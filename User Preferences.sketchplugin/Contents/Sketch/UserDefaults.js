/**
 * Class that helps work with saving user data
 */

class UserDefaults {


  /**
   * Constructor.
   * @param {string}
   */

  constructor(pluginID) {
    this.pluginID = pluginID;
    this.userDefaults = NSUserDefaults.standardUserDefaults();
  }



  /**
   * @param {string} value
   * @param {string} key
   */

  setValueForKey(value, key) {
    let preferences;

    if (!this.userDefaults.dictionaryForKey(this.pluginID)) {
      preferences = NSMutableDictionary.alloc().init();
    } else {
      const dictionary = this.userDefaults.dictionaryForKey(this.pluginID);

      preferences = NSMutableDictionary.dictionaryWithDictionary(dictionary);
    }

    preferences.setObject_forKey(value, key);
    this.userDefaults.setObject_forKey(preferences, this.pluginID);
    this.userDefaults.synchronize();
  }



  /**
   * @param {string} key
   */

  getValueForKey(key) {
    const dictionary = this.userDefaults.dictionaryForKey(this.pluginID);

    if (!dictionary) return null;

    return dictionary.objectForKey(key);
  }
}
