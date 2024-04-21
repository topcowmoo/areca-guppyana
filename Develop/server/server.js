// import modules and functions necessary for the server to run
const express = require("express");
const path = require("path");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server-express4");
const { authMiddleware } = require("./utils/auth");

// import type definitions and resolvers from schemas
const { typeDefs, resolvers } = require("./schemas");

// import database connection
const db = require("./config/connection");

// define the port for the server to listen on
const PORT = process.env.PORT || 3001;

// create an instance of an express app
const app = express();

// create a new Apollo server with type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//create a function to start the Apollo server
const startApolloServer = async () => {
  // start the Apollo server
  await server.start();

  // set up express middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // set up Apollo server middleware with authentication context
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));

    // route all other requests to the React app
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }

  // connect the express server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on your ${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// function call to start the Apollo server
startApolloServer();
