import PropTypes from "prop-types";

const FacetGroupPropTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  facets: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.required,
      disabled: PropTypes.bool.isRequired,
    })
  ).isRequired,
  queryParams: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default FacetGroupPropTypes
