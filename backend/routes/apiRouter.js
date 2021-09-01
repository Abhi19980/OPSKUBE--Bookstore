const router = require('express').Router();
const sellerRouter = require('./seller');
const customerRouter = require('./customer');
const bookRouter = require('./book');

router.use('/seller', sellerRouter);
router.use('/customer', customerRouter);
router.use('/book', bookRouter);

module.exports = router;
