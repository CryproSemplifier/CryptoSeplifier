# Crypto Seplifier - Guida alla Condivisione

## Come Condividere il Sito con i Tuoi Amici

Ci sono diversi modi per condividere il tuo sito Crypto Seplifier con i tuoi amici. Ecco le opzioni più semplici:

### Opzione 1: Hosting Gratuito con GitHub Pages (Consigliato)

1. **Crea un account GitHub** se non ne hai già uno: [https://github.com/signup](https://github.com/signup)
2. **Crea un nuovo repository** chiamato `username.github.io` (sostituisci "username" con il tuo nome utente GitHub)
3. **Carica tutti i file** del sito nella cartella principale del repository
4. Il tuo sito sarà disponibile all'indirizzo `https://username.github.io`
5. Condividi questo link con i tuoi amici

### Opzione 2: Hosting Gratuito con Netlify

1. **Crea un account Netlify**: [https://app.netlify.com/signup](https://app.netlify.com/signup)
2. Vai alla dashboard di Netlify e clicca su "**Add new site**" > "**Deploy manually**"
3. Trascina l'intera cartella del tuo sito (tutti i file HTML, CSS, JS) nell'area di upload
4. Netlify genererà un URL casuale (es. `https://random-name-123456.netlify.app`)
5. Puoi personalizzare questo URL dalle impostazioni del sito
6. Condividi il link con i tuoi amici

### Opzione 3: Hosting Gratuito con Vercel

1. **Crea un account Vercel**: [https://vercel.com/signup](https://vercel.com/signup)
2. Installa Vercel CLI: `npm i -g vercel`
3. Naviga alla cartella del tuo progetto nel terminale e digita `vercel`
4. Segui le istruzioni per il deployment
5. Vercel ti fornirà un URL che puoi condividere con i tuoi amici

## Note Importanti Prima di Condividere

1. **API Key per le Notizie**: Nel file `js/news.js` c'è un segnaposto `YOUR_NEWSAPI_KEY`. Per far funzionare le notizie, dovresti:
   - Registrarti su [NewsAPI](https://newsapi.org/) per ottenere una chiave API gratuita
   - Sostituire `YOUR_NEWSAPI_KEY` con la tua chiave API
   - **Nota**: La versione gratuita di NewsAPI funziona solo in locale o su domini autorizzati

2. **Alternativa per le Notizie**: Se non vuoi usare NewsAPI, il sito è già configurato per mostrare notizie di esempio quando l'API non è disponibile.

3. **Test Locale**: Prima di condividere, assicurati che tutto funzioni correttamente aprendo `index.html` nel tuo browser locale.

## Risoluzione dei Problemi

- Se le API non funzionano dopo il deployment, controlla le restrizioni CORS o le limitazioni delle API gratuite
- Per problemi con GitHub Pages, assicurati che il repository sia pubblico
- Se hai problemi con Netlify o Vercel, consulta la loro documentazione per la risoluzione dei problemi

Buona condivisione! 🚀