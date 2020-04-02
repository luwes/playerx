/**
 * Should create a fake TimeRange object
 * Mimics an HTML5 time range instance, which has functions that
 * return the start and end times for a range
 * TimeRanges are returned by the buffered() method
 *
 * @param  {(Number|Array)} Start of a single range or an array of ranges
 * @param  {Number} End of a single range
 * @private
 * @method createTimeRanges
 */
export function createTimeRanges(start, end) {
  if (Array.isArray(start)) {
    return createTimeRangesObj(start);
  } else if (start == null || end == null) {
    return createTimeRangesObj([]);
  }
  return createTimeRangesObj([[start, end]]);
}

export { createTimeRanges as createTimeRange };

function createTimeRangesObj(ranges) {
  ranges.start = (i) => ranges[i][0];
  ranges.end = (i) => ranges[i][1];
  return ranges;
}
