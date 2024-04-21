// export type definitions
module.exports = typeDefs;

// import gql from apollo-server-express to define GraphQL schema
const { gql } = require("apollo-server-express");

// define GraphQL type definitions
const typeDefs = gql`
  type Query {
    me: User
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    authors: [String]!
    description: String!
    title: String!
    bookId: String!
    image: String
    link: String
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

// export type definitions
module.exports = typeDefs;
