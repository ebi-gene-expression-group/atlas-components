import heatmapOptionsProvider, { checkIfAnnDataExperiment } from '../src/heatmapOptionsProvider'

describe(`checkIfAnnDataExperiment`, () => {
  it(`should return true for valid AnnData experiment accession`, () => {
    expect(checkIfAnnDataExperiment(`E-ANND-1234`)).toBe(true)
  })

  it(`should return false for invalid AnnData experiment accession`, () => {
    expect(checkIfAnnDataExperiment(`E-GEOD-5678`)).toBe(false)
    expect(checkIfAnnDataExperiment(`ANND-1234`)).toBe(false)
  })
})

describe(`heatmapOptionsProvider.multiexperimentcelltypes.tooltip.formatter`, () => {
  const formatter = heatmapOptionsProvider.multiexperimentcelltypes.tooltip.formatter

  it(`should return Not expressed when value is null`, () => {
    const mockPoint = {
      value: null,
      geneName: `Gene1`
    }
    const result = formatter.call({ point: mockPoint })
    expect(result).toContain(`Not expressed`)
    expect(result).toContain(`Gene1`)
  })

  it(`should return formatted expression when value is not null`, () => {
    const mockPoint = {
      value: 2.12345,
      geneName: `Gene2`,
      cellGroupValueWhereMarker: `CellType1`,
      expressionUnit: `TPM`
    }
    const result = formatter.call({ point: mockPoint })
    expect(result).toContain(`CellType1`)
    expect(result).toContain(`Gene2`)
    expect(result).toContain(`2.123`)
    expect(result).toContain(`TPM`)
  })
})

describe(`heatmapOptionsProvider.celltypes.tooltip.formatter`, () => {
  const formatter = heatmapOptionsProvider.celltypes.tooltip.formatter

  it(`should return Not expressed when value is null`, () => {
    const mockPoint = {
      value: null,
      geneName: `Gene3`,
      cellGroupValue: `CellType2`
    }
    const result = formatter.call({ point: mockPoint })
    expect(result).toContain(`Not expressed`)
    expect(result).toContain(`Gene3`)
    expect(result).toContain(`CellType2`)
  })

  it(`should return formatted expression when value is not null`, () => {
    const mockPoint = {
      value: 1.98765,
      geneName: `Gene4`,
      cellGroupValue: `CellType3`,
      cellGroupValueWhereMarker: `CellType4`,
      expressionUnit: `FPKM`
    }
    const result = formatter.call({ point: mockPoint })
    expect(result).toContain(`CellType3`)
    expect(result).toContain(`Gene4`)
    expect(result).toContain(`CellType4`)
    expect(result).toContain(`1.988`)
    expect(result).toContain(`FPKM`)
  })
})

describe(`heatmapOptionsProvider.multiexperimentcelltypes.labelsFormatter`, () => {
  const labelsFormatter = heatmapOptionsProvider.multiexperimentcelltypes.labelsFormatter
  const experimentImageURl = `https://upload.wikimedia.org/wikipedia/commons/6/6a/External_link_font_awesome.svg`
  const host = `https://www.example.com`

  it(`should return formatted label with AnnData icon for AnnData experiments`, () => {
    const experimentAccession = `E-ANND-0001`
    const result = labelsFormatter(experimentAccession, host)

    expect(result).not.toContain(`<img src="${experimentImageURl}"`)
    expect(result).toContain(`E-ANND-0001`)
    expect(result).toContain(`href="${host}/experiments/E-ANND-0001"`)
  })

  it(`should return formatted label without AnnData icon for non-AnnData experiments`, () => {
    const experimentAccession = `E-GEOD-1234`
    const result = labelsFormatter(experimentAccession, host)

    expect(result).not.toContain(`<img src="${experimentImageURl}"`)
    expect(result).toContain(`E-GEOD-1234`)
    expect(result).toContain(`href="${host}/experiments/E-GEOD-1234"`)
  })
})
