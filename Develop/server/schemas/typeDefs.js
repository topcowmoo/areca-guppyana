// import gql from apollo-server-express to define GraphQL schema
const { gql } = require("apollo-server-express");

// define GraphQL type definitions
const typeDefs = gql`
  type Query {
    me: User # Query to get the currently authenticated user
  }

  type User {
    _id: ID # User ID
    username: String # Username of the user
    email: String # Email of the user
    bookCount: Int # Number of books saved by the user
    savedBooks: [Book] # List of books saved by the user
  }

  type Book {
    bookId: String # Unique identifier for the book
    authors: [String] # Authors of the book
    description: String # Description of the book
    title: String # Title of the book
    image: String # URL of the book cover image
    link: String # URL to more information about the book
  }

  type Auth {
    token: ID! # Authentication token
    user: User # Authenticated user
  }

  input BookInput {
    authors: [String]! # Authors of the book
    description: String! # Description of the book
    title: String! # Title of the book
    bookId: String! # Unique identifier for the book
    image: String # URL of the book cover image
    link: String # URL to more information about the book
  }

  type Mutation {
    login(email: String!, password: String!): Auth # Mutation to login and generate authentication token
    addUser(username: String!, email: String!): Auth # Mutation to add a new user
    saveBook(input: BookInput!): User # Mutation to save a book to user's list
    removeBook(bookId: String!): User # Mutation to remove a book from user's list
  }
`;

// export type definitions
module.exports = typeDefs;
