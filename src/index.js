const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const ussdService = require('./services/ussdService');

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.post('/ussd', ussdService.handleUssdRequest);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
