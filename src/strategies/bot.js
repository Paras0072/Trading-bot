// Basic Trading Logic: Buy on 2% drop, Sell on 3% rise
const basicTradingLogic = (currentPrice) => {
  if (lastBasicTradePrice === null) {
    lastBasicTradePrice = currentPrice; // Initialize last price for basic logic
    return;
  }

  // Buy on a 2% drop
  if (positions === 0 && currentPrice <= lastBasicTradePrice * 0.98) {
    positions = Math.floor(balance / currentPrice); // Buy as many as possible
    balance -= positions * currentPrice;
  
    lastBasicTradePrice = currentPrice;
    console.log(
      `Bought ${positions} shares at $${currentPrice.toFixed(2)} (Basic Logic)`
    );
    
  }
  // Sell on a 3% rise
  else if (positions > 0 && currentPrice >= lastBasicTradePrice * 1.03) {
   
    balance += positions * currentPrice; // Sell all shares
    console.log(
      `Sold ${positions} shares at $${currentPrice.toFixed(2)} (Basic Logic)`
    );
   
    positions = 0; // Reset position
    lastBasicTradePrice = currentPrice;
  }
};
