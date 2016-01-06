/* global $ */

import FlowFileInput from './js/FlowFileInput';

$.fn.flowFileUpload = function flowFileUpload(options = {}) {
  const defaults = {
    flowOptions: {},
  };

  return this.each(() => {
    const data = this.data('flowFileUpload');
    if (!data) {
      const flowFileInput = new FlowFileInput(
        this,
        $.extend(true, {}, options, defaults)
      );
      this.data('flowFileUpload', flowFileInput);
    }
  });
};
