const fs = require('fs')
const axios = require('axios')
const inquirer = require('inquirer')
const path = require('path')

const { readFilesNameInFolder } = require('./utilities')

// List of icons in ./svg and ./svg/material folders
const eosIcons = readFilesNameInFolder('/svg/')
const mdIcons = readFilesNameInFolder('/svg/material')

const svgFilledCollection = [...eosIcons, ...mdIcons]

// List of icons in ./svg-outlined and ./svg-outlined/material folders
const eosOutlinedIcons = readFilesNameInFolder('/svg-outlined/')
const mdOutlinedIcons = readFilesNameInFolder('/svg-outlined/material')

const svgOutlinedCollection = [...eosOutlinedIcons, ...mdOutlinedIcons]

const inputForName = async () => {
  try {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '✅  Enter the new icon name (without .svg): ',
        validate: function (input) {
          const done = this.async()

          if (svgCollection.includes(input)) {
            done(`Already exists`)
          } else {
            done(null, true)
          }
        }
      }
    ])
  } catch (error) {
    console.log(error)
  }
}

const duplicateMDIcon = async (mdIcon) => {
  try {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: `✅ The SVG/ folder already has an icon with ${mdIcon}.svg name, do you want to mark this new icon as a duplicate?
        Please review the design before confirming.`,
        choices: ['Yes', 'No']
      }
    ])
  } catch (error) {
    console.log(error)
  }
}

/**
 * Downloads and saves a specif SVG to a given folder
 * @param {string[]} mdIconModelData documents array
 * @param {string} newName file name
 * @param {string} targetDirMd file target directory
 * @returns {void}
 */
const downloadSvgFiles = async (mdIconModelData, newName, targetDirMd) => {
  const filePath = path.resolve(process.cwd(), `.${targetDirMd}/${newName}.svg`)
  const svgCollectionPath = !targetDirMd.includes('svg-outlined')
    ? 'materialicons'
    : 'materialiconsoutlined'

  const url = `https://fonts.gstatic.com/s/i/${svgCollectionPath}/${mdIconModelData[0].name}/v${mdIconModelData[0].version}/24px.svg`
  const file = fs.createWriteStream(filePath)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  return response.data.pipe(file)
}

let nameIcon, svgCollection
const downloadMDFile = async (mdIconList, targetDirMd) => {
  const webMdIconsData = JSON.parse(
    fs.readFileSync('./scripts/md-web-data.json', 'utf8').replace(")]}'", '')
  )

  for (const mdIcon of mdIconList) {
    const mdIconModelData = webMdIconsData.icons.filter(
      (icon) => mdIcon === icon.name
    )
    if (targetDirMd === '/svg/material') {
      svgCollection = svgFilledCollection
    } else {
      svgCollection = svgOutlinedCollection
    }

    if (svgCollection.includes(mdIcon)) {
      await duplicateMDIcon(mdIcon).then(async (response) => {
        if (response.answer === 'Yes') {
          addDuplicateName(mdIcon)
        } else {
          await inputForName().then(async (response) => {
            nameIcon = response.name
            await downloadSvgFiles(mdIconModelData, nameIcon, targetDirMd).then(
              () => {
                if (targetDirMd === '/svg/material') {
                  createSvgModels(mdIconModelData, nameIcon)
                }
              }
            )
            addDuplicateName(mdIcon)
          })
        }
      })
    } else {
      await downloadSvgFiles(mdIconModelData, mdIcon, targetDirMd).then(() => {
        if (targetDirMd === '/svg/material') {
          createSvgModels(mdIconModelData, mdIcon)
        }
      })
    }
  }
}

const addDuplicateName = (duplicateIconName) => {
  const testData = JSON.parse(
    fs.readFileSync('./scripts/duplicated_icons.json', 'utf8')
  )
  testData.filled.push(duplicateIconName)
  fs.writeFileSync(
    `./scripts/duplicated_icons.json`,
    JSON.stringify(testData, null, 2)
  )
}

const createSvgModels = async (mdSvg, nameIcon) => {
  const today = new Date().toLocaleDateString()
  const newObject = {
    name: nameIcon,
    do: '',
    dont: '',
    tags: mdSvg[0].tags,
    category: mdSvg[0].categories,
    type: 'static',
    label: 'None',
    date: today
  }

  fs.writeFileSync(
    `./models/material/${nameIcon}.json`,
    JSON.stringify(newObject, null, 2),
    function (err) {
      if (err) {
        console.log(err)
      }
    }
  )
}

module.exports = {
  downloadMDFile,
  downloadSvgFiles
}
