<script lang="ts" setup>
/**
 * En teknisk komponent för att rendera iXBRL-huvudet i årsredovisningen.
 * Innehåller metadata, referenser, kontexter och enheter som krävs för iXBRL-export.
 */

import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";
import {
  getUnitRef,
  UNIT_REF_PURE,
  UNIT_REF_REDOVISNINGSVALUTA,
  UNIT_REF_SHARES,
} from "@/util/renderUtils.ts";
import { getTaxonomyManager } from "@/util/TaxonomyManager.ts";
import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";

defineProps<{
  /** Årsredovisningen som innehåller information för iXBRL-huvudet. */
  arsredovisning: Arsredovisning;
}>();

const allDecimalTaxonomyItems = [
  await getTaxonomyManager(TaxonomyRootName.FORVALTNINGSBERATTELSE),
  await getTaxonomyManager(
    TaxonomyRootName.RESULTATRAKNING_KOSTNADSSLAGSINDELAD,
  ),
  await getTaxonomyManager(TaxonomyRootName.BALANSRAKNING),
  await getTaxonomyManager(TaxonomyRootName.NOTER),
]
  .flatMap((taxonomyManager) =>
    taxonomyManager
      .getRoot()
      .childrenFlat.filter(
        (taxonomyItem) =>
          taxonomyItem.properties.type === "xbrli:decimalItemType",
      ),
  )
  // Ta bort dubbletter
  .filter(
    (taxonomyItem1, i, taxonomyItems) =>
      taxonomyItems.findIndex(
        (taxonomyItem2) => taxonomyItem2.xmlName === taxonomyItem1.xmlName,
      ) === i,
  );
</script>

<template>
  <div
    style="display: none"
    xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
    xmlns:link="http://www.xbrl.org/2003/linkbase"
    xmlns:xbrli="http://www.xbrl.org/2003/instance"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <ix:header>
      <ix:hidden>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:SprakHandlingUpprattadList"
          >se-mem-base:SprakSvenskaMember
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:LandForetagetsSateList"
          >se-mem-base:LandSverigeMember
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:RedovisningsvalutaHandlingList"
          >{{
            arsredovisning.redovisningsinformation.redovisningsvaluta.xbrlId
          }}
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:FinansiellRapportList"
          >{{ arsredovisning.redovisningsinformation.forfattare.xbrlId }}
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:BeloppsformatList"
          >se-mem-base:BeloppsformatNormalformMember
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:RakenskapsarForstaDag"
          >{{ arsredovisning.verksamhetsarNuvarande.startdatum }}
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:RakenskapsarSistaDag"
          >{{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
        </ix:nonNumeric>
      </ix:hidden>
      <ix:references>
        <link:schemaRef
          xlink:href="http://xbrl.taxonomier.se/se/fr/gaap/k2/risbs/2021-10-31/se-k2-risbs-2021-10-31.xsd"
          xlink:type="simple"
        />
        <link:schemaRef
          xlink:href="http://xbrl.taxonomier.se/se/fr/gaap/coa/rplc/2020-12-01/se-coa-rplc-2020-12-01.xsd"
          xlink:type="simple"
        />
      </ix:references>
      <ix:resources>
        <xbrli:context id="period_nuvarande">
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.bolagsverket.se"
              >{{ arsredovisning.foretagsinformation.organisationsnummer }}
            </xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:startDate
              >{{ arsredovisning.verksamhetsarNuvarande.startdatum }}
            </xbrli:startDate>
            <xbrli:endDate
              >{{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
            </xbrli:endDate>
          </xbrli:period>
        </xbrli:context>
        <xbrli:context id="balans_nuvarande">
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.bolagsverket.se"
              >{{ arsredovisning.foretagsinformation.organisationsnummer }}
            </xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:instant
              >{{ arsredovisning.verksamhetsarNuvarande.slutdatum }}
            </xbrli:instant>
          </xbrli:period>
        </xbrli:context>
        <template
          v-for="i in arsredovisning.verksamhetsarTidigare.length"
          :key="i"
        >
          <xbrli:context :id="'period_tidigare' + i">
            <xbrli:entity>
              <xbrli:identifier scheme="http://www.bolagsverket.se"
                >{{ arsredovisning.foretagsinformation.organisationsnummer }}
              </xbrli:identifier>
            </xbrli:entity>
            <xbrli:period>
              <xbrli:startDate
                >{{ arsredovisning.verksamhetsarTidigare[i - 1].startdatum }}
              </xbrli:startDate>
              <xbrli:endDate
                >{{ arsredovisning.verksamhetsarTidigare[i - 1].slutdatum }}
              </xbrli:endDate>
            </xbrli:period>
          </xbrli:context>
          <xbrli:context :id="'balans_tidigare' + i">
            <xbrli:entity>
              <xbrli:identifier scheme="http://www.bolagsverket.se"
                >{{ arsredovisning.foretagsinformation.organisationsnummer }}
              </xbrli:identifier>
            </xbrli:entity>
            <xbrli:period>
              <xbrli:instant
                >{{ arsredovisning.verksamhetsarTidigare[i - 1].slutdatum }}
              </xbrli:instant>
            </xbrli:period>
          </xbrli:context>
        </template>
        <template v-if="arsredovisning.verksamhetsarTidigare.length == 0">
          <!-- Öppningsbalans för nystartade företag -->
          <xbrli:context id="balans_tidigare1">
            <xbrli:entity>
              <xbrli:identifier scheme="http://www.bolagsverket.se"
                >{{ arsredovisning.foretagsinformation.organisationsnummer }}
              </xbrli:identifier>
            </xbrli:entity>
            <xbrli:period>
              <xbrli:instant
                >{{ arsredovisning.verksamhetsarNuvarande.startdatum }}
              </xbrli:instant>
            </xbrli:period>
          </xbrli:context>
        </template>
        <xbrli:unit :id="UNIT_REF_REDOVISNINGSVALUTA">
          <xbrli:measure
            >iso4217:{{
              arsredovisning.redovisningsinformation.redovisningsvaluta.kod
            }}
          </xbrli:measure>
        </xbrli:unit>
        <xbrli:unit :id="UNIT_REF_PURE">
          <xbrli:measure>xbrli:pure</xbrli:measure>
        </xbrli:unit>
        <xbrli:unit :id="UNIT_REF_SHARES">
          <xbrli:measure>xbrli:shares</xbrli:measure>
        </xbrli:unit>
        <template
          v-for="taxonomyItem in allDecimalTaxonomyItems"
          :key="taxonomyItem.xmlName"
        >
          <xbrli:unit :id="getUnitRef(taxonomyItem)">
            <xbrli:measure
              >se-k2-type:{{ taxonomyItem.properties.name }}
            </xbrli:measure>
          </xbrli:unit>
        </template>
      </ix:resources>
    </ix:header>
  </div>
</template>

<style lang="scss" scoped></style>
