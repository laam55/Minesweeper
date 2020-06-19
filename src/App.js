import React, { useState } from "react";
import classNames from "classnames";
import bombImage from "./assets/images/bomb.png";
import useControl from "./controls";
import { START, PLAYING, WIN, LOSE } from "./constants";

// styles
import "./App.css";

let defaultConfig = {
  bombTotal: 10,
  vertical: 10,
  horizontal: 10,
  countDown: 30,
};

function App() {
  const [config, setConfig] = useState(defaultConfig);

  const handleFullScreen = () => {
    var element = document.getElementById("app");
    openFullscreen(element);
  };

  function openFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  const {
    // data
    bombs,
    flags,
    openedCells,
    countDown,
    status,
    // event
    startGame,
    endGame,
    checkWinner,
    // click cell
    handleClickRightMouse,
    handleClickCell,
  } = useControl(config);

  const boardStyles = {
    width: 48 * config.horizontal,
    height: 48 * config.vertical,
    cursor: 'pointer',
    // transform: `scale(${568 / (48 * config.vertical)})`,
    margin: '0 auto'
  };

  const cellStyles = {

  };

  return (
    <div id="app" className="App no-select">
      <div className="wrapper">
        <section className="wrapper__left">
          {bombs.length > 0 && (
            <div className="board" style={boardStyles}>
              {bombs.map((arr, index) =>
                arr.map((elem, i) => (
                  <div
                    key={`v${index}h${i}`}
                    onClick={() => status === PLAYING && handleClickCell(index, i)}
                    onContextMenu={(e) => handleClickRightMouse(e, index, i)}
                    styles={cellStyles}
                    className={classNames('board__cell', {
                      buttonStyle: openedCells[index][i] == 0,
                      openedStyle: openedCells[index][i] != 0,
                      buttonFlag: flags[index][i] === 1,
                    })}
                  >
                    {openedCells[index][i] == 0 ? null : bombs[index][i] ==
                      0 ? (
                      ""
                    ) : bombs[index][i] == "X" ? (
                      <img src={bombImage} className="bombImg" />
                    ) : (
                      <span className={`num${bombs[index][i]}`}>
                        {bombs[index][i]}
                      </span>
                    )}
                  </div>
                ))
              )}
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
          <br />
          <br />
          <button className="btnStartGame pointer" onClick={handleFullScreen}>
            Full screen
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
