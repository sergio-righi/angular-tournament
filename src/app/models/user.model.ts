export class User {
  static default = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  }

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public username: string,
    public password: string
  ) { }
}
