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
