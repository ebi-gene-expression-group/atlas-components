import parseSvg from '../scripts/svgParserModule'

describe(`SVG parser`, () => {
  const fileName = `test.svg`

  test(`throws an error if XML is invalid`, () => {
    const svgData =
      `<svg width="500" height="500" viewBox="0 0 500 500">` +
        `<g id="LAYER_EFO">` +
          `<g id="UBERON_00000948">` +
            `<path />` +
            `<path />` +
          `</g>` +
      `</svg>`

    expect(() => { parseSvg(fileName, svgData) }).toThrow(Error)
  })

  test(`throws an error when height, width or viewBox is missing`, () => {
    const svgData = `<svg></svg>`
    const svgDataNoHeight = `<svg width="500" viewBox="0 0 500 500"></svg>`
    const svgDataNoWidth = `<svg height="500" viewBox="0 0 500 500"></svg>`
    const svgDataNoViewBox = `<svg height="500" width="500"></svg>`

    expect(() => { parseSvg(fileName, svgData) }).toThrow(Error)
    expect(() => { parseSvg(fileName, svgDataNoHeight) }).toThrow(Error)
    expect(() => { parseSvg(fileName, svgDataNoWidth) }).toThrow(Error)
    expect(() => { parseSvg(fileName, svgDataNoViewBox) }).toThrow(Error)
  })

  test(`throws an error when viewBox doesn’t match width or height`, () => {
    const badViewBoxWidth = `<svg width="500" height="500" viewBox="0 0 400 500"></svg>`
    const badViewBoxHeight = `<svg width="500" height="500" viewBox="0 0 500 400"></svg>`

    expect(() => { parseSvg(fileName, badViewBoxWidth) }).toThrow(Error)
    expect(() => { parseSvg(fileName, badViewBoxHeight) }).toThrow(Error)
  })

  test(`parses SVG correctly if width and height has mm unit`, () => {
    const svgData = `<svg width="500mm" height="500mm" viewBox="0 0 500 500"></svg>`

    const expected = []

    expect(parseSvg(fileName, svgData)).toEqual(expected)
  })

  test(`parses minimal SVGs correctly`, () => {
    const svgData = `<svg width="500" height="500" viewBox="0 0 500 500"></svg>`

    const expected = []

    expect(parseSvg(fileName, svgData)).toEqual(expected)
  })


  test(`only parses IDs in the EFO layer`, () => {
    const svgData =
      `<svg width="500" height="500" viewBox="0 0 500 500">` +
        `<g id="LAYER_OUTLINE">` +
          `<path id="UBERON_00000955" />` +
        `</g>` +
        `<g id="LAYER_EFO">` +
          `<path id="UBERON_00000948" />` +
        `</g>` +
      `</svg>`

    const expected = [`UBERON_00000948`]

    expect(parseSvg(fileName, svgData)).toEqual(expected)
  })

  test(`only parses top-level IDs in the EFO layer`, () => {
    const svgData =
      `<svg width="500" height="500" viewBox="0 0 500 500">` +
        `<g id="LAYER_EFO">` +
          `<g id="UBERON_00000948">` +
            `<path id="foobar" />` +
          `</g>` +
        `</g>` +
      `</svg>`

    const expected = [`UBERON_00000948`]

    expect(parseSvg(fileName, svgData)).toEqual(expected)
  })

  test(`parses any top-level node ID in the EFO layer`, () => {
    const svgData =
      `<svg width="500" height="500" viewBox="0 0 500 500">` +
        `<g id="LAYER_EFO">` +
          `<g id="UBERON_00000948">` +
            `<path />` +
            `<path />` +
          `</g>` +
          `<path id="UBERON_00000955" />` +
          `<path id="UBERON_00002107" />` +
          `<ellipse id="UBERON_00002113" />` +
          `<foobar id="UBERON_0014892" />` +
        `</g>` +
      `</svg>`

    const expected = [`UBERON_00000948`, `UBERON_00000955`, `UBERON_00002107`, `UBERON_00002113`, `UBERON_0014892`]

    expect(parseSvg(fileName, svgData)).toEqual(expected)
  })

})
