// DOM Elements:
const letterEl = document.querySelector(".letter p")

const scoreMultiplierBarEl = document.querySelector(".score-multiplier")
const leftIndicatorEl = document.querySelector(".indicator.left")
const rightIndicatorEl = document.querySelector(".indicator.right")
const scoreSpanEl = document.querySelector(".scores span")
const lettersRemainingSpanEl = document.querySelector(".letters-remaining span")
const nextLetterSpanEl = document.querySelector(".next-letter span")
const appContainer = document.querySelector(".container")

// DOM Function
updateIndicatorAndLetterUI = (letter, mustPressLeftShift) => {
  letterEl.innerText = letter

  if (mustPressLeftShift) {
    appContainer.dataset.whichShift = "left"
  } else {
    appContainer.dataset.whichShift = "right"
  }
}

const updateScoreInUI = amount => {
  scoreSpanEl.innerText = amount
}

const updateLettersRemainingInUI = lettersRemaining => {
  lettersRemainingSpanEl.innerText = lettersRemaining
}

const updateNextLetterInUI = nextLetter => [
  (nextLetterSpanEl.innerText = nextLetter)
]

// Utilities Functions
const iterativeShuffleArray = array => {
  let newArray = [...array]

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = newArray[i]
    newArray[i] = newArray[j]
    newArray[j] = temp
  }

  return newArray
}

const englishAlphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
]

const lettersInfo = englishAlphabet.map(letter => ({
  letter,
  capitalizedLetter: letter.toUpperCase(),
  mustPressLeftShift: "yuiophbjklnm".includes(letter)
}))

let alphabetStack = iterativeShuffleArray(englishAlphabet)

// config
const scoreDecrementAmount_WrongShift = 4
const scoreDecrementAmount_WrongLetter = 2
const scoreDecrementAmount_TimeOut = 2
const scoreIncrementAmount = 10

let score = 0
let lettersRemaining = alphabetStack.length

const scoreMultiplier = 200
let scoreMultiplier_current = scoreMultiplier
let scoreMultiplier_decay = 0.1 * scoreMultiplier
let scoreMultiplier_updateInterval_MS = 200

const remove1LetterFromTheAlphabetStackAndUpdateUI = () => {
  if (alphabetStack.length === 1) {
    alphabetStack = iterativeShuffleArray(englishAlphabet)

    lettersRemaining = alphabetStack.length
    updateLettersRemainingInUI(lettersRemaining)
  }

  alphabetStack = alphabetStack.slice(1)

  lettersRemaining--
  updateLettersRemainingInUI(lettersRemaining)

  updateIndicatorAndLetterUI(
    alphabetStack[0].toUpperCase(),
    lettersInfo.filter(info => info.letter === alphabetStack[0])[0]
      .mustPressLeftShift
  )
  updateNextLetterInUI(alphabetStack[1].toUpperCase())
}

// Event Listeners:

const SHIFT_KEY_STATES = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2
}

let currentShiftKeyState = SHIFT_KEY_STATES.NONE

window.addEventListener("keydown", e => {
  // when shift is held, it determines which one
  if (e.key === "Shift") {
    e.location === 1
      ? (currentShiftKeyState = SHIFT_KEY_STATES.LEFT)
      : (currentShiftKeyState = SHIFT_KEY_STATES.RIGHT)
  }
})

window.addEventListener("keyup", e => {
  // when shift is released, it detects none is held
  if (e.key === "Shift") {
    currentShiftKeyState = SHIFT_KEY_STATES.NONE
  }
})

document.addEventListener("keypress", e => {
  if (
    alphabetStack[0] === e.key.toLowerCase() &&
    currentShiftKeyState !== SHIFT_KEY_STATES.NONE
  ) {
    const { mustPressLeftShift } = lettersInfo.find(
      info => info.letter === alphabetStack[0]
    )
    if (
      (mustPressLeftShift && currentShiftKeyState === SHIFT_KEY_STATES.LEFT) ||
      (!mustPressLeftShift && currentShiftKeyState === SHIFT_KEY_STATES.RIGHT)
    ) {
      score += scoreIncrementAmount * scoreMultiplier_current
      scoreMultiplier_current = scoreMultiplier
      updateScoreInUI(score)
      remove1LetterFromTheAlphabetStackAndUpdateUI()
      return
    } else {
      // add wrong animations to ui
      score -= scoreDecrementAmount_WrongShift * scoreMultiplier
      updateScoreInUI(score)
      return
    }
  }
  score -= scoreDecrementAmount_WrongLetter * scoreMultiplier
  updateScoreInUI(score)
})

// App starts here

remove1LetterFromTheAlphabetStackAndUpdateUI()
updateScoreInUI(score)

setInterval(() => {
  scoreMultiplier_current = Math.max(
    scoreMultiplier_current - scoreMultiplier_decay,
    1
  )
  scoreMultiplierBarEl.style.transform = `scaleX(
    ${scoreMultiplier_current / scoreMultiplier})`
  if (scoreMultiplier_current === 1) {
    score -=
      (scoreDecrementAmount_TimeOut * scoreMultiplier) /
      scoreMultiplier_updateInterval_MS
    updateScoreInUI(score)
  }
}, scoreMultiplier_updateInterval_MS)

/* TODO: Add a system that increases the multiplier when you type 2 write letters
and gets back to normal if you break the streak

if streak is 0 or broken current and max streak
 becomes display : none

 then if 2 answers given right then it shows it

 - when you streak like 5, then amount that fills gets decreased by a curve (like 10% off current value)

 */

/* TODO: Toggle Hide Scores */

/* TODO: Add Accuracy System */

/* TODO: UI Elements for:

    I) Timeout
    II) Score: 100 (+100)
    III) Gameover Screen 



*/

/*TODO: Add Responsiveness */

/* TODO: Add documentation */

/*TODO: Add sounds for right and wrong */
