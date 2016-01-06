/* global $ */
import fileTemplate from '../templates/file';

class UploadedFile {
  constructor(data, inputObj) {
    this.inputObj = inputObj;
    this.tempName = data.tempName;
    this.$container = $(document.createElement('div'));
    this.$container.html(fileTemplate(data));
    this.$container
    .on('click', '[data-el=remove]', () => {
      this.destroy();
    });
  }
  appendTo($el) {
    this.$container.appendTo($el);
  }
  destroy() {
    this.remove();
    this.inputObj.removeFile(this.tempName);
  }
  getTempName() {
    return this.tempName;
  }
  remove() {
    this.$container.remove();
  }
}

export default UploadedFile;
