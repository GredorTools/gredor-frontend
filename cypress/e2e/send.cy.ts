describe("go through send wizard", () => {
  it("works", () => {
    const mockOrderRef = crypto.randomUUID();
    const mockQrCode =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAACHJJREFUeNrt3VGS4zYMBNA45ftfeZLf3Rkn5hoAm9J7n6kpWaLljkQsyMfXv/4COMDfhgAQWAACCxBYAAILQGABAgtAYAEILEBgAQgsAIEFCCwAgQUgsACBBSCwAAQWILAABBaAwALO9zQE/+/xePz4319tOPTT36/87X/9/afHePW3r3RtqlRx3Z3HXhmnlHMWWE1fQgo3A1f7n+jVf1teCYFjCCxAYAEILOC2VAnfUFHhq6g07nDieVSMaVeV9tXfKwAFB9b0l5NeUQG/La+EwMUILEBgAQgs4LZiqoQVk3edPV1dn1dxfa/OOaUaVXEeK5XXiurtlXr7Un5bnrAAr4QAAgtAYAF3oDWnQcUCfhW6WoQ6J8xXjl0xEZxyDAv4ecICBBaAwAIQWIDAAhilSviGzqrYCov61Z/f6nebUgH2hAUgsAAEFiCwAAQWwEdiqoR37Znq7OHrWsBveqHE1WNM9/al9wFe6bflCQsQWAACCxBYAOm05nwgZbI1ZYJ4+tirLTHTCxpeaeL+1oGlxwr8trwSAgILQGABCCzgilQJ37A6kVkx8Zm8NVb6safPo6LSSEBgKcmC35ZXQkBgAQgsAIEF3Mnjq2n2Lr1ysnLZp/ab3XVLqunvpeq++fS4Kb8XT1gAAgsQWAACC7izI1tzpidVKyaqdxQhVibuK45RcS0Vk9opCwkmTNBX/IZSztkTFuCVEEBgAQILQGABFBqvEna2PEx/3nRLTGcbyYrONqOK80i+H18de7rCWvXdesICEFiAwAIQWAACCzhUW5VwtdowXQ2p0FkVm+572/GdT45/53lMj8d0/2nVPe0JC/BKCCCwAAQWcAfju+a80jUZvKMFpGuyu3PxvYprn27N6f4eP/1uu3ZE2tFONPmb9YQFeCUEEFgAAgsQWAAD2qqELz8wvD0ipSUm5Rhd323ntaRUK5NbyKYrm56wAK+EAAILQGABAgsgzHiV8OWJhGwjlNI7l9Jb2XUtnceo2H5t+t6dXpQvZew8YQFeCQEEFoDAAq4mZgG/n+xo35g+j/QxrTi/lBaV5DGdbhWruEatOQACCxBYAAILQGABB4tuzelsV3glZVulrnaKTtPncaXt1yqOPV0B1poDILAAgQUgsAAEFnCwZ9eBVytaFRWH6YpPcgVnx9itHHtHZa1rm6/pamVKj60nLACBBQgsAIEF8F3bpPvqpF5yS8zqsVNaLyomULsmpTuvZceijV33WMUYpSy+5wkL8EoIILAABBYgsACCjLfmVP39u8eoqBjtuJaKz0tud+qs5E235uz4vXw6HilVfE9YgFdCAIEFILAAgQWwSds2X53bWqVI2ebrSqarhzsqjQnfbcoWaZ6wAK+EAAILQGABVxM96b567Oldc6Z3HtmxgF/COHee9+q9dOJCgukT+p6wAK+EAAILQGABAgtgg/FtvqalVBQ7x6lz0bWKhQ5XrvHE++bV33ZV53aMs9YcAIEFCCwAgQUgsICLeU5/4PQWTDsqGdNbY62O9WnX3Xl/pIzHdH9hxXnY5gtAYAECC0BgAXw3voBf544mXTrbGK6+mFvVWKe0hnT9Bq60yJ4nLACBBQgsAIEFCCyAAzxTTqSictJV+ag4j4o2hs5K0nR1bnXRu677o7P9q2tMd1x3SlXRExbglRBAYAECC0BgARQZ7yU80al9gNOVtYpKV8ridNOLEaZfn22+AAQWILAABBbAe9paczp3eEnfnaViorpiEcCuwkfKwoo7ihDJhZaU9h675gAILEBgAQgsQGABHCB6Ab9V0xWciuvrXEBuup1iegu3HduvJbQfpVRpPWEBCCxAYAEILACBBRzseeJJd/YwTfdupWzztfKZFZW1HeOxcuzOStyn99iOvlRPWAACCxBYAAIL4D1tk+4VE4M7zmN64r5i8jllQcP09qrONqjJ695x39k1B0BgAQILQGABCCzgYh5fTVP9nf/Ef7qSkbyY247vpXPxvZT2ns577NPvYLoa2zn+nrAAr4QAAgtAYAECC2CT8QX8TqzwVXxmZyVpeguxzjGtuJaUauXqZyb8DjvvaU9YgFdCAIEFILCAOxhvzUnZFaXiWlbOI6U1p+Ia0ydsp9uPdiwk2HU/Tv+2PGEBXgkBBBaAwAIEFsAmbVXC1pMO2ZJq5fx2VMVStt1KPkZFa076PX2ltjdPWIBXQgCBBQgsAIEFUGS8Srhj+6+V80ioAiWNdfJ47OhXnR676cpm8j3jCQvwSgggsACBBXCCyy/gt2Ohsq6J3FN33tlx7RE/rsadd+46zp6wAK+EAAILEFgAAgugyJEL+LUOSEErRJeUloyUxd92tJGcuBhe1zhZwA9AYAECC0BgAXz3NAS/6tqlZOXzOnVey/QaVyk7EXWOadc4V4zdjnrdc8ePIzmcAK+EAAILEFgAAgvgT6kS/qaiKlbxeV2tEJ2FhvTKU9eChtPFm7vutLQtsFJK+YBXQgCBBQgsAIEFUCmmSphenej6vM6tuLoqjTuKGBULK3b1NHZuR9c11ju2v/OEBXglBBBYAAILuAOtOW+o2Fml4tirE6XTOwBVtLN0tkad2JrTdezOe8kTFoDAAgQWgMACBBbAAVQJ31DR6rF67BXpC+dNt7NMb1m24zw+HbtTd4zyhAUILACBBQgsAIEFUCSmSphSteiqaL0yvRheenUupfLaeezp/sDpe6zzt+wJC/BKCCCwAIEFkE5rzm8qJihTJtK7Jj87FwFMmdRO2V2oa+ejinPeUSh7nhoKgFdCAIEFILAAgQWQ5vHVONWfPrl+6iJmcFetVUKBAHglBAQWgMACEFiAwAIQWAACCxBYAAILQGABAgtAYAEILEBgAQgsAIEFCCwAgQUgsACBBSCwAH7xDwyD6oVl4TuaAAAAAElFTkSuQmCC";

    cy.viewport(1800, 1000);

    cy.visit("http://localhost:4173", {
      onBeforeLoad(win) {
        win.localStorage.setItem("AppShowFirstLaunchScreen", "false");
      },
    });

    cy.intercept(
      {
        method: "POST",
        url: "http://gredor-backend/v1/auth/status",
      },
      {
        loggedIn: false,
      },
    );

    cy.intercept(
      {
        method: "POST",
        url: "http://gredor-backend/v1/bankid/init",
      },
      {
        orderRef: mockOrderRef,
        autoStartToken: crypto.randomUUID(),
        status: "PENDING",
        statusPendingData: {
          qrCodeImageBase64: mockQrCode,
          hintCode: null,
        },
      },
    );

    cy.intercept(
      {
        method: "POST",
        url: "http://gredor-backend/v1/bankid/status",
      },
      {
        orderRef: mockOrderRef,
        status: "COMPLETE",
        statusCompleteData: {
          personalNumber: "191212121212",
          token: crypto.randomUUID(),
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

    cy.intercept(
      {
        method: "POST",
        url: "http://gredor-backend/v1/submission-flow/validate",
      },
      {
        orgnr: "5569999999",
        utfall: [],
      },
    );

    cy.intercept(
      {
        method: "POST",
        url: "http://gredor-backend/v1/submission-flow/submit",
      },
      {
        orgnr: "5569999999",
        avsandare: "191212121212",
        undertecknare: "191212121212",
        url: "http://127.0.0.1",
        handlingsinfo: {
          typ: "arsredovisning_komplett",
          dokumentlangd: 1337,
          idnummer: "M0CK",
          sha256checksumma: "123",
        },
      },
    );

    // Öppna wizard
    cy.get('button[data-testid="show-send-wizard-button"]').click();
    cy.wait(1000); // Behövs för att input-fält inte ska bete sig knasigt

    // Steg 1 - Ladda upp fil
    cy.get(".drop-zone").selectFile(
      `cypress/fixtures/input/gredor/TestfilC.gredorfardig`,
      { action: "drag-drop" },
    );
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 2 - Fyll i uppgifter
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').click();
    cy.get('input[data-testid="send-wizard-personalnumber-input"]').type(
      "191212121212",
    );
    cy.get('input[data-testid="send-wizard-email-input"]').click();
    cy.get('input[data-testid="send-wizard-email-input"]').type(
      "example@example.com",
    );
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 3 - BankID
    cy.get("div.justify-content-center button.btn").click();
    cy.wait(1000); // Vänta på legitimering
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 4 - Bolagsverkets villkor
    cy.get("#bolagsverketAgreementCheck").check();
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 5 - fastställelseintyg
    cy.get("#datum").type("2025-10-12");
    cy.get("#tilltalsnamn").type("Karl");
    cy.get("#efternamn").type("Karlsson");
    cy.get("#roll").select("Styrelseledamot");
    cy.get("#resultatdispositionBeslut").select(
      "Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.",
    );
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 6 - förhandsgranskning (vi går fram och tillbaka till steg 7 också bara för att testa det)
    cy.get('[data-testid="wizard-next-button"]').click({ timeout: 15000 }); // Kan ta en stund att generera iXBRL
    cy.get('[data-testid="wizard-previous-button"]').click();
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 7 - Bolagsverkets kontroller
    cy.get("div.limit-width div").should(
      "have.text",
      "Kontrollresultat Bolagsverkets automatiska kontroller hittade inga anmärkningar. ",
    );
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 8 - Gredors villkor
    cy.get("#gredorAgreementCheck").check();
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 9 - "Sista varningen"
    cy.get('[data-testid="wizard-next-button"]').click();

    // Steg 10 - klar
    cy.get("div.limit-width p:nth-child(1)").should(
      "have.text",
      " Årsredovisningen är nu uppladdad till ditt egna utrymme hos Bolagsverket. ",
    );
    cy.get('[data-testid="wizard-next-button"]').click();
  });
});
