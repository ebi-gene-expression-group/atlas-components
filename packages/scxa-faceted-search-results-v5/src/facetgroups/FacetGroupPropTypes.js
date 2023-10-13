import PropTypes from 'prop-types'

const FacetGroupPropTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  facets: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string.required,
      value: PropTypes.string.required,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  queryParams: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

export default FacetGroupPropTypes
