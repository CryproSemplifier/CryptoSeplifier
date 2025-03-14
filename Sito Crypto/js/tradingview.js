document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const tradingviewWidget = document.getElementById('tradingview-widget');
    const timeframeButtons = document.querySelectorAll('.timeframe-btn');
    
    // Default timeframe
    let currentTimeframe = '1D';
    
    // Initialize TradingView widget
    initTradingViewWidget(currentTimeframe);
    
    // Event listeners for timeframe buttons
    timeframeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update timeframe and reinitialize widget
            currentTimeframe = this.getAttribute('data-timeframe');
            initTradingViewWidget(currentTimeframe);
        });
    });
    
    // Function to initialize TradingView widget with specified timeframe
    function initTradingViewWidget(timeframe) {
        // Clear previous widget
        tradingviewWidget.innerHTML = '';
        
        // Set interval based on timeframe
        let interval = '60'; // Default to 1 hour
        
        switch(timeframe) {
            case '1D':
                interval = '60'; // 1 hour for daily view
                break;
            case '1W':
                interval = '240'; // 4 hours for weekly view
                break;
            case '1M':
                interval = 'D'; // 1 day for monthly view
                break;
        }
        
        // Create new TradingView widget
        new TradingView.widget({
            "autosize": true,
            "symbol": "CRYPTOCAP:BTC.D",
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
    
    // Load TradingView widget script
    function loadTradingViewScript() {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = function() {
            // Initialize widget once script is loaded
            initTradingViewWidget(currentTimeframe);
        };
        document.head.appendChild(script);
    }
    
    // Load TradingView script
    loadTradingViewScript();
});