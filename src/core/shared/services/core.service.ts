export abstract class CoreService<REQ, RES> {
  abstract execute(data: REQ): Promise<RES>;
}
