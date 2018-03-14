const mockBioentityProperties = () => {
  return [ {
    type: `go`,
    name: `Gene Ontology`,
    values: [
      {
        text: `Link of relevance 1`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0000978`,
        relevance: 1
      },
      {
        text: `a Link of relevance 2`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0000978`,
        relevance: 2
      },
      {
        text: `Link of relevance 3`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0000978`,
        relevance: 3
      },
      {
        text: `b Link of relevance 2`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0000978`,
        relevance: 2
      },
      {
        text: `Link of relevance 3- another`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0000978`,
        relevance: 3
      },
      {
        text: `RNA polymerase II core promoter proximal region sequence-specific DNA binding`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0000978`,
        relevance: 0
      }, {
        text: `nucleic acid binding`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0003676`,
        relevance: 0
      }, {
        text: `intracellular`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0005622`,
        relevance: 0
      }, {
        text: `nucleus`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0005634`,
        relevance: 0
      }, {
        text: `transcription, DNA-templated`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0006351`,
        relevance: 0
      }, {
        text: `regulation of transcription, DNA-templated`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0006355`,
        relevance: 0
      }, {
        text: `zinc ion binding`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0008270`,
        relevance: 0
      }, {
        text: `metal ion binding`,
        url: `http://amigo.geneontology.org/amigo/term/GO%3A0046872`,
        relevance: 0
      }]
    },
    {
      type: `synonym`,
      name: `Synonym`,
      values: [
        {
          text: `Sftp1`,
          url: ``,
          relevance: 0
        },
        {
          text: `Sftp-1`,
          url: ``,
          relevance: 0
        },
        {
          text: `SP-A`,
          url: ``,
          relevance: 0
        },
        {
          text: `surfactant pulmonary associated protein A1`,
          url: ``,
          relevance: 0
        },
        {
          text: `SFTPA1`,
          url: ``,
          relevance: 0
        }
      ]
    },
    {
      type: `ensgene`,
      name: `Ensembl gene`,
      values: [
        {
          text: `ENSMUSG00000021789`,
          url: `http://www.ensemblgenomes.org/id-gene/ENSMUSG00000021789`,
          relevance: 0
        }
      ]
    },
    {
      type: `enstranscript`,
      name: `Ensembl transcript`,
      values: [
        {
          text: `ENSMUST00000170719`,
          url: `http://www.ensemblgenomes.org/id/ENSMUST00000170719`,
          relevance: 0
        },
        {
          text: `ENSMUST00000022314`,
          url: `http://www.ensemblgenomes.org/id/ENSMUST00000022314`,
          relevance: 0
        }
      ]
    }
  ]
}

export { mockBioentityProperties }