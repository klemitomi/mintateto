# Mintatető Kft. – bemutató weboldal

Kitalált cég bemutató oldala (tetőfedés, napelem, napelemes tetőcserép, bádogozás). Tiszta HTML, CSS és JS, build nélkül. Készítette: Klement Forge.

## Felépítés
- `public/` – a teljes oldal (főoldal + 3 aloldal, `css/`, `js/`, `img/`)
- `firebase.json` – Firebase Hosting beállítás (`public` mappa)

## Helyi megnyitás
```
cd public && python3 -m http.server 8080
```

## Telepítés Firebase Hostingra
```
npm i -g firebase-tools
firebase login
firebase use --add      # válaszd ki a Firebase-projektet
firebase deploy --only hosting
```

## Megjegyzések
- A képek közül az AI-generáltak jobb alsó sarkában felirat van; a stock fotókon nincs.
- Az ajánlatkérő űrlap és a chatbot demó: nem küld valódi üzenetet.
- Betűtípusok: Google Fonts (Big Shoulders Display, Hanken Grotesk, JetBrains Mono).
