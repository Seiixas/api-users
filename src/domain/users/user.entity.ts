import { BaseConstructorProps, Entity } from '../shared/entity/entity';

interface ConstructorProps extends BaseConstructorProps {
  name: string;
  email: string;
  password: string;
  role: any;
}

export class User extends Entity {
  private _name: string;
  private _email: string;
  private _password: string;
  private _role: any;

  constructor(props: ConstructorProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
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

  get role(): any {
    return this._role;
  }

  set role(role: any) {
    this._role = role;
    this._updatedAt = new Date();
  }
}
