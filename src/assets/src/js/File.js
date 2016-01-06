/* global $ */
import fileTemplate from '../templates/file';
import ProgressBar from './ProgressBar';

class File {
  constructor(flowFile, inputObj) {
    this.flowFile = flowFile;
    this.inputObj = inputObj;
    this.$container = $('<div/>');
    this.render();
    this.$container
    .on('click', '[data-el=remove]', () => {
      this.destroy();
    });
    this.progressBar = new ProgressBar(this.$container.find('[data-el=progress]'));
    this.updateProgress();
  }
  render() {
    const data = {
      filename: this.flowFile.name,
    };
    this.$container.html(fileTemplate(data));
  }
  appendTo($el) {
    this.$container.appendTo($el);
  }
  destroy() {
    this.remove();
    this.flowFile.cancel();
    this.inputObj.removeFile(this.flowFile.uniqueIdentifier);
  }
  updateProgress() {
    if (!this.flowFile.isComplete()) {
      this.progressBar.setProgress(this.flowFile.progress(false));
      setTimeout(this.updateProgress.bind(this), 100);
    } else {
      this.progressBar.complete();
    }
  }
  setTempName(filename) {
    this.tempName = filename;
  }
  getTempName() {
    return this.tempName;
  }
  remove() {
    this.$container.remove();
  }
}

export default File;
