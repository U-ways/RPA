/** Queries
- TODO:
  - Create new quries and nest them inside the root query
  - something like: https://medium.freecodecamp.org/organizing-graphql-mutations-653306699f3d
============================================================================= */
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import {
  storeType
} from './types.js';

import {
  read,
  readAll
} from './resolvers.js';

export const StoreQueries =
{
  Store_read: {
    type: storeType,
    description: 'Find a store by name (case insensitive)',
    args: { name: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: (obj, args) => read(obj, args)
  },
  Store_readAll: {
    type: new GraphQLList(storeType),
    description: 'List the details of all stores avaliable in collection.'
               + '(default query result limit: 30)',
    args: { limit: { type: GraphQLInt, defaultValue: 30 } },
    resolve: (obj, args) => readAll(obj, args)
  }
};
