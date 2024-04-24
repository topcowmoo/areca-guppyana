// Import necessary modules
import "./App.css";
import { Outlet } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import Navbar from "./components/Navbar";
import { setContext } from "@apollo/client/link/context";

// Create HTTP link for Apollo Client
const httpLink = createHttpLink({
  uri: "/api/graphql",
});

// Create authentication link using setContext
const authLink = setContext((_, { headers }) => {
  // Retrieve authentication token from local storage
  const token = localStorage.getItem("id_token");
  // Add token to headers if available
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Define the App component wrapped in ApolloProvider to provide the client to the entire app
function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

// Export the App component as the default export
export default App;
