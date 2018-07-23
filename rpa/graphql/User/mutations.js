/** Mutation
  - https://medium.com/@HurricaneJames/graphql-mutations-fb3ad5ae73c4
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
  userTypeInput,
  userType
} from './types.js';

import {
  create,
  remove,
  update
} from './resolvers.js';

export const MutationRootType = new GraphQLObjectType({
  name: 'UserMutation',
  description: 'Root mutation resolvers for User object',
  fields: () => ({
    create: {
      type: userType,
      description: 'Create a new user (returns newly created user)',
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email:    { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (obj, args) => create(obj, args)
    },
    remove: {
      type: userType,
      description: 'Remove a user by username or email (returns removed user)',
      args: {
        username: { type: GraphQLString },
        email:    { type: GraphQLString }
      },
      resolve: (obj, args) => remove(obj, args)
    },
    update: {
      type: userType,
      description: 'Update user details by username or email (returns updated user)',
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        update:   { type: new GraphQLNonNull(userTypeInput) }
      },
      resolve: (obj, args) => update(obj, args)
    }
  })
});
