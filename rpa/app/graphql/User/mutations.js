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
  UserTypeInput,
  UserType
} from './types.js';

import {
  create,
  remove,
  update
} from './resolvers.js';

const fields = {
  createUser: {
    type: UserType,
    description: 'Create a new user (returns newly created user)',
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
      email:    { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: (obj, args) => create(obj, args)
  },
  removeUser: {
    type: UserType,
    description: 'Remove a user by username or email (returns removed user)',
    args: {
      username: { type: GraphQLString },
      email:    { type: GraphQLString }
    },
    resolve: (obj, args) => remove(obj, args)
  },
  updateUser: {
    type: UserType,
    description: 'Update user details by username or email (returns updated user)',
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      update:   { type: new GraphQLNonNull(UserTypeInput) }
    },
    resolve: (obj, args) => update(obj, args)
  }
};

export default { fields: fields }
