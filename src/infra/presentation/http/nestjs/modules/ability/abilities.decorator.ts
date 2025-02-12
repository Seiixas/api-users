import { SetMetadata } from '@nestjs/common';
import { Actions, Subjects } from './ability.factory';

export const RULES = 'rules';

export interface RequiredRules {
  action: Actions;
  subjects: Subjects;
}

export const Roles = (...requirements: RequiredRules[]) =>
  SetMetadata(RULES, requirements as RequiredRules[]);
