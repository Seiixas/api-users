import { BaseConstructorProps, Entity } from '../shared/entity/entity';

export enum EUserRoles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STANDARD = 'STANDARD',
}

export interface UserProps extends BaseConstructorProps {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role?: EUserRoles;
}

export class User extends Entity {
  private _name: string;
  private _email: string;
  private _password: string;
  private _avatar?: string;
  private _role: EUserRoles;

  constructor(props: UserProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._avatar = props.avatar;
    this._role = props.role || EUserRoles.STANDARD;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    this._updatedAt = new Date();
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
    this._updatedAt = new Date();
  }

  get password(): string {
    return this._password;
  }

  set password(password: string) {
    this._password = password;
    this._updatedAt = new Date();
  }

  get role(): EUserRoles {
    return this._role;
  }

  set role(role: EUserRoles) {
    this._role = role;
    this._updatedAt = new Date();
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  set avatar(avatar: string | undefined) {
    this._avatar = avatar;
    this._updatedAt = new Date();
  }

  get allProps(): UserProps {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      avatar: this._avatar,
      password: this._password,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
