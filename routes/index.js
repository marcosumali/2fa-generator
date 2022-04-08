const express = require('express');

const userRouter = require('./user');

const router = express.Router();
const version = process.env.npm_package_version;

router
  .get('/healthcheck', (req, res) => res.send({version}))
  .use('/users', userRouter)

  
module.exports = router;