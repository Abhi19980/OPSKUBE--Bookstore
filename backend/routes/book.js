const router = require('express').Router();
const Book = require('../models/book');
const Seller = require('../models/seller');
const Customer = require('../models/customer');
const { verifyCustomer, verifySeller } = require('../utils/auth');

router.get('/', verifyCustomer, async (req, res) => {
  const books = await Book.find({});

  res.status(200).json({ books });
});

router.get('/booksBySeller', verifySeller, async (req, res) => {
  const { email } = res.locals.user;

  const seller = await Seller.findOne({ email })
    .populate('books')
    .populate('booksSold');

  res.json({ books: seller.books, booksSold: seller.booksSold });
});

router.post('/addBook', verifySeller, async (req, res) => {
  const { name, price } = req.body;
  const seller = res.locals.user;

  const book = await Book.findOne({ name });

  if (book) {
    res.status(409).json({ message: 'Book already exists' });
    return;
  }

  const doc = Book({ name, price });
  const newBook = await doc.save();

  seller.books.push({ _id: newBook._id });
  await seller.save();

  res.status(201).json({ message: 'Book added' });
});

router.post('/editBook/:bookId', verifySeller, async (req, res) => {
  const id = req.params.bookId;
  const { name, price } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    res.status(404).json({ message: 'Book not found!' });
    return;
  }

  if (name && book.name !== name) {
    book.name = name;
  }
  if (price && book.price !== price) {
    book.price = price;
  }

  await book.save();

  res.status(200).json({ message: 'Book updated!' });
});

router.delete('/deleteBook/:bookId', verifySeller, async (req, res) => {
  const id = req.params.bookId;

  const { email } = res.locals.user;

  // const seller = await Seller.findOne({ email });
  // seller.books.push({ _id: newBook._id });

  await Book.deleteOne({ _id: id });

  res.status(200).json({ message: 'Book deleted' });
});

router.get('/buyBook/:bookId', verifyCustomer, async (req, res) => {
  const id = req.params.bookId;
  const { email } = res.locals.user;

  const book = await Book.findById(id);

  if (!book) {
    res.status(404).json({ message: 'Book not found!' });
    return;
  }

  const seller = await Seller.findOne({ books: id });
  const customer = await Customer.findOne({ email });

  customer.books_purchased.push(id);
  seller.booksSold.push(id);

  await customer.save();
  await seller.save();

  res.json(seller);
});

module.exports = router;
