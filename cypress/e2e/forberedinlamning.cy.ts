const FILE_URL = "https://exempel.test/forberedd.gredorfardig";

function visitWithFileParameter(
  fileUrl: string,
  onBeforeLoad?: (win: Window) => void,
) {
  cy.viewport(1800, 1000);

  cy.visit(
    `http://localhost:4173/laddaupp?fil=${encodeURIComponent(fileUrl)}`,
    {
      onBeforeLoad(win) {
        win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
        onBeforeLoad?.(win);
      },
    },
  );
}

describe("förberedd inlämning via länk", () => {
  it("öppnar flödet på steg 2 med filen ifylld", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });
    cy.intercept("POST", "http://gredor-backend/v1/auth/status", {
      loggedIn: false,
    });

    visitWithFileParameter(FILE_URL);

    // Flödet ska ha hoppat över filuppladdningssteget
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
    cy.location("pathname").should("eq", "/laddaupp");

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

    // Steg 1 ska visas, och nästa-knappen ska vara aktiv eftersom filen redan
    // finns med (både årsredovisning och fil är ihågkomna)
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

    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "contain.text",
      "https://annan.test",
    );
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "not.contain.text",
      "https://exempel.test",
    );
  });

  it("avvisar en källa utanför vitlistan", () => {
    // Ingen intercept behövs: en källa utanför vitlistan ska aldrig hämtas
    visitWithFileParameter("https://elak.test/forberedd.gredorfardig");

    cy.get(".message-modal-content").should(
      "contain.text",
      "https://elak.test",
    );
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "not.exist",
    );
    // Faller tillbaka på manuell uppladdning
    cy.get('[data-testid="send-wizard-gredor-file-input"]').should(
      "be.visible",
    );
  });

  it("avvisar en vidarebefordran till en källa utanför vitlistan", () => {
    cy.intercept("GET", FILE_URL, {
      statusCode: 302,
      headers: { location: "https://elak.test/omdirigerad.gredorfardig" },
    });
    cy.intercept("GET", "https://elak.test/omdirigerad.gredorfardig", {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should(
      "contain.text",
      "https://elak.test",
    );
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "not.exist",
    );
  });

  it("visar felmeddelande och faller tillbaka när filen inte kan hämtas", () => {
    cy.intercept("GET", FILE_URL, { statusCode: 404, body: "" });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should(
      "contain.text",
      "Årsredovisningen kunde inte hämtas från https://exempel.test",
    );
    cy.get('[data-testid="send-wizard-gredor-file-input"]').should(
      "be.visible",
    );
  });

  it("visar felmeddelande när filen är ogiltig", () => {
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

  it("visar felmeddelande när filen har fel datatyp", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilA_utan-orgnr.gredorutkast",
    });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should("be.visible");
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').should(
      "not.exist",
    );
  });

  it("visar felmeddelande när filen är för stor", () => {
    cy.intercept("GET", FILE_URL, { body: "x".repeat(6 * 1024 * 1024) });

    visitWithFileParameter(FILE_URL);

    cy.get(".message-modal-content").should(
      "contain.text",
      "Årsredovisningen kunde inte hämtas från https://exempel.test",
    );
  });

  it("ignorerar http-URL:er helt", () => {
    visitWithFileParameter("http://exempel.test/forberedd.gredorfardig");

    cy.get('[data-testid="send-wizard-gredor-file-input"]').should(
      "be.visible",
    );
    cy.get(".message-modal-content").should("not.exist");
    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "not.exist",
    );
    cy.location("search").should("eq", "");
  });

  it("lämnar användarens autosparade årsredovisning orörd", () => {
    cy.intercept("GET", FILE_URL, {
      fixture: "input/gredor/TestfilC.gredorfardig",
    });

    const autosaveInnan = '{"orort":"det här ska inte röras"}';
    visitWithFileParameter(FILE_URL, (win) => {
      win.localStorage.setItem("AppAutosaveArsredovisning", autosaveInnan);
    });

    cy.get('[data-testid="send-wizard-forbered-inlamning-banner"]').should(
      "be.visible",
    );

    cy.window().then((win) => {
      expect(win.localStorage.getItem("AppAutosaveArsredovisning")).to.eq(
        autosaveInnan,
      );
    });
  });
});
