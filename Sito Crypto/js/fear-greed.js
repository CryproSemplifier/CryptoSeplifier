document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fearGreedValue = document.getElementById('fear-greed-value');
    const fearGreedLabel = document.getElementById('fear-greed-label');
    const fearGreedDate = document.getElementById('fear-greed-date');
    const fearGreedGauge = document.querySelector('.fear-greed-gauge');
    
    // Fetch Fear & Greed Index data
    fetchFearGreedIndex();
    
    // Function to fetch Fear & Greed Index data
    function fetchFearGreedIndex() {
        // Using Alternative.me API for Fear & Greed Index
        fetch('https://api.alternative.me/fng/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.data && data.data.length > 0) {
                    updateFearGreedUI(data.data[0]);
                } else {
                    throw new Error('No data available');
                }
            })
            .catch(error => {
                console.error('Error fetching Fear & Greed Index:', error);
                fearGreedValue.textContent = 'N/A';
                fearGreedLabel.textContent = 'Errore di caricamento';
                fearGreedDate.textContent = 'N/A';
            });
    }
    
    // Function to update the UI with Fear & Greed data
    function updateFearGreedUI(data) {
        // Update value and label
        const value = data.value;
        fearGreedValue.textContent = value;
        fearGreedLabel.textContent = data.value_classification;
        
        // Format and update date
        const timestamp = data.timestamp * 1000; // Convert to milliseconds
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        fearGreedDate.textContent = formattedDate;
        
        // Update gauge color based on value
        updateGaugeColor(value);
    }
    
    // Function to update the gauge color based on the Fear & Greed value
    function updateGaugeColor(value) {
        // Remove any existing color classes
        fearGreedGauge.classList.remove('extreme-fear-bg', 'fear-bg', 'neutral-bg', 'greed-bg', 'extreme-greed-bg');
        
        // Add appropriate color class based on value
        if (value <= 24) {
            fearGreedGauge.classList.add('extreme-fear-bg');
            fearGreedValue.style.color = '#e74c3c';
        } else if (value <= 49) {
            fearGreedGauge.classList.add('fear-bg');
            fearGreedValue.style.color = '#e67e22';
        } else if (value == 50) {
            fearGreedGauge.classList.add('neutral-bg');
            fearGreedValue.style.color = '#f1c40f';
        } else if (value <= 74) {
            fearGreedGauge.classList.add('greed-bg');
            fearGreedValue.style.color = '#27ae60';
        } else {
            fearGreedGauge.classList.add('extreme-greed-bg');
            fearGreedValue.style.color = '#2ecc71';
        }
    }
});