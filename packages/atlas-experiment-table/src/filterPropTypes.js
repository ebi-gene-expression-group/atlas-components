import PropTypes from 'prop-types'

const filterPropTypes = {
  label: PropTypes.string.isRequired,
  dataKey: PropTypes.string.isRequired,
  value: PropTypes.string
}

// A table header is a filter at heart, with some props to render it with a specified set of attributes and behaviour
const tableHeaderPropTypes =
  PropTypes.shape({
    ...filterPropTypes,
    searchable: PropTypes.boolean,
    sortable: PropTypes.boolean,
    image: PropTypes.objectOf(
      PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string
      })
    ),
    width: PropTypes.number
  })

export { tableHeaderPropTypes, filterPropTypes }
