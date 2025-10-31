<script lang="ts" setup>
/**
 * Applikationens sidfot.
 */
</script>

<template>
  <div class="aside-container">
    <hr aria-hidden="true" />
    <aside id="documentation" aria-label="Om Gredor">
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
            Gredor är ett kostnadsfritt verktyg som du kan använda för att ta
            fram årsredovisningar och skicka in dem till Bolagsverket. Verktyget
            har stöd för alla delar i en vanlig K2-årsredovisning för aktiebolag
            utan revisor.
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
            (K2), för aktiebolag utan revisor.
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Sponsorer</strong>
        </div>
        <div class="card-body">
          <p>
            Gredor tillhandahålls och sponsras av potatiz (Potatron Tech AB).
          </p>

          <p>
            potatiz erbjuder även Tågstationen, en webb- och mobilapplikation
            för att man som tågresenär enkelt ska kunna ta reda på spår,
            förseningar och mer om sitt tåg, var man än befinner sig. Låter det
            intressant?
            <a href="https://tågstationen.se" target="_blank">Besök hemsidan</a>
            eller
            <a href="https://potatiz.com/apps/tagstationen/open"
              >ladda ner mobilappen</a
            >.
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Källkod och licens</strong>
        </div>
        <div class="card-body">
          <p>
            Gredor är ett open-source-projekt. Programvaran distribueras under
            AGPLv3-licens (med en tilläggsklausul för friare sammansättning med
            annan programvara), och källkoden finns på
            <a href="https://github.com/GredorTools" target="_blank">GitHub</a>.
          </p>
          <p>
            Bidrag till projektet uppskattas stort! Dock är det viktigt att
            tänka på att t.ex. nya funktioner och förändringar måste passa bra
            med Gredor i övrigt. Om du vill bidra, öppna gärna en issue
            och/eller utkasts-PR i GitHub-repot för att få tidig återkoppling på
            dina tänkta ändringar.
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
            skriver in. I samband med BankID-identifiering lagras personnummer
            på Gredors servrar i en vecka för att förhindra spam, i övrigt
            sparas inget förutom enkla anonymiserade loggar där. Däremot sparar
            Bolagsverket din årsredovisning när du laddar upp den hos dem,
            annars hade tjänsten varit någorlunda värdelös 😉
          </p>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Kontakt</strong>
        </div>
        <div class="card-body">
          <p>
            <strong
              >OBS: Vi är inte redovisningskonsulter och kan inte svara på
              frågor om t.ex. hur din årsredovisning borde se ut.</strong
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
          </p>
          <hr />
          <p>
            Gredor tillhandahålls av Potatron Tech AB (559256-0287, Stockholm).
          </p>
        </div>
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
  margin: 0 auto;
  font-weight: normal;
  display: grid;
  max-width: $max-page-width;
  grid-template-columns: 1fr 1fr 1fr;
  padding: calc($spacing-xl * 2) calc($spacing-xl * 3);
  gap: $spacing-xl;
}
</style>
