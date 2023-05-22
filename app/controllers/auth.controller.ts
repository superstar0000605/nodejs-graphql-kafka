const jwt = require('jsonwebtoken');
const Accounts = require('../models/accounts');
const bcrypt = require('bcrypt')

export class AuthController {
  // generate a salt and hash a password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // verify a password against a hash
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);
    return match;
  }

  async createAccount(input: any) {
    const accountInfo = await Accounts.find({ email: input.email })
    if (accountInfo.length === 0) {
      const hashedPassword = await this.hashPassword(input.password);
      return Accounts.create({ ...input, password: hashedPassword }).then((res: any) => {
        return res;
      });
    } else {
      throw new Error("Provided Email Already Exists")
    }


  }
  async login(input: { email: string, password: string }) {
    const account = await Accounts.findOne({ email: input.email })
    if (!account) {
      throw new Error("Invalid email")
    }
    const match = await this.verifyPassword(input.password, account.password);
    if (!match) {
      throw new Error("Invalid password")
    }
    const token = jwt.sign({ data: input.email }, <string>process.env.auth_encryption_salt)
    return { account: account, token }
  }
}
