import { useState, useEffect } from "react";
import { START, PLAYING, WIN, LOSE } from "./../constants";

let refreshIntervalId;
const useControl = (config) => {
  const [bombs, setBombs] = useState([]);
  const [flags, setFlags] = useState([]);
  const [openedCells, setOpenedCells] = useState([]);
  const [countDown, setCountDown] = useState(config.countDown);
  const [status, setStatus] = useState(START);
  const [lastClickCell, setLastClickCell] = useState(null);

  useEffect(() => {
    return () => clearInterval(refreshIntervalId);
  }, []);

  useEffect(() => {
    if (checkWinner()) {
      winGame();
    }
  }, [openedCells]);

  useEffect(() => {
    if (countDown === 0) {
      endGame();
    }
  }, [countDown]);

  // start game
  const startGame = () => {
    setConfigBoard()
    setStatus(PLAYING);
    startCountDown();
  };

  const setConfigBoard = () => {
    refreshIntervalId && clearInterval(refreshIntervalId)
    setCountDown(config.countDown);
    generateBombs();
  }

  const startCountDown = () => {
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval(() => {
      countDown > 0 && setCountDown((countDown) => countDown - 1);
    }, 1000);
  };

  const generateBombs = () => {
    // create list bombs
    let bombArr = Array(config.vertical)
      .fill(0)
      .map((elem) => Array(config.horizontal).fill(0));

    let bombsCount = 0
    // for (let i = 0; i < config.vertical; i++) {
    //   let bombsPerLine = Math.floor(config.bombTotal / config.vertical) + Math.round(Math.random());
    //   for (let index = 0; index < bombsPerLine; index++) {
    //     if (bombsCount < config.bombTotal) {
    //       let bombPos = Math.floor(Math.random() * config.horizontal);
    //       bombArr[i][bombPos] = "X";
    //       bombsCount ++
    //     }
    //   }
    // }

    while (bombsCount < config.bombTotal) {
      let i =  Math.floor(Math.random() * config.vertical)
      let j =  Math.floor(Math.random() * config.horizontal)

      if (bombArr[i][j] != "X") {
        bombArr[i][j] = "X";
        bombsCount++
      }
    }

    for (let i = 0; i < bombArr.length; i++) {
      for (let j = 0; j < bombArr[i].length; j++) {
        if (bombArr[i][j] !== "X") {
          let sum = 0;

          if (i > 0 && bombArr[i - 1][j] === "X") sum++;
          if (i > 0 && j < bombArr[i].length - 1 && bombArr[i - 1][j + 1] === "X") sum++;
          if (j < bombArr[i].length - 1 && bombArr[i][j + 1] === "X") sum++;
          if (i < bombArr.length - 1 && j < bombArr[i].length - 1 && bombArr[i + 1][j + 1] === "X") sum++;
          if (i < bombArr.length - 1 && bombArr[i + 1][j] === "X") sum++;
          if (i < bombArr.length - 1 && bombArr[i + 1][j - 1] === "X") sum++;
          if (j > 0 && bombArr[i][j - 1] === "X") sum++;
          if (i > 0 && j > 0 && bombArr[i - 1][j - 1] === "X") sum++;

          bombArr[i][j] = sum;
        }
      }
    }
    setBombs(bombArr);

    // create list flag
    let flagsArr = Array(config.vertical)
      .fill(0)
      .map((elem) => Array(config.horizontal).fill(0));
    setFlags(flagsArr);

    // create list cover
    let cover = Array(config.vertical)
      .fill(0)
      .map((elem) => Array(config.horizontal).fill(0));
    setOpenedCells(cover);
  };

  // handle click cell
  const handleClickRightMouse = (e, i, j) => {
    e.preventDefault();
    loseOrWinCannotPlayGame();
    if (openedCells[i][j] === 1) return;
    flags[i][j] = flags[i][j] === 1 ? 0 : 1;
    setFlags([...flags]);
  };
  const handleClickCell = (i, j) => {
    if (flags[i][j] === 1) {
      return false;
    }
    setLastClickCell(`${i},${j}`)
    if (bombs[i][j] === "X") {
      clickToBombs()
      return;
    }
    loseOrWinCannotPlayGame();
    spreadToCells(i, j);
    openedCells[i][j] = 1;
    setOpenedCells([...openedCells]);
  };

  function spreadToCells(i, j) {
    if (
      i < 0 ||
      i > openedCells.length - 1 ||
      j < 0 ||
      j > openedCells[0].length - 1 ||
      openedCells[i][j] === 1 ||
      bombs[i][j] === "X"
    )
      return;

    openedCells[i][j] = 1;

    setOpenedCells([...openedCells]);
    if (bombs[i][j] < 1) {
      spreadToCells(i + 1, j);
      spreadToCells(i + 1, j + 1);
      spreadToCells(i, j + 1);
      spreadToCells(i - 1, j + 1);
      spreadToCells(i - 1, j);
      spreadToCells(i - 1, j - 1);
      spreadToCells(i, j - 1);
      spreadToCells(i + 1, j - 1);
    }
  }

  // after end game
  const clickToBombs = () => {
    setFlags(
      Array(config.vertical)
        .fill(0)
        .map((elem) => Array(config.horizontal).fill(0))
    );
    endGame();
  }

  const loseOrWinCannotPlayGame = () => {
    if (status === LOSE || status === WIN) throw "You lose!";
  };

  const showAllBoard = () => {
    let cover = Array(config.vertical)
      .fill(1)
      .map((elem) => Array(config.horizontal).fill(1));
    setOpenedCells(cover);
  };

  const winGame = () => {
    alert("You win!");
    setStatus(WIN);
    clearInterval(refreshIntervalId);
    showAllBoard();
  };

  const endGame = () => {
    alert("You lose!");
    setStatus(LOSE);
    clearInterval(refreshIntervalId);
    showAllBoard();
  };

  const checkWinner = () => {
    let countButtonRemain = 0;
    for (let i = 0; i < openedCells.length; i++) {
      for (let j = 0; j < openedCells[i].length; j++) {
        if (openedCells[i][j] === 0) countButtonRemain++;
      }
    }

    if (countButtonRemain === config.bombTotal) return true;

    return false;
  };

  return {
    // data
    lastClickCell,
    bombs,
    flags,
    openedCells,
    countDown,
    status,
    // func
    setConfigBoard,
    startGame,
    endGame,
    checkWinner,
    // click cell
    handleClickRightMouse,
    handleClickCell,
  };
};

export default useControl;
