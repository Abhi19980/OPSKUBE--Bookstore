const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    books_purchased: [{ type: ObjectId, ref: 'book' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('customer', customerSchema);
