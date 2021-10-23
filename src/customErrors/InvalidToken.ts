export default class InvalidTokenError extends Error {
  protected status: number;

  public constructor(message) {
    super(message)

    this.name = 'InvalidToken'
    this.status = 400
  }
}
