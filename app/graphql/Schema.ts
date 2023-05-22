import { gql } from "apollo-server-express"; //will create a schema
const Schema = gql`
  type Query {
    account: Account
    balance: Float!
    transactions: [Transaction]
    token(email: String!): String!
  }
  type Mutation {
    createAccount(name: String!, email: String!, password: String!): Account
    login(email: String!, password: String!): ResponseAccount
    transfer(email: String!, amount: Float!): Transaction
  }
  type Account {
    id: ID!
    name: String!
    email: String!
    balance: String!
  }
  type ResponseAccount {
    account: Account!
    token: String!
  }
  type Transaction {
    id: ID!
    sender: Account!
    recipient: Account!
    amount: Float!
    timestamp: String!
  }
`;
export default Schema;