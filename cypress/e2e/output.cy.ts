import * as path from "path";
import { XMLParser } from "fast-xml-parser";
import { diff } from "json-diff-ts";
import { convertIxbrlToXbrl } from "../../tools/simpleIxbrlToXbrl";

describe("validate generated XBRL data", () => {
  const cases = [
    {
      testFileName: "TestfilA",
      godkannaStyrelsensForslag: true,
    },
    {
      testFileName: "TestfilB",
      godkannaStyrelsensForslag: false,
    },
  ];

  cases.forEach(({ testFileName, godkannaStyrelsensForslag }) => {
    it(`should generate correct XBRL data for ${testFileName}.gredorfardig`, () => {
      cy.deleteDownloadsFolder();

      cy.viewport(1280, 680);

      cy.visit("http://localhost:4173");

      cy.intercept(
        {
          method: "POST",
          url: "http://gredor-backend/v1/bankid/init",
        },
        {
          status: "COMPLETE",
          statusCompleteData: {
            personalNumber: "191212121212",
            token: "test-token",
          },
        },
      );

      cy.intercept(
        {
          method: "POST",
          url: "http://gredor-backend/v1/submission-flow/prepare",
        },
        {
          avtalstext: "Exempeltext",
          avtalstextAndrad: "2025-07-28",
        },
      );

      // Öppna wizard
      cy.get('button[data-testid="show-send-wizard-button"]').click();
      cy.wait(1000); // Behövs för att input-fält inte ska bete sig knasigt

      // Steg 1 - Ladda upp fil
      cy.get(".drop-zone").selectFile(
        `cypress/fixtures/input/${testFileName}.gredorfardig`,
        { action: "drag-drop" },
      );
      cy.get(
        '#send-wizard-modal-footer-teleport button[data-testid="wizard-next-button"]',
      ).click();

      // Steg 2 - Fyll i uppgifter
      cy.get('input[data-testid="send-wizard-personalnumber-input"]').click();
      cy.get('input[data-testid="send-wizard-personalnumber-input"]').type(
        "191212121212",
      );
      cy.get('input[data-testid="send-wizard-email-input"]').click();
      cy.get('input[data-testid="send-wizard-email-input"]').type(
        "example@example.com",
      );
      cy.get(
        '#send-wizard-modal-footer-teleport button[data-testid="wizard-next-button"]',
      ).click();

      // Steg 3 - BankID
      cy.get(
        '#send-wizard-modal-footer-teleport button[data-testid="wizard-next-button"]',
      ).click();

      // Steg 4 - Bolagsverkets villkor
      cy.get("#bolagsverketAgreementCheck").check();
      cy.get(
        '#send-wizard-modal-footer-teleport button[data-testid="wizard-next-button"]',
      ).click();

      // Steg 5 - fastställelseintyg
      cy.get("#datum").type("2025-01-20");
      cy.get("#tilltalsnamn").type("Karl");
      cy.get("#efternamn").type("Karlsson");
      cy.get("#roll").select("Styrelseledamot");

      if (godkannaStyrelsensForslag) {
        cy.get("#resultatdispositionBeslut").select(
          "Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.",
        );
      } else {
        cy.get("#resultatdispositionBeslut").select(
          "Årsstämman beslöt att inte godkänna styrelsens förslag till vinstdisposition.",
        );
        cy.get(
          "#resultatdispositionBeslutEgen-avsattningTillReservfond",
        ).click();
        cy.get("#resultatdispositionBeslutEgen-avsattningTillReservfond").type(
          "10000",
        );
        cy.get("#resultatdispositionBeslutEgen-balanseringINyRakning").click();
        cy.get("#resultatdispositionBeslutEgen-balanseringINyRakning").type(
          "71801",
        );
      }
      cy.get(
        '#send-wizard-modal-footer-teleport button[data-testid="wizard-next-button"]',
      ).click();

      // Hämta iXBRL från förhandsgranskning i steg 6, konvertera den till XBRL,
      // och jämför med förväntad XBRL. Då blir det ganska enkelt och vi jämför
      // det allra viktigaste.
      cy.get('button[data-testid="send-wizard-export-ixbrl"]').click({
        timeout: 15000,
      });
      const downloadsFolder = Cypress.config("downloadsFolder");
      const downloadPath = path.join(downloadsFolder, "arsredovisning.xhtml");
      cy.readFile(downloadPath).then((actualIxbrl: string) => {
        // Fixa datum för fastställelseintyg - obs, finns pytteliten risk för att
        // new Date() blir fel datum om man råkar köra testet vid precis "fel"
        // tidpunkt.
        actualIxbrl = actualIxbrl.replace(
          new Date().toISOString().substring(0, 10),
          "2025-09-27",
        );

        const actualXbrl = convertIxbrlToXbrl(actualIxbrl);

        cy.readFile(`cypress/fixtures/expectedoutput/${testFileName}.xml`).then(
          (expectedXbrl: string) => {
            const parser = new XMLParser({
              ignoreAttributes: false,
              attributeNamePrefix: "@_",
              allowBooleanAttributes: true,
              preserveOrder: false,
            });

            const diffs = diff(
              parser.parse(expectedXbrl),
              parser.parse(actualXbrl),
              {
                embeddedObjKeys: {
                  ".xbrli:xbrl.xbrli:context": "@_id",
                  ".xbrli:xbrl.xbrli:unit": "@_id",
                },
              },
            );

            expect(diffs).to.be.empty;
          },
        );
      });
    });
  });
});
