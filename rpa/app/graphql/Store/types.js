/** Types
============================================================================= */

import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql/type';

import GraphQLTimestamp from '../scalars/GraphQLTimestamp.js';

/** Product **/

const TimelineType = new GraphQLObjectType({
  name: 'TimelineType',
  fields: () => ({
    date:  { type: new GraphQLNonNull(GraphQLTimestamp) },
    price: { type: new GraphQLNonNull(GraphQLFloat)     },
    sold:  { type: new GraphQLNonNull(GraphQLInt)       }
  })
});
const TimelineTypeInput = new GraphQLInputObjectType({
  name: 'TimelineTypeInput',
  fields: () => ({
    date:  { type: GraphQLTimestamp },
    price: { type: GraphQLFloat     },
    sold:  { type: GraphQLInt       }
  })
});

const ProductType = new GraphQLObjectType({
  name: 'ProductType',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString)  },
    timeline: { type: new GraphQLList(TimelineType)      }
  })
});
export const ProductTypeInput = new GraphQLInputObjectType({
  name: 'ProductTypeInput',
  fields: () => ({
    name:     { type: GraphQLString },
    timeline: { type: new GraphQLList(TimelineTypeInput) }
  })
});

/** Address **/

const AddressType = new GraphQLObjectType({
  name: 'AddressType',
  fields: () => ({
    street:   { type: new GraphQLNonNull(GraphQLString) },
    county:   { type: GraphQLString                     },
    postcode: { type: new GraphQLNonNull(GraphQLString) },
    country:  { type: new GraphQLNonNull(GraphQLString) }
  })
});
export const AddressTypeInput = new GraphQLInputObjectType({
  name: 'AddressTypeInput',
  fields: () => ({
    street:   { type: GraphQLString },
    county:   { type: GraphQLString },
    postcode: { type: GraphQLString },
    country:  { type: GraphQLString }
  })
});

/** Store **/

export const StoreType = new GraphQLObjectType({
  name: 'StoreType',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString) },
    address:  { type: new GraphQLNonNull(AddressType)   },
    products: { type: new GraphQLList(ProductType)      }
  })
});
export const StoreTypeInput = new GraphQLInputObjectType({
  name: 'StoreTypeInput',
  fields: () => ({
    name:     { type: GraphQLString    },
    address:  { type: AddressTypeInput },
    products: { type: new GraphQLList(ProductTypeInput) }
  })
});
