/* eslint fp/no-this:0 */
export class PlayerError extends Error {
  constructor(code, ...params) {
    super(...params);
    this.name = 'PlayerError';
    this.code = code;
  }
}
