/* global $ */

import FlowFileInput from './js/FlowFileInput';

$.fn.flowFileUpload = function flowFileUpload(options = {}, ...args) {
  const defaults = {
    flowOptions: {},
  };
  const publicMethods = ['reset'];

  return this.each(() => {
    let flowFileInput = this.data('flowFileUpload');
    if (flowFileInput instanceof FlowFileInput
      && typeof options === 'string'
      && publicMethods.indexOf(options) !== -1) {
      flowFileInput[options].apply(flowFileInput, args);
    } else if (flowFileInput === undefined) {
      flowFileInput = new FlowFileInput(
        this,
        $.extend(true, {}, options, defaults)
      );
      this.data('flowFileUpload', flowFileInput);
    }
  });
};
