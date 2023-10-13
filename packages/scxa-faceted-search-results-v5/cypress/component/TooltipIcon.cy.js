import React from 'react'

import TooltipIcon from '../../src/facetgroups/TooltipIcon'

import randomWords from 'random-words'

describe(`TooltipIcon`, () => {
  const maxLineLength = 40
  it(`inserts line breaks to the texts when tooltip longer than max line length`, () => {
    const longText = randomWords(100).join(` `)
    cy.mount(<TooltipIcon tooltipText={longText} />)
    cy.get(`span`)
      .should(`have.attr`, `data-tip`)
      .should(($tooltip) => {
        expect($tooltip).to.contain(`<br>`)
        const lines = $tooltip.split(`<br`)
        expect(lines.length).to.be.least(
          Math.floor((longText.length / maxLineLength) - 1)
        )
      })
  })

  it(`tooltip text matches given text`, () => {
    const longText = `The blowfish puffs himself up four, five times larger than normal and why? Why does he do that? So that it makes him intimidating, that's why. Intimidating! So that the other, scarier fish are scared off. And that's you! You are a blowfish. You see it's just all an illusion. You see it's... it's nothing but air. Now... who messes with the blowfish, Jesse? You're damn right. You are a blowfish. Say it again. Say it like you mean it. You're a BLOWFISH!`
    const longTestWithBreaks = `<span>The blowfish puffs himself up four, five<br>times larger than normal and why? Why does<br>he do that? So that it makes him intimidating,<br>that's why. Intimidating! So that the other,<br>scarier fish are scared off. And that's you!<br>You are a blowfish. You see it's just all<br>an illusion. You see it's... it's nothing<br>but air. Now... who messes with the blowfish,<br>Jesse? You're damn right. You are a blowfish.<br>Say it again. Say it like you mean it. You're<br>a BLOWFISH!</span>`
    cy.mount(<TooltipIcon tooltipText={longText} />)
    cy.get(`span`)
      .should(`have.attr`, `data-tip`)
      .should(`eq`, longTestWithBreaks)
  })
})
