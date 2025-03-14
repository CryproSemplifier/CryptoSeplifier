document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const disclaimerPopup = document.getElementById('disclaimer-popup');
    const closeDisclaimerBtn = document.getElementById('close-disclaimer');
    
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    
    // Show disclaimer popup if user hasn't seen it before
    if (!hasSeenDisclaimer) {
        // Show popup with a slight delay to ensure all elements are loaded
        setTimeout(function() {
            disclaimerPopup.classList.add('active');
        }, 500);
    }
    
    // Event listener for close button
    if (closeDisclaimerBtn) {
        closeDisclaimerBtn.addEventListener('click', function() {
            // Hide popup
            disclaimerPopup.classList.remove('active');
            
            // Set localStorage to remember that user has seen the disclaimer
            localStorage.setItem('hasSeenDisclaimer', 'true');
        });
    }
    
    // Close popup when clicking outside of content
    if (disclaimerPopup) {
        disclaimerPopup.addEventListener('click', function(e) {
            if (e.target === disclaimerPopup) {
                // Hide popup
                disclaimerPopup.classList.remove('active');
                
                // Set localStorage to remember that user has seen the disclaimer
                localStorage.setItem('hasSeenDisclaimer', 'true');
            }
        });
    }
});