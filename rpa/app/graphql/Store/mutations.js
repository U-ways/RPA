/** Mutation
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
  AddressTypeInput,
  StoreTypeInput,
  StoreType
} from './types.js';

import {
  create,
  remove,
  update
} from './resolvers.js';

const fields = {
  createStore: {
    type: StoreType,
    description: 'Create a new store. (Please use the retailer business name) '
               + '(returns newly created store)',
    args: {
      name:    { type: new GraphQLNonNull(GraphQLString)    },
      address: { type: new GraphQLNonNull(AddressTypeInput) }
    },
    resolve: (obj, args) => create(obj, args)
  },
  removeStore: {
    type: StoreType,
    description: 'Remove a store by name (returns removed store)',
    args:        { name: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: (obj, args) => remove(obj, args)
  },
  updateStore: {
    type: StoreType,
    description: 'Update store details by name (returns updated store)',
    args: {
      name:   { type: new GraphQLNonNull(GraphQLString)  },
      update: { type: new GraphQLNonNull(StoreTypeInput) }
    },
    resolve: (obj, args) => update(obj, args)
  }
};

export default { fields: fields }
