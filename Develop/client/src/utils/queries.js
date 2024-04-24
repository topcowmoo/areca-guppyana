// import gql from apollo/client to define GraphQL queries
import { gql } from "@apollo/client";

// define GraphQL query to get user information
export const GET_ME = gql`
  query get_me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
