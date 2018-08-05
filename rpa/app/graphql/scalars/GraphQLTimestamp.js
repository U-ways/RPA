/* GraphQLTimestamp.js
  - What is it?
  GraphQLTimestamp is a more universal representation of time based on the
  Unix Epoch time. (https://en.wikipedia.org/wiki/Unix_time)

  - soruce:
  https://gist.github.com/langpavel/b30f3d507a47713b0c6e89016e4e9eb7
============================================================================= */

// Check Unix Epoch timestamp to understand:
// - https://www.epochconverter.com/

import { Kind } from 'graphql/language';
import { GraphQLScalarType } from 'graphql';

function serializeDate(value) {
  if (value instanceof Date) {
    return value.getTime();
  } else if (typeof value === 'number') {
    return Math.trunc(value);
  } else if (typeof value === 'string') {
    return Date.parse(value);
  }
  return null;
}

function parseDate(value) {
  if (value === null) {
    return null;
  }

  try {
    return new Date(value);
  } catch (err) {
    return null;
  }
}

function parseDateFromLiteral(ast) {
  if (ast.kind === Kind.INT) {
    const num = parseInt(ast.value, 10);
    return new Date(num);
  } else if (ast.kind === Kind.STRING) {
    return parseDate(ast.value);
  }
  return null;
}

const TimestampType = new GraphQLScalarType({
  name: 'Timestamp',
  description:
    'The javascript `Date` as integer. Type represents date and time ' +
    'as number of milliseconds from start of UNIX epoch.',
  serialize: serializeDate,
  parseValue: parseDate,
  parseLiteral: parseDateFromLiteral,
});

export default TimestampType;
