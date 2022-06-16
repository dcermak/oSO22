const { readFilesNameInFolder } = require('./utilities')
const fs = require('fs')
const path = require('path')

/**
 * Function that takes an object with the models and icons source dir
 * @param {object} object {modelsSrc, mdModelsSrc, mdIconsSrc, iconsSrc, animatedSrc}
 * @returns {Promise} { SVGsMissingModelsEOS, SVGsMissingModelsMd, ModelsMissingSVGsEos, ModelsMissingSVGsMd }
 */
const checkForMissingModelsOrIcons = async (params) => {
  const { modelsSrc, mdModelsSrc, mdIconsSrc, iconsSrc, animatedSrc } = params

  try {
    /* Read both models and icons files names. */
    const existentModels = readFilesNameInFolder(modelsSrc)
    const existentIcons = readFilesNameInFolder(iconsSrc)
    const existentAnimatedIcons = readFilesNameInFolder(animatedSrc)
    const existentMdModels = readFilesNameInFolder(mdModelsSrc)
    const existentMdIcons = readFilesNameInFolder(mdIconsSrc)

    const SVGsMissingModelsEOS = compareTwoArraysOfElements(
      [...existentModels],
      [...existentIcons, ...existentAnimatedIcons]
    )

    const SVGsMissingModelsMd = compareTwoArraysOfElements(
      [...existentMdModels],
      [...existentMdIcons]
    )

    const ModelsMissingSVGsEos = compareTwoArraysOfElements(
      [...existentIcons, ...existentAnimatedIcons],
      [...existentModels]
    )

    const ModelsMissingSVGsMd = compareTwoArraysOfElements(
      [...existentMdIcons],
      [...existentMdModels]
    )

    /* Return an object with all the missing SVGs and Models */
    // return { SVGsMissingModels, ModelsMissingSVGs }
    return {
      SVGsMissingModelsEOS,
      SVGsMissingModelsMd,
      ModelsMissingSVGsEos,
      ModelsMissingSVGsMd
    }
  } catch (error) {
    console.log('ERROR: checkForMissingModelsOrIcons() => : ', error)
  }
}

/* Compare two arrays and returns the extra elements that are not part of the first array */
const compareTwoArraysOfElements = (array1, array2) =>
  array1.filter((ele) => !array2.includes(ele) && ele !== 'extended')

/* ==========================================================================
  Models properties checking
  ========================================================================== */
/**
 * Reads all models from a given folder
 * @param {*} {modelsFolder} models directory
 */
const readModelKeys = async (params) => {
  const { modelsFolder } = params

  /* Get all files inside the models folder */
  const filesName = readFilesNameInFolder(modelsFolder)

  /* For each file, read and parse the data */
  return filesName.map((ele) => {
    try {
      const fileData = fs.readFileSync(
        `${path.join(process.cwd(), modelsFolder)}/${ele}.json`,
        (err, data) => {
          if (err) console.error(err)

          return data
        }
      )

      return {
        fileName: ele,
        ...JSON.parse(fileData)
      }
    } catch (error) {
      // eslint-disable-next-line no-throw-literal
      if (error) throw `${ele}: ${error} `
    }
  })
}

/**
 * Will check the models for material icons and add the propriety of hasOutlined to them.
 * @param {object} { outlineSvgDir, modelsFolder} outline-svg and models folders
 */
const outlinedModelsChecker = async ({ outlineSvgDir, modelsFolder }) => {
  const models = await readModelKeys({ modelsFolder })

  const filesMd = fs
    .readdirSync(path.join(process.cwd(), outlineSvgDir), (err, file) => {
      if (err) console.log(err)
      return file
    })
    .filter((ele) => ele.includes('.svg'))

  const modelsToCreate = models.filter((ele) => {
    if (filesMd.includes(`${ele.name}.svg`)) return ele.name
  })

  return modelsToCreate.map((model) => {
    /* Get the object without the filename */
    const { fileName, ...newModel } = model
    /* If the object already has the property of hasOutlined, ignore it */
    if (newModel.hasOutlined && newModel.dateOutlined) return

    /* Rewrite the material-model to include the hasOutlined property */
    return fs.writeFileSync(
      `./${modelsFolder}/${model.name}.json`,
      JSON.stringify(
        {
          ...newModel,
          hasOutlined: true,
          dateOutlined: newModel.dateOutlined
            ? newModel.dateOutlined
            : new Date().toLocaleDateString()
        },
        null,
        2
      )
    )
  })
}

/**
 * Will check the models for material deleted or removed icons and remove the propriety of hasOutlined  dateOutlined.
 * @param {object} { outlineSvgDir, modelsFolder} outline-svg and models folders
 */
const missingOutlinedModelsChecker = async ({
  outlineSvgDir,
  modelsFolder
}) => {
  const models = await readModelKeys({ modelsFolder })

  const filesMd = fs
    .readdirSync(path.join(process.cwd(), outlineSvgDir), (err, file) => {
      if (err) console.log(err)
      return file
    })
    .filter((ele) => ele.includes('.svg'))

  /* Get the list of icons removed deleted from Outlined SVG folder and removed hasOutlined and dateOutlined  properties */
  const missingOutlinedMdIcons = models.filter((ele) => {
    if (!filesMd.includes(`${ele.name}.svg`)) return ele
  })

  if (missingOutlinedMdIcons.length > 0) {
    return missingOutlinedMdIcons.map((model) => {
      /* Get the object without the filename */
      if (!model.hasOutlined && !model.dateOutlined) {
      } else {
        /* Get the object without the hasOutlined and dateOutlined */
        const { hasOutlined, dateOutlined, ...newModel } = model
        /* If the object already has the property of hasOutlined, ignore it */
        return fs.writeFileSync(
          `./${modelsFolder}/${model.name}.json`,
          JSON.stringify(
            {
              ...newModel
            },
            null,
            2
          )
        )
      }
    })
  }
}

/* Maps throught the array of objects checking for models to have all listed proprieties */
const checkModelKeys = async (modelsSrc, materialModelsSrc) => {
  const modelsEos = await readModelKeys({ modelsFolder: modelsSrc })
  const modelsMd = await readModelKeys({ modelsFolder: materialModelsSrc })

  const modelsAll = [...modelsEos, ...modelsMd]
  const errors = []

  modelsAll.forEach((model) => {
    /* Make sure that the filename is eql to the models name */
    if (model.name !== model.fileName.split('.json')[0]) {
      errors.push(
        `\n⛔️  ${
          model.fileName
        } file name does not match models name property. Found: ${
          model.name
        } instead of ${model.fileName.split('.json')[0]}`
      )
    }

    /* Make sure there are tags in all models */
    if (model.tags.length < 1) {
      errors.push(`\n⛔️ Tags missing in: ${model.fileName}.`)
    }

    if (model.hasOutlined && !model.dateOutlined) {
      errors.push(
        `\n⛔️ Found hasOutlined property in ${model.fileName}, missing dateOutlined`
      )
    }

    /* If a key is missing, add the error to the array */
    if (!checkForKeys(Object.keys(model))) {
      errors.push(
        `\n⛔️ Properties missing in: ${model.fileName}. Make sure it has: name, do, dont, tags, category, type, and date`
      )
    }
  })

  return errors
}

/* Checks an object to see if it matches the given keys in the array */
const checkForKeys = (model) => {
  return [
    'name',
    'do',
    'dont',
    'tags',
    'category',
    'type',
    'date'
  ].every((key) => model.includes(key))
}

const outlineModelsAndSvgTest = async ({ outlinedSvgs, normalSvgs }) => {
  try {
    /* Read both models folders. */
    const outlined = readFilesNameInFolder(outlinedSvgs)
    const normal = readFilesNameInFolder(normalSvgs)

    /* Compare one with the other and extract the missing models and icons  */
    const difference = compareTwoArraysOfElements([...outlined], [...normal])

    /* Return an object with all the missing SVGs and Models */
    return { difference }
  } catch (error) {
    console.log('ERROR: checkForMissingModelsOrIcons() => : ', error)
  }
}

module.exports = {
  checkForMissingModelsOrIcons,
  checkModelKeys,
  outlinedModelsChecker,
  outlineModelsAndSvgTest,
  readModelKeys,
  checkForKeys,
  missingOutlinedModelsChecker
}
