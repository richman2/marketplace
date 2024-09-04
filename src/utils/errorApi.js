export default class ErrorApi extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status || 500;
    this.isOperational = true;
  }
}
