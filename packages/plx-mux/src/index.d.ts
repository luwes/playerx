import { Playerx } from 'playerx';
import { VideoObject } from 'schema-dts';

export interface PlxMux extends HTMLElement {

  /**
   * Access to the connected player instance.
   */
  readonly player: Playerx;
}
