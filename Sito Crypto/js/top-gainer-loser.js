document.addEventListener('DOMContentLoaded', function() {
    // Elementi DOM
    const gainerList = document.getElementById('gainer-list');
    const loserList = document.getElementById('loser-list');
    const gainerUpdate = document.getElementById('gainer-update');
    const loserUpdate = document.getElementById('loser-update');
    
    // Timeframe buttons
    const timeframeButtons = document.querySelectorAll('.timeframe-btn');
    
    // Stato corrente
    const currentState = {
        gainer: '24h',
        loser: '24h'
    };
    
    // Mappatura dei timeframe per l'API
    const timeframeMap = {
        '24h': 'price_change_percentage_24h',
        '7d': 'price_change_percentage_7d_in_currency',
        '30d': 'price_change_percentage_30d_in_currency',
        '1y': 'price_change_percentage_1y_in_currency',
        'all': 'all_time_change'
    };
    
    // Mappatura dei timeframe per la visualizzazione
    const timeframeDisplayMap = {
        '24h': '24 ore',
        '7d': '7 giorni',
        '30d': '30 giorni',
        '1y': '1 anno',
        'all': 'sempre'
    };
    
    // Dati storici per il calcolo all-time
    let historicalData = {};
    
    // Funzione per formattare la data
    function formatDate(date) {
        return new Date(date).toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Funzione per formattare la percentuale
    function formatPercentage(percentage) {
        if (percentage === null || percentage === undefined) {
            return 'N/A';
        }
        return percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;
    }
    
    // Funzione per recuperare i dati dall'API di CoinGecko
    async function fetchCryptoData() {
        try {
            // Mostra il caricamento
            gainerList.innerHTML = '<div class="loading">Caricamento dati...</div>';
            loserList.innerHTML = '<div class="loading">Caricamento dati...</div>';
            
            // Parametri API per ottenere anche le variazioni percentuali a 7, 30 giorni e 1 anno
            const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d,1y';
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Errore nel recupero dei dati');
            }
            
            const data = await response.json();
            
            // Calcola la variazione all-time per ogni criptovaluta
            await calculateAllTimeChange(data);
            
            // Aggiorna l'ora dell'ultimo aggiornamento
            const updateTime = formatDate(new Date());
            gainerUpdate.textContent = `Ultimo aggiornamento: ${updateTime}`;
            loserUpdate.textContent = `Ultimo aggiornamento: ${updateTime}`;
            
            // Aggiorna le liste
            updateLists(data);
        } catch (error) {
            console.error('Errore:', error);
            gainerList.innerHTML = `<div class="error-message">Errore nel caricamento dei dati: ${error.message}</div>`;
            loserList.innerHTML = `<div class="error-message">Errore nel caricamento dei dati: ${error.message}</div>`;
        }
    }
    
    // Funzione per calcolare la variazione all-time
    async function calculateAllTimeChange(data) {
        try {
            // Per ogni criptovaluta, otteniamo il prezzo più vecchio disponibile
            for (let i = 0; i < data.length; i++) {
                const coin = data[i];
                
                // Se non abbiamo già i dati storici per questa criptovaluta
                if (!historicalData[coin.id]) {
                    try {
                        // Ottieni i dati storici (utilizziamo la data di lancio di Bitcoin come riferimento per avere dati molto vecchi)
                        const historyUrl = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=max&interval=monthly`;
                        const historyResponse = await fetch(historyUrl);
                        
                        if (historyResponse.ok) {
                            const historyData = await historyResponse.json();
                            
                            // Prendiamo il primo prezzo disponibile
                            if (historyData.prices && historyData.prices.length > 0) {
                                const firstPrice = historyData.prices[0][1]; // [timestamp, price]
                                const currentPrice = coin.current_price;
                                
                                // Calcoliamo la variazione percentuale
                                const percentageChange = ((currentPrice - firstPrice) / firstPrice) * 100;
                                
                                // Memorizziamo il risultato
                                historicalData[coin.id] = percentageChange;
                                
                                // Aggiungiamo il dato alla criptovaluta
                                coin.all_time_change = percentageChange;
                            } else {
                                coin.all_time_change = null;
                            }
                        } else {
                            coin.all_time_change = null;
                        }
                    } catch (error) {
                        console.error(`Errore nel recupero dei dati storici per ${coin.id}:`, error);
                        coin.all_time_change = null;
                    }
                    
                    // Aggiungiamo un piccolo ritardo per evitare di superare i limiti di rate dell'API
                    await new Promise(resolve => setTimeout(resolve, 100));
                } else {
                    // Utilizziamo i dati già memorizzati
                    coin.all_time_change = historicalData[coin.id];
                }
            }
        } catch (error) {
            console.error('Errore nel calcolo della variazione all-time:', error);
        }
    }
    
    // Funzione per aggiornare le liste
    function updateLists(data) {
        // Filtra i dati validi (alcuni potrebbero non avere i dati di variazione percentuale)
        const validData = data.filter(coin => {
            const gainerField = timeframeMap[currentState.gainer];
            const loserField = timeframeMap[currentState.loser];
            
            // Gestisci i campi nidificati per 7d, 30d e 1y
            let gainerValue, loserValue;
            
            if (gainerField === 'price_change_percentage_24h') {
                gainerValue = coin[gainerField];
            } else if (gainerField === 'price_change_percentage_7d_in_currency') {
                gainerValue = coin.price_change_percentage_7d_in_currency;
            } else if (gainerField === 'price_change_percentage_30d_in_currency') {
                gainerValue = coin.price_change_percentage_30d_in_currency;
            } else if (gainerField === 'price_change_percentage_1y_in_currency') {
                gainerValue = coin.price_change_percentage_1y_in_currency;
            } else if (gainerField === 'all_time_change') {
                gainerValue = coin.all_time_change;
            }
            
            if (loserField === 'price_change_percentage_24h') {
                loserValue = coin[loserField];
            } else if (loserField === 'price_change_percentage_7d_in_currency') {
                loserValue = coin.price_change_percentage_7d_in_currency;
            } else if (loserField === 'price_change_percentage_30d_in_currency') {
                loserValue = coin.price_change_percentage_30d_in_currency;
            } else if (loserField === 'price_change_percentage_1y_in_currency') {
                loserValue = coin.price_change_percentage_1y_in_currency;
            } else if (loserField === 'all_time_change') {
                loserValue = coin.all_time_change;
            }
            
            return gainerValue !== null && loserValue !== null;
        });
        
        // Ordina per Top Gainer (decrescente)
        const gainerData = [...validData].sort((a, b) => {
            const fieldName = timeframeMap[currentState.gainer];
            let valueA, valueB;
            
            if (fieldName === 'price_change_percentage_24h') {
                valueA = a[fieldName];
                valueB = b[fieldName];
            } else if (fieldName === 'price_change_percentage_7d_in_currency') {
                valueA = a.price_change_percentage_7d_in_currency;
                valueB = b.price_change_percentage_7d_in_currency;
            } else if (fieldName === 'price_change_percentage_30d_in_currency') {
                valueA = a.price_change_percentage_30d_in_currency;
                valueB = b.price_change_percentage_30d_in_currency;
            } else if (fieldName === 'price_change_percentage_1y_in_currency') {
                valueA = a.price_change_percentage_1y_in_currency;
                valueB = b.price_change_percentage_1y_in_currency;
            } else if (fieldName === 'all_time_change') {
                valueA = a.all_time_change;
                valueB = b.all_time_change;
            }
            
            return valueB - valueA;
        }).slice(0, 50);
        
        // Ordina per Top Loser (crescente)
        const loserData = [...validData].sort((a, b) => {
            const fieldName = timeframeMap[currentState.loser];
            let valueA, valueB;
            
            if (fieldName === 'price_change_percentage_24h') {
                valueA = a[fieldName];
                valueB = b[fieldName];
            } else if (fieldName === 'price_change_percentage_7d_in_currency') {
                valueA = a.price_change_percentage_7d_in_currency;
                valueB = b.price_change_percentage_7d_in_currency;
            } else if (fieldName === 'price_change_percentage_30d_in_currency') {
                valueA = a.price_change_percentage_30d_in_currency;
                valueB = b.price_change_percentage_30d_in_currency;
            } else if (fieldName === 'price_change_percentage_1y_in_currency') {
                valueA = a.price_change_percentage_1y_in_currency;
                valueB = b.price_change_percentage_1y_in_currency;
            } else if (fieldName === 'all_time_change') {
                valueA = a.all_time_change;
                valueB = b.all_time_change;
            }
            
            return valueA - valueB;
        }).slice(0, 50);
        
        // Aggiorna la lista dei Top Gainer
        renderCryptoList(gainerList, gainerData, currentState.gainer, true);
        
        // Aggiorna la lista dei Top Loser
        renderCryptoList(loserList, loserData, currentState.loser, false);
    }
    
    // Funzione per renderizzare la lista delle criptovalute
    function renderCryptoList(container, data, timeframe, isGainer) {
        const fieldName = timeframeMap[timeframe];
        const timeframeDisplay = timeframeDisplayMap[timeframe];
        
        let html = `<div class="crypto-list-header">Top 50 criptovalute - Variazione nelle ultime ${timeframeDisplay}</div>`;
        
        data.forEach(coin => {
            let percentageChange;
            
            if (fieldName === 'price_change_percentage_24h') {
                percentageChange = coin[fieldName];
            } else if (fieldName === 'price_change_percentage_7d_in_currency') {
                percentageChange = coin.price_change_percentage_7d_in_currency;
            } else if (fieldName === 'price_change_percentage_30d_in_currency') {
                percentageChange = coin.price_change_percentage_30d_in_currency;
            } else if (fieldName === 'price_change_percentage_1y_in_currency') {
                percentageChange = coin.price_change_percentage_1y_in_currency;
            } else if (fieldName === 'all_time_change') {
                percentageChange = coin.all_time_change;
            }
            
            const percentageClass = percentageChange >= 0 ? 'positive' : 'negative';
            const formattedPercentage = formatPercentage(percentageChange);
            
            html += `
                <div class="crypto-item">
                    <div class="crypto-info">
                        <img src="${coin.image}" alt="${coin.name}" class="crypto-icon">
                        <span class="crypto-name">${coin.name} <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span></span>
                    </div>
                    <div class="crypto-change ${percentageClass}">${formattedPercentage}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // Event listener per i pulsanti del timeframe
    timeframeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const timeframe = this.dataset.timeframe;
            const column = this.dataset.column;
            
            // Aggiorna lo stato corrente
            currentState[column] = timeframe;
            
            // Rimuovi la classe active da tutti i pulsanti della stessa colonna
            document.querySelectorAll(`.timeframe-btn[data-column="${column}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Aggiungi la classe active al pulsante cliccato
            this.classList.add('active');
            
            // Aggiorna le liste
            fetchCryptoData();
        });
    });
    
    // Carica i dati all'avvio
    fetchCryptoData();
    
    // Aggiorna i dati ogni 5 minuti
    setInterval(fetchCryptoData, 5 * 60 * 1000);
});