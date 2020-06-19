import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import bombImage from "./assets/images/bomb.png";
import bombImageError from "./assets/images/bomb_1.png";
import useControl from "./controls";
import { START, PLAYING, WIN, LOSE, LEVEL } from "./constants";
// styles
import "./App.css";

let defaultConfig = LEVEL.EASY

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const wrapperLeftRef = useRef(null);
  const boardRef = useRef(null);

  useEffect(() => {
    wrapperLeftRef.current.addEventListener("wheel", scrollWrapper);
    return () => {
      wrapperLeftRef.current.removeEventListener("wheel", scrollWrapper);
    };
  }, []);

  useEffect(() => {
    setConfigBoard()
  }, [config]);

  const scrollWrapper = (e) => {
    let diff = 0.1;
    if (boardRef.current) {
      let scale = boardRef.current.style.transform;
      scale = parseFloat(scale.split("scale(")[1].split(")")[0]);

      // range scale
      if (e.deltaY > 0 && scale < 0.3) return;
      if (e.deltaY < 0 && scale > 1) return;

      scale = e.deltaY > 0 ? scale - diff : scale + diff;
      boardRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
  };

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

  const setDifficultLevel = (e) => {
    const level = e.target.value
    if (level === 'CUSTOM') {
      setConfig(Object.assign(config, {

      }))
    } else {
      setConfig(LEVEL[level])
    }
  }

  const {
    // data
    lastClickCell,
    bombs,
    flags,
    openedCells,
    countDown,
    status,
    // event
    setConfigBoard,
    startGame,
    // click cell
    handleClickRightMouse,
    handleClickCell,
  } = useControl(config);

  const boardStyles = {
    width: 48 * config.horizontal,
    height: 48 * config.vertical,
    cursor: "pointer",
    // transform: `scale(1)`,
    transform: `translate(-50%, -50%) scale(${500 / (48 * config.vertical)})`,
    left: "50%",
    top: "50%",
    position: "absolute",
  };

  const cellStyles = {};

  return (
    <div id="app" className="App no-select">
      <div className="wrapper">
        <section className="wrapper__left" ref={wrapperLeftRef}>
          {bombs.length > 0 && (
            <div className="board" style={boardStyles} ref={boardRef}>
              {bombs.map((arr, index) =>
                arr.map((elem, i) => (
                  <div
                    key={`v${index}h${i}`}
                    onClick={() =>
                      status === PLAYING && handleClickCell(index, i)
                    }
                    onContextMenu={(e) => handleClickRightMouse(e, index, i)}
                    styles={cellStyles}
                    className={classNames("board__cell", {
                      buttonStyle: openedCells[index][i] == 0,
                      openedStyle: openedCells[index][i] != 0,
                      buttonFlag: flags[index][i] === 1,
                    })}
                  >
                    {openedCells[index][i] == 0 ? null : bombs[index][i] ==
                      0 ? (
                      ""
                    ) : bombs[index][i] == "X" ? (
                      <img
                        src={
                          lastClickCell != `${index},${i}`
                            ? bombImage
                            : bombImageError
                        }
                        className="bombImg"
                      />
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
          {/* score */}
          <p className="score">{countDown}</p>
          {/* info */}
          {status === LOSE && <p>You lose!</p>}
          {status === WIN && <p>You win!</p>}
          {/* select */}
          <select className="select" onChange={setDifficultLevel}>
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
          </select>
          <br />
          <br />
          {/* start button */}
          <button className="btnStartGame pointer" onClick={startGame}>
            Start Game
          </button>
          <br />
          <br />
          {/* fullname button */}
          <button className="btnStartGame pointer" onClick={handleFullScreen}>
            Full screen
          </button>
        </section>
      </div>
    </div>
  );
}

export default App;
