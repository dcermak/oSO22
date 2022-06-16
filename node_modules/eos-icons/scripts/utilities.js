const fs = require('fs')
const path = require('path')

/**
 * Creates a JS file from JSON
 * @param {*} src file source
 * @param {*} dest file destination
 */
const jsFileFromJSON = async (src, dest) => {
  const icons = fs.readFileSync(src)

  return fs.writeFileSync(dest, `const eosIcons = ${icons}`)
}

/**
 * Returns an array of filenames from a given folder path
 * @param {*} dir relative (./) path to scan
 * @returns string[] => Array with all the filenames
 */
const readFilesNameInFolder = (dir) => {
  try {
    const icons = fs.readdirSync(
      path.join(process.cwd() + dir),
      (err, filenames) => {
        if (err) console.error(err)
        return filenames
      }
    )

    /* We filter out the subfolder (or others elements in the future) */
    const iconsContent = icons.filter((ele) => {
      return ele.includes('.svg') || ele.includes('.json') ? ele : null
    })

    /* Return the files name without the extension */
    return iconsContent.map((ele) => ele.split('.')[0])
  } catch (error) {
    /* Filtr out the erros that are not -2: Folder not found */
    console.log('ERROR: readFiles() => : ', error)
  }
}

/** // TODO: Replace with readDirectoryFilesContent()
 * Returns an array of a mix of all models
 * @param {string} dir relative (./) path to scan
 * @returns string[] => Array with all documents
 */
const readFilesContentInFolder = async (dir) => {
  const data = []
  fs.readdirSync(path.join(process.cwd(), dir), (err, files) => {
    if (err) console.log(err)

    return files
  }).map((file) => {
    if (file.includes('.json')) {
      data.push(
        JSON.parse(
          fs.readFileSync(`${path.join(process.cwd(), dir)}${file}`, 'utf8')
        )
      )
    }
  })

  return data
}

/**
 * Returns an array of the files content
 * @param {string} dir relative (./) path to scan
 * @param {string} type file format we want to read (.svg, .json, .js)
 * @returns string[] => Array with all documents
 */
const readDirectoryFilesContent = async (dir, type) => {
  console.log('type: ', type)
  const data = []
  fs.readdirSync(path.join(process.cwd(), dir), (err, files) => {
    if (err) console.log(err)

    return files
  }).map((file) => {
    // console.log('file.includes(type): ', file.includes(type))
    if (file.includes(type)) {
      if (type === '.json') {
        data.push(
          JSON.parse(
            fs.readFileSync(`${path.join(process.cwd(), dir)}${file}`, 'utf8')
          )
        )
      } else {
        data.push(
          fs.readFileSync(`${path.join(process.cwd(), dir)}${file}`, 'utf8')
        )
      }
    }
  })

  return data
}

/**
 * Reads a file content
 * @param {*} path url to the file (relative to /)
 * @returns file content
 */
const readFileContent = async (path) => {
  return new Promise((resolve, reject) => {
    try {
      const content = fs.readFileSync(`${(process.cwd(), path)}`, 'utf8')
      resolve(content)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Compares two arrays and returns the missing item
 * @param {*} array1 first array that holds the item
 * @param {*} array2 second array to be compared against
 * @returns array with the missing items on array2
 */
const compareArrays = (array1, array2) =>
  array1.filter((val) => !array2.includes(val))

/**
 * Comparte two objects to se if the content matches.
 * @param {string} first string to compare
 * @param {string} second string to be compare
 * @returns boolean for the comparation
 */
const compareObjects = ({ first, second }) => {
  return new Promise((resolve, reject) => {
    try {
      return resolve(JSON.stringify(first) === JSON.stringify(second))
    } catch (error) {
      return reject(error)
    }
  })
}

/**
 * Takes an string as KEY and an ARRAY to checked with and returns the list of matches
 * @param {string} key string as the key to scan for.
 * @param {array} array array with values, ex: ['ux', 'a11y', 'ops']
 * @returns {array} array with matches elements
 */
const elementIncludedInArray = (key, array) => {
  if (!key || !array || array.length === 0)
    throw Error('Key or Array was not provided')

  return array
    .map((ele) => {
      if (ele === '') throw Error('Element in array is empty')
      if (`${key.toLocaleLowerCase()}`.startsWith(ele.toLocaleLowerCase()))
        return ele
    })
    .filter((ele) => ele !== undefined)
}

module.exports = {
  jsFileFromJSON,
  readFilesNameInFolder,
  compareArrays,
  readFilesContentInFolder,
  compareObjects,
  readDirectoryFilesContent,
  readFileContent,
  elementIncludedInArray
}
