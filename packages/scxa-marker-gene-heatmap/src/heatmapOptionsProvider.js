import URI from 'urijs'

const checkIfAnnDataExperiment = experimentAccession => /E-ANND-\d*/.test(experimentAccession)

const heatmapOptionsProvider = {
  multiexperimentcelltypes: {
    tooltip: {
      // followPointer: true,
      formatter: function () {
        if (this.point.value === null) {
          return `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
            `<b>Expression:</b> Not expressed<br/>`
        } else {
          return `<b>Marker gene in experiment:</b> ${this.point.cellGroupValueWhereMarker}<br/>` +
            `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
            `<b>Expression:</b> ${+this.point.value.toFixed(3)} CPM`
        }
      }
    },
    title: cellType => `${cellType}<br>top genes`,
    labelsFormatter:
      (experimentAccession, host) => {
        const annDataIconUrl = URI(`/wikipedia/commons/6/6a/External_link_font_awesome.svg`, `https://upload.wikimedia.org`).toString()
        const experimentLinkText = checkIfAnnDataExperiment(experimentAccession) ?
          `<img src="${annDataIconUrl}" alt="AnnData experiment icon" width="11px"/> ${experimentAccession}` :
          experimentAccession

        return `<a href="${URI(`experiments`, host).segment(experimentAccession).toString()}"` +
          `style="border: none; color: #148ff3; z-index: -1;">${experimentLinkText}</a>`
      },
    noData: `No high-scoring genes found for the selected cell type.`
  },

  celltypes: {
    tooltip: {
      // followPointer: true,
      formatter: function () {
        if (this.point.value === null) {
          return `<b>Cell type:</b> ${this.point.cellGroupValue}<br/>` +
            `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
            `<b>Expression:</b> Not expressed<br/>`
        } else {
          return `<b>Cell type:</b> ${this.point.cellGroupValue}<br/>` +
            `<b>Cell type where marker:</b> ${this.point.cellGroupValueWhereMarker}<br/>` +
            `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
            `<b>Expression:</b> ${+this.point.value.toFixed(3)} CPM`
        }
      }
    },
    title: cellType => `${cellType}<br>marker genes`,
    labelsFormatter: label => label,
    noData: `No marker genes found for the selected organ or region. Try selecting another organism part.`
  },

  clusters: {
    tooltip: {
      // followPointer: true,
      formatter: function () {
        if (this.point.value === null) {
          return `<b>Cluster ID:</b> ${this.point.x + 1}<br/>` +
            `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
            `<b>Median expression:</b> Not expressed<br/>`
        } else {
          const text = `<b>Cluster ID:</b> ${this.point.x + 1}<br/>` +
            `<b>Cluster ID where marker:</b> ${this.point.cellGroupValueWhereMarker}<br/>` +
            `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
            `<b>Median expression:</b> ${+this.point.value.toFixed(3)} CPM`

          if (this.point.cellGroupValueWhereMarker === this.point.x + 1) {
            return text + `<br/><b>P-value:</b> ${this.point.pValue.toExponential(3)}`
          } else {
            return text
          }
        }
      }
    },
    title: () => `Cluster marker genes`,
    labelsFormatter: label => `Cluster ${label}`,
    noData: `There are no marker genes for this k value. Try selecting another k.`
  }
}

export default heatmapOptionsProvider
