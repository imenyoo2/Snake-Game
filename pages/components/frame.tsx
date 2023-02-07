import {Render} from "./utils"
import {MoveGroup} from "./utils"
import {direction} from "./utils"
import React from "react"

export default function Frame() {
  // the state of the worm
  const [wormState, setWromState] = React.useState<[number[], number[]]>([[4, 5, 5, 5, 5], [5, 5, 4, 3, 2]])
  //let squirs = Render(...MoveGroup([5, 5, 5], [5, 4, 3], "right"))
  console.log(...MoveGroup([4, 5, 5], [5, 5, 4], "up"))
  let squirs = Render(...wormState)
  //let squirs = Render(...MoveGroup(...MoveGroup([5, 5, 5], [5, 4, 3], "left"), "up"))
  //let squirs = Render(...MoveGroup([4, 5, 5], [5, 5, 4], "up"))
  const moveWormState = (dir: direction) => {setWromState(MoveGroup(...wormState, dir))}
  return (
  <>
    <div id="container">
    {squirs}
    </div>
    <div>
      <button type="button" onClick={() => moveWormState("left")}>left</button>
      <button type="button" onClick={() => moveWormState("up")}>up</button>
      <button type="button" onClick={() => moveWormState("down")}>down</button>
      <button type="button" onClick={() => moveWormState("right")}>right</button>
    </div>
  </>
  )
}

//[ 4, 5, 5 ]
//[ 5, 5, 4 ]
// -> up
//[ 4, 4, 5 ] -> [4, 4, 5]
//[ 4, 5, 3 ] -> [4, 5, 5]
