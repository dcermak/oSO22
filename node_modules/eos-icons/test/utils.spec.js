// Testing the utils functions
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const {
  readFilesNameInFolder,
  readFilesContentInFolder,
  compareArrays,
  jsFileFromJSON,
  compareObjects
} = require('../scripts/utilities')

describe('# utils functions', () => {
  context('readFilesNameInFolder()', () => {
    it('should find one single svg and json file', async () => {
      const svg = readFilesNameInFolder('/test/dummy-data/persistent/svgs/')
      const json = readFilesNameInFolder('/test/dummy-data/persistent/json/')

      expect(svg[0]).to.eql('abstract_incomplete')
      expect(json[0]).to.eql('abstract_incomplete')
      expect(svg.length).to.eql(1)
      expect(json.length).to.eql(2)
    })
  })

  context('compareArrays()', () => {
    const array1 = ['item1', 'item2']
    const array2 = ['item1', 'item3']

    it('should return item2 as missing item from array2', async () => {
      const res = compareArrays(array1, array2)

      expect(res).to.be.length(1)
      expect(res[0]).to.eql('item2')
    })

    it('should return item3 as missing item from array1', async () => {
      const res = compareArrays(array2, array1)

      expect(res).to.be.length(1)
      expect(res[0]).to.eql('item3')
    })
  })

  context('jsFileFromJSON()', () => {
    before(async () => {
      await jsFileFromJSON(
        path.join(process.cwd(), '/test/__temp__/abstract.json'),
        path.join(process.cwd(), '/test/__temp__/abstract.js')
      )
    })

    it('should create an JS file from the JSON file.', async () => {
      const file = fs.existsSync(
        path.join(process.cwd() + '/test/__temp__/abstract.js')
      )

      expect(file).to.be.true
    })
  })

  context('readFilesContentInFolder()', () => {
    it('should be able to read the content of the .json files', async function () {
      const data = await readFilesContentInFolder('/test/dummy-data/model/')

      expect(data.length > 2).to.be.true
    })
  })

  context('compareObjects()', () => {
    it('should compare svgs files', async function () {
      const filled = fs.readFileSync(
        path.join(process.cwd(), 'test/__temp__/abstract_incomplete.json'),
        async (err, data) => {
          if (err) return err

          return data
        }
      )

      const outlined = fs.readFileSync(
        path.join(
          process.cwd(),
          '/test/dummy-data/svg-outlined/material/1k_plus.svg'
        ),
        async (err, data) => {
          if (err) return err

          return data
        }
      )

      const response = await compareObjects({
        first: filled.toString(),
        second: outlined.toString()
      })

      expect(response).false
    })

    it('should compare both objects', async function () {
      const objects = await compareObjects({
        first: { a: true },
        second: { a: true }
      })
      const objects2 = await compareObjects({
        first: { a: false },
        second: { a: true }
      })

      expect(objects).true
      expect(objects2).false
    })
  })
})
