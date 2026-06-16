type WaitForScrollEndOptions = {
  expectMovement?: boolean;
  startY?: number;
  stableFrames?: number;
};

export function waitForScrollEnd(
  onDone: () => void,
  {
    expectMovement = false,
    startY = window.scrollY,
    stableFrames = 5,
  }: WaitForScrollEndOptions = {}
) {
  if (!expectMovement) {
    requestAnimationFrame(onDone);
    return;
  }

  let last = window.scrollY;
  let stable = 0;
  let hasMoved = false;

  const tick = () => {
    if (Math.abs(window.scrollY - startY) > 1) {
      hasMoved = true;
    }

    if (window.scrollY !== last) {
      hasMoved = true;
      stable = 0;
      last = window.scrollY;
    } else if (hasMoved) {
      stable += 1;
    }

    if (hasMoved && stable >= stableFrames) {
      onDone();
    } else {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}
