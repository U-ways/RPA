/* API exports
Nice example of GraphQL structuring:
- https://goo.gl/e7Zp4Q
- https://goo.gl/UJXbSQ
============================================================================= */
import { GraphQLObjectType, GraphQLSchema } from 'graphql/type';
import graphqlHTTP from 'express-graphql';
import Store from './Store';
import User  from './User';

/** Query **/

const QueryRootType = new GraphQLObjectType({
  name: 'query',
  description: 'Root query resolvers for all objects',
  fields: () => ({
    Store: { type: Store.QueryRootType },
    User:  { type: User.QueryRootType  }
  })
});

/** Mutation **/

const MutationRootType = new GraphQLObjectType({
  name: 'mutation',
  description: 'Root mutation resolvers for all object.',
  fields: () => ({
    Store: { type: Store.MutationRootType },
    User:  { type: User.MutationRootType  }
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
