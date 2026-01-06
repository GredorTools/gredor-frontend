describe("todo list", () => {
  it("is empty by default", () => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173");

    cy.get(
      '[data-testid="first-launch-screen-example-arsredovisning-button"]',
    ).click();

    // Kolla antal att åtgärda == 0
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should("not.exist");

    // Öppna att-åtgärda-listan och kolla att det inte finns några uppgifter
    cy.get("[data-testid='todo-list-button']").click();
    cy.get(
      '[data-testid="todo-list-popover-content"] .empty-state-title',
    ).should("have.text", "Allt klart!");
  });

  it("loads from opened file", () => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173");

    cy.get(
      '[data-testid="first-launch-screen-open-arsredovisning-button"]',
    ).click();
    cy.get('[data-testid="request-open-file-input"]').selectFile(
      "cypress/fixtures/input/todolisttesting/ArsredovisningWithTodoList.gredorutkast",
      { force: true },
    );

    // Kolla antal att åtgärda == 4
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "4",
    );

    // Öppna att-åtgärda-listan
    cy.get("[data-testid='todo-list-button']").click();

    // Kolla att uppgifterna har rätt text, samt att den uppgift som ska vara
    // klar har en bock men inte de andra
    cy.get('[data-testid="todo-list-item-exempel-title"]').should(
      "have.text",
      "Exempeltitel",
    );
    cy.get('[data-testid="todo-list-item-exempel-description"]').should(
      "have.text",
      "Exempelbeskrivning.",
    );
    cy.get('[data-testid="todo-list-item-exempel-task-0"] span').should(
      "have.text",
      "Exempeluppgift 1.",
    );
    cy.get('[data-testid="todo-list-item-exempel-task-0"] i.bi').should(
      "have.class",
      "bi-circle",
    );
    cy.get('[data-testid="todo-list-item-exempel-task-1"] span').should(
      "have.text",
      "Exempeluppgift 2.",
    );
    cy.get('[data-testid="todo-list-item-exempel-task-1"] i.bi').should(
      "have.class",
      "bi-circle",
    );

    cy.get('[data-testid="todo-list-item-sie-import-title"]').should(
      "have.text",
      "Varningar från SIE-import",
    );
    cy.get('[data-testid="todo-list-item-sie-import-description"]').should(
      "have.text",
      "Följande varningar uppstod när du importerade din SIE-fil.",
    );
    cy.get("[data-testid='todo-list-item-sie-import-task-0'] span").should(
      "have.text",
      'Belopprad "Resultat efter finansiella poster" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get('[data-testid="todo-list-item-sie-import-task-0"] i.bi').should(
      "have.class",
      "bi-check-circle-fill",
    );

    cy.get("[data-testid='todo-list-item-sie-import-task-1'] span").should(
      "have.text",
      'Belopprad "Resultat före skatt" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get('[data-testid="todo-list-item-sie-import-task-1"] i.bi').should(
      "have.class",
      "bi-circle",
    );

    cy.get("[data-testid='todo-list-item-sie-import-task-2'] span").should(
      "have.text",
      'Belopprad "Årets resultat" har avrundningsfel. Du kan behöva justera detta manuellt.',
    );
    cy.get('[data-testid="todo-list-item-sie-import-task-2"] i.bi').should(
      "have.class",
      "bi-circle",
    );
  });

  it("can delete items", () => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173");

    cy.get(
      '[data-testid="first-launch-screen-open-arsredovisning-button"]',
    ).click();
    cy.get('[data-testid="request-open-file-input"]').selectFile(
      "cypress/fixtures/input/todolisttesting/ArsredovisningWithTodoList.gredorutkast",
      { force: true },
    );

    // Kolla antal att åtgärda == 4 från början
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "4",
    );

    // Öppna att-åtgärda-listan
    cy.get("[data-testid='todo-list-button']").click();

    // Ta bort en av de två uppgifterna och kolla att det blir rätt
    cy.get('[data-testid="todo-list-item-delete-sie-import"]').click();
    cy.get(
      '[data-testid="todo-list-popover-content"] .empty-state-title',
    ).should("not.exist");
    cy.get(
      '[data-testid="todo-list-item-sie-import-task-0"] .empty-state-title',
    ).should("not.exist");
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "2",
    );

    // Ta bort den sista uppgiften och kolla att det blir rätt
    cy.get('[data-testid="todo-list-item-delete-exempel"]').click();
    cy.get(
      '[data-testid="todo-list-popover-content"] .empty-state-title',
    ).should("have.text", "Allt klart!");
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should("not.exist");
  });

  it("can check and uncheck items", () => {
    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173");

    cy.get(
      '[data-testid="first-launch-screen-open-arsredovisning-button"]',
    ).click();
    cy.get('[data-testid="request-open-file-input"]').selectFile(
      "cypress/fixtures/input/todolisttesting/ArsredovisningWithTodoList.gredorutkast",
      { force: true },
    );

    // Kolla antal att åtgärda == 4 från början
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "4",
    );

    // Öppna att-åtgärda-listan
    cy.get("[data-testid='todo-list-button']").click();

    // Bocka i varje uppgift och kolla att det blir rätt mellan varje ibockning
    cy.get('[data-testid="todo-list-item-exempel-task-0"]').click();
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "3",
    );
    cy.get('[data-testid="todo-list-item-exempel-task-1"]').click();
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "2",
    );
    cy.get('[data-testid="todo-list-item-sie-import-task-1"]').click();
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "1",
    );
    cy.get('[data-testid="todo-list-item-sie-import-task-2"]').click();
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should("not.exist");
    cy.get(
      '[data-testid="todo-list-popover-content"] .empty-state-title',
    ).should("not.exist");

    // Bocka ur ett par uppgifter och kolla att det blir rätt mellan varje ibockning
    cy.get('[data-testid="todo-list-item-exempel-task-1"]').click();
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "1",
    );
    cy.get('[data-testid="todo-list-item-sie-import-task-0"]').click();
    cy.get("[data-testid='todo-list-num-tasks-remaining']").should(
      "have.text",
      "2",
    );
  });
});
