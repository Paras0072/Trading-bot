/**
 * Records a trade in the history and updates balance and positions.
 * @param {string} action - The action performed ('buy' or 'sell').
 * @param {number} price - The price at which the trade was executed.
 * @param {number} quantity - The number of shares involved in the trade.
 */

const logger = require("./logger");

let balance = 10000; // Initial balance
let positions = 0; // Number of shares held
let trades = []; // Array to hold trade history

// Function to update balance and track trades
const recordTrade = (action, price, quantity) => {
  const total = price * quantity;

  if (action === "buy") {
    balance -= total; // Decrease balance on buy
    positions += quantity; // Increase positions on buy
  } else if (action === "sell") {
    balance += total; // Increase balance on sell
    positions -= quantity; // Decrease positions on sell
  }

  // Record the trade in history
  trades.push({ action, price, quantity, total });
  // log the trade
  logger.info(
    `Trade recorded: ${action} ${quantity} shares at $${price.toFixed(
      2
    )} (Total: $${total.toFixed(2)})`
  );
};

// Function to get profit/loss
const getProfitLoss = () => {
  const initialInvestment = 10000; // Starting balance
  const currentValue = positions * trades[trades.length - 1]?.price || 0; // Current value of holdings
  const profitLoss = balance + currentValue - initialInvestment; // Profit/Loss calculation
  return profitLoss;
};

// Function to calculate win/loss ratio
const calculateWinLossRatio = () => {
  const wins = trades.filter(
    (trade) => trade.action === "sell" && trade.total > 0
  ).length;
  const losses = trades.filter(
    (trade) => trade.action === "sell" && trade.total < 0
  ).length;
  return wins + losses > 0 ? (wins / (wins + losses)).toFixed(2) : "N/A"; // Prevent division by zero
};
/**
 * Generates a summary report of all trades and current balance.
 */
// Function to generate summary report

const generateReport = () => {
  console.log("=== Trade Summary ===");
  trades.forEach((trade, index) => {
    console.log(
      `${index + 1}. ${trade.action.toUpperCase()} ${
        trade.quantity
      } shares at $${trade.price.toFixed(2)} (Total: $${trade.total.toFixed(
        2
      )})`
    );
  });
  console.log(`Final Balance: $${balance.toFixed(2)}`);
  console.log(`Positions Held: ${positions}`);
  console.log(`Overall Profit/Loss: $${getProfitLoss().toFixed(2)}`);
  console.log(`Win/Loss Ratio: ${calculateWinLossRatio()}`);
};
// Export functions
module.exports = {
  recordTrade,
  getProfitLoss,
  generateReport,
};
