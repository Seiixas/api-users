import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { EUserRoles, User } from '@/domain/users';

export enum Actions {
  READ = 'READ',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  READ_ANY = 'READ_ANY',
  EDIT_ANY = 'EDIT_ANY',
  EDIT_ALL = 'EDIT_ALL',
  DELETE_ANY = 'DELETE_ANY',
}

const ADMIN_ACTIONS = [Actions.CREATE, Actions.EDIT_ALL];
const MANAGER_ACTIONS = [
  Actions.READ_ANY,
  Actions.EDIT_ANY,
  Actions.DELETE_ANY,
];
const STANDARD_ACTIONS = [Actions.EDIT, Actions.READ, Actions.DELETE];

export type Subjects = InferSubjects<typeof User> | 'all';
export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    switch (user.role) {
      case EUserRoles.ADMIN:
        can([...STANDARD_ACTIONS, ...MANAGER_ACTIONS, ...ADMIN_ACTIONS], 'all');
        break;
      case EUserRoles.MANAGER:
        can([...STANDARD_ACTIONS, ...MANAGER_ACTIONS], User);
        break;
      case EUserRoles.STANDARD:
        can(STANDARD_ACTIONS, User, { id: user.id });
        break;
    }

    const ability = build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });

    return ability;
  }
}
