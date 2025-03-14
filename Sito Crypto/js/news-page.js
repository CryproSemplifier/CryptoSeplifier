document.addEventListener('DOMContentLoaded', function() {
    // Elementi delle sezioni di notizie
    const cryptoNewsSection = document.getElementById('crypto-news');
    const stockNewsSection = document.getElementById('stock-news');
    const goldNewsSection = document.getElementById('gold-news');
    const geopoliticsNewsSection = document.getElementById('geopolitics-news');
    
    // Configurazione delle sezioni di notizie
    const newsSections = [
        {
            container: cryptoNewsSection?.querySelector('.news-list'),
            query: 'Bitcoin OR XRP OR cryptocurrency OR blockchain',
            category: 'Criptovalute'
        },
        {
            container: stockNewsSection?.querySelector('.news-list'),
            query: 'stock market OR S&P 500 OR Nasdaq OR finance',
            category: 'Mercati Azionari'
        },
        {
            container: goldNewsSection?.querySelector('.news-list'),
            query: 'gold price OR gold market',
            category: 'Oro'
        },
        {
            container: geopoliticsNewsSection?.querySelector('.news-list'),
            query: 'geopolitics OR global economy OR sanctions OR war',
            category: 'Geopolitiche'
        }
    ];
    
    // Inizializza il caricamento delle notizie per ogni sezione
    newsSections.forEach(section => {
        if (section.container) {
            fetchNewsForSection(section);
        }
    });
    
    // Funzione per recuperare le notizie per una sezione specifica
    function fetchNewsForSection(section) {
        // Verifica se il container esiste
        if (!section.container) return;
        
        // Mostra il messaggio di caricamento
        section.container.innerHTML = `<div class="loading-section">Caricamento notizie su ${section.category}...</div>`;
        
        // Configura la richiesta API
        const apiKey = 'YOUR_NEWSAPI_KEY'; // Sostituisci con la tua chiave API
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7); // Ultime 7 giorni
        const fromDateStr = fromDate.toISOString().split('T')[0];
        
        // URL dell'API con proxy CORS per evitare problemi di cross-origin
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `${corsProxy}https://newsapi.org/v2/everything?q=${encodeURIComponent(section.query)}&language=it,en&from=${fromDateStr}&sortBy=relevancy&pageSize=5&apiKey=${apiKey}`;
        
        // Effettua la richiesta API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Errore di rete: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.articles && data.articles.length > 0) {
                    displayNewsInSection(data.articles, section.container);
                } else {
                    throw new Error('Nessuna notizia disponibile');
                }
            })
            .catch(error => {
                console.error(`Errore nel recupero delle notizie per ${section.category}:`, error);
                displayMockNewsInSection(section.category, section.container);
            });
    }
    
    // Funzione per visualizzare le notizie in una sezione
    function displayNewsInSection(articles, container) {
        let newsHTML = '';
        
        articles.forEach(article => {
            const date = new Date(article.publishedAt);
            const formattedDate = date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            // Limita la descrizione a 2 righe (gestito tramite CSS)
            const description = article.description || 'Nessuna descrizione disponibile';
            
            newsHTML += `
                <div class="news-card">
                    <h4 class="news-card-title"><a href="${article.url}" target="_blank">${article.title}</a></h4>
                    <div class="news-card-meta">
                        <span>${article.source.name}</span>
                        <span>Crypto Insights, ${formattedDate}</span>
                    </div>
                    <p class="news-card-description">${article.description}</p>
                </div>
            `;
        });
        
        container.innerHTML = newsHTML;
    }
    
    // Funzione per visualizzare notizie di esempio in caso di errore API
    function displayMockNewsInSection(category, container) {
        // Notizie di esempio per ogni categoria
        const mockNewsData = {
            'Criptovalute': [
                {
                    title: "Bitcoin supera i 50.000$ per la prima volta in sei mesi",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Bitcoin ha superato la soglia dei 50.000 dollari per la prima volta negli ultimi sei mesi, segnando un importante recupero dopo il recente calo del mercato."
                },
                {
                    title: "XRP guadagna il 15% dopo la vittoria legale di Ripple",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "XRP ha registrato un aumento del 15% nelle ultime 24 ore dopo che Ripple ha ottenuto una vittoria parziale nella sua battaglia legale con la SEC."
                },
                {
                    title: "Gli analisti prevedono un'impennata di Bitcoin entro fine anno",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Diversi analisti di mercato prevedono che Bitcoin potrebbe raggiungere nuovi massimi storici entro la fine dell'anno, citando l'adozione istituzionale e la scarsità dell'offerta."
                },
                {
                    title: "Ripple espande le partnership per l'utilizzo di XRP nei pagamenti transfrontalieri",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Ripple ha annunciato nuove partnership con istituzioni finanziarie in Asia e America Latina per l'utilizzo di XRP nei pagamenti transfrontalieri."
                },
                {
                    title: "Bitcoin mining: cresce l'adozione di energie rinnovabili",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Un nuovo rapporto indica che oltre il 50% del mining di Bitcoin utilizza ora fonti di energia rinnovabile, in risposta alle preoccupazioni ambientali."
                }
            ],
            'Mercati Azionari': [
                {
                    title: "S&P 500 raggiunge nuovi massimi storici",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "L'indice S&P 500 ha raggiunto nuovi massimi storici, trainato dalle performance positive del settore tecnologico e dalle aspettative di tagli dei tassi di interesse."
                },
                {
                    title: "Nasdaq in rialzo grazie ai titoli tech",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Il Nasdaq ha registrato un forte rialzo grazie alle performance positive dei principali titoli tecnologici, con Apple e Microsoft in testa."
                },
                {
                    title: "Le banche centrali influenzano i mercati azionari globali",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Le decisioni delle banche centrali sui tassi di interesse stanno influenzando significativamente i mercati azionari globali, con gli investitori attenti ai segnali di politica monetaria."
                },
                {
                    title: "Il settore finanziario mostra segni di ripresa",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Il settore finanziario sta mostrando segni di ripresa dopo un periodo di incertezza, con le principali banche che riportano utili superiori alle aspettative."
                },
                {
                    title: "Impatto dell'intelligenza artificiale sui mercati azionari",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "L'adozione crescente dell'intelligenza artificiale sta avendo un impatto significativo sui mercati azionari, con le aziende che investono in questa tecnologia che vedono aumentare il valore delle loro azioni."
                }
            ],
            'Oro': [
                {
                    title: "Il prezzo dell'oro raggiunge nuovi massimi",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Il prezzo dell'oro ha raggiunto nuovi massimi storici, superando i 2.000 dollari per oncia, in un contesto di crescente incertezza economica globale."
                },
                {
                    title: "L'oro come bene rifugio in tempi di inflazione",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Gli investitori si stanno rivolgendo all'oro come bene rifugio in risposta alle preoccupazioni per l'inflazione crescente e l'instabilità economica."
                },
                {
                    title: "Correlazione tra oro e Bitcoin in discussione",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Gli analisti stanno dibattendo sulla correlazione tra oro e Bitcoin, con alcuni che sostengono che le due asset class stiano diventando sempre più interconnesse."
                },
                {
                    title: "Banche centrali aumentano le riserve d'oro",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Le banche centrali di diversi paesi stanno aumentando le loro riserve d'oro, segnalando una crescente sfiducia nel sistema monetario basato sul dollaro."
                },
                {
                    title: "Produzione di oro in calo: impatto sui prezzi",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "La produzione globale di oro è in calo, con le principali miniere che faticano a mantenere i livelli di produzione, il che potrebbe portare a un ulteriore aumento dei prezzi."
                }
            ],
            'Geopolitiche': [
                {
                    title: "Tensioni geopolitiche influenzano i mercati globali",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Le crescenti tensioni geopolitiche tra le principali potenze mondiali stanno avendo un impatto significativo sui mercati finanziari globali, incluso il settore delle criptovalute."
                },
                {
                    title: "Nuove sanzioni economiche e loro impatto sui mercati",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "L'introduzione di nuove sanzioni economiche sta creando volatilità nei mercati finanziari, con alcuni paesi che si rivolgono alle criptovalute per aggirare le restrizioni."
                },
                {
                    title: "Summit economico globale: decisioni chiave per i mercati",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Il recente summit economico globale ha prodotto decisioni chiave che potrebbero influenzare significativamente i mercati finanziari nei prossimi mesi."
                },
                {
                    title: "Crisi energetica: implicazioni per l'economia globale",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "La crisi energetica in corso sta avendo profonde implicazioni per l'economia globale, con potenziali ripercussioni sui mercati delle criptovalute e dell'oro."
                },
                {
                    title: "Nuove politiche monetarie in risposta all'instabilità globale",
                    url: "#",
                    source: { name: "Crypto Insights" },
                    publishedAt: new Date(),
                    description: "Le banche centrali stanno implementando nuove politiche monetarie in risposta all'instabilità globale, con potenziali effetti a lungo termine sui mercati finanziari."
                }
            ]
        };
        
        // Seleziona le notizie di esempio per la categoria corrente
        const mockNews = mockNewsData[category] || mockNewsData['Criptovalute'];
        
        // Visualizza le notizie di esempio
        let newsHTML = '';
        
        mockNews.forEach(article => {
            const date = new Date(article.publishedAt);
            const formattedDate = date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            newsHTML += `
                <div class="news-card">
                    <h4 class="news-card-title"><a href="${article.url}" target="_blank">${article.title}</a></h4>
                    <div class="news-card-meta">
                        <span>${article.source.name}</span>
                        <span>Crypto Insights, ${formattedDate}</span>
                    </div>
                    <p class="news-card-description">${article.description}</p>
                </div>
            `;
        });
        
        container.innerHTML = newsHTML;
    }
});