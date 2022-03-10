# Expression Atlas Information Banner
A React component that renders a message in Markdown, which can be dismissed by clicking a close button.

## Usage
```js
import AtlasInformationBanner from '@ebi-gene-expression/atlas-information-banner'

const loremIpsum = `
# Lorem ipsum

*Lorem ipsum dolor sit amet*, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
 
Ut enim ad minim veniam, --quis nostrud exercitation-- ullamco laboris nisi ut aliquip ex ea commodo consequat.

<a href="https://en.wikipedia.org/wiki/Lorem_ipsum">More about Lorem Ipsum</a> 
`

ReactDOM.render(
  <AtlasInformationBanner
    motd={loremIpsum} />,
  target)
```

## Props
| Name   | Type     | Default value |
|--------|----------|---------------|
| `motd` | `string` | `''`            |

The component supports [GitHub Flavoured Markdown](https://github.github.com/gfm/) as well as raw HTML tags.  If the 
`motd` prop is not a string or is empty, nothing is rendered.

## Look And Feel
For a correct presentational and functional behaviour the 
[EBI Visual Framework](https://www.ebi.ac.uk/style-lab/websites/) must be loaded in the document.  See 
`html/index.html` for a fully working example and a real use case. The current version has only been tested with v1.3
but other minor versions should work as well.

Other than removing the bottom margin from the callout, all other layout options are left to the client.