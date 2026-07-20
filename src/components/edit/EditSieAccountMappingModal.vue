<script lang="ts" setup>
/**
 * En modal som låter användaren mappa BAS-konton från en SIE-fil som inte kunde
 * mappas automatiskt till en rad i resultat- eller balansräkningen. För varje
 * omappat konto väljer användaren i en sökbar lista vilken rad i
 * årsredovisningen kontots belopp ska hamna på. Listan kan sökas både på radens
 * namn och på kontonummer (prefix).
 */

import { reactive, ref } from "vue";
import CommonModal from "@/components/common/CommonModal.vue";
import CommonModalContents from "@/components/common/CommonModalContents.vue";
import CommonWizardButtons from "@/components/common/CommonWizardButtons.vue";
import CommonSearchSelect, {
  type SearchSelectOption,
} from "@/components/common/CommonSearchSelect.vue";
import type { ComponentExposed } from "vue-component-type-helpers";
import {
  getStatementLineOptions,
  type StatementLineOption,
  type UnmappedSieAccount,
} from "@/util/sieUtils.ts";
import { formatNumber } from "@/util/formatUtils.ts";
import { BeloppFormat } from "@/model/arsredovisning/BeloppFormat.ts";

defineProps<{
  /** ID för modalinstansen som är unikt över hela applikationen. */
  instanceId: string;
}>();

const modal = ref<ComponentExposed<typeof CommonModal>>();

/** De omappade konton som visas i modalen. */
const unmappedAccounts = ref<UnmappedSieAccount[]>([]);

/** Valbara rader (taxonomiobjekt) att mappa mot. */
const lineOptions = ref<SearchSelectOption[]>([]);

/** Kontointervall per rad (taxonomiobjektnamn), för sökning på kontonummer. */
const rangesByConcept = ref<
  Map<string, { start: number; end: number }[]>
>(new Map());

/** Representativt BAS-konto per rad (taxonomiobjektnamn) att mappa via. */
const representativeByConcept = ref<Map<string, string>>(new Map());

/**
 * Vald rad (taxonomiobjektnamn) för varje omappat konto (nyckel = det omappade
 * kontonumret). Tom sträng = kontot hoppas över.
 */
const selections = reactive<Record<string, string>>({});

/** Callback som anropas med resultatet när användaren är klar. */
let resolveCallback: ((result: Map<string, string | null>) => void) | null =
  null;

defineExpose({
  /**
   * Visar modalen för de angivna omappade kontona och returnerar ett löfte som
   * uppfylls med en mappning från kontonummer till valt taxonomiobjektnamn
   * (eller null om kontot lämnats omappat) när användaren är klar.
   */
  show: (
    accounts: UnmappedSieAccount[],
  ): Promise<Map<string, string | null>> => {
    unmappedAccounts.value = accounts;
    for (const { basAccount } of accounts) {
      selections[basAccount] = "";
    }
    modal.value?.show();

    // Ladda de valbara raderna (kräver taxonomidata och är därför asynkront).
    void getStatementLineOptions().then((options: StatementLineOption[]) => {
      lineOptions.value = options.map((option) => ({
        value: option.conceptName,
        label: option.label,
        hint: formatAccountRanges(option.accountRanges),
      }));
      rangesByConcept.value = new Map(
        options.map((option) => [option.conceptName, option.accountRanges]),
      );
      representativeByConcept.value = new Map(
        options.map((option) => [
          option.conceptName,
          option.representativeAccount,
        ]),
      );
    });

    return new Promise((resolve) => {
      resolveCallback = resolve;
    });
  },
});

/**
 * Formaterar en rads kontointervall för visning, t.ex. "2091, 2093–2095, 2098"
 * eller "3000–3799". Intervallen sorteras och dubbletter tas bort.
 */
function formatAccountRanges(
  ranges: { start: number; end: number }[],
): string {
  const seen = new Set<string>();
  return ranges
    .filter((range) => {
      const key = `${range.start}-${range.end}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.start - b.start)
    .map((range) =>
      range.start === range.end
        ? String(range.start)
        : `${range.start}–${range.end}`,
    )
    .join(", ");
}

/** Formaterar ett SIE-belopp (Decimal) för visning som heltal. */
function formatAmount(amount: UnmappedSieAccount["value"]["nuvarandeAr"]): string {
  if (amount.isNaN()) {
    return "–";
  }
  return formatNumber(amount.round().toString(), null, BeloppFormat.HELTAL);
}

/** De BAS-konton som ett kontonummer med det angivna prefixet omfattar. */
function prefixInterval(prefix: string): { lo: number; hi: number } {
  if (prefix.length >= 4) {
    const exact = Number.parseInt(prefix, 10);
    return { lo: exact, hi: exact };
  }
  const padding = 4 - prefix.length;
  return {
    lo: Number.parseInt(prefix + "0".repeat(padding), 10),
    hi: Number.parseInt(prefix + "9".repeat(padding), 10),
  };
}

/**
 * Matchar en rad mot söktermen: numeriska sökningar prefixmatchas mot radens
 * kontointervall (så att man kan hitta raden via ett kontonummer), övriga
 * sökningar matchas mot radens namn.
 */
function matchesLine(option: SearchSelectOption, query: string): boolean {
  const trimmed = query.trim();
  if (trimmed === "") {
    return true;
  }
  if (/^\d+$/.test(trimmed)) {
    const { lo, hi } = prefixInterval(trimmed);
    const ranges = rangesByConcept.value.get(option.value) ?? [];
    return ranges.some(
      (range) => Math.max(lo, range.start) <= Math.min(hi, range.end),
    );
  }
  return option.label.toLowerCase().includes(trimmed.toLowerCase());
}

function accountLabel(account: UnmappedSieAccount): string {
  return account.name ? `${account.basAccount} – ${account.name}` : account.basAccount;
}

function finish() {
  const result = new Map<string, string | null>();
  for (const { basAccount } of unmappedAccounts.value) {
    const conceptName = selections[basAccount]?.trim() ?? "";
    // Skicka tillbaka det representativa BAS-kontot för den valda raden, så att
    // beloppet mappas in med full genomslagskraft.
    result.set(
      basAccount,
      conceptName === ""
        ? null
        : (representativeByConcept.value.get(conceptName) ?? null),
    );
  }
  modal.value?.hide();
  resolveCallback?.(result);
  resolveCallback = null;
}
</script>

<template>
  <CommonModal
    :id="`sie-account-mapping-modal-${instanceId}`"
    ref="modal"
    title="Mappa konton"
  >
    <CommonModalContents class="mapping-contents">
      <p>
        Följande konton i SIE-filen kunde inte mappas automatiskt till en rad i
        resultat- eller balansräkningen. Välj för varje konto vilken rad i
        årsredovisningen beloppet ska hamna på. Du kan söka på radens namn eller
        på ett kontonummer. Lämnar du fältet tomt hoppas kontot över och
        beloppet tas inte med (du får då en varning i din att-åtgärda-lista).
      </p>

      <table class="mapping-table">
        <thead>
          <tr>
            <th>Konto</th>
            <th class="amount-col">Belopp</th>
            <th>Mappa till rad</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="account in unmappedAccounts"
            :key="account.basAccount"
            data-testid="sie-account-mapping-row"
          >
            <td class="account-col">{{ accountLabel(account) }}</td>
            <td class="amount-col">
              {{ formatAmount(account.value.nuvarandeAr) }}
              <template
                v-if="
                  !account.value.foregaendeAr.isNaN() &&
                  !account.value.foregaendeAr.isZero()
                "
              >
                <span class="previous-year">
                  (föreg. år: {{ formatAmount(account.value.foregaendeAr) }})
                </span>
              </template>
            </td>
            <td class="line-col">
              <CommonSearchSelect
                v-model="selections[account.basAccount]"
                :options="lineOptions"
                :matches="matchesLine"
                :input-testid="`sie-account-mapping-input-${account.basAccount}`"
                placeholder="Sök rad eller kontonummer…"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </CommonModalContents>

    <CommonWizardButtons
      next-button-text="Klar"
      previous-button-hidden
      @go-to-next-step="finish"
    />
  </CommonModal>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.mapping-contents {
  max-width: min(90vw, 720px);
}

.mapping-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: $spacing-xs $spacing-sm;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    border-bottom: 1px solid var(--bs-border-color);
  }

  tbody tr:not(:last-child) td {
    border-bottom: 1px solid var(--bs-border-color-translucent);
  }
}

.account-col {
  white-space: nowrap;
}

.amount-col {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.previous-year {
  color: var(--bs-secondary-color);
  font-size: $font-size-sm;
}

.line-col {
  min-width: 18rem;
}
</style>
