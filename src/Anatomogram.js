import React from 'react'
import PropTypes from 'prop-types'

import Switcher from './Switcher'
import AnatomogramSvg from './AnatomogramSvg'
import {getDefaultView, getParentView, supportedSpecies} from './Assets'

class Anatomogram extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedView: getDefaultView(props.species),
      parentView: getParentView(props.species, getDefaultView(props.species))
    }
    this._switchAnatomogramView = this._switchAnatomogramView.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.species !== prevProps.species) {
      this.setState({
        selectedView: getDefaultView(this.props.species),
        parentView: getParentView(this.props.species, getDefaultView(this.props.species))
      })
    }
  }

  _switchAnatomogramView(species, anatomogramView) {
    this.props.onClick([])
    this.setState({
      selectedView: anatomogramView,
      parentView: getParentView(species, anatomogramView),
      showIds: [],
      selectIds: [],
      highlightIds:[]
    }, this.props.afterSwitchView(species, anatomogramView))
  }

  static getDerivedStateFromProps(props, state) {
    if (props.species !== state.species) {
      return {
        species: props.species,
        selectedView: getDefaultView(props.species)
      }
    }
    return null
  }

  render() {
    const { parentView, selectedView } = this.state
    const { species, showLinkBoxIds } = this.props
    return (
      supportedSpecies.includes(species) &&
        <div>
          <Switcher
            species={species}
            parentView={parentView}
            selectedView={selectedView}
            onChangeView={this._switchAnatomogramView} />

          <AnatomogramSvg
            {...this.props}
            showLinkBoxIds={showLinkBoxIds}
            onChangeView={this._switchAnatomogramView}
            selectedView={selectedView} />
        </div>
    )
  }
}

Anatomogram.propTypes = {
  species: PropTypes.string.isRequired,
  showLinkBoxIds: PropTypes.func.isRequired
}

export default Anatomogram
