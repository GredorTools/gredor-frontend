import * as path from "path";
import { XMLParser } from "fast-xml-parser";
import { diff } from "json-diff-ts";
import { convertIxbrlToXbrl } from "../../tools/simpleIxbrlToXbrl";

describe("validate generated XBRL data", () => {
  const cases = [
    {
      testFileName: "TestfilA",
      faststallelseIntyg: {
        godkannaStyrelsensForslag: true,
        datum: "2025-01-20",
      },
    },
    {
      testFileName: "TestfilB",
      faststallelseIntyg: {
        godkannaStyrelsensForslag: false,
        avsattningTillReservfond: "10000",
        balanseringINyRakning: "71801",
        datum: "2025-01-20",
      },
    },
    {
      testFileName: "TestfilC",
      faststallelseIntyg: {
        godkannaStyrelsensForslag: true,
        datum: "2025-04-28",
      },
    },
  ];

  cases.forEach(({ testFileName, faststallelseIntyg }) => {
    it(`should generate correct XBRL data for ${testFileName}.gredorfardig`, () => {
      cy.deleteDownloadsFolder();

      cy.clock(new Date("2025-09-27 12:00:00").getTime(), ["Date"]);

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
      cy.get("#datum").type(faststallelseIntyg.datum);
      cy.get("#tilltalsnamn").type("Karl");
      cy.get("#efternamn").type("Karlsson");
      cy.get("#roll").select("Styrelseledamot");

      if (faststallelseIntyg.godkannaStyrelsensForslag) {
        cy.get("#resultatdispositionBeslut").select(
          "Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.",
        );
      } else {
        cy.get("#resultatdispositionBeslut").select(
          "Årsstämman beslöt att inte godkänna styrelsens förslag till vinstdisposition.",
        );
        if (faststallelseIntyg.avsattningTillReservfond) {
          cy.get(
            "#resultatdispositionBeslutEgen-avsattningTillReservfond",
          ).click();
          cy.get(
            "#resultatdispositionBeslutEgen-avsattningTillReservfond",
          ).type(faststallelseIntyg.avsattningTillReservfond);
        }
        if (faststallelseIntyg.balanseringINyRakning) {
          cy.get(
            "#resultatdispositionBeslutEgen-balanseringINyRakning",
          ).click();
          cy.get("#resultatdispositionBeslutEgen-balanseringINyRakning").type(
            faststallelseIntyg.balanseringINyRakning,
          );
        }
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
      cy.wait(3000); // Så filen hinner sparas
      const downloadsFolder = Cypress.config("downloadsFolder");
      const downloadPath = path.join(downloadsFolder, "arsredovisning.xhtml");
      cy.readFile(downloadPath).then((actualIxbrl: string) => {
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
