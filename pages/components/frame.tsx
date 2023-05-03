import { MoveGroup, direction, renderWormState } from "./utils";
import { useState, useEffect } from "react";

// Frame is basically the whole app Component, i probably should've
// made it into different components but i didn't notice until i
// finished lol
export default function Frame() {
  // the state of the worm
  const [wormState, setWormState] = useState<[number[], number[]]>([
    [1, 1, 2],
    [1, 2, 2],
  ]);
  const [currentDir, setCurrentDir] = useState<direction>("down");
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [isMoving, setIsMoving] = useState<number>(0);
  console.log(...MoveGroup([4, 5, 5], [5, 5, 4], "up"));
  let wormparts = renderWormState(...wormState);

  // change the currentdir of the worm to dir
  const moveWormState = (dir: direction) => {
    setCurrentDir(dir);
  };

  // implementing constant movement of the worm, by setting a function
  // that get called every 200 ms and wormState according to currentDir
  useEffect(() => {
    if (isMoving) {
      const id = setInterval(() => {
          setWormState(MoveGroup(...wormState, currentDir));
        }, 200);
      setIntervalId(id);
      console.log("intervalId have changed: ", intervalId);
    } else {
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
            disabled={currentDir == "down"}
            onClick={() => moveWormState("up")}
          >
            up
          </button>
          <div className="rightLeft">
            <button
              type="button"
              disabled={currentDir == "right"}
              onClick={() => moveWormState("left")}
            >
              left
            </button>
            <button
              type="button"
              disabled={currentDir == "left"}
              onClick={() => moveWormState("right")}
            >
              right
            </button>
          </div>
          <button
            type="button"
            disabled={currentDir == "up"}
            onClick={() => moveWormState("down")}
          >
            down
          </button>
        </div>
        <button type="button" onClick={() => setIsMoving(0)}>
          stop
        </button>
        <button type="button" onClick={() => setIsMoving(1)}>
          start
        </button>
      </div>
    </>
  );
}
