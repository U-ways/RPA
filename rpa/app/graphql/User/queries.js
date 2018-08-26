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
  UserType
} from './types.js';

import {
  find,
  findAll
} from './resolvers.js';

const fields = {
  findUser: {
    type: UserType,
    description: 'Find a user by username (case insensitive) or email',
    args: {
      username: { type: GraphQLString },
      email:    { type: GraphQLString }
    },
    resolve: (obj, args) => find(obj, args)
  },
  findAllUsers: {
    type: new GraphQLList(UserType),
    description: 'List the details of all users avaliable in collection. '
               + '(default query result limit: 30)',
    args: { limit: { type: GraphQLInt, defaultValue: 30 } },
    resolve: (obj, args) => findAll(obj, args)
  }
};

export default { fields: fields }
