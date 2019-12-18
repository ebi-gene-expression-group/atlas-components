import { shallow, mount } from 'enzyme'
import EbiSpeciesIcon from 'react-ebi-species'

import { generateRandomInt } from './TestUtils'
import {
  aRickleInTimeImageCardProps, findingNemoSpeciesCardProps,     // URL in title, no URLs in content
  theSmithHouseholdImageCardProps, batmanFilmsSpeciesCardProps  // URLs in content, no URL in title
} from './TestUtils'
import ExtendableCard from '../src/ExtendableCard'

describe(`ExtendableCard`, () => {
  test(`can render species cards`, () => {
    const props = [batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps][generateRandomInt(0, 2)]
    const wrapper = shallow(<ExtendableCard {...props}/>)
    expect(wrapper.find(EbiSpeciesIcon)).toExist()
    expect(wrapper.find(`img`)).not.toExist()
  })

  test(`can render image cards`, () => {
    const props = [aRickleInTimeImageCardProps, theSmithHouseholdImageCardProps][generateRandomInt(0, 2)]
    const wrapper = shallow(<ExtendableCard {...props}/>)
    expect(wrapper.find(EbiSpeciesIcon)).not.toExist()
    expect(wrapper.find(`img`)).toExist()
  })

  test(`does not render title or content if empty`, () => {
    const props = {
      iconType: [`species`, `image`][generateRandomInt(0, 2)],
      iconSrc: ``
    }
    const wrapper = shallow(<ExtendableCard {...props} />)

    expect(wrapper.find(`h4`)).not.toExist()
    expect(wrapper.find(`li`)).not.toExist()
  })

  test(`does not show a link in title if URL is missing`, () => {
    const props = [theSmithHouseholdImageCardProps, batmanFilmsSpeciesCardProps][generateRandomInt(0, 2)]
    const wrapper = mount(<ExtendableCard {...props}/>)

    expect(wrapper).toContainExactlyOneMatchingElement(`h4`)
    expect(wrapper.find(`h4`)).toHaveText(props.description.text)
    expect(wrapper.find(`h4 a`)).not.toExist()
  })

  test(`does not show links in content if URLs are missing`, () => {
    const props = [aRickleInTimeImageCardProps, findingNemoSpeciesCardProps][generateRandomInt(0, 2)]
    const wrapper = mount(<ExtendableCard {...props}/>).find(`ul`)

    expect(wrapper).toContainExactlyOneMatchingElement(`ul`)
    expect(wrapper.find(`li`)).toHaveLength(props.content.length > 5 ? 5 : props.content.length)
    expect(wrapper.find(`li a`)).not.toExist()
  })

  test(`shows a link in the title if URL is present`, () => {
    const props = [aRickleInTimeImageCardProps, findingNemoSpeciesCardProps][generateRandomInt(0, 2)]
    const wrapper = shallow(<ExtendableCard {...props}/>)

    expect(wrapper.find(`h4 a`)).toExist()
  })

  test(`shows links in content if URLs are present`, () => {
    const props = [theSmithHouseholdImageCardProps, batmanFilmsSpeciesCardProps][generateRandomInt(0, 2)]
    const wrapper = shallow(<ExtendableCard {...props}/>)

    expect(wrapper.find(`li a`)).toHaveLength(props.content.length > 5 ? 5 : props.content.length)
  })

  test(`changes species icon size according to props`, () => {
    const props = batmanFilmsSpeciesCardProps
    const size = generateRandomInt(1, 10)
    const wrapper = shallow(<ExtendableCard {...props} speciesIconHeight={`${size}rem`}/>)

    expect(wrapper.find(`span`)).toHaveStyle(`fontSize`, `${size}rem`)
  })

  test(`changes image icon size according to props`, () => {
    const props = aRickleInTimeImageCardProps
    const size = generateRandomInt(100, 400)
    const wrapper = shallow(<ExtendableCard {...props} imageIconHeight={`${size}px`}/>)

    expect(wrapper.find(`img`)).toHaveStyle(`height`, `${size}px`)
  })

  test(`displays up to five content items by default with a button to show/hide the others`, () => {
    const props = [aRickleInTimeImageCardProps, batmanFilmsSpeciesCardProps][generateRandomInt(0, 2)]
    expect(props.content.length).toBeGreaterThan(5)

    const wrapper = shallow(<ExtendableCard {...props} />)
    expect(wrapper.find(`li`)).toHaveLength(5)
    wrapper.find(`button`).at(0).simulate(`click`)
    wrapper.update()
    expect(wrapper.find(`li`)).toHaveLength(props.content.length)
    wrapper.find(`button`).at(0).simulate(`click`)
    wrapper.update()
    expect(wrapper.find(`li`)).toHaveLength(5)
  })

  test.each([
    [aRickleInTimeImageCardProps.description.text, aRickleInTimeImageCardProps],
    [theSmithHouseholdImageCardProps.description.text, theSmithHouseholdImageCardProps],
    [batmanFilmsSpeciesCardProps.description.text, batmanFilmsSpeciesCardProps],
    [findingNemoSpeciesCardProps.description.text, findingNemoSpeciesCardProps]
  ])(`matches snapshot: %s`, (titleText, props) => {
    expect(mount(<ExtendableCard {...props}/>)).toMatchSnapshot()
  })
})
