document.addEventListener('DOMContentLoaded', function() {
    // Load TradingView widget script
    function loadTradingViewScript() {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = function() {
            // Initialize charts
            initChart('btc-chart', 'BINANCE:BTCUSDT');
            initChart('xrp-chart', 'BINANCE:XRPUSDT');
            initChart('btc-dominance-chart', 'CRYPTOCAP:BTC.D');
            initChart('market-volume-chart', 'CRYPTOCAP:TOTAL', 'Volume');
        };
        document.head.appendChild(script);
    }
    
    // Function to initialize TradingView widget
    function initChart(containerId, symbol, chartType = 'Candles') {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Europe/Rome",
            "theme": "dark",
            "style": "1",
            "locale": "it",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "studies": [chartType === 'Volume' ? "Volume@tv-basicstudies" : ""],
            "container_id": containerId
        });
    }
    
    // Load TradingView script
    loadTradingViewScript();
});