import React from 'react'
import ReactDOM from 'react-dom'
import URI from 'urijs'

import { CarouselCardsRow } from '../src/index'

const buildFeaturedExperimentsCards = (host) => {
  const linkToImage = (imgFileName) => URI(`resources/images/experiments-summary/${imgFileName}.png`, host).toString()
  const linkToExperiment = (accession) => URI(`experiments/${accession}`, host).toString()
  const linkToExperimentSet = (keyword) => URI(`experiments?experimentSet=${keyword}`, host).toString()

  return [
    {
      iconType: `image`,
      iconSrc: linkToImage(`encode`),
      description: {
        //   text: ``,
        url: linkToExperimentSet(`ENCODE`)
      },
      content: [
        {
          text: `Human tissues`,
          url: linkToExperiment(`E-MTAB-4344`)
        },
        {
          text: `Human cells`,
          url: linkToExperiment(`E-GEOD-26284`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`blueprint`),
      description: {
        //   text: ``,
        url: linkToExperimentSet(`BLUEPRINT`)
      },
      content: [
        {
          text: `Plasma cells of tonsil`,
          url: linkToExperiment(`E-MTAB-4754`)
        },
        {
          text: `Rare types of haemopoetic cells`,
          url: linkToExperiment(`E-MTAB-3819`)
        },
        {
          text: `Common types of haemopoetic cells`,
          url: linkToExperiment(`E-MTAB-3827`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`fantom`),
      description: {
        //   text: ``,
        url: linkToExperimentSet(`FANTOM5`)
      },
      content: [
        {
          text: `Mouse cells`,
          url: linkToExperiment(`E-MTAB-3578`)
        },
        {
          text: `Mouse tissues`,
          url: linkToExperiment(`E-MTAB-3579`)
        },
        {
          text: `Human tissues`,
          url: linkToExperiment(`E-MTAB-3358`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`human_protein_atlas`),
      description: {
        //   text: ``,
        url: linkToExperiment(`E-PROT-3`)
      },
      content: [
        {
          text: `Human tissues`,
          url: linkToExperiment(`E-PROT-3`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`ccle`),
      description: {
        //   text: ``,
        url: linkToExperiment(`E-MTAB-2770`)
      },
      content: [
        {
          text: `Cancer Cell Line Encyclopedia`,
          url: linkToExperiment(`E-MTAB-2770`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`hipsci`),
      description: {
        //   text: ``,
        url: linkToExperimentSet(`HipSci`)
      },
      content: [
        {
          text: `Proteomics – Cell lines`,
          url: linkToExperiment(`E-PROT-5`)
        },
        {
          text: `RNA – Cell lines`,
          url: linkToExperiment(`E-MTAB-4748`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`gtex`),
      description: {
        //   text: ``,
        url: linkToExperiment(`E-MTAB-5214`)
      },
      content: [
        {
          text: `Human tissues`,
          url: linkToExperiment(`E-MTAB-5214`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`pcawg`),
      description: {
        //   text: ``,
        url: linkToExperimentSet(`Pan-Cancer`)
      },
      content: [
        {
          text: `PCAWG by disease`,
          url: linkToExperiment(`E-MTAB-5200`)
        },
        {
          text: `PCAWG by individual`,
          url: linkToExperiment(`E-MTAB-5423`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`wtsi_mgh_cancerrxgene`),
      description: {
        //   text: ``,
        url: linkToExperiment(`E-MTAB-3983`)
      },
      content: [
        {
          text: `Genomics of Drug Sensitivity in Cancer Project – Cell lines`,
          url: linkToExperiment(`E-MTAB-3983`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`hdbr`),
      description: {
        //   text: ``,
        url: linkToExperiment(`E-MTAB-4840`)
      },
      content: [
        {
          text: `Prenatal brain development`,
          url: linkToExperiment(`E-MTAB-4840`)
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`baseline`),
      description: {
        //   text: ``,
        url: URI(`baseline/experiments`, host).toString()
      },
      content: [
        {
          text: `Baseline experiments`,
          url: URI(`baseline/experiments`, host).toString()
        }
      ]
    },
    {
      iconType: `image`,
      iconSrc: linkToImage(`gramene`),
      description: {
        //   text: ``,
        url: URI(`plant/experiments`, host).toString()
      },
      content: [
        {
          text: `Plant experiments`,
          url: URI(`plant/experiments`, host).toString()
        }
      ]
    }
  ]
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 6,
  autoplay: true,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

const render = (options, target) => {
  ReactDOM.render(
    <CarouselCardsRow
      cards={buildFeaturedExperimentsCards(`${process.env.SERVICE_URL}/gxa/`)}
      {...options}
      host={`${process.env.SERVICE_URL}/gxa/`}
      sliderSettings={sliderSettings}
    />,
    document.getElementById(target))
}

export { render }
