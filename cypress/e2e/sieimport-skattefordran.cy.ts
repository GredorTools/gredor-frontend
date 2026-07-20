describe("importing SIE files with a negative tax liability", () => {
  // SIETestSkattefordran.se är identisk med SIETest.se förutom att konto 2510
  // (aktuell skatt) innevarande år har ett debetsaldo (5000) i stället för ett
  // kreditsaldo, dvs. bolaget har betalat in för mycket skatt. Föregående år är
  // fortfarande ett kreditsaldo (skatteskuld). Kassakontot är justerat så att
  // balansräkningen fortfarande går ihop. Det negativa skattesaldot ska därför
  // omklassificeras från Skatteskulder till Övriga fordringar – men bara för
  // innevarande år.
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
      `cypress/fixtures/input/sie/SIETestSkattefordran.se`,
      {
        action: "drag-drop",
      },
    );
    // Omklassificeringen visas som ett informationsmeddelande först, följt av
    // samma avrundningsmeddelanden som för SIETest.se.
    cy.get("div.message-modal-content p:nth-child(2)").should(
      "have.text",
      "Skattekontona (2510-2519) hade ett debetsaldo och har redovisats som en" +
        " skattefordran under Övriga fordringar i stället för som en skatteskuld." +
        " Kontrollera att detta stämmer.",
    );
    cy.get("div.message-modal-content p:nth-child(3)").should(
      "have.text",
      'Belopprad "Resultat efter finansiella poster" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get("div.message-modal-content p:nth-child(5)").should(
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
  });

  it("reclassifies a negative Skatteskulder to Övriga fordringar", () => {
    // Innevarande år: skatteskulden är omklassificerad till en fordran, så
    // Skatteskulder har inget värde för innevarande år kvar. Endast föregående
    // års skatteskuld (9 738) återstår, så raden matchas utan kolumnkvalificerare.
    cy.get(
      '#arsredovisning-for-export [name="se-gen-base:Skatteskulder"]',
    ).should("have.text", "9 738");

    // Det omklassificerade beloppet (5 000) läggs till de befintliga övriga
    // fordringarna (7 761) för innevarande år -> 12 761. Föregående år är
    // oförändrat (871).
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:OvrigaFordringarKortfristiga"]',
    ).should("have.text", "12 761");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:OvrigaFordringarKortfristiga"]',
    ).should("have.text", "871");

    // Skatteskulden är borta ur kortfristiga skulder för innevarande år
    // (18 835 i SIETest.se -> 3 685 här), medan föregående år är oförändrat.
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KortfristigaSkulder"]',
    ).should("have.text", "3 685");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KortfristigaSkulder"]',
    ).should("have.text", "9 738");

    // Balansräkningen går fortfarande ihop: summa tillgångar = summa eget
    // kapital och skulder, båda åren.
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Tillgangar"]',
    ).should("have.text", "177 781");
    cy.get(
      '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:EgetKapitalSkulder"]',
    ).should("have.text", "177 781");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Tillgangar"]',
    ).should("have.text", "157 467");
    cy.get(
      '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:EgetKapitalSkulder"]',
    ).should("have.text", "157 467");
  });
});
