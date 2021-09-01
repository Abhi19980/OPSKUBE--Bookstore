const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const Seller = require('../models/seller');

const getToken = ({ email, name }) =>
  jwt.sign({ email, name }, process.env.JWT_SECRET);

const verifyCustomer = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const customer = await Customer.findOne({ email }).populate(
      'books_purchased'
    );
    if (customer) {
      res.locals.user = customer;
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const verifySeller = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findOne({ email });
    if (seller) {
      res.locals.user = seller;
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { getToken, verifyCustomer, verifySeller };
