const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library for handling JWTs
const { GraphQLError } = require("graphql"); // Import the GraphQLError class from the graphql library

// Set token secret and expiration date
const secret = "mysecretsshhhhh"; // Secret key for JWT encryption
const expiration = "2h"; // Expiration time for JWT tokens, set to 2 hours

module.exports = {
  AuthenticationError: new GraphQLError("Authentication Error"), // Custom error message for authentication errors
  extensions: {
    code: "UNAUTHENTICATED",
  },
  // Middleware function for authentication
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Extract token value if it's included in the Authorization header
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // If no token is found, return the request object unchanged
    if (!token) {
      return req;
    }

    // Verify token and extract user data from it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      console.log("Invalid token", error);
    }

    // Return the request object so it can be passed to the resolver as `context`
    return req;
  },

  // Function for generating JWT tokens
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    // Sign the token with the payload, secret key, and expiration time
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
