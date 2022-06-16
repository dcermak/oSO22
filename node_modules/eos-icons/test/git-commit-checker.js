const { GIT_COMMIT_PREFIXES } = require('../scripts/constants')
const { elementIncludedInArray } = require('../scripts/utilities')

module.exports.main = (subject) => {
  // Check if the commit message is one of the semantic release tags
  if (elementIncludedInArray(subject, GIT_COMMIT_PREFIXES).length === 1) {
    // If it's a majo release, ask for confirmation
    if (
      elementIncludedInArray(subject, GIT_COMMIT_PREFIXES)[0] === 'Breaking:'
    ) {
      return process.stdout.write(`isBreaking`)
    } else if (
      elementIncludedInArray(subject, GIT_COMMIT_PREFIXES)[0] === 'New:' ||
      elementIncludedInArray(subject, GIT_COMMIT_PREFIXES)[0] === 'Update:'
    ) {
      return process.stdout.write(`isNew`)
    } else {
      return process.stdout.write(`notBreaking`)
    }
  }
}
