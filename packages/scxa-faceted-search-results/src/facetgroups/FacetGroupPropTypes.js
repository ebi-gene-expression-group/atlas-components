import PropTypes from 'prop-types'

import {FacetPropTypes} from '../ResultPropTypes'

const FacetGroupPropTypes = {
	facetGroupName: PropTypes.string.isRequired,
	facetGroupNameDescription: PropTypes.string,
	facets: PropTypes.arrayOf(PropTypes.shape({
		...FacetPropTypes,
		disabled: PropTypes.bool.isRequired})).isRequired,
	onChange: PropTypes.func.isRequired
}

export default FacetGroupPropTypes
