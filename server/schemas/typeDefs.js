// import gql from apollo-server-express to define GraphQL schema

// define GraphQL type definitions
const typeDefs = `
  type Query {
    me: User
    users: [User]
    user(username: String!): User
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
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

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      authors: [String]!
      description: String!
      bookId: String!
      image: String!
      link: String!
      title: String!
    ): User
    removeBook(bookId: String!): User
  }
`;

// export type definitions
module.exports = typeDefs;
