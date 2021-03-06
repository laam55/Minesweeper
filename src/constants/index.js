export const START = 'START'
export const PLAYING = 'PLAYING'
export const WIN = 'WIN'
export const LOSE = 'LOSE'

export const LEVEL = {
  EASY: {
    bombTotal: 10,
    vertical: 8,
    horizontal: 10,
    countDown: 25,
  },
  MEDIUM: {
    bombTotal: 26,
    vertical: 14,
    horizontal: 18,
    countDown: 75,
  },
  HARD: {
    bombTotal: 99,
    vertical: 20,
    horizontal: 20,
    countDown: 300,
  },
  SHARD: {
    bombTotal: 256,
    vertical: 32,
    horizontal: 32,
    countDown: 600,
  },
}