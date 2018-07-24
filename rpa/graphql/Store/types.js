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
  name: 'timelineType',
  fields: () => ({
    date:  { type: new GraphQLNonNull(GraphQLTimestamp) },
    price: { type: new GraphQLNonNull(GraphQLFloat)     },
    sold:  { type: new GraphQLNonNull(GraphQLInt)       }
  })
});
const timelineTypeInput = new GraphQLInputObjectType({
  name: 'timelineTypeInput',
  fields: () => ({
    date:  { type: GraphQLTimestamp },
    price: { type: GraphQLFloat     },
    sold:  { type: GraphQLInt       }
  })
});

const productType = new GraphQLObjectType({
  name: 'productType',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString)  },
    timeline: { type: new GraphQLList(timelineType)      }
  })
});
export const productTypeInput = new GraphQLInputObjectType({
  name: 'productTypeInput',
  fields: () => ({
    name:     { type: GraphQLString },
    timeline: { type: new GraphQLList(timelineTypeInput) }
  })
});

/** Address **/

const addressType = new GraphQLObjectType({
  name: 'addressType',
  fields: () => ({
    street:   { type: new GraphQLNonNull(GraphQLString) },
    county:   { type: GraphQLString                     },
    postcode: { type: new GraphQLNonNull(GraphQLString) },
    country:  { type: new GraphQLNonNull(GraphQLString) }
  })
});
export const addressTypeInput = new GraphQLInputObjectType({
  name: 'addressTypeInput',
  fields: () => ({
    street:   { type: new GraphQLNonNull(GraphQLString) },
    county:   { type: GraphQLString                     },
    postcode: { type: new GraphQLNonNull(GraphQLString) },
    country:  { type: new GraphQLNonNull(GraphQLString) }
  })
});

/** Store **/

export const storeType = new GraphQLObjectType({
  name: 'storeType',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString) },
    address:  { type: new GraphQLNonNull(addressType)   },
    products: { type: new GraphQLList(productType)      }
  })
});
export const storeTypeInput = new GraphQLInputObjectType({
  name: 'storeTypeInput',
  fields: () => ({
    name:     { type: GraphQLString    },
    address:  { type: addressTypeInput },
    products: { type: new GraphQLList(productTypeInput) }
  })
});
