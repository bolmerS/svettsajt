# Publicera en ny artikel på Svettfri

Den här filen är både din checklista *och* instruktion till Claude.
Säg bara: **"Publicera en ny artikel enligt PUBLISHING.md, ämnet är: ..."**
så följer Claude alla steg nedan automatiskt.

---

## 1. Inför skrivande – information som behövs

Innan artikeln skrivs ska följande vara klart:

- [ ] **Huvudsökord** (vad folk googlar) – ex: "jontofores hemma"
- [ ] **Sökintention** – informational / commercial / comparison
- [ ] **Målgrupp** – var i behandlingstrappan står läsaren?
- [ ] **Hampus personliga vinkel** – egen erfarenhet, misstag, åsikt
- [ ] **Relaterade artiklar** – minst 2 interna länkar att peka mot

## 2. Filnamn

Format: `huvudsokord-med-bindestreck.html`

Regler:
- Bara små bokstäver, siffror och bindestreck
- Inga åäö (Google föredrar ASCII i URL:er)
- Max 5-6 ord
- Måste innehålla huvudsökordet

Bra exempel:
- `jontofores-hemma-guide.html`
- `hidroxa-recension.html`
- `botox-mot-svettning-kostnad.html`

## 3. Använd mallen

Utgå från `article-template.html`. Fyll i alla `{{PLATSHÅLLARE}}` enligt riktlinjerna i HTML-kommentarerna. Behåll exakt samma:

- Header (logga + nav-länkar)
- Footer (disclaimer + copyright)
- Google Analytics-block
- CSS-länk (`style.css`)
- Fontladdningar (Fraunces + Inter)

## 4. Skrivriktlinjer – Svettfri-tonen

**Ton:**
- Jag-form, personlig
- Ärlig om vad som inte funkat
- Inga säljiga superlativ ("bäst", "fantastisk", "revolutionerande")
- Erkänn osäkerhet där det finns

**Struktur per artikel:**
- 1 H1 (rubriken)
- 3-7 H2 (huvudavsnitt)
- H3 endast vid behov inom H2
- Korta stycken (2-4 meningar)
- Listor när det är 3+ punkter
- Minst ett `<div class="comparison-card">` om produkter jämförs
- Avsluta alltid med `<div class="next-steps">`

**SEO-grunder:**
- Huvudsökord i: H1, första stycket, meta description, minst en H2
- Längd: 1200-2500 ord för pillar-artiklar, 800-1500 för recensioner
- Internlänkar: minst 2 till andra Svettfri-artiklar
- Externa länkar: bara till trovärdiga källor (1177, vårdguiden, studier)
- Affiliate-länkar: alltid `rel="noopener nofollow"` och `target="_blank"`

## 5. Uppdatera `sitemap.xml`

Lägg till en ny `<url>`-block i `sitemap.xml`:

```xml
<url>
    <loc>https://svettfri.com/FILNAMN.html</loc>
    <lastmod>ÅÅÅÅ-MM-DD</lastmod>
    <priority>0.8</priority>
</url>
```

Priority-riktlinjer:
- `1.0` = startsidan (rör inte)
- `0.9` = pillar-artiklar (huvudguider)
- `0.8` = produktrecensioner och jämförelser
- `0.5` = kontakt, om-mig

## 6. Lägg till intern länk från relaterade sidor

För att Google ska hitta och prioritera den nya artikeln:

- [ ] Lägg en länk från **startsidan** (`index.html`) – antingen i produktgrid eller "min resa"-sektionen
- [ ] Lägg minst en länk från en **relaterad artikel** (i `next-steps`-boxen eller i brödtext)
- [ ] Kolla att artikeln länkas från **minst en** annan sida – aldrig en "orphan page"

## 7. Snabb kvalitetskontroll

Innan commit, kolla:

- [ ] Alla `{{PLATSHÅLLARE}}` är ersatta (sök i filen efter `{{`)
- [ ] Filnamn matchar `<loc>` i sitemap
- [ ] Datum stämmer i både article-meta och sitemap `<lastmod>`
- [ ] Affiliate-länkar har `rel="noopener nofollow"`
- [ ] Alla `href="#"` är ersatta med riktiga länkar eller borttagna
- [ ] Open Graph URL matchar verklig URL

## 8. Commit och push

```bash
git add FILNAMN.html sitemap.xml index.html [andra-relaterade.html]
git commit -m "Lägg till artikel: KORT_BESKRIVNING"
git push
```

Vänta ~30 sekunder, kolla att sidan är live på `svettfri.com/FILNAMN.html`.

## 9. Efter publicering (manuellt – inte Claude)

- [ ] Skicka in URL:en i [Google Search Console](https://search.google.com/search-console) → URL-inspektion → "Begär indexering"
- [ ] Lägg till i din egen anteckning över publicerade artiklar (datum + sökord)
- [ ] Sätt en påminnelse om 4 veckor att kolla Search Console för första rankings

---

## Vanliga misstag att undvika

1. **Tunna artiklar** – om du inte har minst 1000 ord av riktig substans, skriv inte. Bättre färre bra artiklar än många dåliga.
2. **Orphan pages** – artiklar utan interna länkar Googlas inte upp ordentligt. Lägg alltid till länk från minst en befintlig sida.
3. **Affiliate-länk utan kontext** – aldrig en CTA-knapp utan att du sagt *varför* du rekommenderar produkten.
4. **Glömma sitemap** – då hittar Google artikeln långsammare.
5. **Generiska H1:or** – "Min guide till X" är sämre än "X på 4 veckor – min faktiska erfarenhet".

## Mall för Claude-prompten

När du vill att Claude ska publicera en artikel:

> Publicera en ny artikel enligt PUBLISHING.md.
>
> **Ämne:** [huvudsökord, t.ex. "jontofores hemma"]
> **Filnamn:** [förslag eller låt Claude välja]
> **Mina huvudpunkter:**
> - [punkt 1 från egen erfarenhet]
> - [punkt 2]
> - [punkt 3]
> - [vad jag vill att läsaren tar med sig]
>
> **Internlänkar att inkludera:** [vilka befintliga artiklar att peka mot]
> **Produkter att nämna:** [produkt-ID från products.json om relevant]
