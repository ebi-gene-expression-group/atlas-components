const formatTooltip = (chart, plotLine, label) => {
  const tooltip = document.createElement(`div`)
  tooltip.className = `custom-tooltip`
  tooltip.style.position = `absolute`
  tooltip.style.background = `#fff`
  tooltip.style.border = `1px solid #ccc`
  tooltip.style.padding = `1px`
  tooltip.style.pointerEvents = `none`
  tooltip.style.zIndex = 1000

  // Add styling for better display
  tooltip.style.maxWidth = `60px` // Restrict width
  tooltip.style.wordWrap = `break-word` // Enable word wrapping
  tooltip.style.boxShadow = `0 2px 5px rgba(0,0,0,0.3)` // Add subtle shadow for visibility

  tooltip.innerText = plotLine.options.label.text

  // Position tooltip
  chart.container.appendChild(tooltip)
  tooltip.style.left = `${label.getBoundingClientRect().left + window.scrollX}px`
  tooltip.style.top = `${label.getBoundingClientRect().top + window.scrollY - tooltip.offsetHeight}px`

  // Position tooltip
  const labelBBox = label.getBoundingClientRect()
  const containerBBox = chart.container.getBoundingClientRect()
  const tooltipX = labelBBox.left - containerBBox.left + labelBBox.width / 2 - tooltip.style.maxWidth / 2

  // Adjust position dynamically to prevent overflow
  const tooltipRect = tooltip.getBoundingClientRect()
  if (tooltipRect.right > window.innerWidth) {
    tooltip.style.left = `${window.innerWidth - tooltipRect.width}px` // Align to the right edge
  } else {
    tooltip.style.left = `${tooltipX}px` // Default positioning
  }
  return tooltip
}

export default formatTooltip
