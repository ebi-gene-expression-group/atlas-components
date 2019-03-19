// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const generateRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

const aRickleInTimeImageCardProps = {
  iconType: `image`,
  iconSrc: `https://upload.wikimedia.org/wikipedia/en/6/6b/A_Rickle_in_Time.jpg`,
  description: {
    text: `A rickle in time`,
    url: `http://rickandmorty.wikia.com/wiki/A_Rickle_in_Time`
  },
  content: [
    {
      text: `Morty Smith`,
    },
    {
      text: `Summer Smith`,
    },
    {
      text: `Rick Sanchez`,
    },
    {
      text: `Rick Sanchez(split reality)`,
    },
    {
      text: `Morty Smith (split reality)`,
    },
    {
      text: `Summer Smith (split reality)`,
    }
  ]
}

const theSmithHouseholdImageCardProps = {
  iconType: `image`,
  iconSrc: `https://upload.wikimedia.org/wikipedia/en/b/b0/Rick_and_Morty_characters.jpg`,
  description: {
    text: `The Smith household`
  },
  content: [
    {
      text: `Jerry Smith`,
      url: `https://en.wikipedia.org/wiki/List_of_Rick_and_Morty_characters#Jerry_Smith`
    },
    {
      text: `Beth Smith`,
      url: `https://en.wikipedia.org/wiki/List_of_Rick_and_Morty_characters#Beth_Smith`
    },
    {
      text: `Summer Smith`,
      url: `https://en.wikipedia.org/wiki/List_of_Rick_and_Morty_characters#Summer_Smith`
    },
    {
      text: `Morty Smith`,
      url: `https://en.wikipedia.org/wiki/Morty_Smith`
    },
    {
      text: `Rick Sanchez`,
      url: `https://en.wikipedia.org/wiki/Rick_Sanchez_(Rick_and_Morty)`
    }
  ]
}

const batmanFilmsSpeciesCardProps = {
  iconType: `species`,
  iconSrc: `bat`,
  description: {
    text: `Batman films`
  },
  content: [
    {
      url: `https://en.wikipedia.org/wiki/Batman_(serial)`,
      text: `Batman (1943)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_and_Robin_(serial)`,
      text: `Batman and Robin (1949)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_(1966_film)`,
      text: `Batman (1966)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_(1989_film)`,
      text: `Batman (1989)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_Returns`,
      text: `Batman Returns (1992)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_Forever`,
      text: `Batman Forever (1995)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_%26_Robin_(film)`,
      text: `Batman &amp; Robin (1997)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_Begins`,
      text: `Batman Begins (2005)`
    },
    {
      url: `https://en.wikipedia.org/wiki/The_Dark_Knight_(film)`,
      text: `The Dark Knight (2008)`
    },
    {
      url: `https://en.wikipedia.org/wiki/The_Dark_Knight_Rises`,
      text: `The Dark Knight Rises (2012)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Batman_v_Superman:_Dawn_of_Justice`,
      text: `Batman v Superman: Dawn of Justice (2016)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Suicide_Squad_(film)`,
      text: `Suicide Squad (2016)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Justice_League_(film)`,
      text: `Justice League (2017)`
    },
    {
      url: `https://en.wikipedia.org/wiki/Joker_(2019_film)`,
      text: `Joker (2019)`
    }
  ]
}

const findingNemoSpeciesCardProps = {
  iconType: `species`,
  iconSrc: `zebrafish`,
  description: {
    text: `Finding Nemo`,
    url: `https://en.wikipedia.org/wiki/Finding_Nemo`
  },
  content: [
    {
      text: `Dory`,
    },
    {
      text: `Nemo`,
    },
    {
      text: `Gill`,
    }
  ]
}

export {
  generateRandomInt,
  aRickleInTimeImageCardProps, theSmithHouseholdImageCardProps,
  batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps
}
