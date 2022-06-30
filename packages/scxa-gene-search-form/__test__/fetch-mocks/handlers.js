import { rest } from 'msw'

export const handlers = [
  rest.get('/gxa/sc/suggest', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          label: `Some category`,
          options: [
            {
              label: `Suggestion 1`,
              value: JSON.stringify({
                term: `Suggestion 1`,
                category: `some category`
              })
            },
            {
              label: `Suggestion 2`,
              value: JSON.stringify({
                term: `Suggestion 2`,
                category: `some category`
              })
            }
          ]
        },
        {
          label: `Another category`,
          options: [
            {
              label: `Suggestion 3`,
              value: JSON.stringify({
                term: `Suggestion 3`,
                category: `another category`
              })
            }
          ]
        }
      ])
    )
  }),
  rest.get('/gxa/sc/search', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({})
    )
  })
]
