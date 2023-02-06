import {Render} from "./utils"
import {Move} from "./utils"

export default function Frame() {
  let squirs = Render(...Move(5, 5, "up"))
  return (
  <>
    <div id="container">
    {squirs}
    </div>
  </>
  )
}
//
