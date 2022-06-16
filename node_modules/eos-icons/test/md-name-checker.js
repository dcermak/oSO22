const expect = require('chai').expect
const path = require('path')

const { removeFile, moveFiles } = require('./utils/files.util')
const { compareFolders } = require('../scripts/md-name-checker.js')

describe('# md-name-checker', () => {
  context('compareFolders()', () => {
    before(async () => {
      await moveFiles(
        path.join(process.cwd() + '/svg/ai.svg'),
        path.join(process.cwd() + '/test/dummy-data/svg/ai.svg')
      )

      return await moveFiles(
        path.join(process.cwd() + '/svg/ai.svg'),
        path.join(process.cwd() + '/test/dummy-data/svg/material/ai.svg')
      )
    })

    after(async () => {
      await removeFile(path.join(process.cwd() + '/test/dummy-data/svg/ai.svg'))

      await removeFile(
        path.join(process.cwd() + '/test/dummy-data/svg/material/ai.svg')
      )
    })

    it('should compare the models and svgs and find the duplicated svg', async () => {
      const {
        duplicatedEOSicon,
        duplicatedMDicon,
        duplicatedIconsList
      } = await compareFolders({
        mdRepo: '/test/dummy-data/svg/material',
        eosRepo: '/test/dummy-data/svg/',
        eosModelsSrc: '/test/dummy-data/model',
        mdModelsSrc: '/test/dummy-data/model/material'
      })

      expect(duplicatedEOSicon).length(0)
      expect(duplicatedMDicon).length(1)
      expect(duplicatedIconsList).length(1)
    })
  })
})
