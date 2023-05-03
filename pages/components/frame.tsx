import { MoveGroup, direction, renderWormState } from "./utils";
import { useState, useEffect } from "react";

// Frame is basically the whole app Component, i probably should've
// made it into different components but i didn't notice until i
// finished lol
export default function Frame() {
  // the state of the worm
  const [wormState, setWormState] = useState<[number[], number[], direction]>([
    [1, 1, 2],
    [1, 2, 2],
    "down",
  ]);
  console.log(wormState);
  //const [currentDir, setCurrentDir] = useState<direction>("down");
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  // console.log(...MoveGroup([4, 5, 5], [5, 5, 4], "up"));
  let wormparts = renderWormState(wormState[0], wormState[1]);

  // change the currentdir of the worm to dir
  const moveWormState = (dir: direction) => {
    setWormState((currentValue) => [currentValue[0], currentValue[1], dir]);
  };

  // implementing constant movement of the worm, by setting a function
  // that get called every 200 ms and wormState according to currentDir
  useEffect(() => {
    if (isMoving) {
    const id = setInterval(() => {
      setWormState((currentValue) => [...MoveGroup(...currentValue), currentValue[2]]);
    }, 200);
    setIntervalId(id);
    }
    else {
      clearInterval(intervalId);
    }
  }, [isMoving]);

  return (
    <>
      <div className="app">
        <div id="container">{wormparts}</div>
        <div className="controler">
          <button
            type="button"
            disabled={wormState[2] == "down"}
            onClick={() => moveWormState("up")}
          >
            up
          </button>
          <div className="rightLeft">
            <button
              type="button"
              disabled={wormState[2] == "right"}
              onClick={() => moveWormState("left")}
            >
              left
            </button>
            <button
              type="button"
              disabled={wormState[2] == "left"}
              onClick={() => moveWormState("right")}
            >
              right
            </button>
          </div>
          <button
            type="button"
            disabled={wormState[2] == "up"}
            onClick={() => moveWormState("down")}
          >
            down
          </button>
        </div>
        <button type="button" onClick={() => setIsMoving(false)}>
          stop
        </button>
        <button type="button" onClick={() => setIsMoving(true)}>
          start
        </button>
      </div>
    </>
  );
}
