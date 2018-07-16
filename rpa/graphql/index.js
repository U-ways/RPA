// Nice example of GraphQL structuring:
// - https://goo.gl/e7Zp4Q
// - https://goo.gl/UJXbSQ

import graphqlHTTP from 'express-graphql';
import StoreSchema from './types/Store.js';

const API = graphqlHTTP({
  schema: StoreSchema,
  graphiql: true,
});

export default API;
