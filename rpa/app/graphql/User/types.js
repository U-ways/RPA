/** Types
============================================================================= */
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

import GraphQLTimestamp from '../scalars/GraphQLTimestamp.js';

/** Log **/

const ActivityType = new GraphQLEnumType({
  name: 'ActivityType',
  values: {
    Login:  { value: 0 },
    Logout: { value: 1 },
    Create: { value: 2 },
    Read:   { value: 3 },
    Update: { value: 4 },
    Delete: { value: 5 }
  }
});

const LogType = new GraphQLObjectType({
  name: 'LogType',
  fields: () => ({
    activity:    { type: new GraphQLNonNull(ActivityType) },
    date:        { type: GraphQLTimestamp                 },
    description: { type: GraphQLString                    }
  })
});
const LogTypeInput = new GraphQLInputObjectType({
  name: 'LogTypeInput',
  fields: () => ({
    activity:    { type: new GraphQLNonNull(ActivityType) },
    description: { type: GraphQLString                    }
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
    password: { type: GraphQLString },
    email:    { type: GraphQLString }
  })
});
