/* global Flow */
/* global $ */
import flowFileInput from '../templates/flowFileInput';
import File from './File';
import UploadedFile from './UploadedFile';
import style from '../css/main.css';

class FlowFileInput {
  constructor($el, options) {
    this.$input = $el;
    this.$container = $('<div/>').html(flowFileInput());
    this.$input.after(this.$container);
    this.flow = new Flow(options.flowOptions);
    this.uploadedFiles = {};
    this.files = {};
    this.headers = options.flowOptions.headers;
    this.options = options;
    this.restoreFiles();
    this.createFlowInputs();

    this.flow.on('filesSubmitted', (flowFiles) => {
      this.flow.upload();
      this.appendFiles(flowFiles);
    });
    this.flow.on('fileSuccess', (flowFile, message) => {
      const {tempName} = JSON.parse(message);
      this.uploadedFiles[tempName] = flowFile.name;
      this.files[flowFile.uniqueIdentifier].setTempName(tempName);
      this.updateValue();
    });
    this.flow.on('uploadStart', () => {
      this.$input.trigger('uploadStart');
    });
    this.flow.on('complete', () => {
      this.$input.trigger('complete');
    });
    this.flow.on('error', () => {
      this.$input.trigger('error');
    });
  }
  updateValue() {
    const keys = Object.keys(this.uploadedFiles);
    if (keys.length) {
      this.$input.val(JSON.stringify(this.uploadedFiles));
    } else {
      this.$input.val('');
    }
  }
  appendFiles(flowFiles) {
    flowFiles.forEach((flowFile) => {
      const file = new File(flowFile, this);
      file.appendTo(this.$container.find('[data-el=files]'));
      this.files[flowFile.uniqueIdentifier] = file;
    });
  }
  removeFile(flowFileId) {
    if (this.files.hasOwnProperty(flowFileId)) {
      const tempName = this.files[flowFileId].getTempName();
      delete this.files[flowFileId];
      this.removeUploadedFile(tempName);
    }
  }
  removeUploadedFile(tempName) {
    if (this.uploadedFiles.hasOwnProperty(tempName)) {
      delete this.uploadedFiles[tempName];
      this.updateValue();
      const url = `${this.options.deleteUrl}?filename=${tempName}`;
      $.ajax({
        url,
        type: 'POST',
        headers: this.headers,
      });
    }
  }
  restoreFiles() {
    const value = this.$input.val();
    if (!value) {
      return;
    }
    this.uploadedFiles = JSON.parse(value);
    const keys = Object.keys(this.uploadedFiles);
    keys.forEach((tempName) => {
      const data = {
        tempName,
        filename: this.uploadedFiles[tempName],
      };
      const file = new UploadedFile(data, this);
      file.appendTo(this.$container.find('[data-el=files]'));
      this.files[tempName] = file;
    });
  }
  createFlowInputs() {
    const $dropArea = this.$container.find('[data-el=dropArea]');
    this.flow.assignBrowse(this.$container.find('[data-el=browseLink]')[0]);
    this.flow.assignDrop($dropArea[0]);
    $dropArea
    .on('dragenter', () => {
      $dropArea.addClass(style.dropAreaActive);
    })
    .on('dragleave drop', () => {
      $dropArea.removeClass(style.dropAreaActive);
    });
  }
  reset() {
    this.flow.cancel();
    this.uploadedFiles = {};
    const keys = Object.keys(this.files);
    keys.forEach((key) => {
      this.files[key].remove();
    });
    this.files = {};
    this.updateValue();
  }
}

export default FlowFileInput;
