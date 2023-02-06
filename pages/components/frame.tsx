import {Render} from "./utils"
import {MoveGroup} from "./utils"

export default function Frame() {
  //let squirs = Render(...MoveGroup([5, 5, 5], [5, 4, 3], "right"))
  console.log(...MoveGroup([5, 5, 5], [5, 4, 3], "right"))
  let squirs = Render([6, 6, 6], [5, 4, 3])
  //let squirs = Render(...MoveGroup([5, 5, 5], [5, 4, 3], "right"))
  return (
  <>
    <div id="container">
    {squirs}
    </div>
  </>
  )
}
// [ 6, 5, 5 ]
// [ 5, 3, 2 ]
