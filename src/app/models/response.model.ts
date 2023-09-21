export class ResponseModel<T> {
  constructor(
    public status: number,
    public payload: T
  ) { }
}
