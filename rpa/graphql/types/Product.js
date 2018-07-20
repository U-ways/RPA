/* Product GraphQL schema
============================================================================= */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql/type';

import GraphQLTimestamp from '../scalars/GraphQLTimestamp.js';

const timelineType = new GraphQLObjectType({
  name: 'timeline',
  fields: () => ({
    date:  { type: new GraphQLNonNull(GraphQLTimestamp) },
    price: { type: new GraphQLNonNull(GraphQLFloat)     },
    sold:  { type: new GraphQLNonNull(GraphQLInt)       }
  })
});

export const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString)  },
    timeline: { type: new GraphQLList(timelineType)      }
  })
});
