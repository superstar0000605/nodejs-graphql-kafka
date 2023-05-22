
const Accounts = require('../models/accounts');
const Transactions = require('../models/Transactions')
import { Context } from "../context";
import { VerifyAuthorization } from "../decorators/auth.decorator";
import { producer } from "../kafka";

type TransactionType = {
  sender: string,
  recipient: string,
  amount: number
}
export class TransactionsController {
  @VerifyAuthorization
  async transfer(_args: any, _ctx: Context) {
    const sender = await Accounts.findOne({ email: _ctx.email })
    const recipient = await Accounts.findOne( { email: _args.email })
    if (!recipient) {
      throw new Error("This account is not existed")
    }
    const transaction = {
      sender: sender._id,
      recipient: recipient._id,
      amount: _args.amount
    }
    const res = await Transactions.create(transaction)
    const newRes = await Transactions.findById({ _id: res._id })
      .populate('sender')
      .populate('recipient')
    this.sendMessage(<string>process.env.KAFKA_TOPIC, { sender: newRes.sender.email, recipient: newRes.recipient.email, amount: res.amount })
    return newRes;
  }

  @VerifyAuthorization
  async transactions(_args: any, _ctx: Context) {
    const account = await Accounts.findOne( { email: _ctx.email })
    const transactions = await Transactions.find({ sender: account._id })
      .populate('sender')
      .populate('recipient');
    return transactions
  }

  async sendMessage(topic: string, message: TransactionType) {
    try {
      producer.send({
        topic: topic,
        messages: [{ value: JSON.stringify(message) }],
      }).then(console.log)
        .catch((err) => console.log('failed message', err))

    } catch (err) {
      console.error(`Error sending transaction event: ${err}`);
    } 
  }
}
