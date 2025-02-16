import * as ejs from 'ejs';
import * as path from 'path';

import { CachePort } from '@/core/ports/cache.port';
import { MailPort } from '@/core/ports/mail.port';
import { StoragePort } from '@/core/ports/storage.port';
import { Env } from '@/shared/env';

import { HasherPort } from '../../../../../core/ports';
import { CoreService } from '../../../../../core/shared/services/core.service';
import { EUserRoles, User, UserRepository } from '../../../../../domain/users';
import { PASSWORD_SIZE_ERROR, USER_ALREADY_EXISTS_ERROR } from '../../errors';

type Request = {
  name: string;
  email: string;
  password: string;
  avatar?: Express.Multer.File;
  role?: EUserRoles;
};

type Response = User;

export class CreateUserService implements CoreService<Request, Response> {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hasherPort: HasherPort,
    private readonly storagePort: StoragePort,
    private readonly mailPort: MailPort,
    private readonly cachePort: CachePort,
  ) {}

  async execute(payload: Request): Promise<Response> {
    if (payload.password.length < 8) {
      throw PASSWORD_SIZE_ERROR;
    }

    const userAlreadyExists = await this.usersRepository.find({
      where: { email: payload.email },
    });

    if (userAlreadyExists) {
      throw USER_ALREADY_EXISTS_ERROR;
    }

    const hashedPassword = await this.hasherPort.hash(payload.password);

    const user = new User({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      ...(payload.role && { role: payload.role }),
    });

    if (payload.avatar) {
      const avatarUrl = await this.storagePort.putFile({
        file: payload.avatar.buffer,
        filename: `${user.id}-${new Date().toISOString()}.png`,
        contentType: payload.avatar.mimetype,
        isPublic: true,
        contentDisposition: 'inline; filename=filename.png',
      });
      user.avatar = avatarUrl;
    }

    await this.usersRepository.store(user);

    const welcomeMailTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'assets',
      'mail-templates',
      'welcome.ejs',
    );

    const activationCode = crypto.randomUUID().split('-')[0];

    const ONE_HOURS_IN_SECONDS = 60 * 60;
    this.cachePort.set(activationCode, user.id, ONE_HOURS_IN_SECONDS);

    const emailBody = await ejs.renderFile(welcomeMailTemplate, {
      link: `${Env.SERVER_URL}/users/activate/${activationCode}`,
    });

    this.mailPort.sendMail({
      to: user.email,
      subject: `Bem-vindo, ${user.name}! Ative sua conta`,
      body: emailBody,
    });

    return user;
  }
}
