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
    lettersStack[0] === e.key.toLowerCase() &&
    currentShiftKeyState !== SHIFT_KEY_STATES.NONE
  ) {
    const { mustPressLeftShift } = lettersInfo.find(
      info => info.letter === lettersStack[0]
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
      if (score < 0 && !allowNegativeScore) {
        score = 0
      }
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

  if (score < 0 && !allowNegativeScore) {
    score = 0
  }
  updateCurrentAndMaxStreakInUI(streak, streak_max)
  updateAccuracyInUI(typedLetters_correct, typedLetters)
  updateScoreInUI(score)
})

btnThemeSwitchEl.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % allThemes.length
  console.log(
    `Theme ${currentThemeIndex}: ${allThemes[currentThemeIndex]} chosen`
  )
  appContainerEl.dataset.theme = allThemes[currentThemeIndex]
})

letterEl.addEventListener("click", () => {
  scoreShown = !scoreShown
  updateScoreVisibilityInUI(scoreShown)
})
