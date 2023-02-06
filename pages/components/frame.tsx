import {Render} from "./utils"
import {Move} from "./utils"

export default function Frame() {
  let squirs = Render([5], [5])
  return (
  <>
    <div id="container">
    {squirs}
    </div>
  </>
  )
}
//
