import type { OnboardingTourStep } from "vue-onboarding-tour";

export const tourSteps: OnboardingTourStep[] = [
  {
    title: "Välkommen till Gredor!",
    description:
      "Du kommer nu att få en snabb rundtur genom de olika delarna av tjänsten.",
  },
  {
    target: "#editor",
    title: "Redigera årsredovisningen",
    description:
      "På vänster sida av skärmen har du redigeringsvyn, där du bland annat" +
      " lägger till fält i årsredovisningen.",
  },
  {
    target: "#renderer",
    title: "Live-förhandsgranskning",
    description:
      "Och på höger sida av skärmen har du en förhandsgranskning som visar" +
      " hur årsredovisningen kommer att se ut. Den uppdateras live när du" +
      " redigerar årsredovisningen.",
  },
  {
    target: "#newArsredovisningBtn",
    title: "Börja på din årsredovisning",
    description:
      "<p>" +
      "Första gången du öppnar Gredor visas en exempel-årsredovisning. När du" +
      " är redo att börja på din egna årsredovisning bör du klicka på knappen" +
      ' "Ny årsredovisning" för att göra det.' +
      "</p>" +
      "<p>" +
      "Gredor kommer då automatiskt hämta vissa uppgifter från Bolagsverket," +
      " och du kommer även att ha möjlighet att importera en SIE-fil från ditt" +
      " bokföringsprogram om du vill." +
      "</p>",
  },
  {
    target: "#saveArsredovisningBtn",
    title: "Öppna och spara",
    description:
      "<p>" +
      "I Gredor sparas årsredovisningen automatiskt till din webbläsare, men" +
      " du bör även spara den till din enhet manuellt med jämna mellanrum" +
      " ifall din webbläsare skulle rensa datat." +
      "</p>" +
      "<p>" +
      "Du kan även använda" +
      ' knapparna "Öppna" och "Spara som" till att dela årsredovisningar med' +
      " andra personer." +
      "</p>",
  },
  {
    target: "#tools",
    title: "När du är klar…",
    description:
      "När du är klar med din årsredovisning använder du verktygen" +
      " här för att färdigställa och lämna in den till Bolagsverket." +
      "<ul>" +
      "<li>Verktyget <strong>Färdigställ inför årsstämma</strong> låter dig" +
      " färdigställa årsredovisningen inför ditt företags årsstämma.</li>" +
      "<li>Efter årsstämman använder du verktyget <strong>Skicka in till" +
      " Bolagsverket efter årsstämma</strong> för att lämna in årsredovisningen" +
      " till Bolagsverket.</li>" +
      "</ul>",
  },
  {
    target: "#documentation",
    title: "Mer information",
    description:
      "Mer information om hur Gredor fungerar och vad som är viktigt att tänka" +
      " på hittar du här nere.",
  },
];
