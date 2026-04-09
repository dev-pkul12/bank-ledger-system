import Transaction from "../models/Transaction.js";
import { isDuplicate } from "../utils/redis.js";
import { updateLedger } from "./ledgerService.js";

export const processBatch = async (payload) => {
  const transactions = payload.transactions;

  for (const txn of transactions) {
    const duplicate = await isDuplicate(txn.id);
    if (duplicate) continue;

    try {
      const txnDoc = await Transaction.create({
        externalTransactionId: txn.id,
        accountId: txn.accountId,
        amount: txn.amount,
        type: txn.type,
        date: txn.date,
      });

      await updateLedger(txnDoc);
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
  }
};
