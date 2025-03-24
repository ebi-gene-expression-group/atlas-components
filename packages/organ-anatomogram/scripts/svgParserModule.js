const fs = require(`fs`)
const fastXmlParser = require(`fast-xml-parser`)

module.exports = (filename, svgData) => {
  if (fastXmlParser.validate(svgData) !== true) {
    throw new Error(`${filename}: Invalid XML input\n`)
  }

  // fast-xml-parser default, can be changed
  const attrPrefix = `@_`
  // fast-xml-parser considers self closing tags to be text nodes:
  // https://github.com/NaturalIntelligence/fast-xml-parser/issues/18
  const svgObj =
    fastXmlParser.parse(svgData, { ignoreAttributes: false, parseAttributeValue : true }).svg

  const requiredAttributes = [`width`, `height`, `viewBox`]
  requiredAttributes.forEach((attr) => {
    if (!svgObj[`${attrPrefix}${attr}`]) {
      throw new Error(`${filename}: Missing required attribute: ${attr}`)
    }
  })



  if ((svgObj[`${attrPrefix}viewBox`].split(/\s+/)[2] !== svgObj[`${attrPrefix}width`].toString() &&
        svgObj[`${attrPrefix}viewBox`].split(/\s+/)[2] !== svgObj[`${attrPrefix}width`].toString().slice(0, -2))
    ||
    (svgObj[`${attrPrefix}viewBox`].split(/\s+/)[3] !== svgObj[`${attrPrefix}height`].toString() &&
      svgObj[`${attrPrefix}viewBox`].split(/\s+/)[3] !== svgObj[`${attrPrefix}height`].toString().slice(0, -2))
  ) {
    throw new Error(`${filename}: viewBox does not match width/height`)
  }

  const layers = svgObj.g ?
    Array.isArray(svgObj.g) ? svgObj.g : [svgObj.g] :
    []

  if (!layers.some((g) => g[`${attrPrefix}id`] === `LAYER_EFO`)) {
    return []
  } else {
    const efoLayerGroup = layers.find((g) => g[`${attrPrefix}id`] === `LAYER_EFO`)
    // Alternatively we can define shapeTypes explicitly: const shapeTypes = [`g`, `path`, `ellipse`, `rect`...]
    const shapeTypes = Object.keys(efoLayerGroup).filter((node) => !node.startsWith(attrPrefix) && node !== `#text`)

    return shapeTypes.reduce((acc, shapeType) => {
      const shapes = Array.isArray(efoLayerGroup[shapeType]) ? efoLayerGroup[shapeType] : [efoLayerGroup[shapeType]]
      return acc.concat(shapes.map((shape) => shape[`${attrPrefix}id`]))
    }, [])
  }
}
