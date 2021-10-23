export default class TokenExpiredError extends Error {
  protected status: number;

  public constructor(message) {
    super(message)

    this.name = 'TokenExpired'
    this.status = 401
  }
}
