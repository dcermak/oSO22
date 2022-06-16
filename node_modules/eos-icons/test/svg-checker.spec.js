const expect = require('chai').expect

const { compareMdThemeSvgs } = require('../scripts/svg-checker.js')
const { readFilesNameInFolder } = require('../scripts/utilities')

describe('# svg-checker', () => {
  let filled

  before(async () => {
    filled = readFilesNameInFolder('/test/dummy-data/svg')
  })

  context('compareMdThemeSvgs()', () => {
    it('should read the SVG and find that they match', async () => {
      const response = await compareMdThemeSvgs(
        `test/dummy-data/svg/${filled}.svg`,
        `test/dummy-data/svg/${filled}.svg`
      )

      expect(response.isSameIcon).to.eql(true)
      expect(response.fileName).to.eql(`test/dummy-data/svg/${filled}.svg`)
      expect(response.msg).to.eql(
        'The Outlined version is the same as the filled'
      )
    })
    it('should read the SVG and find that they do not match', async () => {
      const response = await compareMdThemeSvgs(
        `test/dummy-data/svg/${filled}.svg`,
        `test/dummy-data/svg/material/1k_plus.svg`
      )

      expect(response.isSameIcon).to.eql(false)
      expect(response.fileName).to.eql(`test/dummy-data/svg/${filled}.svg`)
      expect(response.msg).to.eql('')
    })
  })
})
