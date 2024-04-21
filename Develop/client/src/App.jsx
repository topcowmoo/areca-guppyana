// import CSS file for styling
import "./App.css";

// imoort Outlet component from react-router-dom
import { Outlet } from "react-router-dom";

// import modules from @apollo/client to use GraphQL
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

// import Navbar component
import Navbar from "./components/Navbar";

// create a new ApolloClient instance to connect to the GraphQL server
const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

// define the App component with ApolloProvider to provide the client to the entire app
function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

// export the App component as the defualt export
export default App;
