/* eslint fp/no-this:0 */

/*
  - MEDIA_ERR_ABORTED (numeric value 1)
  The fetching process for the media resource was aborted by the user agent at the user's request.

  - MEDIA_ERR_NETWORK (numeric value 2)
  A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.

  - MEDIA_ERR_DECODE (numeric value 3)
  An error of some description occurred while decoding the media resource, after the resource was established to be usable.

  - MEDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
  The media resource indicated by the src attribute or assigned media provider object was not suitable.
*/

/** Class representing a PlayerError. */
export class PlayerError extends Error {
  /**
   * Create a player error.
   *
   * @param  {number} code
   * @param  {string} message
   * @param  {string} fileName
   * @param  {number} lineNumber
   */
  constructor(code, message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = 'PlayerError';
    this.code = code;
  }
}
