// Import necessary modules
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

// Import GraphQL schema and resolvers
const { typeDefs, resolvers } = require("./schemas");
// Import database connection
const db = require("./config/connection");

// Define port for server
const PORT = process.env.PORT || 3001;
// Initialize Express application
const app = express();
// Initialize Apollo Server with defined schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start Apollo Server
const startApolloServer = async () => {
  // Start Apollo Server
  await server.start();

  // Configure Express middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apply Apollo Server middleware to handle GraphQL requests
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // Serve static files and handle routing in production environment
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // Once database connection is open, start the server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the function to start Apollo Server
startApolloServer();
