export default class NotFoundError extends Error {
  protected status: number;

  public constructor(message) {
    super(message)

    this.name = 'NotFoundError'
    this.status = 404
  }
}
