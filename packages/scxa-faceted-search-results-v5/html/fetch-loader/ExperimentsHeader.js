import React from 'react'
import styled from 'styled-components'

const CardContainerDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex !important;
  flex-wrap: nowrap;
  align-items: center;
  padding: 1rem;
  font-weight: bolder;
  font-size: 0.9rem;
`

const SmallIconDiv = styled.div`
  width: 5%;
  text-align: center;
  opacity: 0.6;
  transition: 0.3s;
`

const IconDiv = styled.div`
  width: 15%;
  text-align: center;
  opacity: 0.6;
  transition: 0.3s;
`

const MarkerDiv = styled.div`
  width: 15%;
  text-align: center;
  opacity: 0.6;
  transition: 0.3s;
`

const TitleDiv = styled.div`
  width: 40%;
  text-align: center;
  opacity: 0.6;
  transition: 0.3s;
`

const VariableDiv = styled.div`
  width: 20%;
  text-align: center;
  opacity: 0.6;
`

const CountDiv = styled.div`
  width: 10%;
  text-align: center;
  opacity: 0.6;
  transition: 0.3s;
`

const ExperimentTableHeaderBasic = () =>
  ({
    titles: [`Experiment type`, `Species`, `Marker genes`, `Title`, `Experimental variables`, `Number of assays`],
    styles: [SmallIconDiv, IconDiv, MarkerDiv, TitleDiv, VariableDiv, CountDiv],
    attributes: [`experimentAccession`, `species`, `markerGenes`, `experimentDescription`, null, `numberOfAssays`]
  })

class ExperimentsHeader extends React.Component {
  render() {
    const tableTitles = ExperimentTableHeaderBasic().titles
    const tableTitleDivs = ExperimentTableHeaderBasic().styles

    return (
      <CardContainerDiv>
        {
          tableTitles.map((title, index) => {
            const TitleDiv = tableTitleDivs[index]
            return <TitleDiv key={title}><span id={`title`}>{title}</span></TitleDiv>
          })
        }
      </CardContainerDiv>
    )
  }
}

export default ExperimentsHeader
