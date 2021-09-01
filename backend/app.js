if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const apiRouter = require('./routes/apiRouter');

const db_url = process.env.DB_URL;
const dbPassword = process.env.DB_PASSWORD;

mongoose
  .connect(db_url.replace('<password>', dbPassword))
  .then(_ => console.log('DB connected!'))
  .catch(err => console.error(err));

const app = express();

app.use(
  cors({
    origin: '*',
    // allowedHeaders: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    // preflightContinue: true,
  })
);
app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => res.send('Hello'));

app.use('/api', apiRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening on PORT:${PORT}`));
