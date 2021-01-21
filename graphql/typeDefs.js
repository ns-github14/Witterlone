const { gql } = require('apollo-server');

//type definitions; requires gql
//we will define all queries in here for our application
//'!' used for required fields
//graphQL component 'Post'
//input Registerinput is an input to GraphQL to return us some info
//type mutation is for making changes to database
module.exports = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
    }
    type Comment {
        id: ID!
        username: String!
        body: String!
        createdAt: String!
    }
    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    }    
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body:String!): Post!
        deleteComment(postId: String!, commentId: ID!): Post!
        updateComment(postId: String!, commentId:ID!, body:String!): Post!
        likePost(postId: ID!): Post!
    }
`;