import PropTypes from 'prop-types'

const SeriesPropTypes = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    expressionLevel: PropTypes.number,
    color: PropTypes.string
  })).isRequired,
  color: PropTypes.string
}))

export default SeriesPropTypes
