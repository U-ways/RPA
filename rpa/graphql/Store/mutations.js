/** Mutation
  - https://medium.com/@HurricaneJames/graphql-mutations-fb3ad5ae73c4
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
  ProductTypeInput,
  addressTypeInput,
  storeTypeInput,
  storeType
} from './types.js';

import {
  create,
  remove,
  update
} from './resolvers.js';

export const StoreMutations = new GraphQLObjectType({
  name: 'StoreMutations',
  description: 'Mutation resolvers for Store',
  fields: () => ({
    create: {
      type: storeType,
      description: 'Create a new store. (Please use the retailer business name) '
                 + '(returns newly created store)',
      args: {
        name:    { type: new GraphQLNonNull(GraphQLString)    },
        address: { type: new GraphQLNonNull(addressTypeInput) }
      },
      resolve: (obj, args) => create(obj, args)
    },
    remove: {
      type: storeType,
      description: 'Remove a store by name (returns removed store)',
      args:        { name: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (obj, args) => remove(obj, args)
    },
    update: {
      type: storeType,
      description: 'Update store details by name (returns updated store)',
      args: {
        name:   { type: new GraphQLNonNull(GraphQLString)  },
        update: { type: new GraphQLNonNull(storeTypeInput) }
      },
      resolve: (obj, args) => update(obj, args)
    }
  })
});
