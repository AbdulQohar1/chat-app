const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));


const port = process.env.PORT || 3000;
const start = async () => {
  try {
    app.listen(port, () => console.log(`Listening on port ${port}...`));

  } catch (error) {
    console.log(error)
  }
};

start();