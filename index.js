require('dotenv').config();
const express = require('express');
const cors = require('cors');
const timeout = require('connect-timeout');

const rootRouter = require('./routes');
const {generateError} = require('./utils/error')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`App is listening at http://localhost:${PORT}`));

app.use(timeout(30000));

app.use('/api/v1', rootRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = generateError(404, 'Incorrect path')
  next(error);
});

// Catch timeout error
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// Error handler
app.use((err, req, res, next) => {
  if (err.code === 'ETIMEDOUT') res.status(500).json({message: 'Server request timeout error'})

  if (err) {
    const {code, error} = err
    res.status(code).json({message: error.message})
  }

  res.status(500).json({message: 'Internal server error'})
});


module.exports = app;