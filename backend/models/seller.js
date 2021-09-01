const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const sellerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    books: [{ type: ObjectId, ref: 'book' }],
    booksSold: [{ type: ObjectId, ref: 'book' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('seller', sellerSchema);
