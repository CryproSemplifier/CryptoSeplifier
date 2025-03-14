document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const grokInput = document.getElementById('grok-input');
    const grokSubmit = document.getElementById('grok-submit');
    const grokResponse = document.getElementById('grok-response');
    
    // Event listeners
    grokSubmit.addEventListener('click', handleGrokQuery);
    grokInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleGrokQuery();
        }
    });
    
    // Function to handle Grok queries
    function handleGrokQuery() {
        const query = grokInput.value.trim();
        
        if (query === '') {
            return; // Don't process empty queries
        }
        
        // Clear placeholder if it exists
        const placeholder = document.querySelector('.grok-placeholder');
        if (placeholder) {
            grokResponse.removeChild(placeholder);
        }
        
        // Add user query to the response area
        addMessage('question', query);
        
        // Generate a response based on the query
        const response = generateResponse(query);
        
        // Add a slight delay to simulate processing
        setTimeout(function() {
            addMessage('answer', response);
            
            // Scroll to the bottom of the response area
            grokResponse.scrollTop = grokResponse.scrollHeight;
        }, 800);
        
        // Clear the input field
        grokInput.value = '';
    }
    
    // Function to add a message to the response area
    function addMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'grok-message';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'grok-' + type;
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        grokResponse.appendChild(messageDiv);
    }
    
    // Function to generate a response based on the query
    function generateResponse(query) {
        query = query.toLowerCase();
        
        // Bitcoin related responses
        if (query.includes('bitcoin') || query.includes('btc')) {
            if (query.includes('prezzo') || query.includes('valore') || query.includes('quanto vale')) {
                return 'Il prezzo di Bitcoin varia costantemente. Al momento, Bitcoin si aggira intorno ai 60.000-65.000 dollari, ma ti consiglio di verificare il prezzo attuale su un exchange o un sito di tracking come CoinMarketCap o CoinGecko.';
            } else if (query.includes('mining') || query.includes('minare')) {
                return 'Il mining di Bitcoin è il processo attraverso cui nuovi bitcoin vengono creati e le transazioni vengono verificate. Utilizza l\'algoritmo di consenso Proof of Work (PoW) e richiede hardware specializzato (ASIC). Oggi è diventato molto competitivo e richiede un significativo investimento in hardware ed elettricità.';
            } else if (query.includes('halving')) {
                return 'L\'halving di Bitcoin è un evento programmato che si verifica approssimativamente ogni quattro anni (ogni 210.000 blocchi) in cui la ricompensa per il mining viene dimezzata. L\'ultimo halving è avvenuto nell\'aprile 2024, riducendo la ricompensa da 6.25 a 3.125 BTC per blocco. Questo evento è significativo perché riduce il tasso di nuova offerta di Bitcoin.';
            } else if (query.includes('wallet') || query.includes('portafoglio')) {
                return 'Per conservare Bitcoin in modo sicuro, puoi utilizzare diversi tipi di wallet: wallet hardware (come Ledger o Trezor) per la massima sicurezza, wallet software (desktop o mobile), o wallet online (meno sicuri). La scelta dipende dalle tue esigenze di sicurezza e dalla frequenza con cui intendi utilizzare i tuoi Bitcoin.';
            } else {
                return 'Bitcoin è la prima e più grande criptovaluta per capitalizzazione di mercato. Creata nel 2009 da una persona o gruppo sotto lo pseudonimo di Satoshi Nakamoto, Bitcoin è una valuta digitale decentralizzata che opera su una tecnologia chiamata blockchain. Ha un\'offerta massima limitata a 21 milioni di unità.';
            }
        }
        
        // XRP related responses
        else if (query.includes('xrp') || query.includes('ripple')) {
            if (query.includes('prezzo') || query.includes('valore') || query.includes('quanto vale')) {
                return 'Il prezzo di XRP varia costantemente. Attualmente, XRP si aggira intorno a 0,50-0,60 dollari, ma ti consiglio di verificare il prezzo attuale su un exchange o un sito di tracking come CoinMarketCap o CoinGecko.';
            } else if (query.includes('sec') || query.includes('causa') || query.includes('legale')) {
                return 'Ripple, la società dietro XRP, è stata coinvolta in una causa legale con la SEC (Securities and Exchange Commission) degli Stati Uniti. La causa riguardava se XRP dovesse essere classificato come un titolo (security). Nel 2023, Ripple ha ottenuto una vittoria parziale quando un giudice ha stabilito che le vendite di XRP sugli exchange non violavano le leggi sui titoli.';
            } else if (query.includes('differenza') || query.includes('diverso da bitcoin')) {
                return 'A differenza di Bitcoin, XRP non viene minato. Tutti i 100 miliardi di XRP sono stati creati alla nascita. XRP utilizza un meccanismo di consenso diverso chiamato Ripple Protocol Consensus Algorithm (RPCA), che è più veloce ed energeticamente efficiente rispetto al Proof of Work di Bitcoin. XRP è stato creato per facilitare i pagamenti transfrontalieri rapidi ed economici.';
            } else if (query.includes('utilizzo') || query.includes('uso') || query.includes('a cosa serve')) {
                return 'XRP è progettato principalmente per facilitare i pagamenti transfrontalieri rapidi ed economici. Ripple, l\'azienda dietro XRP, ha sviluppato soluzioni come RippleNet e On-Demand Liquidity (ODL) che utilizzano XRP come ponte di liquidità per le transazioni internazionali, permettendo alle istituzioni finanziarie di effettuare trasferimenti di denaro globali in pochi secondi anziché giorni.';
            } else {
                return 'XRP è una criptovaluta creata da Ripple Labs. A differenza di Bitcoin, XRP non viene minato e tutti i 100 miliardi di token sono stati creati alla nascita. XRP è progettato per facilitare i pagamenti transfrontalieri rapidi ed economici, con transazioni che si completano in pochi secondi e commissioni molto basse.';
            }
        }
        
        // General crypto questions
        else if (query.includes('crypto') || query.includes('criptovaluta') || query.includes('blockchain')) {
            return 'Le criptovalute sono valute digitali che utilizzano la crittografia per la sicurezza e operano su reti decentralizzate basate sulla tecnologia blockchain. Bitcoin è stata la prima criptovaluta, ma oggi ne esistono migliaia, ognuna con caratteristiche e casi d\'uso diversi. La blockchain è un registro distribuito che registra tutte le transazioni in modo trasparente e immutabile.';
        }
        
        // Fear & Greed Index
        else if (query.includes('fear') || query.includes('greed') || query.includes('paura') || query.includes('avidità') || query.includes('indice')) {
            return 'Il Fear & Greed Index è un indicatore che misura il sentimento del mercato delle criptovalute. Varia da 0 (Paura Estrema) a 100 (Avidità Estrema). Un valore basso indica che gli investitori sono pessimisti o spaventati, suggerendo che il mercato potrebbe essere sottovalutato. Un valore alto indica ottimismo o avidità, suggerendo che il mercato potrebbe essere sopravvalutato. Molti investitori usano questo indice come strumento di analisi contrarian.';
        }
        
        // Default response for unrecognized queries
        else {
            return 'Mi dispiace, non ho informazioni specifiche su questa domanda. Prova a chiedere qualcosa su Bitcoin o XRP, come il loro prezzo, la tecnologia sottostante o i casi d\'uso.';
        }
    }
});