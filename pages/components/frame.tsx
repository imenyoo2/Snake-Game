import {Render} from "./utils"
import {MoveGroup} from "./utils"
import {direction} from "./utils"
import {useState, useEffect} from "react"

export default function Frame() {
  // the state of the worm
  const [wormState, setWormState] = useState<[number[], number[]]>([[4, 5, 5, 5, 5], [5, 5, 4, 3, 2]])
  const [currentDir, setCurrentDir] = useState<direction>("down")
  console.log(...MoveGroup([4, 5, 5], [5, 5, 4], "up"))
  let squirs = Render(...wormState)

  // change the currentdir of the worm to dir
  const moveWormState = (dir: direction) => {setCurrentDir(dir)}

  useEffect (() => {
    const intervalId = setInterval(() => {
      setWormState(MoveGroup(...wormState, currentDir))
    }, 100);
    return () => {clearInterval(intervalId)}
  }, [wormState])
  
  return (
  <>
    <div className="app">
      <div id="container">
        {squirs}
      </div>
      <div className="controler">
        <button type="button" disabled={currentDir == "down"} onClick={() => moveWormState("up")}>up</button>
        <div className="rightLeft">
          <button type="button"  disabled={currentDir == "right"} onClick={() => moveWormState("left")}>left</button>
          <button type="button" disabled={currentDir == "left"} onClick={() => moveWormState("right")}>right</button>
        </div>
        <button type="button" disabled={currentDir == "up"} onClick={() => moveWormState("down")}>down</button>
      </div>
    </div>
  </>
  )
}
