const { readFilesNameInFolder } = require('./utilities')

/**
 * Compares material and eos folders and returs duplicate filenames if any
 * @param {*} mdRepo Material Icons svgs folder
 * @param {*} eosRepo EOS Icons svgs folder
 * @returns {object} duplicatedEOSicon, duplicatedMDicon, duplicatedIconsList
 */
const compareFolders = async (params) => {
  const { mdRepo, eosRepo, eosModelsSrc, mdModelsSrc } = params

  try {
    /* Get the two arrays with the icons for md and eos */
    const mdIcons = readFilesNameInFolder(mdRepo)
    const eosIcons = readFilesNameInFolder(eosRepo)

    /**
     * We compare the two arrays for matching names
     */
    const duplicatedIconsList = mdIcons.filter((element) => {
      return eosIcons.includes(element)
    })

    /* Get the two arrays with the models for md and eos */
    const mdModelsList = readFilesNameInFolder(mdModelsSrc)
    const eosModelsList = readFilesNameInFolder(eosModelsSrc)

    /* Identify duplicated icons with an existing model in models/material/ */
    const duplicatedEOSicon = mdModelsList.filter((value) =>
      duplicatedIconsList.includes(value)
    )

    /* Identify duplicated icons with an existing model in models/ */
    const duplicatedMDicon = eosModelsList.filter((value) =>
      duplicatedIconsList.includes(value)
    )

    return { duplicatedEOSicon, duplicatedMDicon, duplicatedIconsList }
  } catch (error) {
    console.log('ERROR: compareFolders() => : ', error)
  }
}

module.exports = {
  compareFolders
}
