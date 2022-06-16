const express = require('express');
const cors = require('cors');

const resourceRouter = require('./routes/resourceRoutes');
const productRouter = require('./routes/productRoutes');
const accountRouter = require('./routes/accountRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/resource', resourceRouter);
app.use('/api/product', productRouter);
app.use('/api/account', accountRouter);

module.exports = app;
