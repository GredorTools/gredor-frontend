describe("logo", () => {
  it("can be added", () => {
    cy.viewport(1400, 960);

    cy.visit("http://localhost:4173", {
      onBeforeLoad(win) {
        win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
      },
    });

    cy.get("#editor button.btn").click();
    cy.get('[data-testid="request-open-file-input"]').selectFile(
      "cypress/fixtures/input/logo/logo-valid.png",
      { force: true },
    );

    cy.get("#editor img.logo").should("be.visible");
    cy.get("#arsredovisning-for-export img.logo.right").should("be.visible");
    cy.get("#editor div.editor > div:nth-child(2)").click();

    cy.get("#logotyp-placering").select("topp");
    cy.get("#arsredovisning-for-export img.logo.top").should("be.visible");
  });

  it("is rejected if file too large", () => {
    cy.viewport(1400, 960);

    cy.visit("http://localhost:4173", {
      onBeforeLoad(win) {
        win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
      },
    });

    cy.get("#editor button.btn").click();
    cy.get('[data-testid="request-open-file-input"]').selectFile(
      "cypress/fixtures/input/logo/logo-filetoolarge.png",
      { force: true },
    );

    cy.get("div.message-modal-content p").should(
      "have.text",
      "Logotypen får inte vara större än 512 kB.",
    );
    cy.get('[data-testid="wizard-next-button"]').click();

    cy.get("#editor img.logo").should("not.exist");
    cy.get("#arsredovisning-for-export img.logo.right").should("not.exist");
  });

  it("shows up from loaded files", () => {
    cy.viewport(1400, 960);

    cy.visit("http://localhost:4173");

    cy.get(
      '[data-testid="first-launch-screen-open-arsredovisning-button"]',
    ).click();
    cy.get('[data-testid="request-open-file-input"]').selectFile(
      "cypress/fixtures/input/gredor/TestfilD.gredorfardig",
      { force: true },
    );
    cy.get("#arsredovisning-for-export img.logo.left").should("be.visible");
  });
});
