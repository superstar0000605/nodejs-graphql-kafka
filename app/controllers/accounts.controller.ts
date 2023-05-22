const Accounts = require('../models/accounts');
import { Context } from "../context";
import { VerifyAuthorization } from "../decorators/auth.decorator";

export class AccountsController {
  @VerifyAuthorization
  async account(_args: any, _ctx: Context) {
    const account = await Accounts.findOne({ email: _ctx.email })
    if (account) {
      return account;
    } else {
      throw new Error("Invalid Email")
    }
  }

  @VerifyAuthorization
  async balance(_args: any, _ctx: Context) {
    const account = await Accounts.findOne({ email: _ctx.email })
    if (account) {
      return account.balance;
    } else {
      throw new Error("Invalid Email")
    }
  }
}
