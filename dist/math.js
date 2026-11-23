export const clamp = (value, lower = 0, upper = 1) =>
  Math.min(upper, Math.max(lower, value));

// A comfortable thumb–index spread can reach full bloom without overextending.
// A user's explicit calibration always takes precedence over this starter range.
export const defaultRange = { closed: 0.09, open: 0.89 };

export function pinchRatio(landmarks, aspect = 4 / 3) {
  const distance = (a, b) => Math.hypot(
    (landmarks[a].x - landmarks[b].x) * aspect,
    landmarks[a].y - landmarks[b].y
  );
  const palmSize = Math.max(0.03, distance(5, 17), 0.8 * distance(0, 9));
  return distance(4, 8) / palmSize;
}

export function progressFromRatio(ratio, closed, open) {
  return clamp((ratio - closed) / (open - closed));
}

// Keep a small margin on the starter range; use measured endpoints exactly.
export function fullBloomThreshold({closed, open}, calibrated = false) {
  if (calibrated) return open;
  return closed + (open - closed) * 0.88;
}

// Tip landmarks represent estimated centers, not the touching skin surfaces.
// Keep the former full-open endpoint; remap the entire interval continuously.
export function closedBloomThreshold(range, calibrated = false) {
  if (range.closedMeasured) return range.closed;
  return Math.min(Math.max(range.closed, .20), fullBloomThreshold(range, calibrated) - .25);
}

export function rangeWithClosed(range, ratio, calibrated = false) {
  const measured = calibratedRange(ratio, fullBloomThreshold(range, calibrated));
  return measured ? {...measured, closedMeasured:true} : null;
}

export function gestureProgress(ratio, range, calibrated = false) {
  // Never retain the greatest observed ratio: an occlusion/tilt outlier must
  // not permanently raise the target and leave a normally open hand at 73%.
  return progressFromRatio(ratio, closedBloomThreshold(range, calibrated), fullBloomThreshold(range, calibrated));
}

export function calibratedRange(closed, open) {
  if(!Number.isFinite(closed)||!Number.isFinite(open)||closed<0||open-closed<.25)return null;
  return {closed,open};
}

export function median(samples) {
  const ordered = [...samples].sort((a, b) => a - b);
  return ordered[Math.floor(ordered.length / 2)];
}

export function stableProgress(previous, next) {
  if (next === 0 || next === 1) return next;
  const margin = 0.009;
  return clamp(previous, next - margin, next + margin);
}

export function smooth(current, target, dt, maxSpeed = Infinity) {
  const elapsed = clamp(dt, 0, 0.05);
  if (elapsed === 0) return current;
  const change = (target - current) * (1 - Math.exp(-elapsed / 0.115));
  return current + clamp(change, -maxSpeed * elapsed, maxSpeed * elapsed);
}

// The source video lingers on the bud and the fully open flower.
export function bloomFrame(progress) {
  const stops = [[0, 0], [0.10, 23], [0.50, 57], [0.90, 74], [0.98, 86], [1, 95]];
  for (let i = 1; i < stops.length; i++) {
    const [end, last] = stops[i];
    if (progress <= end) {
      const [start, first] = stops[i - 1];
      return Math.round(first + (last - first) * (progress - start) / (end - start));
    }
  }
  return 95;
}
