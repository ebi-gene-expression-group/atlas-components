import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import styled from 'styled-components'

import {getAnatomogramViews} from './Assets'

const loadIcon = (view, selectedView) =>
  require(`./img/${view}.${view === selectedView ? `` : `un`}selected.png`).default

const IconWrapperDiv = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 10%;
  max-width: 44px;
  line-height: 0;
`

const IconImg = styled.img`
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  height: auto;
  padding: 2px;

  &:hover {
    border: 1px solid orange;
    background: lightgoldenrodyellow;
    cursor: pointer;
  }
`

const Switcher = ({species, parentView, selectedView, onChangeView}) => {
  return <IconWrapperDiv>
    {
      [`kidney`, `pancreas`, `lung`, `liver`, `placenta`, `gut`].includes(species) ?
        parentView && <IconImg
          key={parentView}
          onClick={() => onChangeView(species, parentView)}
          src={loadIcon(parentView, selectedView)} />
        :
        getAnatomogramViews(species).map((view) =>
          <IconImg
            key={view}
            onClick={() => onChangeView(species, view)}
            src={loadIcon(view, selectedView)} />
        )
    }

  </IconWrapperDiv>
}

Switcher.propTypes = {
  species: PropTypes.string.isRequired,
  selectedView: PropTypes.string,
  onChangeView: PropTypes.func.isRequired,
  parentView: PropTypes.string
}

export default Switcher
