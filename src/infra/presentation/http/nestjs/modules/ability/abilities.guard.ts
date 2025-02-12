import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';
import { RULES, RequiredRules } from './abilities.decorator';
import { ForbiddenError } from '@casl/ability';
import { UserProfileService } from 'src/core/modules/users/service';
import { User } from 'src/domain/users';
import { USER_NOT_FOUND_ERROR } from 'src/core/modules/users/errors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly userProfileService: UserProfileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRules[]>(RULES, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const userRequested = new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: undefined,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    const targetUserId = request.params?.id;

    try {
      const ability = this.caslAbilityFactory.defineAbility(userRequested);

      if (targetUserId) {
        const targetUser = await this.userProfileService.execute({
          id: targetUserId,
        });

        rules.forEach((rule) =>
          ForbiddenError.from(ability).throwUnlessCan(rule.action, targetUser),
        );
      } else {
        rules.forEach((rule) =>
          ForbiddenError.from(ability).throwUnlessCan(
            rule.action,
            rule.subjects,
          ),
        );
      }

      return true;
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(
          'Você não tem permissão para realizar esta ação.',
        );
      }
      if (err === USER_NOT_FOUND_ERROR) throw err;

      throw err;
    }
  }
}
