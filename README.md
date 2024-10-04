# Trading Bot Backend Application - Documentation

## Overview 
This backend application simulates a basic trading bot for a hypothetical stock market. It continuously monitors stock prices using mock data and executes trades based on predefined strategies. The bot tracks profits, losses, and overall performance metrics.

## Application Features

1. **Trading Strategies**:
   - Moving Average Crossover: Buys when the short-term moving average crosses above the long-term moving average and sells when it crosses below.
   - Momentum Trading: Buys when the current price is higher than the previous price (positive momentum) and sells when the current price is lower (negative momentum).
   - Basic Trading Logic: Buys when the price drops by 2% from the last traded price and sells when the price rises by 3%.
   - Bollinger Bands Trading: Buys when the price is below the lower Bollinger Band and sells when the price is above the upper Bollinger Band.

2. **Profit/Loss Tracking**:
   - Tracks all trades, positions, balance, and overall profit/loss.
   - Generates a summary report showing all trades and the final balance.

3. **Logging & Analytics**:
   - All trades and strategy decisions are logged.
   - Error handling and warnings are logged when data is insufficient or unexpected events occur.
   
## API Usage

### Mock API for Stock Prices
   - The application uses a mock API to retrieve stock price data.
   - The API provides a simulated real-time stream of stock prices, allowing the bot to monitor changes and make trading decisions.
     
  Example API Endpoint (mock):
 
  const fetchStockPrices = async () => {
  const response = await axios.get('https://api.mockstockprices.com/prices');
  return response.data;
};

  - The mock API sends random price data, which the bot processes using various strategies to decide whether to buy or sell stocks.

## Trading Logic

### Moving Average Crossover Strategy:
      -  Buy: When the short-term moving average crosses above the long-term moving average.
      -  Sell: When the short-term moving average crosses below the long-term moving average.
      -  This strategy aims to capture trends by buying during upward momentum and selling during downward momentum.

### Momentum Trading Strategy: 
     -  Buy:When the current price is higher than the previous price (positive momentum).
     -  Sell:When the current price is lower than the previous price (negative momentum).
     -  This strategy relies on price movement direction to make trading decisions.

### Basic Trading Logic: 
     -  Buy: When the stock price drops by 2% from the last price.
     -  Sell: When the stock price rises by 3% from the last price.
     -  This strategy is based on predefined percentage thresholds for buying and selling.
    
### Bollinger Bands Strategy:
     -  Buy: When the price is below the lower Bollinger Band (indicating a potential undervalued price).
     -  Sell: When the price is above the upper Bollinger Band (indicating a potential overvalued price).

# How to Run the Application

##  Requirements:
   - Node.js installed on your machine
   - npm (Node Package Manager)

## Installation

First, clone this repository:

<!-- start:code block -->
## Clone this repository
git clone [https://github.com/mfts/papermark.git](https://github.com/Paras0072/Trading-bot.git)
cd papermark

## Install dependencies
npm install

## Run the app
nodemon

**Don't forget to start API server**

## Open http://localhost:3000 in your browser
open http://localhost:3000

## Routes 
1. http://localhost:3000/start : For starting monitoring of stock
2. http://localhost:3000/stop  : For stopping monitoring of stock
3. http://localhost:3000/report : For getting report containing all data including Win Ratio , Profit/Loss , Remaining balance and many more.......
<!-- end:code block -->

## Configuration:
  - If necessary, modify the mock API URL in app.js to point to the mock stock price data source.

## Logging:
  - The bot logs trades and significant events to the console.
  - The logs also contain error messages and warnings related to insufficient data or incorrect trading behavior.

## Generating Reports:
   - After running the application, a summary report is generated in the console showing:
         - The trades made
         - The balance after each trade
         - The final profit/loss statement

## File Structure

trading-bot/
├── src/
│   ├── api
│   ├── strategies
│   ├── utils/
│           ├── profitTracker.js
│           ├── logger.js
├── index.js
├── package.json
└── README.md

## Explanation of Key Files:
 1. **index.js** : Main file that fetches stock prices, runs the bot, and implements all trading strategies.
 2. **api** : Contain the Api file 
 3. **stratgies**: Contain a file bot.js having all the strategies
 4. **utils/** :
        - **profitTracker.js**: Tracks trades, positions, balance, and generates reports.
        - **logger.js**: Handles logging for trades, errors, and warnings.


## Future Enhancements
  - Add more complex trading strategies.
  - Integrate with real stock price APIs for live data.
  - Add machine learning to predict market movements.

This documentation provides a high-level overview of the bot’s functionality and setup. You can customize it to fit your needs by adding or modifying trading strategies and features.

