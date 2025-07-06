<script lang="ts" setup>
/**
 * Huvudkomponenten som sammanför alla delar av applikationen.
 */

import { ref } from "vue";
import { exampleArsredovisning } from "@/example/ExampleArsredovisning.ts";
import RenderMain from "@/components/render/RenderMain.vue";
import EditMain from "@/components/edit/EditMain.vue";
import ToolsFinish from "@/components/tools/ToolsFinish.vue";
import { getConfigValue } from "@/util/configUtils.ts";

const arsredovisning = ref(exampleArsredovisning);

const environmentName = getConfigValue("VITE_ENV_NAME");
</script>

<template>
  <main class="d-flex flex-column">
    <header>
      <h1>
        Gredor
        <span v-if="environmentName" class="environment">{{
          environmentName
        }}</span>
      </h1>
    </header>

    <div class="d-flex flex overflow-hidden gap-4">
      <div class="editor">
        <EditMain v-model="arsredovisning" />
      </div>

      <div class="renderer">
        <RenderMain
          :arsredovisning="arsredovisning"
          :show-faststallelseintyg="false"
        />
      </div>
    </div>

    <div class="d-flex justify-content-between">
      <div class="help-hint d-flex align-items-center">
        <strong>⬇️ Behöver du hjälp? Skrolla ner lite! ⬇️</strong>
      </div>

      <div>
        <ToolsFinish :arsredovisning="arsredovisning" />
      </div>
    </div>
  </main>
  <div class="aside-container">
    <hr />
    <aside>
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
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Viktigt att tänka på när man använder Gredor</strong>
        </div>
        <div class="card-body">
          <p>
            Målgruppen för Gredor är företagare som är bekväma med att ställa
            upp årsredovisningen själv. Har du exempelvis tidigare skrivit din
            årsredovisning i Word och sedan postat den till Bolagsverket, kan
            Gredor vara ett bra alternativ för dig.
          </p>
          <p>
            Vi som arbetar med Gredor har begränsad möjlighet att ge support;
            bland annat kan vi inte svara på frågor om vilka fält du behöver ha
            med i din årsredovisning. För frågor av sådana slag hänvisar vi till
            <a
              href="https://bolagsverket.se/foretag/aktiebolag/arsredovisningforaktiebolag.759.html#h-Innehallienarsredovisning"
              >Bolagsverkets exempel</a
            >,
            <a
              href="https://www.bfn.se/informationsmaterial/vagledningar/#arsredovisningk2"
              >Bokföringsnämndens vägledning</a
            >
            alternativt en redovisningskonsult.
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
          <strong>TODO</strong>
        </div>
        <div class="card-body">TODO</div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>Källkod och licens</strong>
        </div>
        <div class="card-body">
          <p>
            Gredor är ett open-source-projekt. Programvaran är AGPL-licensierad,
            och källkoden finns på
            <a href="https://github.com/GredorTools" target="_blank">GitHub</a>.
          </p>
          <p>
            Bidrag till projektet uppskattas stort! Om du vill bidra, öppna
            gärna en issue och/eller utkasts-PR för att få tidig återkoppling på
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
            årsredovisning och de filer du laddar upp. Dessa sparas inte på
            Gredors servrar, utan tas bort så fort som möjligt. Däremot sparar
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
  gap: 2em;

  .editor {
    overflow-y: auto;

    border: 1px solid #566f41;
    border-radius: 0.5rem;
    background-color: #fdfff8;
    padding: 1rem;
    justify-self: end;

    width: 100%;
  }

  .renderer {
    /* För skuggan */
    padding: 0 0.5em 0.5em 0px;
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

aside {
  margin: 0 auto;
  font-weight: normal;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 2rem 6rem 4rem 6rem;
  gap: 2em;
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
