const fs = require('fs')
const expect = require('chai').expect

const {
  downloadMaterialIconsList
} = require('../scripts/eos-md-icons-log-differences')

const { removeFile } = require('./utils/files.util')

describe('# eos-md-icons-log-differences', () => {
  context('downloadMaterialIconsLIst()', () => {
    before(async () => {
      await downloadMaterialIconsList('../test/__temp__/md-icons-list.json')
    })

    after(async () => {
      await removeFile('test/__temp__/md-icons-list.json')
    })

    it('should download the material icons list', () => {
      const file = fs.existsSync('test/__temp__/md-icons-list.json')

      expect(file).to.be.true
    })
  })
})
