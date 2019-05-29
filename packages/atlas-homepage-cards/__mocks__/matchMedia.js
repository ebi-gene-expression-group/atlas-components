Object.defineProperty(window, `matchMedia`, {
  value: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  })
})

module.exports = window