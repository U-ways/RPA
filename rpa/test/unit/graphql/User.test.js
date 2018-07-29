import { expect }   from 'chai';
import { UserType } from '../../../graphql/User/types';
import { QueryRootType, MutationRootType } from '../../../graphql';

export function types() {
  let user = UserType.getFields();
  for (let field in user) {
    let type = user[field].type;
    switch (field) {
      case 'username':
      case 'email':
        expect(type, 'username | email').to.match(/^String!$/);
      break;
      case 'logs':
        expect(type, 'logs').to.match(/^\[LogType\]$/);
      break;
    }
  }
}
