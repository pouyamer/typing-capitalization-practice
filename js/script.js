// constants

const SHIFT_KEY_STATES = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2
}

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
const getAlphabetStackBasedOnLetterUpdateMode = (swapMode, letters) => {
  switch (swapMode) {
    case "random":
      return iterativeShuffleArray(letters)
    case "asc":
      return [...letters.sort()]
    case "desc":
      return [...letters.sort().reverse()]
  }
}

let currentThemeIndex = startingThemeIndex

const allLetters = lettersInfo.map(({ letter }) => letter)

let lettersStack = getAlphabetStackBasedOnLetterUpdateMode(
  lettersSwapMode,
  allLetters
)

let scoreShown = displayScoreAtStart

let streak = 0
let streak_max = streak

let typedLetters = 0
let typedLetters_correct = 0

let score = 0
let lettersRemaining = lettersStack.length

let scoreMultiplier_current = scoreMultiplier
let scoreMultiplier_updateInterval_MS = scoreMultiplierUpdateInterval_MS
let scoreMultiplier_decay = calculateScoreMultiplierDecayFunction(
  scoreMultiplier_updateInterval_MS,
  maxLastingScoreMultiplierTime_MS
)

const updateScoreMultiplierDecay = streak => {
  scoreMultiplier_decay =
    ((scoreMultiplier_updateInterval_MS * 200) /
      maxLastingScoreMultiplierTime_MS) *
    (1 + 0.3 * streak)
}

const remove1LetterFromTheAlphabetStackAndUpdateUI = () => {
  lettersStack = lettersStack.slice(1)

  // if (lettersStack.length === 0) {
  //   console.log("letters ended")
  //   lettersRemaining = lettersStack.length

  //   // refill the stack
  // }

  if (lettersStack.length === 1) {
    lettersStack = [
      lettersStack[0],
      ...getAlphabetStackBasedOnLetterUpdateMode(lettersSwapMode, allLetters)
    ]
    lettersRemaining = lettersStack.length
  }

  updateNextLetterInUI(lettersStack[1].toUpperCase())

  lettersRemaining--
  updateLettersRemainingInUI(lettersRemaining)

  if (lettersRemaining === allLetters.length) {
    updateLettersRemainingInUI("0")
  }

  updateIndicatorAndLetterUI(
    lettersStack[0].toUpperCase(),
    lettersInfo.filter(info => info.letter === lettersStack[0])[0]
      .mustPressLeftShift
  )

  console.log(lettersStack)
}

// Event Listeners:

let currentShiftKeyState = SHIFT_KEY_STATES.NONE

// App starts here

appContainerEl.dataset.theme = allThemes[currentThemeIndex]

lettersRemaining--
updateLettersRemainingInUI(lettersRemaining)

updateIndicatorAndLetterUI(
  lettersStack[0].toUpperCase(),
  lettersInfo.filter(info => info.letter === lettersStack[0])[0]
    .mustPressLeftShift
)
updateNextLetterInUI(lettersStack[1].toUpperCase())
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

    if (!allowNegativeScore) {
      score = 0
    }
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

// -----------------------------------------------------------------------------------
/* TODO: Add a system that increases the multiplier when you type 2 write letters
and gets back to normal if you break the streak

if streak is 0 or broken current and max streak
becomes display : none

then if 2 answers given right then it shows it

- when you streak like 5, then amount that fills gets decreased by a curve (like 10% off current value)

--DONE
*/
/* TODO: Add Accuracy System --DONE */
/* TODO: Toggle Hide Scores --DONE */
