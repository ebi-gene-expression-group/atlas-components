import React from 'react'
import PropTypes from 'prop-types'
import LinksToResources from './supplementary-information/resources/LinksToResources'

const DownloadsRoute = ({ atlasUrl, data, experimentAccession }) => {
  const downloadLinks = data.map((download, index) =>
    <div key={index} className={`small-12 columns margin-bottom-xlarge`}>
      <h3 key={`title`}>{download.title}</h3>
      <LinksToResources key={`links`} data={download.files} atlasUrl={atlasUrl}/>
    </div>
  )

  return (
    <div className={`row expanded margin-top-large`}>
      <div className={`small-12 columns margin-bottom-xlarge`}>
        <h3 key={`title`}>Via FTP</h3>
        <span>You can download data for this experiment in Single Cell Expression Atlas through our <a href={`http://ftp.ebi.ac.uk/pub/databases/microarray/data/atlas/sc_experiments/${experimentAccession}`}>{`FTP site`}</a></span>
      </div>
      {downloadLinks}
    </div>
  )
}

DownloadsRoute.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  atlasUrl: PropTypes.string.isRequired,
  resourcesUrl: PropTypes.string,
  experimentAccession: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string,
      type: PropTypes.string,
      url: PropTypes.string
    }))
  }))
}

export default DownloadsRoute
