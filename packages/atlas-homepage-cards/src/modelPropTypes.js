import PropTypes from 'prop-types'

// See JSON schema in README.md
const modelPropTypes = {
  iconType: PropTypes.oneOf([`species`, `image`]).isRequired,
  iconSrc: PropTypes.string.isRequired,
  description: PropTypes.shape({
    text: PropTypes.string,
    url: PropTypes.string
  }),
  content: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string
  }))
}

export default modelPropTypes
