const express = require('express');

const {
  createUser,
  getUser,
  enable2FA,
  generateQRCode,
  verifyToken
} = require('../controllers/user');

const router = express.Router();

router
  .post('/register', createUser)
  .get('/:id', getUser)
  .patch('/:id/enable2FA', enable2FA)
  .get('/:id/generateQRCode', generateQRCode)
  .post('/:id/verifyToken', verifyToken)


module.exports = router;