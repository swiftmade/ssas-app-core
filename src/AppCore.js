export default class AppCore {

  constructor(DEFAULTS) {
    this.configuration = {...DEFAULTS}
  }

  configure(config) {
    this.configuration = {
      ...this.configuration,
      ...config
    }
  }

  get(key) {
    return this.configuration[key]
  }

  has(key) {
    return this.get(key) !== undefined
  }
}