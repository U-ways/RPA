/* GraphQL API
============================================================================= */
import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import graphqlHTTP from 'express-graphql';
import Store from './Store';
import User  from './User';

/** Query **/

const QueryRootType = new GraphQLObjectType({
  name: 'query',
  description: 'Root query',
  fields: () => ({
    store: {
      type: Store.queries,
      description: 'Store root query'
    },
    user: {
      type: User.queries,
      description: 'User root query'
    }
  })
});

/** Mutation **/

const MutationRootType = new GraphQLObjectType({
  name: 'mutation',
  description: 'Root mutation',
  fields: () => ({
    store: {
      type: Store.mutations,
      description: 'Store root mutation'
    },
    user: {
      type: User.mutations,
      description: 'User root mutation'
    }
  })
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
