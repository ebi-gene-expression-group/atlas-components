const tabs = [
  {
    type: `results`,
    name: `Results`,
    props: {
      ks: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      metadata: [
        {
          value: `inferred cell type - authors labels`,
          label: `Inferred cell type - authors labels`
        },
        {
          value: `inferred cell type - ontology labels`,
          label: `Inferred cell type - ontology labels`
        }
      ],
      plotTypesAndOptions: {
        "t-SNE": [{ perplexity: 40 }, { perplexity: 25 }, { perplexity: 45 }, { perplexity: 1 }, { perplexity: 30 },
          { perplexity: 10 }, { perplexity: 15 }, { perplexity: 50 }, { perplexity: 35 }, { perplexity: 20 }, { perplexity: 5 }],
        UMAP: [{ n_neighbors: 5 }, { n_neighbors: 100 }, { n_neighbors: 50 }, { n_neighbors: 10 }, { n_neighbors: 30 }, { n_neighbors: 15 }, { n_neighbors: 3 }]
      },
      defaultPlotMethodAndParameterisation: { "t-SNE": { perplexity: 50 }, UMAP: { n_neighbors: 100 } },
      anatomogram: {
        pancreas: [`CL_0000097`, `CL_0000115`, `CL_0000145`, `CL_0000168`, `CL_0000169`, `CL_0000171`, `CL_0000173`,
          `CL_0000622`, `CL_0002079`, `CL_0002275`, `CL_0002410`, `CL_0002470`, `CL_0005019`, `CL_0008024`,
          `MONDO_0005148`, `NCBITaxon_9606`, `PATO_0000383`, `PATO_0000384`, `PATO_0000461`, `PATO_0001422`,
          `UBERON_0000006`, `UBERON_0001264`]
      },
      suggesterEndpoint: `json/suggestions`
    }
  },
  {
    type: `experiment-design`,
    name: `Experiment Design`,
    props: {
      downloadUrl: `experiment/E-MTAB-5061/download?fileType=experiment-design&accessKey=`,
      table: {
        headers: [
          {
            name: ``,
            values: [
              `Cell`
            ]
          },
          {
            name: `Sample Characteristics`,
            values: [
              `age`,
              `body mass index`,
              `cell type`,
              `disease`,
              `individual`,
              `organism`,
              `organism part`,
              `sex`,
              `single cell well quality`
            ]
          },
          {
            name: `Experimental Variables`,
            values: [
              `cell type`,
              `disease`
            ]
          }
        ],
        data: [
          {
            properties: {
              analysed: true
            },
            values: [
              [
                `ERR1630013`
              ],
              [
                `43 year`,
                `30.8`,
                `not applicable`,
                `normal`,
                `AZ`,
                `Homo sapiens`,
                `pancreas`,
                `male`,
                `low quality cell`
              ],
              [
                `not applicable`,
                `normal`
              ]
            ]
          },
          {
            properties: {
              analysed: true
            },
            values: [
              [
                `ERR1630014`
              ],
              [
                `43 year`,
                `30.8`,
                `delta cell`,
                `normal`,
                `AZ`,
                `Homo sapiens`,
                `pancreas`,
                `male`,
                `OK`
              ],
              [
                `delta cell`,
                `normal`
              ]
            ]
          },
          {
            properties: {
              analysed: true
            },
            values: [
              [
                `ERR1630015`
              ],
              [
                `43 year`,
                `30.8`,
                `alpha cell`,
                `normal`,
                `AZ`,
                `Homo sapiens`,
                `pancreas`,
                `male`,
                `OK`
              ],
              [
                `alpha cell`,
                `normal`
              ]
            ]
          }
        ]
      }
    }
  },
  {
    type: `supplementary-information`,
    name: `Supplementary Information`,
    props: {
      sections: [
        {
          type: `static-table`,
          name: `Analysis Methods`,
          props: {
            data: [
              [
                `Analysis`,
                `Software`,
                `Version`,
                `Citation`
              ],
              [
                `Build List`,
                `Build List`,
                `1.0.0`,
                ``
              ],
              [
                `clustering_slotnames`,
                `Replace Text`,
                `1.1.2`,
                `https://toolshed.g2.bx.psu.edu/view/bgruening/text_processing/0a8c6b61f0f4`
              ],
              [
                `Column arrange`,
                `Column arrange`,
                `0.2`,
                `https://toolshed.g2.bx.psu.edu/view/bgruening/column_arrange_by_header/6c6d26ff01ff`
              ],
              [
                `Cut`,
                `Cut`,
                `1.0.2`,
                ``
              ],
              [
                `filter_cells`,
                `Scanpy FilterCells`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_filter_cells/b28ba58033ea`
              ],
              [
                `Filtered cellgroup markers`,
                `Filter failed`,
                `1.0.0`,
                ``
              ],
              [
                `filter_genes`,
                `Scanpy FilterGenes`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_filter_genes/082832adea96`
              ],
              [
                `Filtering and trimming`,
                `fastq_utils`,
                `0.18.2`,
                `https://github.com/nunofonseca/fastq_utils`
              ],
              [
                `Filtering and trimming`,
                `FASTX-Toolkit`,
                `0.0.14`,
                `http://hannonlab.cshl.edu/fastx_toolkit/`
              ],
              [
                `find_clusters`,
                `Scanpy FindCluster`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_find_cluster/002f73dae0a7`
              ],
              [
                `find_markers`,
                `Scanpy FindMarkers`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_find_markers/e2f004c3b2b3`
              ],
              [
                `find_variable_genes`,
                `Scanpy FindVariableGenes`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_find_variable_genes/438a09194001`
              ],
              [
                `Gene/transcript quantification`,
                `kallisto`,
                `0.46.2`,
                `Nicolas L Bray, Harold Pimentel, Páll Melsted, Lior Pachter. Near-optimal probabilistic RNA-seq quantification. Nature Biotechnology (2016).`
              ],
              [
                `harmony_batch`,
                `Scanpy Harmony`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_integrate_harmony/c8eb5547846b`
              ],
              [
                `Join two Datasets`,
                `Join two Datasets`,
                `2.1.3`,
                ``
              ],
              [
                `make_project_file`,
                `AnnData Operations`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/anndata_ops/52ee45fd7690`
              ],
              [
                `merged_embeddings`,
                `Merge Collections`,
                `1.0.0`,
                ``
              ],
              [
                `neighbours for umap`,
                `Scanpy ComputeGraph`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_compute_graph/0fe56ddbab0d`
              ],
              [
                `normalise_data`,
                `Scanpy NormaliseData`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_normalise_data/f6a781314ca8`
              ],
              [
                `Pipeline`,
                `Gene expression group single-cell analysis pipeline (Nextflow)`,
                `20.04.1`,
                `https://github.com/ebi-gene-expression-group/scxa-control-workflow`
              ],
              [
                `QC`,
                `FastQC`,
                `0.11.8`,
                `http://www.bioinformatics.babraham.ac.uk/projects/fastqc/`
              ],
              [
                `Reference`,
                `Ensembl`,
                `106`,
                `Homo_sapiens.GRCh38.cdna.all.106.fa.gz, Homo_sapiens.GRCh38.106.gtf.gz`
              ],
              [
                `Remove beginning`,
                `Remove beginning`,
                `1.0.0`,
                ``
              ],
              [
                `resolution`,
                `Scanpy ParameterIterator`,
                `0.0.1+galaxy3`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_parameter_iterator/b9dd12ab0550`
              ],
              [
                `run_pca`,
                `Scanpy RunPCA`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_run_pca/4fbc4b97090f`
              ],
              [
                `run_tsne`,
                `Scanpy RunTSNE`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_run_tsne/753bf41cc2e3`
              ],
              [
                `run_umap`,
                `Scanpy RunUMAP`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_run_umap/0da35cd42e7c`
              ],
              [
                `Scanpy Read10x`,
                `Scanpy Read10x`,
                `1.8.1+2+galaxy0`,
                `https://toolshed.g2.bx.psu.edu/view/ebi-gxa/scanpy_read_10x/c2fe8568f35f`
              ],
              [
                `Configuration`,
                `scxa-workflows`,
                `e87b8ef`,
                `https://github.com/ebi-gene-expression-group/scxa-workflows`
              ]
            ]
          }
        },
        {
          type: `resources`,
          name: `Resources`,
          props: {
            url: `json/experiments/E-MTAB-5061/resources/SUPPLEMENTARY_INFORMATION`
          }
        }
      ]
    }
  },
  {
    type: `downloads`,
    name: `Downloads`,
    props: {
      data: [
        {
          title: `Metadata files`,
          files: [
            {
              url: `experiment/E-MTAB-5061/download/zip?fileType\u003dexperiment-metadata\u0026accessKey\u003d`,
              type: `icon-tsv`,
              description: `Experiment metadata (SDRF and IDF files archive)`,
              isDownload: true
            },
            {
              url: `experiment/E-MTAB-5061/download?fileType\u003dexperiment-design\u0026accessKey\u003d`,
              type: `icon-experiment-design`,
              description: `Experiment design file (TSV format)`,
              isDownload: true
            }
          ]
        },
        {
          title: `Result files`,
          files: [
            {
              url: `experiment/E-MTAB-5061/download?fileType\u003dcluster\u0026accessKey\u003d`,
              type: `icon-tsv`,
              description: `Clustering file (TSV format)`,
              isDownload: true
            },
            {
              url: `experiment/E-MTAB-5061/download/zip?fileType\u003dquantification-filtered\u0026accessKey\u003d`,
              type: `icon-tsv`,
              description: `Filtered TPMs files (MatrixMarket archive)`,
              isDownload: true
            },
            {
              url: `experiment/E-MTAB-5061/download/zip?fileType\u003dmarker-genes\u0026accessKey\u003d`,
              type: `icon-tsv`,
              description: `Marker gene files (TSV files archive)`,
              isDownload: true
            },
            {
              url: `experiment/E-MTAB-5061/download/zip?fileType\u003dnormalised\u0026accessKey\u003d`,
              type: `icon-tsv`,
              description: `Normalised counts files (MatrixMarket archive)`,
              isDownload: true
            },
            {
              url: `experiment/E-MTAB-5061/download/zip?fileType\u003dquantification-raw\u0026accessKey\u003d`,
              type: `icon-tsv`,
              description: `Raw counts files (MatrixMarket archive)`,
              isDownload: true
            }
          ]
        }
      ]
    }
  }

]
