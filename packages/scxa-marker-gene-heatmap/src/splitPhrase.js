const splitPhrase = (phrase, maxLineLength = 12) => {
  const splitPhrase = []

  const words = phrase.split(/\s+/)

  if (words.length > 0) {
    splitPhrase.push(words.shift())
  }

  while (words.length > 0) {
    const nextWord = words.shift()
    const exceedMaxLength = splitPhrase[splitPhrase.length - 1].length + nextWord.length + 1 > maxLineLength
    if (!exceedMaxLength) {
      splitPhrase[splitPhrase.length - 1] = `${splitPhrase[splitPhrase.length - 1]} ${nextWord}`
    } else {
      splitPhrase.push(nextWord)
    }
  }

  return splitPhrase
}

export default splitPhrase
