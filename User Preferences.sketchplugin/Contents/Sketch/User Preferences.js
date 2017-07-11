@import 'UserDefaults.js'
@import 'DialogWrapper.js'


const pluginID = 'com.github.romashamin.sketch-user-preferences';
const defaultName = 'John Galt';
const key = 'userName';


function getPreferencesFromUser(context) {
  const document = context.document;

  const preferences = new UserDefaults(pluginID);
  const currentName = preferences.getValueForKey(key) || defaultName;

  const preferencesDialog = new DialogWrapper({
    header  : 'Set your name',
    buttons : [ 'Save', 'Cancel' ],
    elements : [
      { type : 'textLabel', value : 'Your name' },
      { type : 'textField', value : currentName, name : key }
    ]
  });

  if (preferencesDialog.isDefaultButtonClicked) {
    const userName = preferencesDialog.getElementValueByName(key);
    preferences.setValueForKey(userName, key);

    onRun(context, preferences);
  }
}


function onRun(context, prefs) {
  const document = context.document;

  const preferences = prefs || new UserDefaults(pluginID);
  const currentName = preferences.getValueForKey(key) || defaultName;

  document.showMessage('Hello, ' + currentName + '!');
}
