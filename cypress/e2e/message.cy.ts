describe("messages", () => {
  it("don't show when there aren't any", () => {
    cy.viewport(1400, 960);

    cy.visit("http://localhost:4173", {
      onBeforeLoad(win) {
        win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
      },
    });

    cy.get('[data-testid="app-messages"]').should("not.exist");
  });

  it("show when sent from server and can be dismissed", () => {
    cy.intercept(
      {
        method: "GET",
        url: "http://gredor-backend/v1/message/messages",
      },
      [
        {
          text: "Första roliga meddelandet!",
        },
        {
          text: "Andra, mindre roliga meddelandet.",
        },
      ],
    );

    cy.viewport(1400, 960);

    cy.visit("http://localhost:4173", {
      onBeforeLoad(win) {
        win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
      },
    });

    // Kolla att meddelandena finns och visas korrekt
    cy.get('[data-testid="app-messages"] .alert:nth-child(1)').should(
      "have.text",
      "Första roliga meddelandet!",
    );
    cy.get('[data-testid="app-messages"] .alert:nth-child(2)').should(
      "have.text",
      "Andra, mindre roliga meddelandet.",
    );

    // Stäng första meddelandet
    cy.get(
      '[data-testid="app-messages"] .alert:nth-child(1) button.btn-close',
    ).click();
    cy.get('[data-testid="app-messages"] .alert:nth-child(1)').should(
      "have.text",
      "Andra, mindre roliga meddelandet.",
    );

    // Stäng andra meddelandet
    cy.get(
      '[data-testid="app-messages"] .alert:nth-child(1) button.btn-close',
    ).click();
    cy.get('[data-testid="app-messages"]').should("not.exist");
  });
});
