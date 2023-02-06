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
    for (let j = 0; j < y.length; j++) {
      if (y[j] == i) {
        let buffer = [...squirsx]
        buffer[x[j]] = <div className="cordx check"></div>
        console.log(buffer)
        final.push(<div className="cordy check">{buffer}</div>)
        n = 0; // we don't what to push twise
        break
      }
    }
    if (n) {
      final.push(<div className="cordy check">{squirsx}</div>)
    }
  }
  return final
}

// Move return an array [x, y] after apply dir
export function Move(x: number, y:number, dir: string): number[] {
  let result: number[] = []
  switch(dir) {
    case "up":
      result.push(x)
      result.push(y - 1) // here because the way the squires rendered is reversed
      break
    case "down":
      result.push(x)
      result.push(y + 1) // same reason as up
      break
    case "right":
      result.push(x + 1)
      result.push(y)
      break
    case "left":
      result.push(x - 1)
      result.push(y)
      break
  }
  return result
}
