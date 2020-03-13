import React from 'react'
import PropTypes from 'prop-types'

class Prompt extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedFileTypes: props.downloadFileTypes.map(fileType => fileType.id)
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick(selectedFileType) {
    const selectedFileTypes = [...this.state.selectedFileTypes]
    this.setState({
      selectedFileTypes: selectedFileTypes.includes(selectedFileType) ?
        selectedFileTypes.filter(fileType => fileType !== selectedFileType) :
        [selectedFileType, ...selectedFileTypes]
      },
      () => this.props.onSelect(this.state.selectedFileTypes)
    )
  }

  render() {
    return <div>
        <p style={{paddingBottom: `1rem`}}>Choose file types...</p>
          {
            this.props.downloadFileTypes.map((fileType, idx) =>
              <div key={`filetype${idx}`} style={{display:"flex"}}>
                <input type={`checkbox`} className={`checkbox`} id={fileType.id}
                       checked={this.state.selectedFileTypes.includes(fileType.id)}
                       onChange={() => this.onClick(fileType.id)}/>
                <p id={fileType.description} style={{paddingLeft: `1rem`, paddingBottom: `1rem`}}>
                  {fileType.description}
                </p>
              </div>
            )
          }

      </div>

  }
}

Prompt.propTypes = {
  onSelect: PropTypes.func.isRequired,
  downloadFileTypes: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string
    })
  ).isRequired
}

export default Prompt
