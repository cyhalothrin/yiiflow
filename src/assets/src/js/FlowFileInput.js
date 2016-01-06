/* global Flow */
/* global $ */
import flowFileInput from '../templates/flowFileInput';
import File from './File';
import UploadedFile from './UploadedFile';

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
      const {filename} = JSON.parse(message);
      this.uploadedFiles[filename] = flowFile.name;
      this.files[flowFile.uniqueIdentifier].setFilename(filename);
      this.updateValue();
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
    if (flowFileId in this.files) {
      if (this.files.hasOwnProperty(flowFileId)) {
        const filename = this.files[flowFileId].getFilename();
        delete this.files[flowFileId];
        this.removeUploadedFile(filename);
      }
    }
  }
  removeUploadedFile(filename) {
    if (filename !== null && filename !== undefined && filename in this.uploadedFiles) {
      delete this.uploadedFiles[filename];
      this.updateValue();
      const url = `${this.options.deleteUrl}?filename=${filename}`;
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
    for (const key of keys) {
      const data = {
        filename: key,
        viewName: this.uploadedFiles[key],
      };
      const file = new UploadedFile(data, this);
      file.appendTo(this.$container.find('[data-el=files]'));
    }
  }
  createFlowInputs() {
    this.flow.assignBrowse(this.$container.find('[data-el=browseLink]')[0]);
    this.flow.assignDrop(this.$container.find('[data-el=dropArea]')[0]);
  }
}

export default FlowFileInput;
