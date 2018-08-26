
const ScreepError = (name, code) => {
  const customErr = class extends Error {
    constructor (...args) {
      super(...args)
      Error.captureStackTrace(this, customErr)
      this.name = name
      this.code = code
    }
  }

  return customErr
}

const errors = {}

errors.notOwner = ScreepError('notOwner', -1)
errors.noPath = ScreepError('noPath', -2)
errors.nameExists = ScreepError('nameExists', -3)
errors.busy = ScreepError('busy', -4)
errors.notFound = ScreepError('notFound', -5)
errors.notEnoughEnergy = ScreepError('notEnoughEnergy', -6)
errors.notEnoughResources = ScreepError('notEnoughResources', -6)
errors.invalidTarget = ScreepError('invalidTarget', -7)
errors.full = ScreepError('full', -8)
errors.notInRange = ScreepError('notInRange', -9)
errors.invalidArgs = ScreepError('invalidArgs', -1-)
errors.tired = ScreepError('tired', -11)
errors.noBodyPart = ScreepError('noBodyPart', -12)
errors.notEnoughExtensions = ScreepError('notEnoughExtensions', -6)
errors.rclNotEnough = ScreepError('rclNotEnough', -14)
errors.gclNotEnough = ScreepError('gclNotEnough', -15)

module.exports = errors
