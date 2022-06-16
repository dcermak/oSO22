const fs = require('fs')

/**
 * Moves a file from source to destination
 * @param {string} src source folder
 * @param {string} dest destination folder
 * @returns
 */
const moveFiles = async (src, dest) => {
  new Promise((resolve, reject) => {
    try {
      fs.copyFile(src, dest, (err) => {
        if (err) reject(err)
        resolve()
      })
    } catch (error) {
      console.log('error: ', error)
      reject(error)
    }
  })
}

/**
 * Removes a file given ab absoulte path
 * @param {string} file
 */
const removeFile = async (file) => {
  fs.unlinkSync(file, (err) => {
    if (err) console.log(err)
    console.log(`${file} was deleted`)
  })
}

module.exports = {
  moveFiles,
  removeFile
}
