export default class UnauthorizedError extends Error {
  protected status: number;

  public constructor(message) {
    super(message)

    this.name = 'UnauthorizedError'
    this.status = 401
  }
}
