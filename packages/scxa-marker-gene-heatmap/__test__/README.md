IMPORTANT
=========

We’ve experimented over some years that the path to the React-wrapped Highcharts object has changed a few times, making
it difficult to access it with Enzyme in a foolproof way. At the time of writing (and as of version 1.7.0),
`highcharts-react-official@3.0.0` creates a `Memo` (?) React component, so we need to get to it by “counting children”
starting from the returned component in our `render` method:
```javascript
wrapper.children().first().props().options
```
