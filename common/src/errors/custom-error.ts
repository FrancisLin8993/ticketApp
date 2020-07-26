/**
 * The base class of various custom error classes
 * Extends the basic Error class
 */
export abstract class CustomError extends Error {
  //The HTTP status code should returned
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    //Extend a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  //Convert the info from the Error object into the structure of the error messages sent to client
  abstract serializeErrors(): { message: String; field?: string }[];
}
