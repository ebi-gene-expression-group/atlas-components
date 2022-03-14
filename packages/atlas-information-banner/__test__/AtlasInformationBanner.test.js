/**
 * @jest-environment jsdom
 */
import React from 'react'
import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'

import AtlasInformationBanner from '../src/AtlasInformationBanner'

// React-Markdown and Jest don’t get along
// https://github.com/facebook/create-react-app/issues/11946
jest.mock(`react-markdown`, () => (props) => { return <>{props.children}</> })
jest.mock(`remark-gfm`, () => () => {})
jest.mock(`rehype-raw`, () => () => {})

const props = {
  motd: [
    `**Help us improve Single Cell Expression Atlas**`,
    ``,
    `We are continuously developing the resource to deliver the best possible service for the community;`,
    `Please take two minutes to fill out our user survey and help us make Expression Atlas even better.`,
    ``,
    `<a target={_blank} href="https://www.surveymonkey.co.uk/r/SCEAsurvey22" class="button">Take survey</a>`
  ].join(`\n`)
}

describe(`AtlasInformationBanner`, () => {
  test(`renders nothing if no message is passed`, () => {
    render(<AtlasInformationBanner />)
    expect(screen.queryByRole(`complementary`)).not.toBeInTheDocument()
  })

  test(`renders nothing if an empty string is passed`, () => {
    render(<AtlasInformationBanner motd={`    `} />)
    expect(screen.queryByRole(`complementary`)).not.toBeInTheDocument()
  })

  test(`renders a Foundation callout box with a close button if an empty string is passed`, () => {
    render(<AtlasInformationBanner {...props} />)
    expect(screen.getByRole(`complementary`)).toHaveClass(`callout`)
    expect(screen.getByRole(`button`)).toHaveClass(`close-button`)
  })

  // Unfortunately we can’t test this because we’re relying on Foundation to do the disappearing for us, which is code
  // injected via a <script> tag in the HTML document where the component is rendered.
  // test(`disappears when the close button is clicked`,  async () => {
  //   render(<AtlasInformationBanner {...props} />)
  //   userEvent.click(screen.getByRole(`button`))
  //   await waitForElementToBeRemoved(() => screen.queryByRole(`complementary`))
  // })

  test(`matches snapshot with a typical MOTD`, () => {
    const tree = renderer.create(<AtlasInformationBanner {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
