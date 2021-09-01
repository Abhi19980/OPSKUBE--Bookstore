const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const bookSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('book', bookSchema);
