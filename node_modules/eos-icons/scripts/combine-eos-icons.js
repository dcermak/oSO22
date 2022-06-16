const fs = require('fs-extra')
const path = require('path')
const { readFilesContentInFolder } = require('./utilities')

/** Combines both EOS and MD models into a single file
 * @param targetDirEos eos models
 * @param targetDirMd md models
 * @param destDir file destination directory
 */
const combineIconsModels = async (params) => {
  /* It takes a targetDir where the files.json are and the destination file. */
  const { targetDirEos, targetDirMd, destDir } = params

  try {
    const eosModelsArray = await readFilesContentInFolder(targetDirEos)
    const mdModelsArray = await readFilesContentInFolder(targetDirMd)

    return new Promise((resolve, reject) => {
      return fs.writeFile(
        path.join(process.cwd(), destDir),
        JSON.stringify([...eosModelsArray, ...mdModelsArray], null, 2),
        (err) => {
          if (err) reject(err)

          return resolve()
        }
      )
    })
  } catch (error) {
    console.log(error)
  }
}

const showMissingOutlinedFiles = async ({
  outlineSvgDir,
  normalSvgDir,
  tempFolder
}) => {
  const exits = fs.existsSync(tempFolder)

  if (!exits) {
    fs.mkdirSync(tempFolder)
  }

  // Get all the outline icons version
  const outlineList = fs
    .readdirSync(outlineSvgDir, (err, file) => {
      if (err) console.log(err)
      return file
    })
    .filter((ele) => ele.includes('.svg'))

  const eosIcons = fs
    .readdirSync(normalSvgDir, (err, file) => {
      if (err) console.log(err)
      return file
    })
    .filter((ele) => ele.includes('.svg'))

  const filtered = eosIcons.filter(function (x) {
    return outlineList.indexOf(x) < 0
  })

  // Move the missing files to complete the outline version
  filtered.map((icon) => {
    fs.copyFile(`${normalSvgDir}/${icon}`, `${tempFolder}/${icon}`, (err) => {
      if (err) throw err
    })
  })

  return `Done moving ${filtered.length} files to complete the missing version`
}

module.exports = {
  combineIconsModels,
  showMissingOutlinedFiles
}
