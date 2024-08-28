export default class ErrorApi extends Error {
  constructor(message, status) {
    super(message);
    this.status = status || 500;
  }
}
