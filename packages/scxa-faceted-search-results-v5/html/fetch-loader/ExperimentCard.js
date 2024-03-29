import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import formatNumber from 'format-number'
import EbiSpeciesIcon from '@ebi-gene-expression-group/react-ebi-species'

const _formatNumber = formatNumber()

const CardContainerDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex !important;
  flex-wrap: nowrap;
  align-items: center;
  border: #e6e6e6 solid 1px;
  margin-bottom: 0.5rem;
  padding: 1rem;
  &:hover {
    background-color: #eaeaea;
    cursor: pointer;
  }
`

const SmallIconDiv = styled.div`
  width: 5%;
  text-align: center;
  font-size: 3rem;
`

const IconDiv = styled.div`
  width: 15%;
  text-align: center;
  font-size: 3rem;
`

const MarkerDiv = styled.div`
  width: 15%;
  text-align: center;
`

const TitleDiv = styled.p`
  width: 40%;
  text-align: center;
  margin-bottom: 0;
`

const VariableDiv = styled.div`
  width: 20%;
  text-align: center;
`

const CountDiv = styled.div`
  width: 10%;
  text-align: center;
`

const ANNDATA = `E-ANND`

class ExperimentCard extends React.Component {
  constructor(props) {
    super(props)
  }

  _goToExperiment(url) {
    window.location = url
  }

  render() {
    const {url, species, experimentDescription, markerGenes, numberOfAssays, experimentAccession, type, factors} = this.props

    const markerGeneLinks = markerGenes ? markerGenes.map((markerGene) =>
      <li key={`marker-gene-${markerGene.k}`}>
        <a href={markerGene.url}>See cluster {markerGene.clusterIds.sort().join(`, `)} for k = {markerGene.k}</a>
      </li>) :
      []

    return (
      <CardContainerDiv onClick={this._goToExperiment.bind(this, url)}>
          <SmallIconDiv>
              <span data-tip={type} data-html={true} className={`icon icon-functional`}>
                  {
                      experimentAccession.substring(0,6) === ANNDATA ?
                          //tbc
                          <img src={`https://user-images.githubusercontent.com/33519183/203308460-aee477fa-c8ab-4561-be46-34254bfa1731.png`} /> :
                          <img src={`https://www.ebi.ac.uk/gxa/resources/images/expression-atlas.png`} />
                  }
              </span>
          </SmallIconDiv>
        <IconDiv>
          <EbiSpeciesIcon species={species}/>
          <h6>{species}</h6>
        </IconDiv>
        {
          markerGeneLinks.length ?
            <MarkerDiv>
              <ul style={{marginBottom: 0}}>
                {markerGeneLinks}
              </ul>
            </MarkerDiv> :
            // Be aware that the FacetedSearchContainer in the search results component will insert <ReactTooltip/>
            <MarkerDiv>
              <span
                data-tip={`<span>Not a marker gene</span>`}
                data-html={true}
                className={`icon icon-functional`}
                data-icon={`x`} />
            </MarkerDiv>
        }
        <TitleDiv> {experimentDescription} </TitleDiv>
        <VariableDiv>
          <ul style={{marginBottom: 0}}>
            {factors.map(factor => <li key={`factor-${factor}`}> {factor} </li>)}
          </ul>
        </VariableDiv>
        <CountDiv> {_formatNumber(numberOfAssays)} </CountDiv>
      </CardContainerDiv>
    )
  }
}

ExperimentCard.propTypes = {
  url: PropTypes.string.isRequired,
  species: PropTypes.string.isRequired,
  experimentDescription: PropTypes.string.isRequired,
  markerGenes: PropTypes.arrayOf(PropTypes.shape({
    k: PropTypes.number.isRequired,
    clusterIds: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired
  })),
  numberOfAssays: PropTypes.number.isRequired,
  factors: PropTypes.array.isRequired,
  experimentAccession: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}

export default ExperimentCard
