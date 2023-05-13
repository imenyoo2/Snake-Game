export type direction = "up" | "down" | "right" | "left";

// Move return an array [x, y] after apply dir
export function Move(point: number[], dir: direction): number[] {
  let result = [];
  switch (dir) {
    case "up":
      result.push(point[0]);
      result.push(point[1] - 1); // here because the way the squires rendered is reversed
      break;
    case "down":
      result.push(point[0]);
      result.push(point[1] + 1); // same reason as up
      break;
    case "right":
      result.push(point[0] + 1);
      result.push(point[1]);
      break;
    case "left":
      result.push(point[0] - 1);
      result.push(point[1]);
      break;
  }
  return result;
}

// RelativeMove move relative based on the target movement
// used to move the rest of snake body
export function RelativeMove(
  relative: number[],
  target: number[],
  dir: direction
): [number[], direction] {
  switch (dir) {
    case "up":
    case "down":
      // test if target and relative align vertically
      if (relative[0] == target[0]) {
        return [Move(target, dir), dir];
        // test if relative is at the right of target
        // TODO change the comment above after testing
      } else if (relative[0] > target[0]) {
        return [Move(target, "right"), "right"];
      } else {
        return [Move(target, "left"), "left"];
      }
    case "left":
    case "right":
      if (relative[1] == target[1]) {
        return [Move(target, dir), dir];
      } else if (relative[1] > target[1]) {
        return [Move(target, "down"), "down"];
      } else {
        return [Move(target, "up"), "up"];
      }
  }
}

// x and y have the same length
export function MoveGroup(
  x: number[],
  y: number[],
  dir: direction
): [number[], number[]] {
  //console.log("MoveGroup run...");
  let result: [number[], number[]] = [[], []];
  // handling head point
  let headPoint = [x[0], y[0]];
  const movedHeadPoint = Move(headPoint, dir);
  result[0].push(movedHeadPoint[0]);
  result[1].push(movedHeadPoint[1]);
  let newdir = dir;

  // execlude the last point cuz it's the coord of food
  for (let i = 1; i < x.length - 1; i++) {
    let movedPoint: number[];
    [movedPoint, newdir] = RelativeMove(
      [x[i - 1], y[i - 1]],
      [x[i], y[i]],
      newdir
    );
    result[0].push(movedPoint[0]);
    result[1].push(movedPoint[1]);
  }
  // checking if snake eat food
  if (result[0][0] == x[x.length - 1] && result[1][0] == y[y.length - 1]) {
    //console.log("handling eating....");
    //console.log(x, y);
    //console.log(result);
    result[0].push(x[x.length - 2]);
    result[1].push(y[y.length - 2]);
    // adding a new food
    result[0].push(random(0, 55));
    result[1].push(random(0, 55));
  } else {
    result[0].push(x[x.length - 1]);
    result[1].push(y[y.length - 1]);
  }
  return result;
}

// renderSnakeState return an array of the warm parts with thier
// coordinates configured
export function renderSnakeState(x: number[], y: number[]): JSX.Element[] {
  let result: JSX.Element[] = [];
  for (let i = 0; i < x.length; i++) {
    result.push(
      <div
        key={i}
        className="SnakePart"
        style={{ left: x[i] * 10, top: y[i] * 10 }}
      ></div>
    );
  }
  return result;
}

export function checkEdge(
  x: number,
  y: number,
  action1: any,
  action2: any,
  isMoving: boolean
) {
  //console.log(`x = ${x}, y = ${y}`);
  if (isMoving && (x == -1 || x == 55)) {
    action1(false);
    action2(true);
  }
  if (isMoving && (y == 55 || y == -1)) {
    action1(false);
    action2(true);
  }
}

// checkBody checks if any of SnakeState coordinates is equal
// to the head coordinates, exept for the head of food
export function checkBody(
  SnakeState: [number[], number[]],
  action1: any,
  action2: any,
  isMoving: boolean
) {
  let lastIndex = SnakeState[0].length - 1;

  if (!isMoving) {
    return;
  }
  for (let i = 1; i < lastIndex; i++) {
    if (SnakeState[0][i] == SnakeState[0][0] && SnakeState[1][i] == SnakeState[1][0]) {
      action1(false);
      action2(true);
      return;
    }
  }
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function sleep(ms:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
