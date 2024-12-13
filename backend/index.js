// index.js
const express = require('express');
const sequelize = require('./database/db');
const cors = require('cors');
const initDatabase = require('./database/configbd');
const app = express();


require('dotenv').config();


app.use(cors());
app.use(express.json());

initDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${process.env.PORT}`);
});

app.use('/api/tiposAnimales', require('./router/tiposAnimales'));