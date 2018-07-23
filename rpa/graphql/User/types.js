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

import GraphQLTimestamp from '../_scalars/GraphQLTimestamp.js';

/** Log **/

// https://graphql.org/graphql-js/type/#graphqlenumtype
const activityType = new GraphQLEnumType({
  name: 'activity',
  values: {
    Login:  { value: 0 },
    Logout: { value: 1 },
    Create: { value: 2 },
    Read:   { value: 3 },
    Update: { value: 4 },
    Delete: { value: 5 }
  }
});

const logType = new GraphQLObjectType({
  name: 'log',
  fields: () => ({
    activity:    { type: new GraphQLNonNull(activityType) },
    date:        { type: GraphQLTimestamp                 },
    description: { type: GraphQLString                    }
  })
});
const logTypeInput = new GraphQLInputObjectType({
  name: 'logInput',
  fields: () => ({
    activity:    { type: new GraphQLNonNull(activityType) },
    description: { type: GraphQLString                    }
  })
});

/** User **/

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email:    { type: new GraphQLNonNull(GraphQLString) },
    logs:     { type: new GraphQLList(logType)          }
  })
});
export const userTypeInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: () => ({
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email:    { type: GraphQLString }
  })
});
