export default class ForbiddenError extends Error {
  protected status: number;

  public constructor(message) {
    super(message)

    this.name = 'ForbiddenError'
    this.status = 403
  }
}
