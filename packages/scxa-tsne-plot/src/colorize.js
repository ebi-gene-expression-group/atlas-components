import Color from 'color'

// const defaultColor = `#eeeeee`
// const stops = [
//   // The first stop acts as a threshold: anything lower than this gets the defaultColor
//   {
//     cutoff: 0.1,
//     color: `#e1e9f4`
//   },
//   {
//     cutoff: 1,
//     color: `#d4e4fb`
//   },
//   {
//     cutoff: 10,
//     color: `#95adde`
//   },
//   {
//     cutoff: 100,
//     color: `#6077bf`
//   },
//   {
//     cutoff: 1000,
//     color: `#1151d1`
//   },
//   {
//     cutoff: 10000,
//     color: `#35419b`
//   },
//   {
//     cutoff: 100000,
//     color: `#0e0573`
//   },
//   {
//     cutoff: 1000000,
//     color: `#07004c`
//   }
// ]

const colorize = (stops, defaultColour) =>
  (val) => {
    // Below minimum
    if (val < stops[0].cutoff) {
      return Color(defaultColour).alpha(0.65).toString()
    }
    // Above maximum
    if (val > stops[stops.length - 1].cutoff) {
      return Color(stops[stops.length - 1].color).toString()
    }

    // General case
    const stopIndex = stops.findIndex(stop => val <= stop.cutoff)

    const minColor = Color(stops[Math.max(0, stopIndex - 1)].color)  // Because stopIndex may be 0
    const maxColor = Color(stops[stopIndex].color)

    // Transform colors to RGB
    const positionWithinStops = val / stops[stopIndex].cutoff
    return Color.rgb(
      minColor.red() + (maxColor.red() - minColor.red()) * positionWithinStops,
      minColor.green() + (maxColor.green() - minColor.green()) * positionWithinStops,
      minColor.blue() + (maxColor.blue() - minColor.blue()) * positionWithinStops,
    ).toString()
  }

export default colorize
