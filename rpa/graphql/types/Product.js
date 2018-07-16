/* Product GraphQL schema
============================================================================ */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import GraphQLTimestamp from '../scalars/GraphQLTimestamp.js';
import ProductModel     from '../../mvc/models/Product.js';

const PriceTimelineType = new GraphQLObjectType({
  name: 'PriceTimeline',
  fields: () => ({
    price: { type: new GraphQLNonNull(GraphQLInt)  },
    date:  { type: new GraphQLNonNull(GraphQLTimestamp) },
  })
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    name:           { type: new GraphQLNonNull(GraphQLString)  },
    priceTimeline:  { type: new GraphQLList(PriceTimelineType) },
  })
});

export default ProductType;
