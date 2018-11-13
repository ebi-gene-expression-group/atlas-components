

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

const dummyCards = () => {
  return [
    {
      iconType: `species`,
      iconSrc: `mus musculus`,
      iconDescription: `Mus musculus`,
      content: [
        {
          text: `4 experiments`,
        }
      ]
    },
    {
      iconType: `species`,
      iconSrc: `homo sapiens`,
      iconDescription: `Homo sapiens`,
      content: [
        {
          text: `2 experiments`,
        }
      ]
    },
    {
      iconType: `unknown`,
      iconSrc: `http://www.lingyun.com`,
      iconDescription: `Mus musculus`,
      content: [
        {
          text: `4 experiments`,
        }
      ]
    },
    {
      iconType: `experiments`,
      iconSrc: `http://www.zhao.com`,
      iconDescription: `Homo sapiens`,
      content: [
        {
          text: `2 experiments`,
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: `logo-goes-here`,
      iconDescription: `An image card`,
      content: [
        {
          text: `Go to experiments`,
        }
      ]
    },
    {
      iconType: `imagespecies`,
      iconSrc: `http://www.lingyun.com`,
      iconDescription: `Mus musculus`,
      content: [
        {
          text: `4 experiments`,
        }
      ]
    },
  ]
}

export {getRandomInt, dummyCards}