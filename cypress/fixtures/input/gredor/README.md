## TestfilA

En av testfilerna som används för att skapa iXBRL för granskning av
Bolagsverket (för godkännande av programvaran).

Innehåller:

* Flerårsöversikt i tusentals kronor
* Förändring av eget kapital som innehåller:
    - föregående års resultat (vinst)
    - utdelning
    - att bolaget har gjort en fondemission under året (bunden överkursfond har
      tagits i anspråk)
    - att resten av eget kapital balanseras i ny räkning
* Förslag till disposition där utdelning ingår
* Fullständig resultaträkning som innehåller samtliga begrepp och som visar
  vinst
* Balansräkning med 10 balansposter (exklusive summaposter)
* Anläggningsnot (Byggnader och mark) där alla begrepp i noten ingår
* Undertecknande med två företrädare och datum för undertecknande är lika för
  respektive företrädare


## TestfilB

En av testfilerna som används för att skapa iXBRL för granskning av
Bolagsverket (för godkännande av programvaran).

Innehåller:

* Flerårsöversikt i tusentals kronor
* Förändring av eget kapital som innehåller:
    - erhållet aktieägartillskott som täcker föregående års resultat (förlust)
    - att resten av eget kapital balanseras i ny räkning
* Förslag till disposition
* Fullständig resultaträkning som innehåller samtliga begrepp och som visar
  förlust
* Balansräkning med 10 balansposter (exklusive summaposter)
* En not som redovisas som en tuple i XBRL (ExceptionellaKostnaderTuple)
* Undertecknande med två företrädare och datum för undertecknande är olika för
  respektive företrädare


## TestfilC

Testfil för ett nystartat företag, första räkenskapsåret.

Innehåller:

* Flerårsöversikt i heltal kronor
* Förändring av eget kapital med öppningsbalans
* Förslag till disposition
* Resultaträkning
* Balansräkning
* Undertecknande med en företrädare


## TestfilD

Testfil med alla fält ifyllda. Värdena går inte ihop logiskt utan detta är bara
till för regressionstestning.


## TestfilE

Liknar TestfilA, men har avrundningsfel på ett av fälten för balanserat
resultat.
