<script lang="ts" setup>
/**
 * Applikationens sidfot.
 */

import { computed } from "vue";
import { getConfigValue } from "@/util/configUtils.ts";

const version = computed(() => {
  let result = __APP_VERSION__;
  const environmentName = getConfigValue("VITE_ENV_NAME");
  if (environmentName) {
    result += `-${environmentName}`;
  }
  return result;
});
</script>

<template>
  <div class="aside-container">
    <hr aria-hidden="true" />
    <aside id="documentation" aria-label="Om Gredor" class="row">
      <div class="col-12">
        <div class="text-center">
          <h2>Om Gredor</h2>
        </div>
      </div>
      <div class="card-container col-12 col-sm-6 col-lg-3">
        <div class="card">
          <div class="card-header">
            <strong>Vad är Gredor?</strong>
          </div>
          <div class="card-body">
            <p>
              Gredor är ett kostnadsfritt verktyg som du kan använda för att ta
              fram årsredovisningar och skicka in dem till Bolagsverket. Du kan
              alltså lämna in företagets åredovisning digitalt helt gratis.
            </p>
            <p>
              Verktyget har stöd för alla delar i en vanlig K2-årsredovisning
              för aktiebolag utan revisor, och du kan dessutom enkelt komma
              igång genom att importera en SIE-fil från ditt bokföringssystem om
              du vill.
            </p>
            <p>
              Gredor är utvecklat av småföretagare för småföretagare. Vår vision
              är att det ska vara enkelt och smidigt att driva ett litet bolag –
              utan att man ska behöva lägga en massa pengar på programvara.
            </p>
          </div>
        </div>
      </div>
      <div class="card-container col-12 col-sm-6 col-lg-3">
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
              bland annat kan vi inte svara på frågor om vad din årsredovisning
              borde innehålla. För frågor av sådana slag hänvisar vi till
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
              Gredor stöder endast regelverket för årsredovisning i mindre
              företag (K2), för aktiebolag utan revisor.
            </p>
          </div>
        </div>
      </div>
      <div class="card-container col-12 col-sm-6 col-lg-3">
        <div class="card">
          <div class="card-header">
            <strong>Integritetspolicy</strong>
          </div>
          <div class="card-body">
            <p>
              Till skillnad från en del andra aktörer har Gredor inget intresse
              av att kartlägga ditt liv; Gredor skickar aldrig någon personlig
              data via internet utöver det som är nödvändigt för att tjänsten
              ska fungera.
            </p>
            <p>
              De uppgifter som skickas över internet är, utöver sådant som
              skickas automatiskt för att kunna ansluta (t.ex. ip-adress), din
              årsredovisning samt personuppgifter du skriver in. I samband med
              BankID-identifiering lagras ditt personnummer på Gredors servrar i
              en vecka för att förhindra spam, i övrigt sparas inget förutom
              enkla anonymiserade loggar där. Däremot sparar Bolagsverket din
              årsredovisning när du laddar upp den hos dem, annars hade tjänsten
              varit någorlunda värdelös 😉
            </p>
          </div>
        </div>
      </div>
      <div class="card-container col-12 col-sm-6 col-lg-3">
        <div class="card">
          <div class="card-header">
            <strong>Kontakt</strong>
          </div>
          <div class="card-body">
            <p>
              <strong
                >OBS: Vi är inte redovisningskonsulter och kan inte svara på
                frågor om t.ex. vad din årsredovisning borde innehålla.</strong
              >
            </p>
            <hr />
            <p>
              E-post: <a href="mailto:gredor@potatiz.com">gredor@potatiz.com</a>
            </p>
            <hr />
            <p>
              GitHub:
              <a href="https://github.com/GredorTools" target="_blank"
                >GredorTools</a
              >
              (open-source!)
            </p>
            <hr />
            <p>
              Gredor tillhandahålls av Potatron Tech AB (559256-0287,
              Stockholm).
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 mt-4 small opacity-75 text-center">
        Version: {{ version }}
      </div>
    </aside>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.aside-container {
  background-color: $background-dark;
}

#documentation {
  max-width: $max-page-width;
  margin: 0 auto;
  padding: 0 $spacing-md $spacing-xxl;

  h2 {
    margin-top: $spacing-xxl + $spacing-sm;
    margin-bottom: $spacing-xl;
  }

  .card-container {
    padding: $spacing-md;

    .card {
      height: 100%;
    }
  }
}
</style>
