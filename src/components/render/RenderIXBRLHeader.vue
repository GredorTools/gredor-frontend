<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

defineProps<{
  arsredovsining: Arsredovisning;
}>();
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
            arsredovsining.redovisningsinformation.redovisningsvaluta.xbrlId
          }}
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-gen-base:FinansiellRapportList"
          >{{ arsredovsining.redovisningsinformation.forfattare.xbrlId }}
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:BeloppsformatList"
          >se-mem-base:BeloppsformatNormalformMember
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:RakenskapsarForstaDag"
          >{{ arsredovsining.verksamhetsarNuvarande.startdatum }}
        </ix:nonNumeric>
        <ix:nonNumeric
          contextRef="period_nuvarande"
          name="se-cd-base:RakenskapsarSistaDag"
          >{{ arsredovsining.verksamhetsarNuvarande.slutdatum }}
        </ix:nonNumeric>
      </ix:hidden>
      <ix:references>
        <link:schemaRef
          xlink:href="http://xbrl.taxonomier.se/se/fr/gaap/k2/risbs/2021-10-31/se-k2-risbs-2021-10-31.xsd"
          xlink:type="simple"
        />
      </ix:references>
      <ix:resources>
        <xbrli:context id="period_nuvarande">
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.bolagsverket.se"
              >{{ arsredovsining.foretagsinformation.organisationsnummer }}
            </xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:startDate
              >{{ arsredovsining.verksamhetsarNuvarande.startdatum }}
            </xbrli:startDate>
            <xbrli:endDate
              >{{ arsredovsining.verksamhetsarNuvarande.slutdatum }}
            </xbrli:endDate>
          </xbrli:period>
        </xbrli:context>
        <xbrli:context id="balans_nuvarande">
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.bolagsverket.se"
              >{{ arsredovsining.foretagsinformation.organisationsnummer }}
            </xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:instant
              >{{ arsredovsining.verksamhetsarNuvarande.slutdatum }}
            </xbrli:instant>
          </xbrli:period>
        </xbrli:context>
        <xbrli:context
          v-if="arsredovsining.verksamhetsarTidigare?.length > 0"
          id="period_foregaende"
        >
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.bolagsverket.se"
              >{{ arsredovsining.foretagsinformation.organisationsnummer }}
            </xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:startDate
              >{{ arsredovsining.verksamhetsarTidigare[0].startdatum }}
            </xbrli:startDate>
            <xbrli:endDate
              >{{ arsredovsining.verksamhetsarTidigare[0].slutdatum }}
            </xbrli:endDate>
          </xbrli:period>
        </xbrli:context>
        <xbrli:context
          v-if="arsredovsining.verksamhetsarTidigare?.length > 0"
          id="balans_foregaende"
        >
          <xbrli:entity>
            <xbrli:identifier scheme="http://www.bolagsverket.se"
              >{{ arsredovsining.foretagsinformation.organisationsnummer }}
            </xbrli:identifier>
          </xbrli:entity>
          <xbrli:period>
            <xbrli:instant
              >{{ arsredovsining.verksamhetsarTidigare[0].slutdatum }}
            </xbrli:instant>
          </xbrli:period>
        </xbrli:context>
        <xbrli:unit id="redovisningsvaluta">
          <xbrli:measure
            >iso4217:{{
              arsredovsining.redovisningsinformation.redovisningsvaluta.kod
            }}
          </xbrli:measure>
        </xbrli:unit>
        <xbrli:unit id="procent">
          <xbrli:measure>xbrli:pure</xbrli:measure>
        </xbrli:unit>
        <xbrli:unit id="antal-anstallda">
          <xbrli:measure>se-k2-type:AntalAnstallda</xbrli:measure>
        </xbrli:unit>
      </ix:resources>
    </ix:header>
  </div>
</template>

<style lang="scss" scoped></style>
