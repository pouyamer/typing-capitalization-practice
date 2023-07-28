// DOM Elements:
const letterEl = document.querySelector(".letter-and-multiplier p")
const letterContainerEl = document.querySelector(".letter")
const btnThemeSwitchEl = document.querySelector(".theme-switcher")
const scoreMultiplierBarEl = document.querySelector(".score-multiplier")
const leftIndicatorEl = document.querySelector(".indicator.left")
const rightIndicatorEl = document.querySelector(".indicator.right")
const scoreSpanEl = document.querySelector(".scores span")
const lettersRemainingSpanEl = document.querySelector(".letters-remaining span")
const nextLetterSpanEl = document.querySelector(".next-letter span")
const currentStreakSpanEl = document.querySelector(".current-streak span")
const maxStreakSpanEl = document.querySelector(".max-streak span")
const accuracySpanEl = document.querySelector(".accuracy span")
const appContainerEl = document.querySelector(".container")

// DOM Function

const updateScoreVisibilityInUI = shown => {
  scoreSpanEl.parentElement.parentElement.classList.add(
    shown ? "shown" : "hidden"
  )
  scoreSpanEl.parentElement.parentElement.classList.remove(
    shown ? "hidden" : "shown"
  )
  letterEl.style.borderRight = shown ? "1px solid" : "none"
}

const updateCurrentAndMaxStreakInUI = (streak, maxStreak) => {
  maxStreakSpanEl.innerText = maxStreak
  currentStreakSpanEl.innerText = streak

  if (streak === maxStreak) {
    maxStreakSpanEl.parentElement.classList.add("record-set")
  }

  if (streak === 0) {
    currentStreakSpanEl.parentElement.style.display = "none"
    maxStreakSpanEl.parentElement.style.display = "none"

    maxStreakSpanEl.parentElement.classList.remove("record-set")
    return
  }

  if (streak === 2) {
    currentStreakSpanEl.parentElement.style.display = "block"
    maxStreakSpanEl.parentElement.style.display = "block"
  }
}

const updateIndicatorAndLetterUI = (letter, mustPressLeftShift) => {
  letterEl.innerText = letter

  if (mustPressLeftShift) {
    appContainerEl.dataset.whichShift = "left"
  } else {
    appContainerEl.dataset.whichShift = "right"
  }
}

const updateAccuracyInUI = (typedLetters_correct, typedLetters) => {
  const accuracyPercentage = (typedLetters_correct * 100) / typedLetters

  accuracySpanEl.innerText =
    typedLetters === 0 ? "-" : Math.ceil(accuracyPercentage * 100) / 100
}

const updateScoreInUI = amount => {
  scoreSpanEl.innerText = Math.floor(amount)
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

const themeNames = ["light", "dark"]
let currentThemeIndex = 0

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

let scoreShown = true

let streak = 0
let streak_max = streak

const scoreDecrementAmount_WrongShift = 4
const scoreDecrementAmount_WrongLetter = 2
const scoreDecrementAmount_TimeOut = 2
const scoreIncrementAmount = 10

let typedLetters = 0
let typedLetters_correct = 0

let score = 0
let lettersRemaining = alphabetStack.length

const scoreMultiplier = 200
const maxEstimatedScoreMultiplierTime_MS = 7500
let scoreMultiplier_current = scoreMultiplier
let scoreMultiplier_updateInterval_MS = 100
let scoreMultiplier_decay =
  (scoreMultiplier_updateInterval_MS * 200) / maxEstimatedScoreMultiplierTime_MS

const updateScoreMultiplierDecay = streak => {
  scoreMultiplier_decay =
    ((scoreMultiplier_updateInterval_MS * 200) /
      maxEstimatedScoreMultiplierTime_MS) *
    (1 + 0.3 * streak)

  console.log(scoreMultiplier_decay)
}

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
      typedLetters_correct++
      typedLetters++

      score += scoreIncrementAmount * scoreMultiplier_current
      scoreMultiplier_current = scoreMultiplier

      streak++
      if (streak > streak_max) streak_max = streak

      updateCurrentAndMaxStreakInUI(streak, streak_max)
      updateAccuracyInUI(typedLetters_correct, typedLetters)
      updateScoreInUI(score)
      remove1LetterFromTheAlphabetStackAndUpdateUI()
      return
    } else {
      // add wrong animations to ui
      typedLetters++
      score -= scoreDecrementAmount_WrongShift * scoreMultiplier
      streak = 0

      updateCurrentAndMaxStreakInUI(streak, streak_max)
      updateAccuracyInUI(typedLetters_correct, typedLetters)
      updateScoreInUI(score)
      return
    }
  }
  score -= scoreDecrementAmount_WrongLetter * scoreMultiplier
  typedLetters++
  streak = 0

  updateCurrentAndMaxStreakInUI(streak, streak_max)
  updateAccuracyInUI(typedLetters_correct, typedLetters)
  updateScoreInUI(score)
})

btnThemeSwitchEl.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themeNames.length
  console.log(
    `Theme ${currentThemeIndex}: ${themeNames[currentThemeIndex]} chosen`
  )
  appContainerEl.dataset.theme = themeNames[currentThemeIndex]
})

letterEl.addEventListener("click", () => {
  scoreShown = !scoreShown
  updateScoreVisibilityInUI(scoreShown)
})

// App starts here

appContainerEl.dataset.theme = themeNames[currentThemeIndex]

remove1LetterFromTheAlphabetStackAndUpdateUI()
updateCurrentAndMaxStreakInUI(streak, streak_max)
updateAccuracyInUI(typedLetters_correct, typedLetters)
updateScoreInUI(score)
updateScoreVisibilityInUI(scoreShown)

setInterval(() => {
  scoreMultiplier_current = Math.max(
    scoreMultiplier_current - scoreMultiplier_decay,
    1
  )

  if (scoreMultiplier_current === 1) {
    streak = 0
    updateCurrentAndMaxStreakInUI(streak, streak_max)
  }

  scoreMultiplierBarEl.style.transform = `scaleX(
    ${scoreMultiplier_current / scoreMultiplier})`
  if (scoreMultiplier_current === 1) {
    score -=
      (scoreDecrementAmount_TimeOut * scoreMultiplier) /
      scoreMultiplier_updateInterval_MS
    updateScoreInUI(score)
  }

  updateScoreMultiplierDecay(streak)
}, scoreMultiplier_updateInterval_MS)

/* TODO: UI Elements for:

I) Timeout
II) Score: 100 (+100)
III) Gameover Screen 



*/

/*TODO: Style the theme button */

/*TODO: Add Responsiveness */
/* TODO: Add documentation */

/*TODO: Add sounds for right and wrong */

/* TODO: Add Accuracy System --DONE */

/* TODO: Add a system that increases the multiplier when you type 2 write letters
and gets back to normal if you break the streak

if streak is 0 or broken current and max streak
becomes display : none

then if 2 answers given right then it shows it

- when you streak like 5, then amount that fills gets decreased by a curve (like 10% off current value)

--DONE
*/

/* TODO: Toggle Hide Scores --DONE */
