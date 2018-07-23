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

import GraphQLTimestamp from '../_scalars/GraphQLTimestamp.js';

/** Product **/

const timelineType = new GraphQLObjectType({
  name: 'timeline',
  fields: () => ({
    date:  { type: new GraphQLNonNull(GraphQLTimestamp) },
    price: { type: new GraphQLNonNull(GraphQLFloat)     },
    sold:  { type: new GraphQLNonNull(GraphQLInt)       }
  })
});
const timelineTypeInput = new GraphQLInputObjectType({
  name: 'timelineInput',
  fields: () => ({
    date:  { type: GraphQLTimestamp },
    price: { type: GraphQLFloat     },
    sold:  { type: GraphQLInt       }
  })
});

const productType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString)  },
    timeline: { type: new GraphQLList(timelineType)      }
  })
});
export const productTypeInput = new GraphQLInputObjectType({
  name: 'ProductInput',
  fields: () => ({
    name:     { type: GraphQLString },
    timeline: { type: new GraphQLList(timelineTypeInput) }
  })
});

/** Address **/

const addressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    street:   { type: new GraphQLNonNull(GraphQLString) },
    county:   { type: GraphQLString                     },
    postcode: { type: new GraphQLNonNull(GraphQLString) },
    country:  { type: new GraphQLNonNull(GraphQLString) }
  })
});
export const addressTypeInput = new GraphQLInputObjectType({
  name: 'AddressInput',
  fields: () => ({
    street:   { type: new GraphQLNonNull(GraphQLString) },
    county:   { type: GraphQLString                     },
    postcode: { type: new GraphQLNonNull(GraphQLString) },
    country:  { type: new GraphQLNonNull(GraphQLString) }
  })
});

/** Store **/

export const storeType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString) },
    address:  { type: new GraphQLNonNull(addressType)   },
    products: { type: new GraphQLList(productType)      }
  })
});
export const storeTypeInput = new GraphQLInputObjectType({
  name: 'StoreInput',
  fields: () => ({
    name:     { type: GraphQLString    },
    address:  { type: addressTypeInput },
    products: { type: new GraphQLList(productTypeInput) }
  })
});
