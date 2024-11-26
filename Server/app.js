const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config(); 

const app = express();


app.use(bodyParser.json());


app.use(cors());


app.use('/api', authRoutes); 


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
