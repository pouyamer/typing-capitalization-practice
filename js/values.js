// desctructuring config values:

const { allThemes, startingIndex: startingThemeIndex } = config.theme
const { info: lettersInfo, swapMode: lettersSwapMode } = config.letters
const {
  displayAtStart: displayScoreAtStart,
  allowNegative: allowNegativeScore
} = config.score
const {
  amount: scoreMultiplier,
  maxLastingTime_MS: maxLastingScoreMultiplierTime_MS,
  updateInterval_MS: scoreMultiplierUpdateInterval_MS,
  calculateDecayFunction: calculateScoreMultiplierDecayFunction
} = config.score.multiplier

const {
  wrongShift: scoreDecrementAmount_WrongShift,
  wrongLetter: scoreDecrementAmount_WrongLetter,
  timeout: scoreDecrementAmount_TimeOut
} = config.score.decrementation

const { default: scoreIncrementAmount } = config.score.incrementation
