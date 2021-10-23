export default class UnprocessableEntityError extends Error {
  protected status: number;

  public constructor(message) {
    super(message)

    this.name = 'UnprocessableEntityError'
    this.status = 422
  }
}
