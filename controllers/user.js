const uuid = require("uuid");
const speakeasy = require("speakeasy");
const QRCode = require('qrcode');

const db = require("../utils/db");

const createUser = (req, res) => {
  try {
    const {name} = req.body;

    const id = uuid.v4();

    const newUser = {
      id,
      name,
      is2FAEnabled: false,
    };

    db.push(`/users/${id}`, newUser);

    res.status(201).json({
      message: "User was successfully created",
      user: newUser,
    });
  } catch (error) {
    console.log('ERROR:', error.stack)
    res.status(500).json({message: error.message})
  }
};

const getUser = (req, res) => {
  try {
    const {id} = req.params;

    const user = db.getData(`/users/${id}`);

    res.status(200).json(user);
  } catch (error) {
    console.log('ERROR:', error.stack)
    res.status(500).json({message: error.message})
  }
};

const enable2FA = (req, res) => {
  try {
    const {id} = req.params;

    const secret = speakeasy.generateSecret();

    const user = db.getData(`/users/${id}`);
    const updatedUser = {
      ...user,
      is2FAEnabled: true,
      secret: secret.base32,
    };

    db.push(`/users/${id}`, updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('ERROR:', error.stack)
    res.status(500).json({message: error.message})
  }
};

const generateQRCode = (req, res) => {
  try {
    const {id} = req.params;

    const user = db.getData(`/users/${id}`);

    const otpauthURL = speakeasy.otpauthURL({ secret: user.secret, label: user.name, issuer: "SecretKey", encoding: "base32"});

    QRCode.toDataURL(otpauthURL, function (err, url) {
      if (err) throw err;
      // console.log(url)
      res.status(200).json({
        message: "QRcode was successfully generated",
        source: url
      });
    })

  } catch (error) {
    console.log('ERROR:', error.stack)
    res.status(500).json({message: error.message})
  }
};

const verifyToken = (req, res) => {
  try {
    const {id} = req.params;
    const {token} = req.body;

    const user = db.getData(`/users/${id}`);

    const verified = speakeasy.totp.verify({ secret: user.secret, encoding: 'base32', token });

    if (!verified) throw new Error("Incorrect token");
    if (verified) {
      res.status(200).json({
        message: "2FA Verification was successful",
        status: verified,
      });
    }

  } catch (error) {
    console.log('ERROR:', error.stack)
    res.status(500).json({message: error.message})
  }
}


module.exports = {
  createUser,
  getUser,
  enable2FA,
  generateQRCode,
  verifyToken,
}