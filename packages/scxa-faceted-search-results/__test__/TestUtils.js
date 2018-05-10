// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const vindicators = [
  { value: `supernova`, label: `Supernova`},
  { value: `noob-noob`, label: `Noob-Noob` },
  { value: `vance_maximus`, label: `Vance Maximus`},
  { value: `alan_rails`, label: `Alan Rails`},
  { value: `crocubot`, label: `Crocubot` },
  { value: `million_ants`, label: `Million Ants`},
  { value: `morty_smith`, label: `Morty Smith`},
  { value: `rick_sanchez`, label: `Rick Sanchez`},
  { value: `lady_katana`, label: `Lady Katana`},
  { value: `calypso`, label: `Calypso`},
  { value: `diablo_verde`, label: `Diablo Verde`}
]

export {getRandomInt, vindicators}
