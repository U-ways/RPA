/** Types
============================================================================= */

import GraphQLTimestamp from '../scalars/GraphQLTimestamp.js';

import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql/type';

/** Log **/

const LogType = new GraphQLObjectType({
  name: 'LogType',
  fields: () => ({
    activity:    { type: new GraphQLNonNull(GraphQLString) },
    date:        { type: GraphQLTimestamp                  },
    description: { type: GraphQLString                     }
  })
});

/** User **/

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    email:    { type: new GraphQLNonNull(GraphQLString) },
    logs:     { type: new GraphQLList(LogType)          }
  })
});
export const UserTypeInput = new GraphQLInputObjectType({
  name: 'UserTypeInput',
  fields: () => ({
    username: { type: GraphQLString },
    email:    { type: GraphQLString },
    password: { type: GraphQLString },
  })
});
