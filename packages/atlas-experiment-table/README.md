# Atlas Experiment Table
An [Evergreen-based](https://evergreen.segment.com/) table with some bells and whistles to be used in
[Expression Atlas](https://www.ebi.ac.uk/gxa) and [Single Cell Expression Atlas](https://www.ebi.ac.uk/gxa/sc).
With very minor tweaks it can work as a general-purpose table with easy-to-configure searchable and sortable headers,
row pagination and dropdown filtering. The only hard requirement is that your table rows are objects instead of arrays
(which, to be honest, we don’t know if it’s a more common type for table data).

See the examples in the `html` directory for details.

*More documentation coming soon!*

## Run it on your browser
Use Webpack-Dev-Server:
```
npm install
npx webpack-dev-server -d
```

Then browse to either `http://localhost:9000/index-bulk.html` or `http://localhost:9000/index-sc.html`.
