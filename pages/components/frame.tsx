import { MoveGroup, direction, renderSnakeState, checkEdge } from "./utils";
import { useState, useEffect } from "react";
import LostWindow from "./LostWindow"

// Frame is basically the whole app Component, i probably should've
// made it into different components but i didn't notice until i
// finished lol
export default function Frame() {
  // the state of the snake
  const [snakeState, setSnakeState] = useState<[number[], number[], direction]>([
    [1, 1, 2, 30],
    [1, 2, 2, 35],
    "down",
  ]);
  console.log(snakeState);
  //const [currentDir, setCurrentDir] = useState<direction>("down");
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [isLost, setIsLost] = useState<boolean>(false);
  // console.log(...MoveGroup([4, 5, 5], [5, 5, 4], "up"));
  checkEdge(snakeState[0][0], snakeState[1][0], setIsMoving, setIsLost, isMoving);

  let snakeparts = renderSnakeState(snakeState[0], snakeState[1]);

  // change the currentdir of the snake to dir
  const moveSnakeState = (dir: direction) => {
    setSnakeState((currentValue) => [currentValue[0], currentValue[1], dir]);
  };

  // implementing constant movement of the snake, by setting a function
  // that get called every 200 ms and snakeState according to currentDir
  useEffect(() => {
    if (isMoving) {
    const id = setInterval(() => {
      setSnakeState((currentValue) => [...MoveGroup(...currentValue), currentValue[2]]);
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
        <div id="container">
        {isLost ? <LostWindow/> : snakeparts}
        </div>
        <div className="controler">
          <button
            type="button"
            disabled={snakeState[2] == "down"}
            onClick={() => moveSnakeState("up")}
          >
            up
          </button>
          <div className="rightLeft">
            <button
              type="button"
              disabled={snakeState[2] == "right"}
              onClick={() => moveSnakeState("left")}
            >
              left
            </button>
            <button
              type="button"
              disabled={snakeState[2] == "left"}
              onClick={() => moveSnakeState("right")}
            >
              right
            </button>
          </div>
          <button
            type="button"
            disabled={snakeState[2] == "up"}
            onClick={() => moveSnakeState("down")}
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
