const FILE_URL = "https://exempel.test/forberedd.gredorfardig";

function visitWithFileParameter(fileUrl: string) {
  cy.viewport(1800, 1000);

  cy.visit(`http://localhost:4173/?fil=${encodeURIComponent(fileUrl)}`, {
    onBeforeLoad(win) {
      win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
    },
  });
}

describe("förberedd inlämning via länk", () => {
  it("öppnar wizarden på steg 2 med filen ifylld", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });

    cy.intercept("POST", "http://gredor-backend/v1/auth/status", {
      loggedIn: false,
    });

    visitWithFileParameter(FILE_URL);

    // Wizarden ska ha hoppat över filuppladdningssteget
    cy.contains("h4", "Steg 2/10").should("be.visible");
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "be.visible",
    );
    cy.get('[data-testid="send-wizard-gredor-file-input"]').should("not.exist");

    // Bannern ska tala om varifrån filen kom
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "contain.text",
      "https://exempel.test",
    );

    // Parametern ska vara borttagen, så att en omladdning inte hämtar om filen
    cy.location("search").should("eq", "");

    // Flödet ska gå att fortsätta som vanligt
    cy.wait(1000); // Behövs för att input-fält inte ska bete sig knasigt
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').click();
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').type(
      "191212121212",
    );
    cy.get('input[data-testid="send-wizard-email-input"]').click();
    cy.get('input[data-testid="send-wizard-email-input"]').type(
      "example@example.com",
    );
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 3 - BankID, dvs. inget steg har hoppats över utom filuppladdningen.
    // Själva legitimeringen täcks av send.cy.ts.
    cy.contains("h4", "Steg 3/10: Legitimera med BankID").should("be.visible");
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "be.visible",
    );
  });

  it("går tillbaka till filuppladdningen utan att tappa filen", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });

    visitWithFileParameter(FILE_URL);

    cy.get('[data-testid="wizard-previous-button"]').click();

    // Steg 1 ska visas, och nästa-knappen ska vara aktiv eftersom det redan
    // finns en årsredovisning
    cy.get('[data-testid="send-wizard-gredor-file-input"]').should(
      "be.visible",
    );
    cy.get('[data-testid="wizard-next-button"]').should("not.be.disabled");
  });

  it("döljer bannern när användaren laddar upp en egen fil i stället", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });

    visitWithFileParameter(FILE_URL);

    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "be.visible",
    );

    // Gå tillbaka till steg 1 och välj en annan fil manuellt
    cy.get('[data-testid="wizard-previous-button"]').click();
    cy.get('[data-testid="send-wizard-gredor-file-input"]').selectFile(
      "cypress/fixtures/input/gredor/TestfilA.gredorfardig",
      { action: "drag-drop" },
    );

    // Nu kommer årsredovisningen inte längre från länken, och då får bannern
    // inte påstå det
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "not.exist",
    );
    cy.get('[data-testid="wizard-next-button"]').click();
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "not.exist",
    );
  });

  it("visar den origin filen faktiskt kom från, inte den vidarebefordrande", () => {
    cy.intercept("GET", FILE_URL, {
      statusCode: 302,
      headers: { location: "https://annan.test/omdirigerad.gredorfardig" },
    });
    cy.intercept("GET", "https://annan.test/omdirigerad.gredorfardig", {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });

    visitWithFileParameter(FILE_URL);

    // Bannern får inte påstå exempel.test när filen kom från annan.test
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "contain.text",
      "https://annan.test",
    );
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "not.contain.text",
      "https://exempel.test",
    );
  });

  it("visar felmeddelande och ingen wizard när filen är för stor", () => {
    cy.intercept("GET", FILE_URL, { body: "x".repeat(6 * 1024 * 1024) });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should(
      "contain.text",
      "Årsredovisningen kunde inte hämtas från https://exempel.test",
    );
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "not.exist",
    );
  });

  it("visar felmeddelande och ingen wizard när filen inte kan hämtas", () => {
    cy.intercept("GET", FILE_URL, { statusCode: 404, body: "" });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should(
      "contain.text",
      "Årsredovisningen kunde inte hämtas från https://exempel.test",
    );
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "not.exist",
    );
  });

  it("visar felmeddelande och ingen wizard när filen är ogiltig", () => {
    cy.intercept("GET", FILE_URL, { body: "det här är ingen gredor-fil" });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should(
      "contain.text",
      "Årsredovisningen kunde inte hämtas från https://exempel.test",
    );
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "not.exist",
    );
  });

  it("visar felmeddelande och ingen wizard när filen har fel datatyp", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilA_utan-orgnr.gredorutkast",
    });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should("be.visible");
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "not.exist",
    );
  });

  it("ignorerar http-URL:er helt", () => {
    visitWithFileParameter("http://exempel.test/forberedd.gredorfardig");

    cy.get(".message-modal-content").should("not.exist");
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "not.exist",
    );
    cy.location("search").should("eq", "");
  });

  it("lämnar användarens autosparade årsredovisning orörd", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });

    visitWithFileParameter(FILE_URL);

    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "be.visible",
    );

    // Den hämtade filen gäller Exempelbolaget AB; det som ligger autosparat får
    // inte ha bytts ut mot den
    cy.window().then((win) => {
      const autosaved =
        win.localStorage.getItem("AppAutosaveArsredovisning") ?? "";
      expect(autosaved).to.not.contain("Exempelbolaget AB");
    });
  });
});
