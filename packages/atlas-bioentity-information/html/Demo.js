import React from 'react'
import ReactDOM from 'react-dom'
import BioentityInformation from '../src/BioentityInformation'
import AtlasAutocomplete from 'expression-atlas-autocomplete'

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      geneId: ``
    }
  }

  render() {
    return (
      <div>
        <AtlasAutocomplete key={`expression-autocomplete`}
                           atlasUrl={`http://localhost:8080/scxa/`}
                           wrapperClassName={`row column`}
                           enableSpeciesFilter={false}
                           suggesterEndpoint={`json/suggestions`}
                           initialValue={this.state.geneId}
                           onSelect={ (geneId) => { this.setState({geneId: geneId}) }}/>

        <BioentityInformation atlasUrl={`http://localhost:8080/scxa/`}
                              geneId={this.state.geneId}
        />
      </div>

    )
  }
}

const render = (options, target) => {
  ReactDOM.render(<Demo {...options} />, document.getElementById(target))
}

export {render}
