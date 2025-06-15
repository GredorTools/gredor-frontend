<script lang="ts" setup>
import type { Arsredovisning } from "@/model/arsredovisning/Arsredovisning.ts";

defineProps<{
  arsredovisning: Arsredovisning;
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
        <xbrli:unit id="redovisningsvaluta">
          <xbrli:measure
            >iso4217:{{
              arsredovisning.redovisningsinformation.redovisningsvaluta.kod
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
