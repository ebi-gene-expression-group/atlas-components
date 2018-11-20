import withFetchLoader from './containers/FetchLoader'
import SceaHomepageSpeciesContainer from './containers/SceaHomepageSpeciesContainer'
import HcaLandingPageContainer from './containers/HcaLandingPageContainer'

const _SceaHomepageSpeciesContainer = withFetchLoader(SceaHomepageSpeciesContainer)
const _HcaLandingPageContainer = withFetchLoader(HcaLandingPageContainer)

export {
  _SceaHomepageSpeciesContainer as SceaHomepageSpeciesContainer,
  _HcaLandingPageContainer as HcaLandingPageContainer
}
