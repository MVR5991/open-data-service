import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from 'graphql-tag';
import fetch from 'node-fetch';

const { ApolloServer } = require('apollo-server');


// defines the different new types of the server.
// These types will be added to the schema.
const typeDefs = gql`

  # Example enriched data type
  type ImprovedData {
    id: String
    agency: String
    newCustomField: String
  }

  # Example Query type
  type Query {
    betterData: ImprovedData
  }
`;

// example function that firstly collects data from the server and then
// enriches the data with custom business logic
const API_NAME = "storage_publicapi5"

function collectBetterData() {
  const data = client.query({
    query: gql`
      query MyQuery {
        ${API_NAME}(limit: 1) {
          id
          agency
        }
      }
    `,
  })
  .then(result => {
    console.log(result['data'][API_NAME][0].id)
    return {
      // ...,
      id: result['data'][API_NAME][0].id,
      agency: result['data'][API_NAME][0].agency,
      newCustomField: "custom1"
    }
  });
  return data;
}

// mapping of how the example type betterData is being resolved
const resolvers = {
  Query: {
    betterData: () => collectBetterData(),
  },
};

// creates new server utilising the Apollo library
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000} ).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});


const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "http://172.17.0.1:7654/v1/graphql",
  fetch: fetch
});

//initialies a new client.
// this client can be used to fetch data froma  graph ql server endpoint
const client = new ApolloClient({
  cache,
  link,
});

client
.query({
  query: gql`
    query MyQuery {
      ${API_NAME} {
        id
        agency
      }
    }
  `
})

