// src/models/Transaction.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    externalTransactionId: { type: String, required: true },
    accountId: String,
    amount: Number,
    type: String,
    date: Date,
  },
  { timestamps: true },
);

schema.index({ externalTransactionId: 1, accountId: 1 }, { unique: true });

export default mongoose.model("Transaction", schema);
