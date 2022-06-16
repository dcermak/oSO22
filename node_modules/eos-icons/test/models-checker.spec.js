const expect = require('chai').expect
const path = require('path')
const {
  checkForMissingModelsOrIcons,
  readModelKeys,
  outlinedModelsChecker,
  checkModelKeys,
  checkForKeys
} = require('../scripts/models-checker.js')
const { moveFiles } = require('./utils/files.util')

describe('# models-checker', () => {
  context('checkForMissingModelsOrIcons()', () => {
    it('should find missing models', async () => {
      const result = await checkForMissingModelsOrIcons({
        modelsSrc: '/test/dummy-data/model',
        mdModelsSrc: '/test/dummy-data/model/material',
        mdIconsSrc: '/test/dummy-data/svg/material',
        iconsSrc: '/test/dummy-data/svg',
        animatedSrc: '/test/dummy-data/animated'
      })

      expect(result.SVGsMissingModelsEOS[0]).to.eql('ai')
      expect(result.SVGsMissingModelsEOS[1]).to.eql('commit')
      expect(result.ModelsMissingSVGsEos[0]).to.eql('loading')
      expect(result.SVGsMissingModelsMd.length).to.eql(0)
      expect(result.ModelsMissingSVGsMd.length).to.eql(0)
    })

    context('readModelKeys()', () => {
      it('should read the models keys and add add the extra fileName to it', async () => {
        const response = await readModelKeys({
          modelsFolder: '/test/dummy-data/model'
        })

        expect(response[0]).to.have.property('fileName')
      })
    })

    context('outlinedModelsChecker()', () => {
      before(async () => {
        moveFiles(
          'test/dummy-data/persistent/json/abstract_incomplete.json',
          'test/__temp__/abstract_incomplete.json'
        )
        moveFiles(
          'test/dummy-data/persistent/svgs/abstract_incomplete.svg',
          'test/__temp__/abstract_incomplete.svg'
        )
      })

      it('should add the property of hasOutlined and dateOutlined to the model', async () => {
        await outlinedModelsChecker({
          outlineSvgDir: '/test/__temp__/',
          modelsFolder: '/test/__temp__/'
        })

        const modifiedFile = require('./__temp__/abstract_incomplete.json')
        const modifiedFile2 = require('./__temp__/abstract.json')

        expect(modifiedFile).to.have.property('hasOutlined')
        expect(modifiedFile).to.have.property('dateOutlined')
        expect(modifiedFile2).to.have.property('hasOutlined')
        expect(modifiedFile2).to.have.property('dateOutlined')
      })
    })

    context('checkModelKeys()', () => {
      it('should check and find the missing proprieties in a given json file ', async () => {
        const [name, tags, props] = await checkModelKeys(
          '/test/dummy-data/persistent/json/',
          '/test/dummy-data/persistent/json/'
        )

        expect(name.includes('Found: not_matching_name instead of keys_check'))
          .to.be.true
        expect(tags.includes('Tags missing in: keys_check.')).to.be.true
        expect(props.includes('Properties missing in')).to.be.true
      })
    })

    context('checkForKeys()', () => {
      it('should check and find the missing proprieties in a given json file ', async () => {
        const _modelAllProps = [
          'fileName',
          'name',
          'do',
          'dont',
          'tags',
          'category',
          'type',
          'hasOutlined',
          'date',
          'dateOutlined'
        ]

        const _modelMissingProps = []

        const hasAll = checkForKeys(_modelAllProps)
        const hasNotAll = checkForKeys(_modelMissingProps)

        expect(hasAll).to.to.true
        expect(hasNotAll).to.to.false
      })
    })
  })
})
