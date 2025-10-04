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
            Gredor är ett open-source-projekt. Programvaran distribueras under
            AGPLv3-licens (med en tilläggsklausul för friare sammansättning med
            annan programvara), och källkoden finns på
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
          <p>Du kan kontakta oss på...</p>
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
