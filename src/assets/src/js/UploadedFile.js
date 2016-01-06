/* global $ */
import fileTemplate from '../templates/file';

class UploadedFile {
  constructor(data, inputObj) {
    this.inputObj = inputObj;
    this.filename = data.filename;
    this.$container = $(document.createElement('div'));
    this.$container.html(fileTemplate({
      filename: data.viewName,
    }));
    this.$container
    .on('click', '[data-el=remove]', () => {
      this.destroy();
    });
  }
  appendTo($el) {
    this.$container.appendTo($el);
  }
  destroy() {
    this.$container.remove();
    this.inputObj.removeUploadedFile(this.filename);
  }
}

export default UploadedFile;
