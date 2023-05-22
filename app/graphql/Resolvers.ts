import { GraphQLResolveInfo } from 'graphql';
import * as jwt from 'jsonwebtoken';
import { IResolvers } from '@graphql-tools/utils';
import { AccountsController } from '../controllers/accounts.controller';
import { AuthController  } from '../controllers/auth.controller';
import { TransactionsController } from '../controllers/transactions.controller';
import { Context } from '../context';
import { AppConstants } from '../constants/app.constants';
const accountsController = new AccountsController();
const authController = new AuthController();
const transactionsController = new TransactionsController();

const resolvers: IResolvers = {
  Query: {
    balance: (_: void, args: any, ctx: Context, _info: GraphQLResolveInfo) => {
      return accountsController.balance(args, ctx)
    },
    account: (_: void, args: any, ctx: Context, _info: GraphQLResolveInfo) => {
      return accountsController.account(args, ctx)
    },
    transactions: (_: void, args: any, ctx: Context, _info: GraphQLResolveInfo) => {
      return transactionsController.transactions(args, ctx)
    },
    token: (_, args: any) => {
      return jwt.sign({ data: args[AppConstants.EMAIL] }, <string>process.env.auth_encryption_salt);
    }
  },
  Mutation: {
    createAccount: (_, input, ctx: Context) => {
      return authController.createAccount(input)
    },
    login: (_, inputAccount, ctx: Context) => {
      return authController.login(inputAccount)
    },
    transfer: (_, input, ctx: Context) => {
      return transactionsController.transfer(input, ctx)
    }
  },
};

export default resolvers;