document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const newsBtn = document.getElementById('news-btn');
    const closePopup = document.getElementById('close-popup');
    const newsContainer = document.getElementById('news-container');
    const newsPopup = document.getElementById('news-popup');
    
    // Event listeners for news popup (keeping this for other pages)
    if (newsBtn) {
        newsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            newsPopup.classList.add('active');
            fetchNews(true); // true indicates popup mode
        });
    }
    
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            newsPopup.classList.remove('active');
        });
    }
    
    // Close popup when clicking outside of content
    if (newsPopup) {
        newsPopup.addEventListener('click', function(e) {
            if (e.target === newsPopup) {
                newsPopup.classList.remove('active');
            }
        });
    }
    
    // Load news directly on homepage if news container exists
    if (newsContainer && !newsContainer.closest('.news-popup')) {
        fetchNews(false); // false indicates direct display mode
    }
    
    // Function to fetch cryptocurrency news
    function fetchNews(isPopup) {
        const targetContainer = isPopup ? 
            document.querySelector('.news-popup-body#news-container') : 
            document.getElementById('news-container');
            
        if (!targetContainer) return;
        
        targetContainer.innerHTML = '<div class="loading-news">Caricamento notizie...</div>';
        
        // Using NewsAPI for cryptocurrency news
        // Note: You need to register for a free API key at https://newsapi.org/
        const apiKey = 'YOUR_NEWSAPI_KEY'; // Replace with your actual NewsAPI key
        const url = `https://newsapi.org/v2/everything?q=Bitcoin OR XRP OR Ripple&language=it,en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.articles && data.articles.length > 0) {
                    // Format NewsAPI data to match our display function
                    const formattedNews = data.articles.map(article => ({
                        title: article.title,
                        news_url: article.url,
                        source_name: article.source.name,
                        date: new Date(article.publishedAt),
                        text: article.description || 'Nessuna descrizione disponibile'
                    }));
                    displayNews(formattedNews, targetContainer);
                } else {
                    throw new Error('No news available');
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                // Fallback to mock data if API fails
                displayMockNews(targetContainer);
            });
    }
    
    // Function to display news in the container
    function displayNews(newsItems, container) {
        let newsHTML = '';
        
        newsItems.forEach(item => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            newsHTML += `
                <div class="news-item">
                    <h4 class="news-title"><a href="${item.news_url}" target="_blank">${item.title}</a></h4>
                    <div class="news-meta">
                        <span>${item.source_name}</span>
                        <span>${formattedDate}</span>
                    </div>
                    <p class="news-description">${item.text}</p>
                </div>
            `;
        });
        
        container.innerHTML = newsHTML;
    }
    
    // Function to display mock news if API fails
    function displayMockNews(container) {
        const mockNews = [
            {
                title: "Bitcoin supera i 50.000$ per la prima volta in sei mesi",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "Bitcoin ha superato la soglia dei 50.000 dollari per la prima volta negli ultimi sei mesi, segnando un importante recupero dopo il recente calo del mercato."
            },
            {
                title: "XRP guadagna il 15% dopo la vittoria legale di Ripple",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "XRP ha registrato un aumento del 15% nelle ultime 24 ore dopo che Ripple ha ottenuto una vittoria parziale nella sua battaglia legale con la SEC."
            },
            {
                title: "Gli analisti prevedono un'impennata di Bitcoin entro fine anno",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "Diversi analisti di mercato prevedono che Bitcoin potrebbe raggiungere nuovi massimi storici entro la fine dell'anno, citando l'adozione istituzionale e la scarsità dell'offerta."
            },
            {
                title: "Ripple espande le partnership per l'utilizzo di XRP nei pagamenti transfrontalieri",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "Ripple ha annunciato nuove partnership con istituzioni finanziarie in Asia e America Latina per l'utilizzo di XRP nei pagamenti transfrontalieri."
            },
            {
                title: "Bitcoin mining: cresce l'adozione di energie rinnovabili",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "Un nuovo rapporto indica che oltre il 50% del mining di Bitcoin utilizza ora fonti di energia rinnovabile, in risposta alle preoccupazioni ambientali."
            },
            {
                title: "XRP potrebbe essere integrato in più exchange dopo chiarimenti normativi",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "Diversi exchange stanno considerando di reintegrare XRP dopo i recenti sviluppi normativi che hanno fornito maggiore chiarezza sul suo status legale."
            },
            {
                title: "Bitcoin adottato come valuta legale in un altro paese",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "Un altro paese ha annunciato piani per adottare Bitcoin come valuta legale, seguendo l'esempio di El Salvador."
            },
            {
                title: "Ripple lancia un fondo da 250 milioni per sviluppatori XRP",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "Ripple ha lanciato un fondo da 250 milioni di dollari per sostenere gli sviluppatori che creano applicazioni sull'ecosistema XRP Ledger."
            },
            {
                title: "Analisi tecnica: Bitcoin forma un pattern rialzista",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "L'analisi tecnica mostra che Bitcoin sta formando un pattern rialzista che potrebbe segnalare un'ulteriore crescita nei prossimi giorni."
            },
            {
                title: "XRP guadagna popolarità nel settore dei pagamenti digitali",
                news_url: "#",
                source_name: "Crypto Insights",
                date: new Date(),
                text: "XRP sta guadagnando popolarità nel settore dei pagamenti digitali grazie alla sua velocità di transazione e ai bassi costi operativi."
            }
        ];
        
        displayNews(mockNews, container);
    }
});