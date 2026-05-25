# Svettfri Admin – Installation

## Vad du fått

| Fil | Vad det är | Var den ska ligga |
|---|---|---|
| `admin.html` | Själva admin-verktyget | I roten av repot, men committa inte den till GitHub Pages (eller lägg i `.gitignore`). Den körs lokalt. |
| `products.js` | Skript som läser products.json på publika sidor | I roten av repot (committas och deployas) |
| `products.json` | "Databasen" med produkter och quiz-rek | I roten av repot (committas och deployas) |

## Snabbstart (15 minuter)

### 1. Lägg filerna i ditt repo

```bash
cd ~/path/till/svettsajt
# Kopiera de tre filerna hit
```

### 2. Öppna admin lokalt

Dubbelklicka `admin.html`, eller dra den till webbläsaren. Den fungerar utan server.

> Första gången laddar du upp den medföljande `products.json` via **Importera / Exportera-fliken** så att alla dina nuvarande produkter dyker upp i admin.

### 3. Koppla in produkterna på sajten

Hänvisningarna är opt-in. Du ändrar HTML där du vill att admin ska styra innehållet.

**På `index.html` – byt produktkorten i sektionen `#produkter`:**

```html
<div class="product-card" data-svettfri-product-card="absolut-torr-35"></div>
```

**På `driclor-vs-absolut-torr-vs-perspirex.html` – byt jämförelsekorten:**

```html
<div class="comparison-card" data-svettfri-comparison="absolut-torr-35"></div>
<div class="comparison-card" data-svettfri-comparison="driclor-20"></div>
<div class="comparison-card" data-svettfri-comparison="perspirex-original"></div>
```

**Lägg till skriptet i `<head>` på de sidor där du vill ha dynamisk data:**

```html
<script src="products.js" defer></script>
```

**För quiz-logiken i index.html** – jag har skrivit `products.js` så det exponerar `window.SVETTFRI_QUIZ_DATA`. Du kan steg-för-steg ersätta det hårdkodade `recommendations`-objektet med:

```js
window.addEventListener('svettfri:loaded', () => {
  // Använd window.SVETTFRI_QUIZ_DATA istället för recommendations
});
```

Men det är inte bråttom – så länge produktdata stämmer i båda ställen funkar quiz som idag.

### 4. Daglig workflow

1. Öppna `admin.html` på din dator
2. Redigera produkter / quiz-rekommendationer
3. Klicka **"Ladda ner products.json"**
4. Ersätt filen i repot
5. `git add products.json && git commit -m "..." && git push`
6. GitHub Pages bygger om – nya priser/länkar live om 30 sekunder

## Vanliga frågor

**Q: Måste jag bygga om alla artiklar nu?**
Nej. Du kan migrera en sida i taget. Sidor utan `data-svettfri-*` attribut påverkas inte.

**Q: Kan admin gå sönder min sajt?**
Nej. Admin rör aldrig din live-data direkt – du laddar bara ner en JSON-fil och committar manuellt.

**Q: Funkar admin på mobilen?**
Ja, men jag har optimerat för desktop. Mobilstöd finns ifall du behöver fixa något i farten.

**Q: Var sparas mina ändringar mellan sessioner?**
I `localStorage` i din webbläsare. Använd alltid samma dator för admin, eller exportera/importera mellan datorer.

**Q: Hur lägger jag till en ny kategori?**
Just nu är de fyra hårdkodade. Säg till så lägger jag in stöd för fri text.

## Att tänka på (säkerhet)

- `admin.html` har en `noindex`-tag, men du bör ändå **inte** deploya den till GitHub Pages om du vill hålla redigeringsgränssnittet privat.
- Lägg den i `.gitignore` om paranoid, eller commit:a i en separat privat branch.
- Eftersom allt sker lokalt finns inga lösenord eller API-nycklar att läcka.

## Nästa steg när det här rullar

När produktadmin sitter och du publicerat ett par artiklar till med den, kommer naturliga nästa moduler:

1. **Artikelutkast-läge** – skriv-assistent som lär sig din röst från befintliga artiklar
2. **Sökord & idéer** – planera artiklar mot dina målsökord från roadmap
3. **Affiliate-tracker** – manuell registrering av konverteringar per produkt så du ser vad som funkar

Säg till när du är redo.
