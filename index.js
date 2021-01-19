//require Apollo Server for Express
const { ApolloServer } = require('apollo-server');
//require GraphQL
const gql = require('graphql-tag');
//require MongoDB
const mongoose = require('mongoose');
//get connection key from config.js

//local dependencies
const Post = require('./models/Post');
const { MONGODB } = require('./config.js');
const typeDefs = require('./graphql/typeDefs');
//on each query mutation or subscription it has it's correponding resolver
//returns what this query returns
const resolvers = require('./graphql/resolvers');

//setup Apollo Server with parameters type definitions and resolvers
//context for reading headers and authorizing users using EXPRESS
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
});

//connect to backend
//start server using server instance, specify a port
//it returns a promise so include .then()
mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected!');
        return server.listen({ port: 5000 });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    });

//we get graphql playground at port 5000