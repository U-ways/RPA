/* GraphQL API
============================================================================= */

import Store from './Store';
import User  from './User';
import graphqlHTTP from 'express-graphql';

import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';

/** Query **/

const queries = Object.assign({},
  Store.query.fields,
  User.query.fields
);

export const QueryRootType = new GraphQLObjectType({
  name: 'query',
  description: 'Root query',
  fields: () => (queries)
});

/** Mutation **/

const mutations = Object.assign({},
  Store.mutation.fields,
  User.mutation.fields
);

export const MutationRootType = new GraphQLObjectType({
  name: 'mutation',
  description: 'Root mutation',
  fields: () => (mutations)
});

/** Schema **/

const Schema = new GraphQLSchema({
  query:    QueryRootType,
  mutation: MutationRootType
});

/** HTTP API **/

export const api = graphqlHTTP({
  schema: Schema,
});

export const graphiql = graphqlHTTP({
  schema: Schema,
  graphiql: true
});
