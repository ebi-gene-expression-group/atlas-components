import PropTypes from 'prop-types'

const FacetGroupPropTypes = {
  facetName: PropTypes.string.isRequired,
  hideName: PropTypes.bool.isRequired,
  facetItems: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  onChange: PropTypes.func.isRequired
}

export default FacetGroupPropTypes
