
export interface Playerx extends HTMLElement {

  /**
   * Returns a `TimeRanges` object that indicates the ranges of the media source
   * that the browser has buffered (if any) at the moment the buffered property
   * is accessed.
   */
  readonly buffered: TimeRanges;

  /**
   * Returns a DOMString with the absolute URL of the chosen media resource.
   */
  readonly currentSrc: string;

  /**
   * A read-only double-precision floating-point value indicating the total
   * duration of the media in seconds. If no media data is available, the
   * returned value is `NaN`. If the media is of indefinite length (such as
   * streamed live media, a WebRTC call's media, or similar), the value
   * is `+Infinity`.
   */
  readonly duration: number;

  /**
   * Returns a `Boolean` that indicates whether the media element has
   * finished playing.
   */
  readonly ended: boolean;

  /**
   * Returns a `Boolean` that indicates whether the media element is paused.
   */
  readonly paused: boolean;

  /**
   * Returns an unsigned integer value indicating the intrinsic height of
   * the resource in CSS pixels, or 0 if no media is available yet.
   */
  readonly videoHeight: number;

  /**
   * Returns an unsigned integer value indicating the intrinsic width of
   * the resource in CSS pixels, or 0 if no media is available yet.
   */
  readonly videoWidth: number;

  /**
   * Is a `Number` that can set the preferred aspect ratio for the player.
   */
  aspectRatio: number;

  /**
   * A `Boolean` that reflects the autoplay HTML attribute, indicating whether
   * playback should automatically begin as soon as enough media is available
   * to do so without interruption.
   */
  autoplay: boolean;

  /**
   * Is a Boolean that reflects the controls HTML attribute, indicating whether
   * user interface items for controlling the resource should be displayed.
   */
  controls: boolean;

  /**
   * A double-precision floating-point value indicating the current playback
   * time in seconds; if the media has not started to play and has not been
   * seeked, this value is the media's initial playback time. Setting this
   * value seeks the media to the new time. The time is specified relative to
   * the media's timeline.
   */
  currentTime: number;

  /**
   * Is a DOMString that reflects the height HTML attribute, which specifies
   * the height of the display area, in CSS pixels.
   */
  height: number;

  /**
   * A `Boolean` that reflects the loop HTML attribute, which indicates whether
   * the media element should start over when it reaches the end.
   */
  loop: boolean;

  /**
   * Is a `Boolean` that determines whether audio is muted.
   * `true` if the audio is muted and `false` otherwise.
   */
  muted: boolean;

  /**
   * Is a double that indicates the rate at which the media is being played back.
   */
  playbackRate: number;

  /**
   * Is a `Boolean` that reflects the playing HTML attribute, that can play
   * and pause playback.
   */
  playing: boolean;

  /**
   * A Boolean attribute indicating that the video is to be played "inline",
   * that is within the element's playback area. Note that the absence of
   * this attribute does not imply that the video will always be played
   * in fullscreen.
   */
  playsinline: boolean;

  /**
   * Is a `DOMString` that reflects the preload HTML attribute, indicating what
   * data should be preloaded, if any. Possible values are: `none`, `metadata`,
   * `auto`.
   */
  preload: string;

  /**
   * Is a `String` that reflects the src HTML attribute, which contains
   * the URL of a media resource to use.
   */
  src: string;

  videoId: string;
  videoTitle: string;

  /**
   * Is a double indicating the audio volume, from 0.0 (silent) to 1.0 (loudest).
   */
  volume: number;

  /**
   * Is a DOMString that reflects the width HTML attribute, which specifies
   * the width of the display area, in CSS pixels.
   */
  width: string;

  /**
   * Begins playback of the media.
   */
  play(): Promise<void>;

  /**
   * Pauses the media playback.
   */
  pause(): void;

  /**
   * Resets the media to the beginning and selects the best available source
   * from the sources provided using the src attribute or the <source> element.
   */
  load(): Promise<void>;
}
