const config = {
  letters: {
    info: enLetters,
    // updateModes: random, asc, desc
    swapMode: "random"
  },
  theme: {
    allThemes: ["light", "dark"],
    startingIndex: 1
  },
  score: {
    allowNegative: false,
    displayAtStart: true,
    multiplier: {
      amount: 200,
      maxLastingTime_MS: 7500,
      updateInterval_MS: 100,
      calculateDecayFunction: (updateInterval_MS, maxLastingTime_MS) =>
        updateInterval_MS / maxLastingTime_MS
    },
    decrementation: {
      wrongShift: 4,
      wrongLetter: 2,
      timeout: 2
    },
    incrementation: {
      default: 10
    }
  }
}
