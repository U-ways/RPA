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
  userType
} from './types.js';

import {
  read,
  readAll
} from './resolvers.js';



export const QueryRootType = new GraphQLObjectType({
  name: 'UserQuery',
  description: 'Root query resolvers for User object.',
  fields: () => ({
    read: {
      type: userType,
      description: 'Find a user by username (case insensitive) or email',
      args: {
        username: { type: GraphQLString },
        email:    { type: GraphQLString }
      },
      resolve: (obj, args) => read(obj, args)
    },
    readAll: {
      type: new GraphQLList(userType),
      description: 'List the details of all users avaliable in collection.'
                 + '(default query result limit: 30)',
      args: { limit: { type: GraphQLInt, defaultValue: 30 } },
      resolve: (obj, args) => readAll(obj, args)
    }
  })
});
