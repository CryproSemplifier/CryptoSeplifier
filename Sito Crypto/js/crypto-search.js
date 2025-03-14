document.addEventListener('DOMContentLoaded', function() {
    // Elementi DOM
    const searchForm = document.getElementById('crypto-search-form');
    const searchInput = document.getElementById('crypto-search-input');
    const searchButton = document.getElementById('crypto-search-button');
    const searchResults = document.getElementById('search-results');
    const searchError = document.getElementById('search-error');
    
    // Timeframe buttons per il grafico
    const timeframeButtons = document.querySelectorAll('.search-timeframe-btn');
    
    // Stato corrente
    let currentTimeframe = '1D';
    let currentCrypto = null;
    
    // Lista statica di broker comuni
    const commonBrokers = {
        'bitcoin': ['Binance', 'Coinbase', 'Kraken', 'Bitstamp', 'Gemini'],
        'ethereum': ['Binance', 'Coinbase', 'Kraken', 'Bitstamp', 'Gemini'],
        'ripple': ['Binance', 'Kraken', 'Bitstamp', 'Uphold', 'KuCoin'],
        'cardano': ['Binance', 'Coinbase', 'Kraken', 'KuCoin', 'Bitfinex'],
        'solana': ['Binance', 'Coinbase', 'Kraken', 'FTX', 'KuCoin'],
        'polkadot': ['Binance', 'Kraken', 'KuCoin', 'Bitfinex', 'OKX'],
        'dogecoin': ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'OKX'],
        'default': ['Binance', 'Coinbase', 'Kraken', 'KuCoin', 'OKX']
    };
    
    // Funzione per formattare numeri grandi
    function formatNumber(num) {
        if (num === null || num === undefined) return 'N/A';
        
        if (num >= 1000000000000) {
            return '$' + (num / 1000000000000).toFixed(2) + ' T';
        } else if (num >= 1000000000) {
            return '$' + (num / 1000000000).toFixed(2) + ' B';
        } else if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(2) + ' M';
        } else if (num >= 1000) {
            return '$' + (num / 1000).toFixed(2) + ' K';
        } else {
            return '$' + num.toFixed(2);
        }
    }
    
    // Funzione per recuperare i dati della criptovaluta
    async function fetchCryptoData(query) {
        try {
            // Mostra il caricamento
            searchResults.innerHTML = '<div class="loading">Ricerca in corso...</div>';
            searchResults.style.display = 'block';
            searchError.style.display = 'none';
            
            // Recupera i dati dalla API di CoinGecko
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${query.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
            
            if (!response.ok) {
                throw new Error('Criptovaluta non trovata');
            }
            
            const data = await response.json();
            currentCrypto = data;
            
            // Visualizza i risultati
            displayCryptoData(data);
            
        } catch (error) {
            console.error('Errore:', error);
            searchResults.style.display = 'none';
            searchError.textContent = `Errore: ${error.message}`;
            searchError.style.display = 'block';
        }
    }
    
    // Funzione per visualizzare i dati della criptovaluta
    function displayCryptoData(data) {
        // Ottieni i broker per questa criptovaluta
        const brokers = commonBrokers[data.id] || commonBrokers['default'];
        
        // Crea l'HTML per i risultati
        let html = `
            <div class="search-result-header">
                <img src="${data.image.small}" alt="${data.name}" class="crypto-logo">
                <h3>${data.name} <span class="crypto-symbol">${data.symbol.toUpperCase()}</span></h3>
            </div>
            
            <div class="search-result-content">
                <!-- Layout a due colonne: Grafico a sinistra (60%) e Market Cap/Supply/Broker a destra (40%) -->
                <div class="search-result-top-container">
                    <!-- Colonna sinistra (60%): Grafico -->
                    <div class="search-result-chart">
                        <div class="timeframe-selector search-timeframe-selector">
                            <button class="search-timeframe-btn active" data-timeframe="1D">1 Giorno</button>
                            <button class="search-timeframe-btn" data-timeframe="1W">1 Settimana</button>
                            <button class="search-timeframe-btn" data-timeframe="1M">1 Mese</button>
                            <button class="search-timeframe-btn" data-timeframe="1Y">1 Anno</button>
                            <button class="search-timeframe-btn" data-timeframe="MAX">All Time</button>
                        </div>
                        <div id="tradingview-widget" class="tradingview-widget"></div>
                    </div>
                    
                    <!-- Colonna destra (40%): Market Cap, Supply, Broker -->
                    <div class="search-result-details-right">
                        <div class="detail-item">
                            <h4>Market Cap</h4>
                            <p>${formatNumber(data.market_data.market_cap.usd)}</p>
                        </div>
                        
                        <div class="detail-item">
                            <h4>Supply</h4>
                            <p>Circolante: ${data.market_data.circulating_supply ? formatNumber(data.market_data.circulating_supply).replace('$', '') : 'N/A'}</p>
                            <p>Totale: ${data.market_data.total_supply ? formatNumber(data.market_data.total_supply).replace('$', '') : 'N/A'}</p>
                        </div>
                        
                        <div class="detail-item">
                            <h4>Broker Disponibili</h4>
                            <ul class="broker-list">
                                ${brokers.map(broker => `<li>${broker}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Descrizione sotto, occupa tutta la larghezza -->
                <div class="search-result-description">
                    <div class="detail-item description">
                        <h4>Descrizione</h4>
                        <p>${data.description.it ? data.description.it : data.description.en}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Aggiorna il contenuto
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
        
        // Inizializza il widget TradingView
        initTradingViewWidget(data.symbol, currentTimeframe);
        
        // Aggiungi event listener ai pulsanti del timeframe
        document.querySelectorAll('.search-timeframe-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Rimuovi la classe active da tutti i pulsanti
                document.querySelectorAll('.search-timeframe-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Aggiungi la classe active al pulsante cliccato
                this.classList.add('active');
                
                // Aggiorna il timeframe e reinizializza il widget
                currentTimeframe = this.getAttribute('data-timeframe');
                initTradingViewWidget(currentCrypto.symbol, currentTimeframe);
            });
        });
    }
    
    // Funzione per inizializzare il widget TradingView
    function initTradingViewWidget(symbol, timeframe) {
        // Pulisci il widget precedente
        const widgetContainer = document.getElementById('tradingview-widget');
        if (!widgetContainer) return;
        
        widgetContainer.innerHTML = '';
        
        // Imposta l'intervallo in base al timeframe
        let interval = '60'; // Default a 1 ora
        
        switch(timeframe) {
            case '1D':
                interval = '60'; // 1 ora per la vista giornaliera
                break;
            case '1W':
                interval = '240'; // 4 ore per la vista settimanale
                break;
            case '1M':
                interval = 'D'; // 1 giorno per la vista mensile
                break;
            case '1Y':
                interval = 'W'; // 1 settimana per la vista annuale
                break;
            case 'MAX':
                interval = 'M'; // 1 mese per la vista all time
                break;
        }
        
        // Crea il nuovo widget TradingView
        new TradingView.widget({
            "autosize": false, // Cambiato da true a false per controllare meglio l'altezza
            "width": "100%",
            "height": 300, // Altezza fissa di 300px come specificato nel CSS
            "symbol": `CRYPTO:${symbol.toUpperCase()}USD`,
            "interval": interval,
            "timezone": "Europe/Rome",
            "theme": "dark",
            "style": "1",
            "locale": "it",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "container_id": "tradingview-widget"
        });
    }
    
    // Event listener per il form di ricerca
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                fetchCryptoData(query);
            }
        });
    }
    
    // Carica lo script TradingView
    function loadTradingViewScript() {
        if (typeof TradingView === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }
    
    // Carica lo script TradingView
    loadTradingViewScript();
});