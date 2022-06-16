const fs = require('fs')
const inquirer = require('inquirer')
const { readFilesNameInFolder, readFileContent } = require('./utilities')

const namingConventionRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/g

/* Runs every SVG name aginst a regular expression */
const checkSvgName = async (params) => {
  const { mdDir, eosDir } = params

  /* Reads all the svg files and remove the .svg from the name */
  const eosIcons = readFilesNameInFolder(eosDir)
  const eosIconsNew = eosIcons.filter(
    (ele) => ele.match(namingConventionRegex) === null
  )

  const mdIconsMd = readFilesNameInFolder(mdDir)
  const mdIconsMdNew = mdIconsMd.filter(
    (ele) => ele.match(namingConventionRegex) === null
  )

  /* Checks that the name match the regex, if not, returns it */
  return { eosIconsNew, mdIconsMdNew }
}

const renameSvgTo = async (originalFile, filePath, otherFilePath) => {
  const eosSVG = readFilesNameInFolder(filePath)
  const mdSVG = readFilesNameInFolder(otherFilePath)
  const svgCollections = [...eosSVG, ...mdSVG]

  try {
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Indicate the new name (without .svg): ',
          validate: function (input) {
            const done = this.async()

            !input.length
              ? done(`Field can't be blank`)
              : !input.match(namingConventionRegex)
              ? done(
                  `Wrong naming convention, please use: filename or file_name`
                )
              : svgCollections.includes(input)
              ? done(
                  `This file name already exists. Please enter a new unique name`
                )
              : done(null, true)
          }
        }
      ])
      .then((data) => {
        return fs.rename(
          `.${filePath}/${originalFile}.svg`,
          `.${filePath}/${data.name}.svg`,
          function (err) {
            if (err) console.log(`ERROR: ${err}`)
            console.log(
              `File was renamed from ${originalFile}.svg to ${data.name}.svg`
            )
          }
        )
      })
  } catch (error) {
    console.log('inputForModel(): ', error)
  }
}

const deleteDuplicateSvg = async (iconName) => {
  await selectIconFolder().then(async (response) => {
    if (response.answer === 'EOS (svg/)') {
      fs.unlinkSync(`./svg/material/${iconName}.svg`)
    } else {
      fs.unlinkSync(`./svg/${iconName}.svg`)
      console.log('Duplicated file from EOS is deleted!')
    }
  })
}

const selectIconFolder = async () => {
  try {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message:
          '✅ Two icons with the same name were found, please select which one you want to keep: ',
        choices: ['EOS (svg/)', 'Material (svg/material/)']
      }
    ])
  } catch (error) {
    console.log(error)
  }
}

/**
 * Will compare the filled SVG to the outline SVG
 * @param {*} filledPath path to the reference, filled SVG file
 * @param {*} outlinedPath path to the outlined version of the SVG
 */
const compareMdThemeSvgs = async (filledPath, outlinedPath) => {
  try {
    const filled = await readFileContent(filledPath)
    const outlined = await readFileContent(outlinedPath)

    // Comprate the two SVGs as strings
    const comparation = filled === outlined

    return {
      isSameIcon: comparation,
      fileName: filledPath.replace('svg/material/', ''),
      msg: comparation ? 'The Outlined version is the same as the filled' : ''
    }
  } catch (error) {
    console.error('error: ', error)
  }
}

/**
 * Adds to duplicated_icons.json the name of the SVGs that have the same code for both filled and outlined
 * @param {*} filledArray Array of MD filled SVG names to compare vs the outlined folder.
 */
const writeDuplicateSvgsTheme = async (filledArray) => {
  const duplicatedIconsList = JSON.parse(
    fs.readFileSync('./scripts/duplicated_icons.json', 'utf8')
  )

  const data = await Promise.all(
    filledArray.map(async (ele) => {
      // Dont compare the files if the element is already on the duplicate_icons.json
      if (duplicatedIconsList.outlined.includes(ele)) return

      const comparationResult = await compareMdThemeSvgs(
        `svg/material/${ele}.svg`,
        `svg-outlined/material/${ele}.svg`
      )

      if (comparationResult && comparationResult.isSameIcon)
        return comparationResult
    })
  )

  // Filter out out the files that are not the same.
  const filterDuplicates = data
    .filter((ele) => ele !== undefined)
    .map((ele) => {
      return ele.fileName.replace('.svg', '')
    })

  return fs.writeFileSync(
    `./scripts/duplicated_icons.json`,
    JSON.stringify(
      {
        filled: [...duplicatedIconsList.filled],
        outlined: [...duplicatedIconsList.outlined, ...filterDuplicates]
      },
      null,
      2
    )
  )
}

module.exports = {
  checkSvgName,
  renameSvgTo,
  deleteDuplicateSvg,
  compareMdThemeSvgs,
  writeDuplicateSvgsTheme
}
