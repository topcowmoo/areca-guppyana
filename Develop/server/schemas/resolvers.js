// import necessary modules and functions
const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

// define resolvers for Query and Mutation operations
const resolvers = {
  Query: {
    // resolver for "me" query
    me: async (parent, args, context) => {
      // Check if user is authenticated
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("book");
        return userData;
      }
      // Throw an authentication error if the user is not logged in
      throw new AuthenticationError("Please log in");
    },
    // resolver for users query
    users: async () => {
      return User.find().select("-__v -password").populate("books");
    },
    // resolver for single user query
    user: async (parent, { _id }) => {
      return User.findOne({ _id }).select("-__v -password").populate("book");
    },
  },
  Mutation: {
    // resolver for login mutation
    login: async (parent, { email, password }) => {
      // find user name by email in the database
      const user = await User.findOne({ email });
      // If no user found with given email, give authentication error
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // check if the password is correct
      const correctPw = await user.isCorrectPassword(password);
      // if password is incorrect, give authentication error
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // generate a JWT token
      const token = signToken(user);
      // return the token and the user data
      return { token, user };
    },
    // resolver for addUser
    addUser: async (parent, { username, email, password }) => {
      // create a new user in the database
      const user = await User.create({ username, email, password });
      // generate a JWT token for the new user
      const token = signToken(user);
      // return the token and the user data
      return { token, user };
    },
    // resolver for saveBook
    saveBook: async (parent, { bookId, authors, title, description, image, link }, context) => {
      // check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }
      try {
        // update the user document in the database to save the book
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: { bookId, authors, title, description, image, link } } }, // add book to savedBooks
          { new: true, runValidators: true } // return the updated user document
        ).populate("savedBooks"); // populate the savedBooks field of the updated user document
        // return the updated user document
        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error("Unable to save book.");
      }
    },
    // resolver for removeBook
    removeBook: async (parent, { bookId }, context) => {
      // check if the user is authenticated
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }
      try {
        // Update the user document in the database to remove the book with specific bookId
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } }, // remove the book with the given bookId from the savedBooks
          { new: true } // return the updated user document
        ).populate("savedBooks"); // populate the savedBooks field of the updated user document
        // return the updated user document is not found, throw an error
        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }
        // return the updated user
        return updatedUser;
      } catch (err) {
        console.error(err);
        throw new Error("Unable to remove book.");
      }
    },
  },
};

// Export the resolvers
module.exports = resolvers;
