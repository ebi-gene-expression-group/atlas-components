# Atlas experiment table
We implement a sortable table header and check box table cell for downloading atlas experiments' files. [Evergreen  Table](https://evergreen.segment.com/) component is used in this repository.

## Table header/content props structure

Table information is passed by an array of objects, named as `tableHeader`, including mandatory entries `type`, `title`, `width` and `dataParam`.
If the table cell links to another page, please indicate `link`, `resource`, `endpoint`, which will be transformed as a href to `host/resource/data[link]/endpoint`

***For example:***
```
[
 {type: `plain`, title: `index`, width: 60, dataParam: null, link: null}
 {type: `sort`, title: `Loaded date`, width: 140, dataParam: `lastUpdate`, link: null},
 {type: `search`, title: `species`, width: 200, dataParam: `species`, link: null},
 {type: `search`, title: `experiment description`, width: 360, dataParam: `experimentDescription`,
            link: `experimentAccession`, resource: `experiments`, endpoint: `Results`},
 {type: `search`, title: `experiment factors`, width: 260, dataParam: `experimentalFactors`, link: null},
 {type: `sort`, title: `Number of assays`, width: 160, dataParam: `numberOfAssays`,
            link: `experimentAccession`, resource: `experiments`, endpoint: `Experiment Design`}
]
```

## Run it on your browser
Use Webpack-Dev-Server:
```
npx webpack-dev-server -d
```
