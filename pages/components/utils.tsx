type direction = "up" | "down" | "right" | "left"

// render return the whole board with spots highlighted based on x and y
export function Render (x: number[], y: number[]): JSX.Element[] {
  let squirsx: JSX.Element[] = []; // array of the x's of eatch y
  let final: JSX.Element[] = [];
  // initiate squirsx
  for (let i = 0; i < 50; i++) {
    squirsx.push(<div className="cordx"></div>)
  }
  // now we start pushing squirsx inside each y dev
  // we also modify the classNames of each squirsx element based
  // on x and y
  for (let i = 0; i < 50; i++) {
    let n = 1; // track the state of the if statment bellow, we don't want to push the same element twise
    let buffer = [...squirsx]
    for (let j = 0; j < y.length; j++) {
      if (y[j] == i) {
        console.log("loop count", j)
        console.log(x[j], i)
        buffer[x[j]] = <div className="cordx check"></div>
        final[i] = <div className="cordy">{buffer}</div>
        n = 0; // we don't what to push twise
      }
    }
    if (n) {
      final.push(<div className="cordy check">{squirsx}</div>)
    }
  }
  return final
}

// Move return an array [x, y] after apply dir
export function Move(point: number[], dir: direction): number[] {
  let result = []
  switch(dir) {
    case "up":
      result.push(point[0])
      result.push(point[1] - 1) // here because the way the squires rendered is reversed
      break
    case "down":
      result.push(point[0])
      result.push(point[1] + 1) // same reason as up
      break
    case "right":
      result.push(point[0] + 1)
      result.push(point[1])
      break
    case "left":
      result.push(point[0] - 1)
      result.push(point[1])
      break
  }
  return result
}

// RelativeMove move relative based on the target movement
// used to move the rest of worm body
export function RelativeMove (relative: number[], target: number[], dir: direction): number[] {
  switch (dir) {
    case "up":
    case "down":
      // test if target and relative align vertically
      if (relative[0] == target[0]) {
        return Move(target, dir)
      // test if relative is at the right of target
      // TODO change the comment above after testing
      } else if (relative[0] > target[0]) {
        return Move(target, "right")
      } else {
        return Move(target, "left")
      }
    case "left":
    case "right":
      if (relative[1] == target[1]) {
        return Move(target, dir)
      } else if (relative[1] > target[1]) {
        return Move(target, "down")
      } else {
        return Move(target, "up")
      }
  }
}

// x and y have the same length
export function MoveGroup(x: number[], y: number[], dir: direction): [number[], number[]] {
  console.log("starting MoveGroup function")
  let result: [number[], number[]] = [[], []]
  let headPoint = [x[0], y[0]]
  const movedHeadPoint = Move(headPoint, dir)
  result[0].push(movedHeadPoint[0])
  result[1].push(movedHeadPoint[1])

  for (let i = 1; i < x.length; i++) {
    const movedPoint: number[] = RelativeMove([x[i - 1], y[i - 1]], [x[i], y[i]], dir)
    result[0].push(movedPoint[0])
    result[1].push(movedPoint[1])
  }
  return result
}
