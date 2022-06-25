// Polyfill "window.fetch" used in the React component
import 'whatwg-fetch'

import { setupServer } from 'msw/node'
import { matchRequestUrl } from 'msw'

import { handlers } from './handlers'

function waitForRequest (method, url) {
  let requestId = ``
  return new Promise((resolve, reject) => {
    server.events.on(`request:start`, (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase()
      const matchesUrl = matchRequestUrl(req.url, url).matches
      if (matchesMethod && matchesUrl) {
        requestId = req.id
      }
    })

    server.events.on(`request:match`, (req) => {
      if (req.id === requestId) {
        //console.log(req.url.toString())
        resolve(req)
      }
    })

    server.events.on(`request:unhandled`, (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`)
        )
      }
    })
  })
}

export const server = setupServer(...handlers)
export { waitForRequest }
