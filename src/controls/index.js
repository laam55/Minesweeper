import { useState, useEffect } from "react";
import { START, PLAYING, WIN, LOSE } from "./../constants";

let refreshIntervalId;
const useControl = (config) => {
  const [bombs, setBombs] = useState([]);
  const [flags, setFlags] = useState([]);
  const [openedCells, setOpenedCells] = useState([]);
  const [countDown, setCountDown] = useState(config.countDown);
  const [status, setStatus] = useState(START);

  useEffect(() => {
    return () => clearInterval(refreshIntervalId);
  }, []);

  useEffect(() => {
    if (checkWinner()) {
      setStatus(WIN);
      clearInterval(refreshIntervalId);
    }
  }, [openedCells]);

  useEffect(() => {
    if (countDown === 0) {
      setStatus(LOSE);
      clearInterval(refreshIntervalId);
    }
  }, [countDown]);

  const startCountDown = () => {
    if (refreshIntervalId) clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval(() => {
      countDown > 0 && setCountDown((countDown) => countDown - 1);
    }, 1000);
  };

  const startGame = () => {
    setCountDown(config.countDown);
    setStatus((status) => {
      startCountDown();
      generateBombs();
      return PLAYING;
    });
  };

  const loseOrWinCannotPlayGame = () => {
    if (status === LOSE || status === WIN) throw "You lose!";
  };

  const generateBombs = () => {
    let bombArr = Array(config.vertical)
      .fill(0)
      .map((elem) => Array(config.horizontal).fill(0));
    let flagsArr = Array(config.vertical)
      .fill(0)
      .map((elem) => Array(config.horizontal).fill(0));

    const bombsPerLine = Math.ceil(config.bombTotal / config.vertical);
    for (let i = 0; i < config.vertical; i++) {
      for (let index = 0; index < bombsPerLine; index++) {
        let bombPos = Math.floor(Math.random() * config.horizontal);
        bombArr[i][bombPos] = "X";
      }
    }

    for (let i = 0; i < bombArr.length; i++) {
      for (let j = 0; j < bombArr[i].length; j++) {
        if (bombArr[i][j] !== "X") {
          let sum = 0;

          if (i > 0 && bombArr[i - 1][j] === "X") sum++;
          if (i < bombArr.length - 1 && bombArr[i + 1][j] === "X") sum++;
          if (j < bombArr.length - 1 && bombArr[i][j + 1] === "X") sum++;
          if (j > 0 && bombArr[i][j - 1] === "X") sum++;
          if (i < bombArr.length - 1 && j > 0 && bombArr[i + 1][j - 1] === "X")
            sum++;
          if (
            i < bombArr.length - 1 &&
            j < bombArr.length - 1 &&
            bombArr[i + 1][j + 1] === "X"
          )
            sum++;
          if (i > 0 && j > 0 && bombArr[i - 1][j - 1] === "X") sum++;
          if (i > 0 && j < bombArr.length - 1 && bombArr[i - 1][j + 1] === "X")
            sum++;

          bombArr[i][j] = sum;
        }
      }
    }
    setBombs(bombArr);
    setFlags(flagsArr);

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
    if (bombs[i][j] === "X") {
      setFlags(
        Array(config.vertical)
          .fill(0)
          .map((elem) => Array(config.horizontal).fill(0))
      );
      showAllBoard();
      endGame();
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
  const showAllBoard = () => {
    let cover = Array(config.vertical)
      .fill(1)
      .map((elem) => Array(config.horizontal).fill(1));
    setOpenedCells(cover);
  };

  const endGame = () => {
    setStatus(LOSE);
    clearInterval(refreshIntervalId);
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
    bombs,
    flags,
    openedCells,
    countDown,
    status,
    startGame,
    endGame,
    checkWinner,
    // click cell
    handleClickRightMouse,
    handleClickCell,
  };
};

export default useControl;
