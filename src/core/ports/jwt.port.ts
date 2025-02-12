export abstract class JwtPort {
  abstract sign(payload: any): string;
  abstract verify(token: string): boolean;
  abstract decode(token: string): { id: string };
}
