<script lang="ts" setup>
/**
 * Huvudkomponenten som sammanför alla delar av applikationen.
 */

import { onMounted, ref, useTemplateRef } from "vue";
import { exampleArsredovisning } from "@/example/exampleArsredovisning.ts";
import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";
import ToolsFinish from "@/components/tools/ToolsFinish.vue";
import { getConfigValue } from "@/util/configUtils.ts";
import {
  type OnboardingTourStep,
  VueOnboardingTour,
} from "vue-onboarding-tour";
import type { ComponentExposed } from "vue-component-type-helpers";
import { Tooltip } from "bootstrap";
import { useGredorStorage } from "@/util/storageUtils.ts";

const arsredovisning = ref(exampleArsredovisning);

const environmentName = getConfigValue("VITE_ENV_NAME");

// Tooltip för rundtur - visas automatiskt när sidan laddas första gången
const tourBtn = useTemplateRef("tour-btn");
const tourTooltipHasBeenDisplayed = useGredorStorage(
  "AppTourTooltipHasBeenDisplayed",
  false,
);
if (!tourTooltipHasBeenDisplayed.value) {
  onMounted(() => {
    const element = tourBtn.value;
    if (element) {
      const tooltip = new Tooltip(element);
      setTimeout(() => {
        tooltip.show();
        setTimeout(() => {
          tooltip.hide();
          tourTooltipHasBeenDisplayed.value = true;
        }, 5000);
      }, 500);
    }
  });
}

// Rundtur
const tour = ref<ComponentExposed<typeof VueOnboardingTour>>();

function startTour() {
  // @ts-expect-error Något fel med typerna i VueOnboardingTour - nedan ska fungera
  tour.value?.startTour();
}

function endTour() {
  window.scrollTo(0, 0);
}

const tourSteps: OnboardingTourStep[] = [
  {
    title: "Välkommen till Gredor!",
    description:
      "Du kommer nu att få en snabb rundtur genom de olika delarna av tjänsten.",
  },
  {
    target: "#editor",
    title: "Redigera årsredovisningen",
    description:
      "På vänster sida av skärmen har du redigeringsvyn, där du bland annat" +
      " lägger till fält i årsredovisningen.",
  },
  {
    target: "#renderer",
    title: "Live-förhandsgranskning",
    description:
      "Och på höger sida av skärmen har du en förhandsgranskning som visar" +
      " hur årsredovisningen kommer att se ut. Den uppdateras live när du" +
      " redigerar årsredovisningen.",
  },
  {
    target: "#tools",
    title: "När du är klar…",
    description:
      "När du är klar med din årsredovisning använder du verktygen" +
      " här för att färdigställa och lämna in den till Bolagsverket." +
      "<ul>" +
      "<li>Verktyget <strong>Färdigställ inför årsstämma</strong> låter dig" +
      " färdigställa årsredovisningen inför ditt företags årsstämma.</li>" +
      "<li>Efter årsstämman använder du verktyget <strong>Skicka in till" +
      " Bolagsverket efter årsstämma</strong> för att lämna in årsredovisningen" +
      " till Bolagsverket.</li>" +
      "</ul>",
  },
  {
    target: "#documentation",
    title: "Mer information",
    description:
      "Mer information om hur Gredor fungerar och vad som är viktigt att tänka" +
      " på hittar du här nere.",
  },
];
</script>

<template>
  <VueOnboardingTour
    ref="tour"
    :steps="tourSteps"
    label-terminate="Avsluta rundtur"
    tour-id="appTour"
    @end-tour="endTour"
  />

  <main class="d-flex flex-column">
    <header class="d-flex flex-row justify-content-between">
      <h1>
        Gredor
        <span v-if="environmentName" class="environment">{{
          environmentName
        }}</span>
      </h1>

      <button
        id="tour-btn"
        ref="tour-btn"
        class="btn btn-success"
        data-bs-offset="[0, 12]"
        data-bs-placement="left"
        data-bs-title="Första gången här? Ta rundturen!"
        data-bs-toggle="tooltip"
        data-bs-trigger="manual"
        @click="startTour"
      >
        Rundtur
      </button>
    </header>

    <div class="d-flex flex overflow-hidden gap-4">
      <div id="editor">
        <EditMain v-model="arsredovisning" />
      </div>

      <div id="renderer">
        <RenderMain
          :arsredovisning="arsredovisning"
          :show-faststallelseintyg="false"
        />
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <div class="help-hint d-flex align-items-center">
        <strong>⬇️ Mer information om Gredor finns nedan! ⬇️</strong>
      </div>

      <div id="tools">
        <ToolsFinish :arsredovisning="arsredovisning" />
      </div>
    </div>
  </main>
  <div class="aside-container">
    <hr />
    <aside id="documentation">
      <div></div>
      <div class="text-center">
        <h2>Om Gredor</h2>
      </div>
      <div></div>
      <div class="card">
        <div class="card-header">
          <strong>Vad är Gredor?</strong>
        </div>
        <div class="card-body">
          <p>
            Bacon ipsum dolor amet picanha meatball kielbasa, rump alcatra ball
            tip biltong t-bone. Pork belly shank turducken porchetta, meatloaf
            picanha hamburger chicken.
          </p>
          <p>
            Shoulder ham short loin, sirloin drumstick corned beef ham hock
            alcatra capicola chicken pork frankfurter picanha pork belly.
            Meatloaf shoulder turducken, tongue venison shankle meatball
            tenderloin sausage porchetta beef jerky chuck.
          </p>
          <p>
            Gredor är utvecklat av småföretagare för småföretagare. Vår vision
            är att det ska vara enkelt och smidigt att driva ett litet bolag –
            utan att man ska behöva lägga en massa pengar på programvara.
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Viktigt att tänka på när man använder Gredor</strong>
        </div>
        <div class="card-body">
          <p>
            Målgruppen för Gredor är främst företagare som är bekväma med att
            ställa upp årsredovisningen själva. Har du exempelvis tidigare
            skrivit din årsredovisning i Word och sedan postat den till
            Bolagsverket, kan Gredor vara ett bra alternativ för dig.
          </p>
          <p>
            Vi som arbetar med Gredor har begränsad möjlighet att ge support;
            bland annat kan vi inte svara på frågor om vilka fält du behöver ha
            med i din årsredovisning. För frågor av sådana slag hänvisar vi till
            <a
              href="https://bolagsverket.se/foretag/aktiebolag/arsredovisningforaktiebolag.759.html#h-Innehallienarsredovisning"
              >Bolagsverkets exempel</a
            >
            och
            <a
              href="https://www.bfn.se/informationsmaterial/vagledningar/#arsredovisningk2"
              >Bokföringsnämndens vägledning</a
            >, alternativt en redovisningskonsult.
            <strong>Gredor tillhandahålls utan några garantier.</strong>
          </p>
          <p>
            Gredor stöder endast regelverket för årsredovisning i mindre företag
            (K2), för företag utan revisor.
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Sponsorer</strong>
        </div>
        <div class="card-body">TODO</div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Källkod och licens</strong>
        </div>
        <div class="card-body">
          <p>
            Gredor är ett open-source-projekt. Programvaran är
            AGPLv3-licensierad, och källkoden finns på
            <a href="https://github.com/GredorTools" target="_blank">GitHub</a>.
          </p>
          <p>
            Bidrag till projektet uppskattas stort! Om du vill bidra, öppna
            gärna en issue och/eller utkasts-PR i GitHub-repot för att få tidig
            återkoppling på dina tänkta ändringar.
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Integritetspolicy</strong>
        </div>
        <div class="card-body">
          <p>
            Till skillnad från en del andra aktörer har Gredor inget intresse av
            att kartlägga ditt liv; Gredor skickar aldrig någon personlig data
            via internet utöver det som är nödvändigt för att tjänsten ska
            fungera.
          </p>
          <p>
            De uppgifter som skickas över internet är, utöver sådant som skickas
            automatiskt för att kunna ansluta (t.ex. ip-adress), din
            årsredovisning, de filer du laddar upp samt personuppgifter du
            skriver in. Personnummer lagras på Gredors servrar i en vecka för
            att förhindra spam, i övrigt sparas inget där. Däremot sparar
            Bolagsverket din årsredovisning när du skickar in den dit, annars
            hade tjänsten varit någorlunda värdelös 😉
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Kontakt</strong>
        </div>
        <div class="card-body">
          <p>Du kan kontakta oss på...</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
main,
aside {
  max-width: calc(1152px + 210mm);
}

main {
  margin: 0 auto;
  font-weight: normal;

  height: 100vh;
  max-height: 100vh;
  padding: 2rem;
  gap: 2rem;

  #editor {
    overflow-y: auto;

    border: 1px solid #566f41;
    border-radius: 0.5rem;
    background-color: #fdfff8;
    padding: 1rem;
    justify-self: end;

    width: 100%;
  }

  #renderer {
    /* För skuggan */
    padding: 0 0.5rem 0.5rem 0px;
  }

  .help-hint {
    border: 1px solid #8a5555;
    background-color: #f8e7e7;
    padding: 0 1rem;
  }
}

.aside-container {
  background-color: #e5e5e5;
}

#documentation {
  margin: 0 auto;
  font-weight: normal;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 2rem 6rem 4rem 6rem;
  gap: 2rem;
}

header {
  grid-column: 1 / span 2;

  h1 {
    margin-bottom: 0;

    .environment {
      color: #566f41;
      font-style: italic;
    }
  }
}
</style>
