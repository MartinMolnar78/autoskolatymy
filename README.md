# Autoškola Tymy

Dvojjazyčný prezentačný web v Astre. Statické HTML pre slovenskú a maďarskú verziu, lokálne hostované písmo Manrope, optimalizované WebP fotografie a originálne PDF. Bez databázy, analytiky a kontaktného formulára. Google mapa je vložená priamo cez iframe a načíta sa automaticky pri priblížení ku kontaktnej sekcii.

Informácia o povinnosti preukázať vzdelanie pred kurzom skupiny B bola overená podľa [Ministerstva dopravy SR](https://www.mindop.sk/ministerstvo/doprava/autoskoly/zmeny-ucinne-od-01092026-v-zakone-c-93/2005-z-z), zmena účinná od 1. 9. 2026. Na webe je pod PDF iba textové upozornenie bez odkazu na podrobnosti.

## Lokálny vývoj

Node.js 22.12 alebo novší, npm 9.6.5 alebo novší.

```sh
npm ci
npm run dev
```

Otvoriť `http://127.0.0.1:4321/sk/` alebo `/hu/`.

V prostredí, ktoré nepovoľuje zápis do používateľského profilu, nastaviť `ASTRO_TELEMETRY_DISABLED=1`.

## Obsah a fotografie

- `src/data/content.ts`: texty oboch jazykov, inštruktori a ich telefónne čísla. Tretí inštruktor sa pridáva do poľa `instructors`; rozloženie sa prispôsobí.
- `src/pages/[lang]/index.astro`: sekcie, ceny a kontakty.
- `src/styles/global.css`: responzívny dizajn a animácie vrátane rešpektovania obmedzenia pohybu.
- `src/styles/motion.css`: kompozícia oboch áut, animovaná cesta cez celú šírku úvodu, pohyb grafiky a obrysy okolo portrétov. Tlačidlo v úvode pozastaví animácie; nastavenie obmedzenia pohybu ich vypne automaticky.
- `public/images/`: optimalizované kópie dodaných fotografií. Peter a Tibor používajú výhradne zdroje `withlogo`.
- `public/documents/`: dodané PDF bez zmien. Aj na maďarskej stránke zostávajú slovenské originály, čo je pri odkazoch uvedené.
- `scripts/prepare-assets.py`: voliteľné opätovné spracovanie pôvodných fotografií; vyžaduje Python s Pillow a úpravu cesty k zdroju. Pri bežnom builde sa nespúšťa.

Fotografie z `VsetkyFoto` sa nepoužívajú. Originály v priečinku na ploche sa nemenia.

## Build a kontrola

```sh
npm run build
npm run verify
npm run preview
```

Výstup je v `dist/`. Skript `verify` kontroluje obsah v hotovom HTML oboch jazykov, SEO tagy, interné odkazy, fotografie a PDF.

## Cloudflare Workers Static Assets

Pripravený `wrangler.jsonc` obsluhuje `dist/` a vracia skutočnú 404 pre neexistujúce adresy. Web nepotrebuje SSR adaptér ani bežiaci Node.js server.

Pred nasadením na finálnu doménu nastaviť build premenné:

```text
SITE_URL=https://vasa-finalna-domena.sk
INDEXABLE=true
ASTRO_TELEMETRY_DISABLED=1
```

Potom:

```sh
npm run build
npm run verify
npx wrangler deploy
```

V Cloudflare Workers Builds: build `npm run build`, deploy `npx wrangler deploy`, priečinok projektu tento adresár. Wrangler sa pri prvom použití môže doinštalovať cez npx. Prípadne možno výsledný priečinok `dist/` nasadiť aj na Cloudflare Pages.

Predvolene je pracovný návrh **noindex** a `robots.txt` zakazuje indexovanie. `INDEXABLE=true` zapne indexovanie pri zostavení finálneho webu. `SITE_URL` určuje canonical, hreflang, Open Graph, sitemapu a URL v štruktúrovaných údajoch. V produkcii treba obe premenné nastaviť súčasne. Sociálna náhľadová fotografia je `public/images/social.jpg`.

Po pripojení finálnej domény overiť `/sk/`, `/hu/`, `/sitemap.xml`, `/robots.txt`, oba PDF súbory a neexistujúcu URL. Následne pridať doménu do Google Search Console a odoslať sitemapu. Pred verejným spustením odporúčame klientovi skontrolovať maďarské znenie, ceny a adresu; firemný profil Google sa spravuje samostatne.

Projekt bol vytvorený podľa dodaného About.txt. Nie sú pridané vymyslené recenzie, otváracie hodiny, termíny kurzov ani tvrdenia o úspešnosti.
