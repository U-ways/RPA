/* Store GraphQL schema
============================================================================= */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import StoreModel from '../../mvc/models/Store.js';
// FIXME: Do a correct import later on
import ProductType from './Product.js';

// TODO:
// - Provide a better input definetion for address
// - both on storetype and root types.

const StoreType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString) },
    address:  { type: new GraphQLNonNull(GraphQLString) },
    products: { type: new GraphQLList(ProductType) },
  })
});

const QueryRootType = new GraphQLObjectType({
  name: 'query',
  description: 'Root query resolvers for Store object.',
  fields: () => ({
    Store: {
      type: StoreType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, {name}) => {
        return StoreModel.find({name: storeName}).select('address');
      }
    }
  })
});

// https://medium.com/@HurricaneJames/graphql-mutations-fb3ad5ae73c4
const MutationRootType = new GraphQLObjectType({
  name: 'mutation',
  description: 'Root mutation resolvers for Store object.',
  fields: () => ({
    addNewStore: {
      type: StoreType,
      args: {
        name:    { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, {storeName, address}) => {
        StoreModel.create({
          name: storeName,
          address: {
            street:   address.street,
            county:   address.county,
            postcode: address.postcode,
            country:  address.country
          }
        }).catch(err => {if (err) return err});
      }
    }
  })
});

const schema = new GraphQLSchema({
  query:    QueryRootType,
  mutation: MutationRootType
});

export default schema;
