it("can create and edit manually", function () {
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
      harVerkstallandeDirektor: true,
      harLikvidator: false,
    },
  );

  // Börja på ny årsredovisning
  cy.get("#newArsredovisningBtn").click();
  cy.wait(1000);
  cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').click();
  cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').clear();
  cy.get('[data-testid="new-arsredovisning-modal-orgnr"]').type("556002-1361");
  cy.get("#new-arsredovisning-modal-AppHeader-footer-teleport .btn").click();

  cy.get(
    '#arsredovisning-for-export [name="se-cd-base:ForetagetsNamn"]',
  ).should("have.text", "Aktiebolaget Exemplet");
  cy.get(
    '#arsredovisning-for-export [name="se-cd-base:Organisationsnummer"]',
  ).should("have.text", "556002-1361");
  cy.get("#arsredovisning-for-export h1").should(
    "have.text",
    "Årsredovisning för räkenskapsåret 2025",
  );
  cy.get("#arsredovisning-for-export p:nth-child(3)").should(
    "have.text",
    "Styrelsen och verkställande direktören avger härmed följande årsredovisningför räkenskapsåret 2025-01-01 – 2025-12-31. ",
  );
  cy.get("#arsredovisning-for-export .currency-info").should(
    "have.text",
    " Om inte annat särskilt anges, redovisas alla belopp i hela kronor. ",
  );
  cy.get(
    "#arsredovisning-for-export div:nth-child(1) > table > thead > tr > th:nth-child(2)",
  ).should("have.text", "2025");
  cy.get(
    "#arsredovisning-for-export div:nth-child(1) > table > thead > tr > th:nth-child(3)",
  ).should("have.text", "2024");

  // Börja på förvaltningsberättelsen
  cy.get("#editor li:nth-child(2) .nav-link").click();
  cy.get(
    '[data-testid="accordion-item-forvaltningsberattelse-accordion-se-gen-base:VerksamhetenAbstract"]',
  ).click();
  cy.get('[data-testid="edit-se-gen-base:AllmantVerksamheten"]').click();
  cy.get('[data-testid="edit-se-gen-base:AllmantVerksamheten"]').clear();
  cy.get('[data-testid="edit-se-gen-base:AllmantVerksamheten"]').type(
    "Under det redovisade räkenskapsåret har tyngdpunkten av verksamheten, liksom det föregående året, utgjorts av egen utveckling av mobilapplikationer och hemsidor.",
  );

  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:AllmantVerksamheten"] p',
  ).should(
    "have.text",
    "Under det redovisade räkenskapsåret har tyngdpunkten av verksamheten, liksom det föregående året, utgjorts av egen utveckling av mobilapplikationer och hemsidor.",
  );
  cy.get('[data-testid="edit-se-gen-base:AllmantVerksamheten"]').click();
  cy.get('[data-testid="edit-se-gen-base:AllmantVerksamheten"]').type(
    "\n\nBolaget har sitt säte i Stockholms kommun.",
  );
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:AllmantVerksamheten"] p:nth-child(1)',
  ).should(
    "have.text",
    "Under det redovisade räkenskapsåret har tyngdpunkten av verksamheten, liksom det föregående året, utgjorts av egen utveckling av mobilapplikationer och hemsidor.",
  );
  cy.get("#arsredovisning-for-export p:nth-child(2)").should(
    "have.text",
    "Bolaget har sitt säte i Stockholms kommun.",
  );

  // Resultaträkning
  cy.get("#editor li:nth-child(3) .nav-link").click();
  cy.get('[data-testid="accordion-item-resultatrakning-accordion"]').click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]').type(
    "213",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]').type(
    "213157",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringLagerProdukterIArbeteFardigaVarorPagaendeArbetenAnnansRakning-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringLagerProdukterIArbeteFardigaVarorPagaendeArbetenAnnansRakning-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringLagerProdukterIArbeteFardigaVarorPagaendeArbetenAnnansRakning-terseLabel-current-year"]',
  ).type("6097");
  cy.get(
    '[data-testid="edit-se-gen-base:AktiveratArbeteEgenRakning-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AktiveratArbeteEgenRakning-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AktiveratArbeteEgenRakning-current-year"]',
  ).type("146530");
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaRorelseintakter-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AktiveratArbeteEgenRakning-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AktiveratArbeteEgenRakning-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AktiveratArbeteEgenRakning-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringLagerProdukterIArbeteFardigaVarorPagaendeArbetenAnnansRakning-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringLagerProdukterIArbeteFardigaVarorPagaendeArbetenAnnansRakning-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringLagerProdukterIArbeteFardigaVarorPagaendeArbetenAnnansRakning-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:RavarorFornodenheterKostnader-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:RavarorFornodenheterKostnader-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:RavarorFornodenheterKostnader-terseLabel-current-year"]',
  ).type("6097");
  cy.get(
    '[data-testid="edit-se-gen-base:HandelsvarorKostnader-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-current-year"]',
  ).type("146530");
  cy.get(
    '[data-testid="edit-se-gen-base:RavarorFornodenheterKostnader-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:RavarorFornodenheterKostnader-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:RavarorFornodenheterKostnader-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaExternaKostnader-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaExternaKostnader-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaExternaKostnader-current-year"]',
  ).type("6097");
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaRanteintakterLiknandeResultatposter-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaRanteintakterLiknandeResultatposter-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaRanteintakterLiknandeResultatposter-terseLabel-current-year"]',
  ).type("1043");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringOveravskrivningar-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringOveravskrivningar-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringOveravskrivningar-current-year"]',
  ).type("1");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringOveravskrivningar-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:SkattAretsResultat-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:SkattAretsResultat-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:SkattAretsResultat-terseLabel-current-year"]',
  ).type("12706");
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).type("274012");
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaExternaKostnader-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaExternaKostnader-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaExternaKostnader-previous-year-1"]',
  ).type("7901");
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-previous-year-1"]',
  ).type("206");
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Personalkostnader-previous-year-1"]',
  ).type("206983");
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaRanteintakterLiknandeResultatposter-terseLabel-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaRanteintakterLiknandeResultatposter-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaRanteintakterLiknandeResultatposter-terseLabel-previous-year-1"]',
  ).type("507");
  cy.get(
    '[data-testid="edit-se-gen-base:SkattAretsResultat-terseLabel-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:SkattAretsResultat-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:SkattAretsResultat-terseLabel-previous-year-1"]',
  ).type("12313");

  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Nettoomsattning"]',
  ).should("have.text", "213 157");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:RorelseintakterLagerforandringarMm"]',
  ).should("have.text", "213 157");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:OvrigaExternaKostnader"]',
  ).should("have.text", "6 097");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Personalkostnader"]',
  ).should("have.text", "146 530");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Rorelsekostnader"]',
  ).should("have.text", "152 627");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Rorelseresultat"]',
  ).should("have.text", "60 530");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:OvrigaRanteintakterLiknandeResultatposter"]',
  ).should("have.text", "1 043");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:FinansiellaPoster"]',
  ).should("have.text", "1 043");
  cy.get("#arsredovisning-for-export tr:nth-child(12) td:nth-child(3)").should(
    "have.text",
    "61 573",
  );
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:ResultatForeSkatt"]',
  ).should("have.text", "61 573");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:SkattAretsResultat"]',
  ).should("have.text", "12 706");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:AretsResultat"]',
  ).should("have.text", "48 867");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Nettoomsattning"]',
  ).should("have.text", "274 012");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:RorelseintakterLagerforandringarMm"]',
  ).should("have.text", "274 012");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:OvrigaExternaKostnader"]',
  ).should("have.text", "7 901");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Personalkostnader"]',
  ).should("have.text", "206 983");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Rorelsekostnader"]',
  ).should("have.text", "214 884");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Rorelseresultat"]',
  ).should("have.text", "59 128");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:OvrigaRanteintakterLiknandeResultatposter"]',
  ).should("have.text", "507");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:FinansiellaPoster"]',
  ).should("have.text", "507");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
  ).should("have.text", "59 635");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:ResultatForeSkatt"]',
  ).should("have.text", "59 635");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:SkattAretsResultat"]',
  ).should("have.text", "12 313");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:AretsResultat"]',
  ).should("have.text", "47 322");

  // Balansräkning
  cy.get("#editor li:nth-child(4) .nav-link").click();
  cy.get(
    '[data-testid="accordion-item-balansrakning-accordion-se-gen-base:TecknatEjInbetaltKapital"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:TecknatEjInbetaltKapital-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AndraLangfristigaVardepappersinnehav-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AndraLangfristigaVardepappersinnehav-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AndraLangfristigaVardepappersinnehav-current-year"]',
  ).type("55000");
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaFordringarKortfristiga-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaFordringarKortfristiga-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaFordringarKortfristiga-terseLabel-current-year"]',
  ).type("7761");
  cy.get(
    '[data-testid="edit-se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter-current-year"]',
  ).type("14248");
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-current-year"]',
  ).type("115922");
  cy.get(
    '[data-testid="accordion-item-balansrakning-accordion-se-gen-base:EgetKapitalAbstract"]',
  ).click();
  cy.get('[data-testid="edit-se-gen-base:Aktiekapital-current-year"]').click();
  cy.get('[data-testid="edit-se-gen-base:Aktiekapital-current-year"]').clear();
  cy.get('[data-testid="edit-se-gen-base:Aktiekapital-current-year"]').type(
    "25000",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:Aktiekapital-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Aktiekapital-previous-year-1"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Aktiekapital-previous-year-1"]').type(
    "25000",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).type("100");
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).type("100228");
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-current-year"]',
  ).type("48867");
  cy.get('[data-testid="edit-se-gen-base:Skatteskulder-current-year"]').click();
  cy.get('[data-testid="edit-se-gen-base:Skatteskulder-current-year"]').clear();
  cy.get('[data-testid="edit-se-gen-base:Skatteskulder-current-year"]').type(
    "15",
  );
  cy.get('[data-testid="edit-se-gen-base:Skatteskulder-current-year"]').clear();
  cy.get('[data-testid="edit-se-gen-base:Skatteskulder-current-year"]').type(
    "15150",
  );
  cy.get(
    "#balansrakning-accordion-se-gen-base\\:EgetKapitalAbstract tr:nth-child(46) td:nth-child(3)",
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaKortfristigaSkulder-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaKortfristigaSkulder-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaKortfristigaSkulder-terseLabel-current-year"]',
  ).type("3686");
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-previous-year-1"]',
  ).type("75406");
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-previous-year-1"]',
  ).type("47");
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-previous-year-1"]',
  ).type("47322");
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaKortfristigaSkulder-terseLabel-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Skatteskulder-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Skatteskulder-previous-year-1"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Skatteskulder-previous-year-1"]').type(
    "9739",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:AndraLangfristigaVardepappersinnehav-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AndraLangfristigaVardepappersinnehav-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AndraLangfristigaVardepappersinnehav-previous-year-1"]',
  ).type("50000");
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaFordringarKortfristiga-terseLabel-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaFordringarKortfristiga-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:OvrigaFordringarKortfristiga-terseLabel-previous-year-1"]',
  ).type("871");
  cy.get(
    '[data-testid="edit-se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter-previous-year-1"]',
  ).type("19367");
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-previous-year-1"]',
  ).type("877");
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-previous-year-1"]',
  ).type("87");
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBankExklRedovisningsmedel-terseLabel-previous-year-1"]',
  ).type("87229");

  cy.get(
    '[data-testid="edit-se-gen-base:FinansiellaAnlaggningstillgangar-totalLabel-current-year"]',
  ).should("have.value", "55000");
  cy.get(
    '[data-testid="edit-se-gen-base:Anlaggningstillgangar-totalLabel-current-year"]',
  ).should("have.value", "55000");
  cy.get(
    '[data-testid="edit-se-gen-base:KortfristigaFordringar-totalLabel-current-year"]',
  ).should("have.value", "22009");
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBank-totalLabel-current-year"]',
  ).should("have.value", "115922");
  cy.get(
    '[data-testid="edit-se-gen-base:Omsattningstillgangar-totalLabel-current-year"]',
  ).should("have.value", "137931");
  cy.get(
    '[data-testid="edit-se-gen-base:Tillgangar-totalLabel-current-year"]',
  ).should("have.value", "192931");
  cy.get(
    '[data-testid="edit-se-gen-base:BundetEgetKapital-totalLabel-current-year"]',
  ).should("have.value", "25000");
  cy.get(
    '[data-testid="edit-se-gen-base:FrittEgetKapital-totalLabel-current-year"]',
  ).should("have.value", "149095");
  cy.get(
    '[data-testid="edit-se-gen-base:EgetKapital-totalLabel-current-year"]',
  ).should("have.value", "174095");
  cy.get(
    '[data-testid="edit-se-gen-base:KortfristigaSkulder-totalLabel-current-year"]',
  ).should("have.value", "18836");
  cy.get(
    '[data-testid="edit-se-gen-base:EgetKapitalSkulder-totalLabel-current-year"]',
  ).should("have.value", "192931");
  cy.get(
    '[data-testid="edit-se-gen-base:FinansiellaAnlaggningstillgangar-totalLabel-previous-year-1"]',
  ).should("have.value", "50000");
  cy.get(
    '[data-testid="edit-se-gen-base:Anlaggningstillgangar-totalLabel-previous-year-1"]',
  ).should("have.value", "50000");
  cy.get(
    '[data-testid="edit-se-gen-base:KortfristigaFordringar-totalLabel-previous-year-1"]',
  ).should("have.value", "20238");
  cy.get(
    '[data-testid="edit-se-gen-base:KassaBank-totalLabel-previous-year-1"]',
  ).should("have.value", "87229");
  cy.get(
    '[data-testid="edit-se-gen-base:Omsattningstillgangar-totalLabel-previous-year-1"]',
  ).should("have.value", "107467");
  cy.get(
    '[data-testid="edit-se-gen-base:Tillgangar-totalLabel-previous-year-1"]',
  ).should("have.value", "157467");
  cy.get(
    '[data-testid="edit-se-gen-base:BundetEgetKapital-totalLabel-previous-year-1"]',
  ).should("have.value", "25000");
  cy.get(
    '[data-testid="edit-se-gen-base:FrittEgetKapital-totalLabel-previous-year-1"]',
  ).should("have.value", "122728");
  cy.get(
    '[data-testid="edit-se-gen-base:EgetKapital-totalLabel-previous-year-1"]',
  ).should("have.value", "147728");
  cy.get(
    '[data-testid="edit-se-gen-base:KortfristigaSkulder-totalLabel-previous-year-1"]',
  ).should("have.value", "9739");
  cy.get(
    '[data-testid="edit-se-gen-base:EgetKapitalSkulder-totalLabel-previous-year-1"]',
  ).should("have.value", "157467");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:AndraLangfristigaVardepappersinnehav"]',
  ).should("have.text", "55 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:FinansiellaAnlaggningstillgangar"]',
  ).should("have.text", "55 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Anlaggningstillgangar"]',
  ).should("have.text", "55 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:OvrigaFordringarKortfristiga"]',
  ).should("have.text", "7 761");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter"]',
  ).should("have.text", "14 248");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KortfristigaFordringar"]',
  ).should("have.text", "22 009");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KassaBankExklRedovisningsmedel"]',
  ).should("have.text", "115 922");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KassaBank"]',
  ).should("have.text", "115 922");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Omsattningstillgangar"]',
  ).should("have.text", "137 931");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Tillgangar"]',
  ).should("have.text", "192 931");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Aktiekapital"]',
  ).should("have.text", "25 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:BundetEgetKapital"]',
  ).should("have.text", "25 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:BalanseratResultat"]',
  ).should("have.text", "100 228");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:AretsResultatEgetKapital"]',
  ).should("have.text", "48 867");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:FrittEgetKapital"]',
  ).should("have.text", "149 095");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:EgetKapital"]',
  ).should("have.text", "174 095");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Skatteskulder"]',
  ).should("have.text", "15 150");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:OvrigaKortfristigaSkulder"]',
  ).should("have.text", "3 686");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:KortfristigaSkulder"]',
  ).should("have.text", "18 836");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:EgetKapitalSkulder"]',
  ).should("have.text", "192 931");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:AndraLangfristigaVardepappersinnehav"]',
  ).should("have.text", "50 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:FinansiellaAnlaggningstillgangar"]',
  ).should("have.text", "50 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Anlaggningstillgangar"]',
  ).should("have.text", "50 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:OvrigaFordringarKortfristiga"]',
  ).should("have.text", "871");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:ForutbetaldaKostnaderUpplupnaIntakter"]',
  ).should("have.text", "19 367");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KortfristigaFordringar"]',
  ).should("have.text", "20 238");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KassaBankExklRedovisningsmedel"]',
  ).should("have.text", "87 229");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KassaBank"]',
  ).should("have.text", "87 229");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Omsattningstillgangar"]',
  ).should("have.text", "107 467");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Tillgangar"]',
  ).should("have.text", "157 467");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Aktiekapital"]',
  ).should("have.text", "25 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:BundetEgetKapital"]',
  ).should("have.text", "25 000");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:BalanseratResultat"]',
  ).should("have.text", "75 406");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:AretsResultatEgetKapital"]',
  ).should("have.text", "47 322");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:FrittEgetKapital"]',
  ).should("have.text", "122 728");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:EgetKapital"]',
  ).should("have.text", "147 728");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Skatteskulder"]',
  ).should("have.text", "9 739");
  cy.get("#arsredovisning-for-export tr:nth-child(29) td:nth-child(4)").should(
    "have.text",
    "–",
  );
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:KortfristigaSkulder"]',
  ).should("have.text", "9 739");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:EgetKapitalSkulder"]',
  ).should("have.text", "157 467");

  // Noter
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:RedovisningsVarderingsprinciper"] p',
  ).should(
    "have.text",
    "Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.",
  );

  cy.get("#editor li:nth-child(5) .nav-link").click();

  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:RedovisningsVarderingsprinciper"]',
  ).should("exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotOvrigaRorelsekostnader"]',
  ).should("exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotAndraOvrigaUpplysningar"]',
  ).should("exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotMedelantaletAnstallda"]',
  ).should("exist");
  cy.get('[name="edit-noter-filter"]').click();
  cy.get('[name="edit-noter-filter"]').type("anställ");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:RedovisningsVarderingsprinciper"]',
  ).should("not.exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotOvrigaRorelsekostnader"]',
  ).should("not.exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotAndraOvrigaUpplysningar"]',
  ).should("not.exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotMedelantaletAnstallda"]',
  ).should("exist");

  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotMedelantaletAnstallda"]',
  ).click();

  cy.get(
    "#arsredovisning-for-export table:nth-child(3) td:nth-child(2)",
  ).should("have.text", "–");
  cy.get(
    "#arsredovisning-for-export table:nth-child(3) td:nth-child(3)",
  ).should("have.text", "–");

  cy.get(
    '[data-testid="edit-se-gen-base:MedelantaletAnstallda-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:MedelantaletAnstallda-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:MedelantaletAnstallda-current-year"]',
  ).type("0");
  cy.get(
    '[data-testid="edit-se-gen-base:MedelantaletAnstallda-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:MedelantaletAnstallda-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:MedelantaletAnstallda-previous-year-1"]',
  ).type("0");

  cy.get(
    '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:MedelantaletAnstallda"]',
  ).should("have.text", "0");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:MedelantaletAnstallda"]',
  ).should("have.text", "0");

  cy.get("#editor .filter-contents .bi.bi-x-lg").click();
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:RedovisningsVarderingsprinciper"]',
  ).should("exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotOvrigaRorelsekostnader"]',
  ).should("exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotAndraOvrigaUpplysningar"]',
  ).should("exist");
  cy.get(
    '[data-testid="accordion-item-noter-accordion-se-gen-base:NotMedelantaletAnstallda"]',
  ).should("exist");

  // Fixar till grunduppgifter
  cy.get("#editor li:nth-child(2) .nav-link").click();
  cy.get(
    '[data-testid="accordion-item-forvaltningsberattelse-accordion-se-gen-base:Flerarsoversikt"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]',
  ).click();
  cy.get("#editor li:nth-child(1) .nav-link").click();
  cy.get(
    '[data-testid="accordion-item-grunduppgifter-accordion-rakenskapsar"]',
  ).click();
  cy.get("#verksamhetsarTidigareAktivt2").check();
  cy.get("#verksamhetsarTidigareAktivt3").check();
  cy.get("#verksamhetsarTidigareAktivt2").uncheck();
  cy.get("#verksamhetsarTidigareAktivt3").check();
  cy.get("#startdatumTidigare2").click();
  cy.get("#startdatumTidigare2").clear();
  cy.get("#startdatumTidigare2").type("2023-01-01");
  cy.get("#slutdatumTidigare2").click();
  cy.get("#slutdatumTidigare2").clear();
  cy.get("#slutdatumTidigare2").type("2023-12-31");
  cy.get("#startdatumTidigare3").click();
  cy.get("#startdatumTidigare3").clear();
  cy.get("#slutdatumTidigare3").click();
  cy.get("#startdatumTidigare3").type("2022-01-01");
  cy.get("#slutdatumTidigare3").clear();
  cy.get("#slutdatumTidigare3").type("2022-12-31");
  cy.get(
    "#arsredovisning-for-export div:nth-child(1) > table > thead > tr > th:nth-child(2)",
  ).should("have.text", "2025");
  cy.get(
    "#arsredovisning-for-export div:nth-child(1) > table > thead > tr > th:nth-child(3)",
  ).should("have.text", "2024");
  cy.get(
    "#arsredovisning-for-export div:nth-child(1) > table > thead > tr > th:nth-child(4)",
  ).should("have.text", "2023");
  cy.get(
    "#arsredovisning-for-export div:nth-child(1) > table > thead > tr > th:nth-child(5)",
  ).should("have.text", "2022");

  // Tillbaka till förvaltningsberättelsen
  cy.get("#editor li:nth-child(2) .nav-link").click();
  cy.get(
    '[data-testid="accordion-item-forvaltningsberattelse-accordion-se-gen-base:Flerarsoversikt"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]').type(
    "213",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Nettoomsattning-current-year"]').type(
    "213157",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).type("274");
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-1"]',
  ).type("274012");
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-2"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-2"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-2"]',
  ).type("259");
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-2"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-2"]',
  ).type("259263");
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-3"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-3"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-3"]',
  ).type("1");
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-3"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-3"]',
  ).type("210");
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-3"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:Nettoomsattning-previous-year-3"]',
  ).type("210364");
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-current-year"]',
  ).type("61");
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-current-year"]',
  ).type("61573");
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-1"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-1"]',
  ).type("59");
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-1"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-1"]',
  ).type("59635");
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-2"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-2"]',
  ).type("16");
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-2"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-2"]',
  ).type("16825");
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-3"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-3"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ResultatEfterFinansiellaPoster-previous-year-3"]',
  ).type("14922");
  cy.get('[data-testid="edit-se-gen-base:Soliditet-current-year"]').click();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-current-year"]').clear();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-current-year"]').type("90");
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-1"]').click();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-1"]').clear();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-1"]').type(
    "94",
  );
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-2"]').click();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-2"]').clear();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-2"]').type(
    "83",
  );
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-3"]').click();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-3"]').clear();
  cy.get('[data-testid="edit-se-gen-base:Soliditet-previous-year-3"]').type(
    "79",
  );

  cy.get(
    '[data-testid="accordion-item-forvaltningsberattelse-accordion-se-gen-base:ForandringEgetKapital"]',
  ).click();
  cy.get(
    "#forvaltningsberattelse-accordion-se-gen-base\\:ForandringEgetKapital .btn",
  ).click();
  cy.wait(1000);
  cy.get(
    '[data-testid="edit-se-gen-base:Aktiekapital-periodStartLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Aktiekapital-periodStartLabel"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Aktiekapital-periodStartLabel"]').type(
    "25000",
  );
  cy.get(
    '[data-testid="edit-se-gen-base:Aktiekapital-periodEndLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:Aktiekapital-periodEndLabel"]',
  ).clear();
  cy.get('[data-testid="edit-se-gen-base:Aktiekapital-periodEndLabel"]').type(
    "25000",
  );
  cy.get(
    "#edit-forvaltningsberattelse-forandringar-modal-footer-teleport .btn",
  ).click();
  cy.get(
    "#forvaltningsberattelse-accordion-se-gen-base\\:ForandringEgetKapital .btn",
  ).click();
  cy.wait(1000);
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-periodStartLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-periodStartLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-periodStartLabel"]',
  ).type("75406");
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodStartLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodStartLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodStartLabel"]',
  ).type("47");
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodStartLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodStartLabel"]',
  ).type("47322");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodStartLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodStartLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodStartLabel"]',
  ).type("147");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodStartLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodStartLabel"]',
  ).type("147728");
  cy.get(
    "#edit-forvaltningsberattelse-forandringar-modal-footer-teleport .btn",
  ).click();
  cy.get(
    "#forvaltningsberattelse-accordion-se-gen-base\\:ForandringEgetKapital .btn",
  ).click();
  cy.wait(1000);
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatUtdelning-terseLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatUtdelning-terseLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatUtdelning-terseLabel"]',
  ).type("-22500");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltUtdelning-totalLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltUtdelning-totalLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltUtdelning-totalLabel"]',
  ).type("-25");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltUtdelning-totalLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltUtdelning-totalLabel"]',
  ).type("-22500");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning-terseLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning-terseLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning-terseLabel"]',
  ).type("47");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning-terseLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning-terseLabel"]',
  ).type("47322");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning-terseLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning-terseLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltBalanserasNyRakning-totalLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning-terseLabel"]',
  ).type("-47322");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltBalanserasNyRakning-totalLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltBalanserasNyRakning-totalLabel"]',
  ).type("0");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat-terseLabel"]',
  ).click();
  cy.get(
    "#edit-forvaltningsberattelse-forandringar-modal-footer-teleport .btn",
  ).click();
  cy.get(
    "#forvaltningsberattelse-accordion-se-gen-base\\:ForandringEgetKapital .btn",
  ).click();
  cy.wait(1000);
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat-terseLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat-terseLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat-terseLabel"]',
  ).type("48867");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltAretsResultat-totalLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltAretsResultat-totalLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltAretsResultat-totalLabel"]',
  ).type("4887");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltAretsResultat-totalLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotaltAretsResultat-totalLabel"]',
  ).type("48867");
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-periodEndLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodEndLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodEndLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodEndLabel"]',
  ).type("4");
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodEndLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-periodEndLabel"]',
  ).type("48867");
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-periodEndLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-periodEndLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-periodEndLabel"]',
  ).type("100228");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodEndLabel"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodEndLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodEndLabel"]',
  ).type("1");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodEndLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodEndLabel"]',
  ).type("174");
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodEndLabel"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForandringEgetKapitalTotalt-periodEndLabel"]',
  ).type("174095");
  cy.get(
    "#edit-forvaltningsberattelse-forandringar-modal-footer-teleport .btn",
  ).click();

  cy.get(
    '[data-testid="accordion-item-forvaltningsberattelse-accordion-se-gen-base:Resultatdisposition"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:BalanseratResultat-current-year"]',
  ).type("100228");
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:AretsResultatEgetKapital-terseLabel-current-year"]',
  ).type("48867");
  cy.get(
    '[data-testid="edit-se-gen-base:FrittEgetKapital-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:FrittEgetKapital-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:FrittEgetKapital-terseLabel-current-year"]',
  ).type("149095");
  cy.get(
    '[data-testid="edit-se-gen-base:UtdelningBeslutadExtraBolagsstamma-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionUtdelningAnnanUtdelning-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionUtdelningAnnanUtdelning-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionUtdelningAnnanUtdelning-terseLabel-current-year"]',
  ).type("37");
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionUtdelningAnnanUtdelning-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionUtdelningAnnanUtdelning-terseLabel-current-year"]',
  ).type("37540");
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionBalanserasINyRakning-terseLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionBalanserasINyRakning-terseLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDispositionBalanserasINyRakning-terseLabel-current-year"]',
  ).type("111555");
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDisposition-totalLabel-current-year"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDisposition-totalLabel-current-year"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:ForslagDisposition-totalLabel-current-year"]',
  ).type("149095");
  cy.get(
    '[data-testid="edit-se-gen-base:StyrelsensYttrandeVinstutdelning"]',
  ).click();
  cy.get(
    '[data-testid="edit-se-gen-base:StyrelsensYttrandeVinstutdelning"]',
  ).clear();
  cy.get(
    '[data-testid="edit-se-gen-base:StyrelsensYttrandeVinstutdelning"]',
  ).type(
    "Styrelsens uppfattning är att den föreslagna utdelningen inte hindrar bolaget från att fullgöra sina förpliktelser på kort och lång sikt, ej heller att fullgöra erforderliga investeringar. Företagets soliditet och likviditet bedöms kunna upprätthållas på en betryggande nivå. Den föreslagna utdelningen kan därmed försvaras med hänsyn till vad som anförs i ABL 17 kap. 3 § 2 st. (försiktighetsregeln).",
  );

  cy.get(
    '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:Nettoomsattning"]',
  ).should("have.text", "213");
  cy.get(
    '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
  ).should("have.text", "62");
  cy.get(
    '#arsredovisning-for-export td:nth-child(2) [name="se-gen-base:Soliditet"]',
  ).should("have.text", "90");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(1) td:nth-child(3) [name="se-gen-base:Nettoomsattning"]',
  ).should("have.text", "274");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(2) td:nth-child(3) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
  ).should("have.text", "60");
  cy.get(
    '#arsredovisning-for-export td:nth-child(3) [name="se-gen-base:Soliditet"]',
  ).should("have.text", "94");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(1) td:nth-child(4) [name="se-gen-base:Nettoomsattning"]',
  ).should("have.text", "259");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(2) td:nth-child(4) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
  ).should("have.text", "17");
  cy.get(
    '#arsredovisning-for-export td:nth-child(4) [name="se-gen-base:Soliditet"]',
  ).should("have.text", "83");
  cy.get(
    '#arsredovisning-for-export td:nth-child(5) [name="se-gen-base:Nettoomsattning"]',
  ).should("have.text", "210");
  cy.get(
    '#arsredovisning-for-export td:nth-child(5) [name="se-gen-base:ResultatEfterFinansiellaPoster"]',
  ).should("have.text", "15");
  cy.get(
    '#arsredovisning-for-export td:nth-child(5) [name="se-gen-base:Soliditet"]',
  ).should("have.text", "79");

  cy.get(
    '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:Aktiekapital"]',
  ).should("have.text", "25 000");
  cy.get(
    "#arsredovisning-for-export div:nth-child(6) tr:nth-child(2) td:nth-child(2)",
  ).should("have.text", "–");
  cy.get(
    "#arsredovisning-for-export div:nth-child(6) tr:nth-child(3) td:nth-child(2)",
  ).should("have.text", "–");
  cy.get(
    "#arsredovisning-for-export div:nth-child(6) tr:nth-child(4) td:nth-child(2)",
  ).should("have.text", "–");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(5) [name="se-gen-base:Aktiekapital"]',
  ).should("have.text", "25 000");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:BalanseratResultat"]',
  ).should("have.text", "75 406");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalBalanseratResultatUtdelning"]',
  ).should("have.text", "22 500");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalBalanseratResultatBalanserasNyRakning"]',
  ).should("have.text", "47 322");
  cy.get(
    "#arsredovisning-for-export div:nth-child(6) tr:nth-child(4) td:nth-child(3)",
  ).should("have.text", "–");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(5) [name="se-gen-base:BalanseratResultat"]',
  ).should("have.text", "100 228");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:AretsResultatEgetKapital"]',
  ).should("have.text", "47 322");
  cy.get(
    "#arsredovisning-for-export div:nth-child(6) tr:nth-child(2) td:nth-child(4)",
  ).should("have.text", "–");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning"]',
  ).should("have.text", "47 322");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalAretsResultatBalanserasNyRakning"]',
  ).should("have.attr", "sign", "-");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalAretsResultatAretsResultat"]',
  ).should("have.text", "48 867");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(5) [name="se-gen-base:AretsResultatEgetKapital"]',
  ).should("have.text", "48 867");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(1) [name="se-gen-base:ForandringEgetKapitalTotalt"]',
  ).should("have.text", "147 728");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalTotaltUtdelning"]',
  ).should("have.text", "22 500");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalTotaltBalanserasNyRakning"]',
  ).should("have.text", "0");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForandringEgetKapitalTotaltAretsResultat"]',
  ).should("have.text", "48 867");
  cy.get(
    '#arsredovisning-for-export tr:nth-child(5) [name="se-gen-base:ForandringEgetKapitalTotalt"]',
  ).should("have.text", "174 095");

  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForslagDispositionUtdelning"]',
  ).should("have.text", "37 540");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForslagDispositionBalanserasINyRakning"]',
  ).should("have.text", "111 555");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:ForslagDisposition"]',
  ).should("have.text", "149 095");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:StyrelsensYttrandeVinstutdelning"] p',
  ).should(
    "have.text",
    "Styrelsens uppfattning är att den föreslagna utdelningen inte hindrar bolaget från att fullgöra sina förpliktelser på kort och lång sikt, ej heller att fullgöra erforderliga investeringar. Företagets soliditet och likviditet bedöms kunna upprätthållas på en betryggande nivå. Den föreslagna utdelningen kan därmed försvaras med hänsyn till vad som anförs i ABL 17 kap. 3 § 2 st. (försiktighetsregeln).",
  );

  // Underskrifter
  cy.get("#editor li:nth-child(6) .nav-link").click();
  cy.get('[data-testid="accordion-item-signatures-accordion-general"]').click();
  cy.get("#undertecknandeOrt").click();
  cy.get("#undertecknandeOrt").clear();
  cy.get("#undertecknandeOrt").type("Stockholm");
  cy.get("#datering").click();
  cy.get("#datering").click();
  cy.get("#datering").type("2025-01-03");
  cy.get(
    '[data-testid="accordion-item-signatures-accordion-signatures"]',
  ).click();
  cy.get("#tilltalsnamn0").click();
  cy.get("#tilltalsnamn0").clear();
  cy.get("#tilltalsnamn0").type("Karl");
  cy.get("#efternamn0").clear();
  cy.get("#efternamn0").type("Karlsson");
  cy.get("#datum0").click();
  cy.get("#datum0").clear();
  cy.get("#datum0").type("2025-01-03");
  cy.get("#signatures-accordion-signatures .row").click();

  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:UndertecknandeArsredovisningOrt"]',
  ).should("have.text", "Stockholm");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:UndertecknandeArsredovisningDatum"]',
  ).should("have.text", "2025-01-03");
  cy.get("#arsredovisning-for-export .signature").should(
    "have.text",
    "Karl Karlsson",
  );
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:UnderskriftHandlingEfternamn"]',
  ).should("have.text", "Karlsson");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:UnderskriftHandlingTilltalsnamn"]',
  ).should("have.text", "Karl");
  cy.get(
    '#arsredovisning-for-export [name="se-gen-base:UndertecknandeDatum"]',
  ).should("have.text", "2025-01-03");
});
