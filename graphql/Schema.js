const typeDefs  = `#graphql

  type Author{
    name: String!
    email: String!
    password: String!
  }

  type Query {
    authors: [Author]
    author(id: ID!): Author
  }

  type Mutation {
    addAuthor(author: addAuthorInput!): [Author]
  }

  input addAuthorInput {
    name: String!
    email: String!
    password: String!
  }

  

`

module.exports = typeDefs