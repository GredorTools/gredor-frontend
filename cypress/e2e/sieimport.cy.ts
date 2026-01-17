import path from "path";
import { diff } from "json-diff-ts";
import { Arsredovisning } from "../../src/model/arsredovisning/Arsredovisning";

describe("importing SIE files", () => {
  beforeEach(() => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173", {
      onBeforeLoad(win) {
        win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
      },
    });

    cy.intercept(
      {
        method: "GET",
        url: "http://gredor-backend/v1/information/records/5560021361",
      },
      {
        foretagsnamn: "Testbolaget AB",
        rakenskapsperioder: [
          {
            from: "2024-01-01",
            tom: "2024-12-31",
            kravPaRevisionsberattelse: "nej",
            revisorsplikt: "uppgift_saknas",
          },
          {
            from: "2023-01-01",
            tom: "2023-12-31",
            kravPaRevisionsberattelse: "nej",
            revisorsplikt: "uppgift_saknas",
          },
        ],
      },
    );

    // Börja på ny årsredovisning
    cy.get("#newArsredovisningBtn").click();
    cy.wait(1000);
    cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').click();
    cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').clear();
    cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').type(
      "556002-1361",
    );
    cy.get('[data-testid="new-arsredovisning-sie-file-input"]').selectFile(
      `cypress/fixtures/input/sie/SIETest.se`,
      {
        action: "drag-drop",
      },
    );
    cy.get("div.message-modal-content p:nth-child(2)").should(
      "have.text",
      'Belopprad "Resultat efter finansiella poster" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get("div.message-modal-content p:nth-child(3)").should(
      "have.text",
      'Belopprad "Resultat före skatt" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get("div.message-modal-content p:nth-child(4)").should(
      "have.text",
      'Belopprad "Årets resultat" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get(
      '#app-modal-controller-1-footer-teleport [data-testid="wizard-next-button"]',
    ).click();
    cy.get("#new-arsredovisning-modal-AppHeader-footer-teleport .btn").click();

    cy.get(
      '#arsredovisning-for-export [name="se-cd-base:ForetagetsNamn"]',
    ).should("have.text", "Testbolaget AB");
    cy.get(
      '#arsredovisning-for-export [name="se-cd-base:Organisationsnummer"]',
    ).should("have.text", "556002-1361");
    cy.get("#arsredovisning-for-export h1").should(
      "have.text",
      "Årsredovisning för räkenskapsåret 2024",
    );
    cy.get("#arsredovisning-for-export p:nth-child(3)").should(
      "have.text",
      "Styrelsen avger härmed följande årsredovisningför räkenskapsåret 2024-01-01 – 2024-12-31. ",
    );
  });

  it("generates correct content on page", () => {
    // Verifiera innehåll
    cy.get(
      '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:Nettoomsattning"]',
    ).should("have.text", "207");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(1) td:nth-child(3) [name="se-gen-base:Nettoomsattning"]',
    ).should("have.text", "274");
    cy.get(
      '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
    ).should("have.text", "56");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(2) td:nth-child(3) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
    ).should("have.text", "60");
    cy.get(
      '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:Soliditet"]',
    ).should("have.text", "90");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Soliditet"]',
    ).should("have.text", "94");

    cy.get(
      '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:Aktiekapital"]',
    ).should("have.text", "25 000");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:BalanseratResultat"]',
    ).should("have.text", "75 407");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:AretsResultatEgetKapital"]',
    ).should("have.text", "47 322");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:ForandringEgetKapitalTotalt"]',
    ).should("have.text", "147 729");
    cy.get(
      "#arsredovisning-for-export table.forandringar-table tr:nth-child(2) td:nth-child(2)",
    ).should("have.text", "–");
    cy.get(
      "#arsredovisning-for-export table.forandringar-table tr:nth-child(2) td:nth-child(3)",
    ).should("have.text", "–");
    cy.get(
      '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat"]',
    ).should("have.text", "48 867");
    cy.get(
      '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalTotaltAretsResultat"]',
    ).should("have.text", "48 867");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(3) [name="se-gen-base:Aktiekapital"]',
    ).should("have.text", "25 000");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(3) td:nth-child(3) [name="se-gen-base:BalanseratResultat"]',
    ).should("have.text", "100 229");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(3) [name="se-gen-base:AretsResultatEgetKapital"]',
    ).should("have.text", "48 867");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(3) [name="se-gen-base:ForandringEgetKapitalTotalt"]',
    ).should("have.text", "174 096");

    cy.get(
      '#arsredovisning-for-export div:nth-child(7) tr:nth-child(3) td.value-container [name="se-gen-base:BalanseratResultat"]',
    ).should("have.text", "100 229");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(4) [name="se-gen-base:AretsResultatEgetKapital"]',
    ).should("have.text", "48 867");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(5) [name="se-gen-base:FrittEgetKapital"]',
    ).should("have.text", "149 096");
    cy.get(
      '#arsredovisning-for-export [name="se-gen-base:ForslagDisposition"]',
    ).should("have.text", "149 096");

    cy.get(
      '#arsredovisning-for-export tr:nth-child(2) td:nth-child(3) [name="se-gen-base:Nettoomsattning"]',
    ).should("have.text", "207 157");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Nettoomsattning"]',
    ).should("have.text", "274 012");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:RorelseintakterLagerforandringarMm"]',
    ).should("have.text", "207 157");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:RorelseintakterLagerforandringarMm"]',
    ).should("have.text", "274 012");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:OvrigaExternaKostnader"]',
    ).should("have.text", "6 097");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:OvrigaExternaKostnader"]',
    ).should("have.text", "7 901");
    cy.get(
      "#arsredovisning-for-export div:nth-child(5) tr:nth-child(6) td.not-container",
    ).should("have.text", "2");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Personalkostnader"]',
    ).should("have.text", "146 530");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Personalkostnader"]',
    ).should("have.text", "206 983");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Rorelsekostnader"]',
    ).should("have.text", "152 627");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Rorelsekostnader"]',
    ).should("have.text", "214 884");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Rorelseresultat"]',
    ).should("have.text", "54 530");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Rorelseresultat"]',
    ).should("have.text", "59 128");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:OvrigaRanteintakterLiknandeResultatposter"]',
    ).should("have.text", "1 044");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:OvrigaRanteintakterLiknandeResultatposter"]',
    ).should("have.text", "507");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:FinansiellaPoster"]',
    ).should("have.text", "1 044");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:FinansiellaPoster"]',
    ).should("have.text", "507");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(12) td:nth-child(3) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
    ).should("have.text", "55 574");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
    ).should("have.text", "59 635");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:ResultatForeSkatt"]',
    ).should("have.text", "55 574");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:ResultatForeSkatt"]',
    ).should("have.text", "59 635");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:SkattAretsResultat"]',
    ).should("have.text", "12 706");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:SkattAretsResultat"]',
    ).should("have.text", "12 313");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:AretsResultat"]',
    ).should("have.text", "42 868");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:AretsResultat"]',
    ).should("have.text", "47 322");

    cy.get(
      '#arsredovisning-for-export tr:nth-child(4) td:nth-child(3) [name="se-gen-base:AndraLangfristigaVardepappersinnehav"]',
    ).should("have.text", "55 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:AndraLangfristigaVardepappersinnehav"]',
    ).should("have.text", "50 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:FinansiellaAnlaggningstillgangar"]',
    ).should("have.text", "55 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:FinansiellaAnlaggningstillgangar"]',
    ).should("have.text", "50 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Anlaggningstillgangar"]',
    ).should("have.text", "55 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Anlaggningstillgangar"]',
    ).should("have.text", "50 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:OvrigaFordringarKortfristiga"]',
    ).should("have.text", "7 761");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:OvrigaFordringarKortfristiga"]',
    ).should("have.text", "871");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter"]',
    ).should("have.text", "14 248");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter"]',
    ).should("have.text", "19 367");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KortfristigaFordringar"]',
    ).should("have.text", "22 009");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KortfristigaFordringar"]',
    ).should("have.text", "20 238");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KassaBankExklRedovisningsmedel"]',
    ).should("have.text", "115 922");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KassaBankExklRedovisningsmedel"]',
    ).should("have.text", "87 229");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KassaBank"]',
    ).should("have.text", "115 922");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KassaBank"]',
    ).should("have.text", "87 229");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Omsattningstillgangar"]',
    ).should("have.text", "137 931");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Omsattningstillgangar"]',
    ).should("have.text", "107 467");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Tillgangar"]',
    ).should("have.text", "192 931");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Tillgangar"]',
    ).should("have.text", "157 467");

    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Aktiekapital"]',
    ).should("have.text", "25 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Aktiekapital"]',
    ).should("have.text", "25 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:BundetEgetKapital"]',
    ).should("have.text", "25 000");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:BundetEgetKapital"]',
    ).should("have.text", "25 000");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(23) td:nth-child(3) [name="se-gen-base:BalanseratResultat"]',
    ).should("have.text", "100 229");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:BalanseratResultat"]',
    ).should("have.text", "75 407");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:AretsResultatEgetKapital"]',
    ).should("have.text", "48 867");
    cy.get(
      '#arsredovisning-for-export tr:nth-child(24) td:nth-child(4) [name="se-gen-base:AretsResultatEgetKapital"]',
    ).should("have.text", "47 322");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:FrittEgetKapital"]',
    ).should("have.text", "149 096");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:FrittEgetKapital"]',
    ).should("have.text", "122 729");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:EgetKapital"]',
    ).should("have.text", "174 096");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:EgetKapital"]',
    ).should("have.text", "147 729");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Skatteskulder"]',
    ).should("have.text", "15 150");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Skatteskulder"]',
    ).should("have.text", "9 738");
    cy.get(
      '#arsredovisning-for-export [name="se-gen-base:OvrigaKortfristigaSkulder"]',
    ).should("have.text", "3 685");
    cy.get(
      "#arsredovisning-for-export tr:nth-child(29) td:nth-child(4)",
    ).should("have.text", "–");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KortfristigaSkulder"]',
    ).should("have.text", "18 835");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KortfristigaSkulder"]',
    ).should("have.text", "9 738");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:EgetKapitalSkulder"]',
    ).should("have.text", "192 931");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:EgetKapitalSkulder"]',
    ).should("have.text", "157 467");

    cy.get("#arsredovisning-for-export table:nth-child(2) h3").should(
      "have.text",
      "Not 1: Redovisningsprinciper",
    );
    cy.get("#arsredovisning-for-export table:nth-child(3) h3").should(
      "have.text",
      "Not 2: Medelantalet anställda",
    );
    cy.get(
      "#arsredovisning-for-export table:nth-child(3) td:nth-child(2)",
    ).should("have.text", "–");
    cy.get(
      "#arsredovisning-for-export table:nth-child(3) td:nth-child(3)",
    ).should("have.text", "–");
    cy.get("#arsredovisning-for-export table:nth-child(4) h3").should(
      "have.text",
      "Not 3: Andra långfristiga värdepappersinnehav",
    );
    cy.get(
      '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:AndraLangfristigaVardepappersinnehav"]',
    ).should("have.text", "55 000");
    cy.get(
      '#arsredovisning-for-export tr.summa td:nth-child(3) [name="se-gen-base:AndraLangfristigaVardepappersinnehav"]',
    ).should("have.text", "50 000");

    // Kolla att-åtgärda-lista
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "3",
    );
    cy.get("[data-testid='todo-list-button']").click();
    cy.get("[data-testid='todo-list-item-sie-import-task-0'] span").should(
      "have.text",
      'Belopprad "Resultat efter finansiella poster" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get("[data-testid='todo-list-item-sie-import-task-1'] span").should(
      "have.text",
      'Belopprad "Resultat före skatt" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get("[data-testid='todo-list-item-sie-import-task-2'] span").should(
      "have.text",
      'Belopprad "Årets resultat" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
  });

  it("generates correct .gredorutkast file", () => {
    cy.get("#saveArsredovisningBtn").click();
    cy.wait(3000); // Så filen hinner sparas

    const downloadsFolder = Cypress.config("downloadsFolder");
    const downloadPath = path.join(
      downloadsFolder,
      "Arsredovisning.gredorutkast",
    );
    cy.readFile(downloadPath).then((actualGredorFile: string) => {
      cy.readFile(
        `cypress/fixtures/expectedoutput/sie/SIETest.gredorutkast`,
      ).then((expectedGredorFile: string) => {
        const parsedActual = JSON.parse(actualGredorFile) as Arsredovisning;
        const parsedExpected = JSON.parse(expectedGredorFile) as Arsredovisning;

        for (const beloppradList of [
          "forvaltningsberattelse",
          "resultatrakning",
          "balansrakning",
          "noter",
        ]) {
          const diffs = diff(
            parsedExpected[beloppradList],
            parsedActual[beloppradList],
          );

          expect(diffs).to.be.empty;
        }
      });
    });
  });
});
