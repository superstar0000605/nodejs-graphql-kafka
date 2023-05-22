import mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    }
  }
);

module.exports = mongoose.model('Account', AccountSchema);
