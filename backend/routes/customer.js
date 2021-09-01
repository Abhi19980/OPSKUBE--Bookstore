const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const Customer = require('../models/customer');
const { getToken, verifyCustomer } = require('../utils/auth');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Customer.findOne({ email });

    if (seller) {
      const result = await bcryptjs.compare(password, seller.password);

      if (result) {
        const token = getToken(seller);
        res.status(201).json({ token });
      } else {
        res.status(401).json({ message: 'Incorrect email or password!' });
      }
    } else {
      res.status(401).json({ message: 'Incorrect email or password!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Some error occurred' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const seller = await Customer.findOne({ email });

    if (seller) {
      res.status(409).json({ message: 'Customer already exists' });
      return;
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);

      const newSeller = Customer({
        name,
        email,
        password: hashedPassword,
        address,
      });

      await newSeller.save();

      res.status(201).json({ message: 'Customer successfully registered!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Some error occurred' });
  }
});

router.get('/getCustomer', verifyCustomer, async (req, res) => {
  const customer = res.locals.user;
  res.json({ ...customer._doc, password: '********' });
});

module.exports = router;
