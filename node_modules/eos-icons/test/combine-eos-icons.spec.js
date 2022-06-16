const expect = require('chai').expect
const path = require('path')
const fs = require('fs')

const {
  combineIconsModels,
  showMissingOutlinedFiles
} = require('../scripts/combine-eos-icons.js')

const { config } = require('./settings')

const constants = {
  targetDirEosModels: `/test/dummy-data/model/`,
  targetDirMdModels: '/test/dummy-data/model/material/',
  destDirModels: '/test/__temp__/mix-models.json'
}

describe('# combine-eos-icons', function () {
  const { targetDirEosModels, targetDirMdModels, destDirModels } = constants

  describe('combineIconsModels()', function () {
    // TOOD: Try to understand why is not working on CI.
    it.skip('should generate a file that exists and, combines both models files in a single one', async function () {
      await combineIconsModels({
        targetDirEos: targetDirEosModels,
        targetDirMd: targetDirMdModels,
        destDir: destDirModels
      }).then(() => {
        const file1 = require(path.join(process.cwd() + config.models[0].src))
        const file2 = require(path.join(process.cwd() + config.models[2].src))

        // Get the combine output from the function
        const combineFile = require(path.join(
          process.cwd() + '/test/__temp__/mix-models.json'
        ))

        expect(JSON.stringify(combineFile).includes(JSON.stringify(file1))).to
          .be.true
        expect(JSON.stringify(combineFile).includes(JSON.stringify(file2))).to
          .be.true
      })
    })
  })

  describe('showMissingOutlinedFiles()', function () {
    before(async function () {
      await showMissingOutlinedFiles({
        normalSvgDir: './test/dummy-data/svg/',
        outlineSvgDir: './test/dummy-data/svg-outlined/',
        tempFolder: './test/__temp__/'
      })
    })

    it('should move the missing abstract.svg file to the __temp__ folder', async function () {
      const file = fs.existsSync(
        path.join(process.cwd() + '/test/__temp__/abstract.svg')
      )

      expect(file).to.be.true
    })
  })
})
