/**
 * Class representing a wrapper for COSAlertWindow
 *
 * Makes it easier to create a dialog using a special structure
 * and to get user input using field names
 *
 * Structure example
 * {
 *   header  : 'Set greeting name',
 *   // First button title must represent a default/primary action
 *   buttons : [ 'Save', 'Cancel' ],
 *   // For now only textLabel and textField types are supported
 *   // Define `name` property to be able get its value later
 *   elements : [
 *     { type : 'textLabel', value : 'Greeting name' },
 *     { type : 'textField', value : 'Michael', name : 'greetingName' }
 *   ]
 * }
 *
 * See also
 *   1. NSAlert → runModal()
 *      https://developer.apple.com/documentation/appkit/nsalert/1535441-runmodal?language=objc
 *
 */

class DialogWrapper {


  /**
   * Init a dialog wrapper.
   * @param {object} dialogStruct - Special structure, see an example in source file.
   */

  constructor(dialogStruct) {
    this.dialogStruct = dialogStruct || {
      mesageText : 'Something went wrong',
      buttons    : [ 'OK' ]
    };

    this.elementNameToIndexList = [];

    this.isDefaultButtonClicked   = false;
    this.isAlternateButtonClicked = false;

    this.dialog = this._createDialogFromStruct();
    this.showAndUpdateStatuses();
  }



  /**
   * Create COSAlertWindow instance.
   * @return {COSAlertWindow}
   */

  _createDialogFromStruct() {
    const alert = COSAlertWindow.new();

    if (this.dialogStruct.header) alert.setMessageText(this.dialogStruct.header);
    if (this.dialogStruct.info) alert.setInformativeText(this.dialogStruct.info);

    this.dialogStruct.buttons.forEach(
      (buttonTitle) => alert.addButtonWithTitle(buttonTitle)
    );
    this.dialogStruct.elements.forEach(
      (element) => this._addElementToDialog(alert, element)
    );
    this.dialogStruct.elements.forEach(function(element, i) {
      if (element.name) {
        this.elementNameToIndexList.push({ name : element.name, index : i });
      }
    }, this);

    return alert;
  }



  /**
   * Show the dialog and store a result.
   */

  _show() {
    this.result = this.dialog.runModal();
  }



  /**
   * Show the dialog and update `*ButtonClicked` statuses according result.
   */

  showAndUpdateStatuses() {
    this._show();

    if (this.result === 1000) {
      this.isDefaultButtonClicked = true;
    } else {
      this.isDefaultButtonClicked = false;
    }

    if (this.result === 1001) {
      this.isAlternateButtonClicked = true;
    } else {
      this.isAlternateButtonClicked = false;
    }

    if (this.result !== 1000 && this.result !== 1001) {
      this.isDefaultButtonClicked   = false;
      this.isAlternateButtonClicked = false;
    }
  }



  /**
   * Add an element to given dialog.
   * @param {COSAlertWindow}
   * @param {object}
   */

  _addElementToDialog(dialog, element) {
    const value = element.value || 'No value';

    switch (element.type) {
      case 'textLabel' :
        dialog.addTextLabelWithValue(value);
        break;

      case 'textField' :
        dialog.addTextFieldWithValue(value);
        break;

      default :
        dialog.addTextLabelWithValue(value);
    }
  }



  /**
   * Get user input by element name.
   * @param {string}
   * @param {string}
   */

  getElementValueByName(elementName) {
    const elementsWithSameName = this.elementNameToIndexList.filter(
      (element) => element.name === elementName
    );
    const element = elementsWithSameName[0];

    return this.dialog.viewAtIndex(element.index).stringValue();
  }
}
