/* Store GraphQL schema
  TODO:
  - I should return server err numbers w/ JSON for errs like this:
    https://stackoverflow.com/a/48303244/5037430
============================================================================= */
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} from 'graphql/type';

import Store from '../../mvc/models/Store.js';
import { ProductType } from './Product.js';

/** Types **/

const addressType = new GraphQLObjectType({
  name: 'Address',
  fields: () => ({
    street:   { type: new GraphQLNonNull(GraphQLString) },
    county:   { type: GraphQLString                     },
    postcode: { type: new GraphQLNonNull(GraphQLString) },
    country:  { type: new GraphQLNonNull(GraphQLString) },
  })
});

const addressInputType = new GraphQLInputObjectType({
  name: 'AddressInput',
  fields: () => ({
    street:   { type: new GraphQLNonNull(GraphQLString) },
    county:   { type: GraphQLString                     },
    postcode: { type: new GraphQLNonNull(GraphQLString) },
    country:  { type: new GraphQLNonNull(GraphQLString) },
  })
});

const storeType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    name:     { type: new GraphQLNonNull(GraphQLString) },
    address:  { type: new GraphQLNonNull(addressType)   },
    products: { type: new GraphQLList(ProductType)      },
  })
});

const storeInputType = new GraphQLInputObjectType({
  name: 'StoreInput',
  fields: () => ({
    name:     { type: GraphQLString    },
    address:  { type: addressInputType }
  })
});

/** Query **/

const QueryRootType = new GraphQLObjectType({
  name: 'query',
  description: 'Root query resolvers for Store object.',
  fields: () => ({
    findStore: {
      type: storeType,
      description: 'Find a store by name (case insensitive)',
      args: { name: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (obj, {name}) => {
        let regex  = new RegExp(name,'i');
        let query  = Store.findOne({ name: regex }).exec();
        let result = query.then((doc, err) => {
          if (err) console.log('err: ' + err);
          else     return doc;
        });
        return result;
      }
    },
    listAllStores: {
      type: new GraphQLList(storeType),
      description: 'List the details of all stores avaliable in collection. '
                 + '(default query result limit: 30)',
      args: { limit: { type: GraphQLInt, defaultValue: 30 } },
      resolve: (obj, {limit}) => {
        let query  = Store.find().limit(limit).exec();
        let result = query.then((arr, err) => {
          if (err) console.log('err: ' + err);
          else     return arr;
        });
        return result;
      }
    }
  })
});

// https://medium.com/@HurricaneJames/graphql-mutations-fb3ad5ae73c4
const MutationRootType = new GraphQLObjectType({
  name: 'mutation',
  description: 'Root mutation resolvers for Store object.',
  fields: () => ({
    createStore: {
      type: storeType,
      description: 'Create a new store. (Please use the retailer business name) '
                 + '(returns newly created store)',
      args: {
        name:    { type: new GraphQLNonNull(GraphQLString)    },
        address: { type: new GraphQLNonNull(addressInputType) }
      },
      resolve: (obj, {name, address}) => {
        let mutation = Store.create({
          name: name,
          address: {
            street:   address.street,
            county:   address.county,
            postcode: address.postcode,
            country:  address.country
          }
        })
        let result   = mutation.then((doc, err) => {
          if (err) console.log('err: ' + err);
          else     return doc;
        });
        return result;
      }
    },
    removeStore: {
      type: storeType,
      description: 'Remove a store by name (returns removed store)',
      args:        { name: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: (obj, {name}) => {
        let regex    = new RegExp(name,'i');
        let mutation = Store.findOneAndDelete({ name: regex }).exec();
        let result   = mutation.then((doc, err) => {
          if (err) console.log('err: ' + err);
          else     return doc;
        });
        return result;
      }
    },
    updateStore: {
      type: storeType,
      description: 'Update store details by name (returns updated store)',
      args: {
        name:   { type: new GraphQLNonNull(GraphQLString)  },
        update: { type: new GraphQLNonNull(storeInputType) }
      },
      resolve: (obj, {name, update}) => {
        let regex    = new RegExp(name,'i');
        let query    = { name: regex };
        let options  = { new: true };
        let mutation = Store.findOneAndUpdate(query, update, options).exec();
        let result   = mutation.then((doc, err) => {
          if (err) console.log('err: ' + err);
          else     return doc;
        });
        return result;
      }
    }
  })
});

const schema = new GraphQLSchema({
  query:    QueryRootType,
  mutation: MutationRootType
});

export default schema;
