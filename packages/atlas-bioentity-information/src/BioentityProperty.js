import React from 'react'
import PropTypes from 'prop-types'

class BioentityProperty extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showAll: false
        }
    }

    // take three most relevant links and then all of the same relevance
    _pickMostRelevant(properties) {
        const relevanceThreshold =
            properties
                .map(p => p.relevance)
                .sort((l,r) => r-l)
                .concat([0,0,0])
                [properties.size < 3 ? properties.size-1 : 2];
        return properties.filter(p => p.relevance>=relevanceThreshold);
    }

    _renderProperty(property, ix) {
        return (
            property.url
                ? <a key={property.url+" "+ix} className={"bioEntityCardLink"} href={property.url} target="_blank">
                    {property.text}
                </a>
                : <span key={property.text + " "+ix}>
          {property.text}
        </span>
        )
    }

    _zipWithCommaSpans(elts) {
        return (
            [].concat.apply([],
                elts.map((e, ix)=>[e, <span key={"comma "+ix}>, </span>])
            )
                .slice(0,-1)
        )
    }

    render() {
        const numUnshownLinks = this.props.values.length - this._pickMostRelevant(this.props.values).length;
        const hasOptionalLinks = ["go","po"].indexOf(this.props.type) > -1 && numUnshownLinks >0;
        const showMoreLessButton = <a role="button" style={{cursor:"pointer"}} onClick={function(){
                                        this.setState((previousState)=>({showAll: !previousState.showAll}))
                                      }.bind(this)}>
                                      {this.state.showAll ? " (show less)" : " … and "+numUnshownLinks+" more"}
                                  </a>;

        return (
          <tr>
            <td className={"gxaBioentityInformationCardPropertyType"}>
                {this.props.name}
            </td>
            <td>
            <div>
              {hasOptionalLinks
                ?
                <span>
                  {
                    this._zipWithCommaSpans(
                      (this.state.showAll
                        ? this.props.values
                        : this._pickMostRelevant(this.props.values)
                      )
                        .sort((l,r)=>(
                          r.relevance === l.relevance
                            ? r.text.toLowerCase() < l.text.toLowerCase() ? 1 : -1
                            : r.relevance - l.relevance
                          )
                        ).map(this._renderProperty)
                    )}

                  {showMoreLessButton}
                </span>
                : this._zipWithCommaSpans(this.props.values.map(this._renderProperty))
              }

                </div>
            </td>
          </tr>
        )
    }
}

BioentityProperty.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        relevance: PropTypes.number.isRequired
    }))
}

export default BioentityProperty