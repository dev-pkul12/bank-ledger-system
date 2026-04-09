import mongoose from "mongoose";
import Ledger from "../models/Ledger.js";
import LedgerEntry from "../models/LedgerEntry.js";

export const updateLedger = async (txn) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let ledger = await Ledger.findOne({ accountId: txn.accountId }).session(session);

    if (!ledger) {
      ledger = await Ledger.create([{ accountId: txn.accountId, balance: 0 }], { session });
      ledger = ledger[0];
    }

    const newBalance =
      txn.type === "credit"
        ? ledger.balance + txn.amount
        : ledger.balance - txn.amount;

    ledger.balance = newBalance;
    await ledger.save({ session });

    await LedgerEntry.create([{
      accountId: txn.accountId,
      transactionId: txn._id,
      amount: txn.amount,
      balanceAfterTransaction: newBalance
    }], { session });

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};