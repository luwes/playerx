import { Playerx } from 'playerx';
import { VideoObject } from 'schema-dts';

export interface PlxSchema extends HTMLElement {

  /**
   * Access to the connected player instance.
   */
  readonly player: Playerx;

  /**
   * Access to the internal data structure.
   */
  readonly data: VideoObject;
}
