import React, { useState } from "react";
import classNames from "classnames";
import bombImage from "./assets/images/bomb.png";
import useControl from './controls'
import { START, PLAYING, WIN, LOSE } from './constants'

// styles
import "./App.css";

let defaultConfig = {
  bombTotal: 10,
  v: 10,
  h: 10,
  countDown: 30,
};

function App() {
  const [config, setConfig] = useState(defaultConfig);

  const {
    // data
    bombs,
    openedCells,
    countDown,
    status,
    isLose,
    // event
    startGame,
    endGame,
    checkWinner,
    // click cell
    handleClickRightMouse,
    handleClickCell,
  } = useControl(config)

  return (
    <div className="App">
      <div className="wrapper">
        <section className="wrapper__left">
          {bombs.length > 0 && (
            <div className="board">
              {bombs.map((arr, index) => (
                <div key={index}>
                  {arr.map((elem, i) => (
                    <div
                      onClick={() => handleClickCell(index, i)}
                      onContextMenu={(e) => handleClickRightMouse(e, index, i)}
                      className={classNames({
                        buttonStyle: openedCells[index][i] == 0,
                        openedStyle: openedCells[index][i] != 0,
                      })}
                    >
                      {openedCells[index][i] == 0 ? null : bombs[index][i] == 0 ? (
                        ""
                      ) : bombs[index][i] == "X" ? (
                        <img src={bombImage} className="bombImg" />
                      ) : (
                        bombs[index][i]
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="wrapper__right">
          <p className="score">{countDown}</p>
          {status === LOSE && <p>You lose!</p>}
          {status === WIN && <p>You win!</p>}
          <button className="btnStartGame pointer" onClick={startGame}>
            Start Game
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
