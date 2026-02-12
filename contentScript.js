/**
 * Safe-Fi Content Script
 * Monitors Uniswap/DEX UI to capture trade details.
 */

console.log("Safe-Fi Tactical Overlay Active");

function detectSwapDetails() {
  // Selectors for Uniswap V3/V2 UI elements (Simplified for MVP)
  const inputFields = document.querySelectorAll('input[inputmode="decimal"]');
  if (inputFields.length >= 2) {
    const sellAmount = inputFields[0].value;
    const buyAmount = inputFields[1].value;
    
    // Message the extension logic (or popup)
    chrome.runtime.sendMessage({
      type: 'SWAP_DETECTED',
      data: {
        sellAmount,
        buyAmount,
        timestamp: Date.now()
      }
    });
  }
}

// Observe UI changes for dynamic swap inputs
const observer = new MutationObserver(() => {
  detectSwapDetails();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});