const DEFAULTS = {
  /**
   * During launch, this logo will be used if a downloaded logo is not present.
   */
  "defaultLaunchLogo": require('./Assets/ssas.png'),

  /**
   * Default Launch Name: this name will be displayed if the app is not connected to any domain yet.
   */
  "defaultLaunchName": "RiskrApps",

  /**
   * Base URL for API communications
   */
  "endpoint": "http://%domain%.riskrapps.net/api/v1",

  /**
   * Lock into the provided domain. Null disables it.
   * To use it, pass a string that will replace %domain% variable in endpoint url.
   */
  "domainLock": null,

  /**
   * Turn off survey validation. Useful for testing purposes.
   */
  validationOff: false
}

class AppCore {

  constructor() {
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
    return this.get(key) !== null
  }
}

const appCoreInstance = new AppCore()
export default appCoreInstance