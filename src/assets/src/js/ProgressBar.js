import style from '../css/file';

class ProgressBar {
  constructor($el) {
    this.$el = $el;
    this.$el.removeClass(style.progressLineCompleted);
    this.$el.addClass(style.progressLineUploading);
    this.setProgress(0);
  }
  setProgress(value) {
    if (this.progress === value) {
      return;
    }
    const width = Math.round(value * 100);
    this.$el.css({ width: `${width}%` });
    this.progress = value;
  }
  complete() {
    this.$el.removeClass(style.progressLineUploading);
    this.$el.addClass(style.progressLineCompleted);
    this.setProgress(1);
  }
}

export default ProgressBar;
