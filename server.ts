var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

var schema = buildSchema(`
  type User {
    id: String
    name: String
  }

  input UserInput {
    id : String! 
    name:String! 
  }
  input query{
    id:String!
  }

  type Query {
    user(input: query): User
  }

  type Mutation {
    addUser(input:UserInput) : User
  }

`);

var fakeDatabase:any = {
  a: {
    id: "a",
    name: "nameA",
  },
  b: {
    id: "b",
    name: "nameB",
  },
};

var root = {
  user: ({input}: {input: { id: keyof typeof fakeDatabase }}): (typeof fakeDatabase)["a"] => {
    return fakeDatabase[input?.id];
  },
  addUser : ({input} : {input : {name:string,id:string}}) : {name:string,id:string} => {
    fakeDatabase[input?.id] = input;
    return input;
  }
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
