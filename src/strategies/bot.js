const movingAverage = (data, period) => {
  if (data.length < period) return null;
  const sum = data.slice(-period).reduce((acc, price) => acc + price, 0);
  return sum / period;
};

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
 let shortTermPrices = []; // To track short-term price history
 let longTermPrices = []; // To track long-term price history
 let balance = 10000; // Starting balance
 let positions = 0; // Current positions
 let lastPrice = null; // Last price when positions were bought
 let lastBasicTradePrice = null; // Last price for basic trading logic
 const shortTermPeriod = 5; // Short-term moving average period
 const longTermPeriod = 10; // Long-term moving average period

 // Moving Average Crossover Trading Strategy
 const movingAverageCrossover = (currentPrice) => {
   shortTermPrices.push(currentPrice);
   longTermPrices.push(currentPrice);

   if (shortTermPrices.length > shortTermPeriod) {
     shortTermPrices.shift(); // Remove oldest price
   }
   if (longTermPrices.length > longTermPeriod) {
     longTermPrices.shift(); // Remove oldest price
   }

   const shortTermMA = movingAverage(shortTermPrices, shortTermPeriod);
   const longTermMA = movingAverage(longTermPrices, longTermPeriod);

   if (shortTermMA && longTermMA && !isNaN(shortTermMA) && !isNaN(longTermMA)) {
     
     console.log(
       `Short-term MA: ${shortTermMA.toFixed(
         2
       )}, Long-term MA: ${longTermMA.toFixed(2)}`
     );

     // Buy signal
     if (shortTermMA > longTermMA && positions === 0) {
       positions = Math.floor(balance / currentPrice); // Buy as many shares as possible
       if (positions > 0) {
         lastPrice = currentPrice; // Store the price at which shares were bought
         balance -= positions * currentPrice; // Deduct the cost from the balance
        
       
         console.log(
           `Bought ${positions} shares at $${currentPrice.toFixed(
             2
           )} (MA Crossover)`
         );
       } else {
         
       }
     }
     // Sell signal
     else if (shortTermMA < longTermMA && positions > 0) {
       balance += positions * currentPrice; // Add the proceeds to the balance
       recordTrade("sell", currentPrice, positions); // Record trade
      
       console.log(
         `Sold ${positions} shares at $${currentPrice.toFixed(
           2
         )} (MA Crossover)`
       );
       positions = 0; // Reset positions after selling
     }
   }
 };