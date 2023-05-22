const dotenv = require('dotenv')
dotenv.config();

import { ApolloServer } from "apollo-server-express";
import depthLimit from 'graphql-depth-limit';
import cors from 'cors'
import compression from "compression";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import startKafka from "./kafka";
import { MongoHelper } from "./helpers/mongoHelpers";
import Schema from "./graphql/Schema";
import Resolvers from "./graphql/Resolvers";

async function startApolloServer(schema: any, resolvers: any) {
  const app = express();
  const mHelper = new MongoHelper();
  mHelper.initiateMongoConnection();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    introspection: true,
    validationRules: [depthLimit(7)],
    context: async ({ req }) => {
      return await mHelper.validateUser(req);
    },
    //tell Express to attach GraphQL functionality to the server
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  }) as any;
  app.use('*', cors());
  app.use(compression());
  await server.start(); //start the GraphQL server.
  server.applyMiddleware({ app });
// start kafka
  startKafka();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve) //run the server on port 4000
  );
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
}
//in the end, run the server and pass in our Schema and Resolver.
startApolloServer(Schema, Resolvers);