/* GraphQL API
============================================================================= */
import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import graphqlHTTP from 'express-graphql';
import Store from './Store';
import User  from './User';

/** Query **/

const queries = Object.assign({},Store.queries, User.queries);

const QueryRootType = new GraphQLObjectType({
  name: 'query',
  description: 'Root query',
  fields: () => (queries)
});

/** Mutation **/

const mutations = Object.assign({},Store.mutations, User.mutations);

const MutationRootType = new GraphQLObjectType({
  name: 'mutation',
  description: 'Root mutation',
  fields: () => (mutations)
});

/** Schema **/

const Schema = new GraphQLSchema({
  query:    QueryRootType,
  mutation: MutationRootType
});

/** API **/

const API = graphqlHTTP({
  schema: Schema,
  graphiql: true,
});

export default API;
