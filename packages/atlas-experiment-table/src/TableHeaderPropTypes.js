import PropTypes from 'prop-types'

const tableHeaderPropTypes =
  PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([`sort`, `search`, ``]).isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      dataParam: PropTypes.string.isRequired,
      image: PropTypes.objectOf(
        PropTypes.shape({
          src: PropTypes.string,
          alt: PropTypes.string
        })
      )
    })
  )

export { tableHeaderPropTypes }
