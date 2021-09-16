import { Playerx } from 'playerx';

export interface PlxMux extends HTMLElement {

  /**
   * Access to the connected player instance.
   */
  readonly player: Playerx;
}
