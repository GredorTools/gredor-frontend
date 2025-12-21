describe("first launch screen", () => {
  it("can create new", () => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173");

    cy.intercept(
      {
        method: "GET",
        url: "http://gredor-backend/v1/information/records/5569999999",
      },
      {
        foretagsnamn: "Aktiebolaget Exemplet",
        rakenskapsperioder: [
          {
            from: "2025-01-01",
            tom: "2025-12-31",
            kravPaRevisionsberattelse: "nej",
            revisorsplikt: "uppgift_saknas",
          },
          {
            from: "2024-01-01",
            tom: "2024-12-31",
            kravPaRevisionsberattelse: "nej",
            revisorsplikt: "uppgift_saknas",
          },
        ],
        harVerkstallandeDirektor: false,
        harLikvidator: true,
      },
    );

    cy.get(
      '[data-testid="first-launch-screen-new-arsredovisning-button"]',
    ).click();
    cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').click();
    cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').type("5569999999");
    cy.get('[data-testid="wizard-next-button"]').click();
  });

  it("can open existing", () => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173");

    cy.get(
      '[data-testid="first-launch-screen-open-arsredovisning-button"]',
    ).click();
    cy.get('[data-testid="request-open-file-input"]').selectFile(
      "cypress/fixtures/input/gredor/TestfilB.gredorfardig",
      { force: true },
    );
  });

  it("can show example", () => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173");

    cy.get(
      '[data-testid="first-launch-screen-example-arsredovisning-button"]',
    ).click();
    cy.get(
      '#arsredovisning-for-export [name="se-gen-base:AllmantVerksamheten"] p:nth-child(1)',
    ).should("have.text", "Verksamheten har varit att grilla körv.");
  });
});
