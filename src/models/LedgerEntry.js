import mongoose from "mongoose";

const schema = new mongoose.Schema({
  accountId: String,
  transactionId: String,
  amount: Number,
  balanceAfterTransaction: Number,
});

export default mongoose.model("LedgerEntry", schema);
