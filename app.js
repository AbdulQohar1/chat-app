const express = require('express');
const pa
const app = express();

app.use(express.static(''))


const port = process.env.PORT || 3000;
const start = async () => {
  try {
    app.listen(port, () => console.log(`Listening on port ${port}...`));

  } catch (error) {
    console.log(error)
  }
};

start();