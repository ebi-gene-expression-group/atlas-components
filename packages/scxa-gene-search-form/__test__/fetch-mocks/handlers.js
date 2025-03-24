import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/gxa/sc/suggest', async ({ request }) => {
    console.log('✅ MSW Handler triggered for /gxa/sc/suggest')

    return new HttpResponse(
        JSON.stringify([
          {
            label: 'Some category',
            options: [
              {
                label: 'Suggestion 1',
                value: JSON.stringify({
                  term: 'Suggestion 1',
                  category: 'some category',
                }),
              },
              {
                label: 'Suggestion 2',
                value: JSON.stringify({
                  term: 'Suggestion 2',
                  category: 'some category',
                }),
              },
            ],
          },
          {
            label: 'Another category',
            options: [
              {
                label: 'Suggestion 3',
                value: JSON.stringify({
                  term: 'Suggestion 3',
                  category: 'another category',
                }),
              },
            ],
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }),

  http.get('/gxa/sc/search', async ({ request }) => {
    return new HttpResponse(
        JSON.stringify({}),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }),
]
