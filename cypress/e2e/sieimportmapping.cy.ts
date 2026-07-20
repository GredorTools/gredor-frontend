const bolagsverketRecords = {
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
};

function startImport(fixture: string) {
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
    bolagsverketRecords,
  );

  cy.get("#newArsredovisningBtn").click();
  // Vänta in att modalen har öppnats (fältet blir synligt) i stället för en
  // fast fördröjning.
  cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').should("be.visible");
  cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').click();
  cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').clear();
  cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').type("556002-1361");
  cy.get('[data-testid="new-arsredovisning-sie-file-input"]').selectFile(
    `cypress/fixtures/input/sie/${fixture}`,
    { action: "drag-drop" },
  );
}

// Slutför skapandet av årsredovisningen. Väntar in att importen är klar (Skapa-
// knappen är inte längre inaktiverad), stänger en eventuell sammanfattningsmodal
// (t.ex. avrundningsfelvarningar) och skapar sedan årsredovisningen.
function finishCreation() {
  const skapaButton =
    "#new-arsredovisning-modal-AppHeader-footer-teleport [data-testid='wizard-next-button']";
  cy.get(skapaButton).should("not.be.disabled");
  cy.get("body").then(($body) => {
    if ($body.find(".message-modal-content").length > 0) {
      cy.get(".message-modal-content")
        .parents(".modal")
        .find('[data-testid="wizard-next-button"]')
        .click();
    }
  });
  cy.get(skapaButton).click();
}

describe("mapping accounts with no automatic match (9000)", () => {
  beforeEach(() => startImport("SIETestUnmapped.se"));

  it("shows the account-mapping modal for the unmapped, non-zero account", () => {
    cy.get('[data-testid="sie-account-mapping-input-9000"]').should(
      "be.visible",
    );
    cy.get('[data-testid="sie-account-mapping-row"]').should("have.length", 1);
  });

  it("maps the account to a chosen report line and imports it", () => {
    // Sök efter raden på namn och välj den i listan
    cy.get('[data-testid="sie-account-mapping-input-9000"]').type("nettooms");
    cy.get(
      '[data-testid="sie-account-mapping-input-9000-option-se-gen-base:Nettoomsattning"]',
    ).click();

    cy.get(
      '#sie-account-mapping-modal-AppHeader-footer-teleport [data-testid="wizard-next-button"]',
    ).click();

    finishCreation();

    // Nettoomsättningen ska nu innehålla ett värde (kontot 9000 har mappats in)
    cy.get('#arsredovisning-for-export [name="se-gen-base:Nettoomsattning"]')
      .first()
      .invoke("text")
      .should("not.be.empty");
  });

  it("keeps the account unmapped when left blank", () => {
    cy.get(
      '#sie-account-mapping-modal-AppHeader-footer-teleport [data-testid="wizard-next-button"]',
    ).click();

    cy.get(".message-modal-content").should(
      "contain.text",
      "Konto 9000 kunde inte mappas",
    );
  });
});

describe("mapping accounts that only reach summary rows (2090)", () => {
  // Konto 2090 "Fritt eget kapital" matchar visserligen ett kontointervall, men
  // träffar bara summerade rader i balansräkningen och skulle därför tappas bort
  // vid summeringen. Det ska behandlas som omappat och dyka upp i modalen (till
  // skillnad från 8999 "Årets resultat", som inte flaggas).
  beforeEach(() => startImport("SIETestSummaryOnly.se"));

  it("flags only the summary-only account (2090), not 8999", () => {
    cy.get('[data-testid="sie-account-mapping-input-2090"]').should(
      "be.visible",
    );
    cy.get('[data-testid="sie-account-mapping-row"]').should("have.length", 1);
    // Kontot visas med sitt namn från SIE-filens #KONTO-rad
    cy.get('[data-testid="sie-account-mapping-row"] .account-col').should(
      "contain.text",
      "Fritt eget kapital",
    );
  });

  it("can find the report line by typing an account number (prefix)", () => {
    // Konto 2091 mappas till "Balanserat resultat" – att söka på "2091" ska
    // därför visa den raden som ett alternativ
    cy.get('[data-testid="sie-account-mapping-input-2090"]').type("2091");
    cy.get(
      '[data-testid="sie-account-mapping-input-2090-option-se-gen-base:BalanseratResultat"]',
    ).should("be.visible");
  });

  it("maps 2090 to Balanserat resultat so its amount is retained", () => {
    cy.get('[data-testid="sie-account-mapping-input-2090"]').type("balanserat");
    cy.get(
      '[data-testid="sie-account-mapping-input-2090-option-se-gen-base:BalanseratResultat"]',
    ).click();

    cy.get(
      '#sie-account-mapping-modal-AppHeader-footer-teleport [data-testid="wizard-next-button"]',
    ).click();

    finishCreation();

    cy.get('#arsredovisning-for-export [name="se-gen-base:BalanseratResultat"]')
      .first()
      .invoke("text")
      .should("not.be.empty");
  });
});
