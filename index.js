// // npm init : package.json - This is a node project
// // npm i express : expressJs package get install - project came to know that we are using express
// // We finally use express

const express = require("express");

const app = express();
const PORT = 2000;



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
