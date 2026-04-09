import mongoose from "mongoose";

const schema = new mongoose.Schema({
  accountId: String,
  balance: Number,
});

export default mongoose.model("Ledger", schema);
