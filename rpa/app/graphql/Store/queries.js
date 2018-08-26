/** Queries
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
  StoreType
} from './types.js';

import {
  find,
  findAll
} from './resolvers.js';

const fields = {
  findStore: {
    type: StoreType,
    description: 'Find a store by name (case insensitive)',
    args: { name: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: (obj, args) => find(obj, args)
  },
  findAllStores: {
    type: new GraphQLList(StoreType),
    description: 'List the details of all stores avaliable in collection. '
               + '(default query result limit: 30)',
    args: { limit: { type: GraphQLInt, defaultValue: 30 } },
    resolve: (obj, args) => findAll(obj, args)
  }
};

export default { fields: fields }
