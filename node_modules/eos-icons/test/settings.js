/**
 * Mocha's entry point.
 * We use this file to define and remove all files needes for the tests
 */
const path = require('path')

const { moveFiles, removeFile } = require('./utils/files.util')

const config = {
  models: [
    {
      src: '/models/abstract.json',
      dest: '/test/dummy-data/model/abstract.json'
    },
    {
      src: '/models/abstract.json',
      dest: '/test/__temp__/abstract.json'
    },
    {
      src: '/models/ai.json',
      dest: '/test/dummy-data/model/ai.json'
    },
    {
      src: '/models/commit.json',
      dest: '/test/dummy-data/model/commit.json'
    },
    {
      src: '/models/material/1k_plus.json',
      dest: '/test/dummy-data/model/material/1k_plus.json'
    }
  ],
  svgs: [
    // {
    //   src: '/svg-outlined/abstract.svg',
    //   dest: /'test/dummy-data/svg-outlined/abstract.svg'
    // },
    {
      src: '/svg/abstract.svg',
      dest: '/test/dummy-data/svg/abstract.svg'
    },
    {
      src: '/animated-svg/loading.svg',
      dest: '/test/dummy-data/animated/loading.svg'
    },
    {
      src: '/svg/material/1k_plus.svg',
      dest: '/test/dummy-data/svg/material/1k_plus.svg'
    },
    {
      src: '/svg-outlined/material/1k_plus.svg',
      dest: '/test/dummy-data/svg-outlined/material/1k_plus.svg'
    }
  ],
  targetDirEosModels: `./test/dummy-data/model/`,
  targetDirMdModels: './test/dummy-data/model/material/',
  destDirModels: './test/__temp__/mix-models.json'
}

const { models, svgs } = config

before('', () => {
  // console.log('📁  Moving files needed for the unit-testing');

  // Move needed models for the test
  models.map((ele) => {
    moveFiles(
      path.join(process.cwd() + ele.src),
      path.join(process.cwd() + ele.dest)
    )
  })

  // Moves needed svgs for the test
  svgs.map((ele) => {
    moveFiles(
      path.join(process.cwd() + ele.src),
      path.join(process.cwd() + ele.dest)
    )
  })
})

// TODO: Remove all files with extensions instead of manually pointing to files
after('', () => {
  // Removes models
  models.map((ele) => {
    removeFile(path.join(process.cwd() + ele.dest))
  })
  // Removes svgs
  svgs.map((ele) => {
    removeFile(path.join(process.cwd() + ele.dest))
  })
  removeFile(path.join(__dirname + '/__temp__/mix-models.json'))
  removeFile(path.join(__dirname + '/__temp__/abstract.svg'))
  removeFile('test/__temp__/abstract_incomplete.json')
  removeFile('test/__temp__/abstract_incomplete.svg')
  removeFile('test/__temp__/abstract.js')
})

module.exports = {
  config
}
