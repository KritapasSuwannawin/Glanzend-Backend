const express = require('express');
const cors = require('cors');

const resourceRouter = require('./routes/resourceRoutes');
const productRouter = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/resource', resourceRouter);
app.use('/api/product', productRouter);

module.exports = app;
