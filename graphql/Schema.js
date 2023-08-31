const typeDefs  = `#graphql

  type Author{
    name: String
    email: String
    password: String
    success: String
    token: String!
    redirect: String!
  }

  type Query {
    authors: [Author]
    author(id: ID!): Author
  }

  type Mutation {
    addAuthor(author: addAuthorInput!): [Author]
    authenticateAuthor(author: authenticateAuthorInput!): Author
  }

  input addAuthorInput {
    name: String!
    email: String!
    password: String!
  }

  input authenticateAuthorInput {
    email: String!
    password: String!
  }

  

`

module.exports = typeDefs