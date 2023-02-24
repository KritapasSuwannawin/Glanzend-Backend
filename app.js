const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const resourceRouter = require('./routes/resourceRoutes');
const productRouter = require('./routes/productRoutes');
const accountRouter = require('./routes/accountRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  })
);

app.use('/api/resource', resourceRouter);
app.use('/api/product', productRouter);
app.use('/api/account', accountRouter);

module.exports = app;
