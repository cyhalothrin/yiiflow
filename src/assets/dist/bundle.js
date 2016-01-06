/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!********************************!*\
  !*** ./src/assets/src/main.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _FlowFileInput = __webpack_require__(/*! ./js/FlowFileInput */ 2);
	
	var _FlowFileInput2 = _interopRequireDefault(_FlowFileInput);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	$.fn.flowFileUpload = function flowFileUpload() {
	  var _this = this;
	
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var defaults = {
	    flowOptions: {}
	  };
	
	  return this.each(function () {
	    var data = _this.data('flowFileUpload');
	    if (!data) {
	      var flowFileInput = new _FlowFileInput2.default(_this, $.extend(true, {}, options, defaults));
	      _this.data('flowFileUpload', flowFileInput);
	    }
	  });
	}; /* global $ */undefined

/***/ },
/* 1 */,
/* 2 */
/*!********************************************!*\
  !*** ./src/assets/src/js/FlowFileInput.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /* global Flow */
	/* global $ */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _flowFileInput = __webpack_require__(/*! ../templates/flowFileInput */ 3);
	
	var _flowFileInput2 = _interopRequireDefault(_flowFileInput);
	
	var _File = __webpack_require__(/*! ./File */ 8);
	
	var _File2 = _interopRequireDefault(_File);
	
	var _UploadedFile = __webpack_require__(/*! ./UploadedFile */ 12);
	
	var _UploadedFile2 = _interopRequireDefault(_UploadedFile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FlowFileInput = (function () {
	  function FlowFileInput($el, options) {
	    var _this = this;
	
	    _classCallCheck(this, FlowFileInput);
	
	    this.$input = $el;
	    this.$container = $('<div/>').html((0, _flowFileInput2.default)());
	    this.$input.after(this.$container);
	    this.flow = new Flow(options.flowOptions);
	    this.uploadedFiles = {};
	    this.files = {};
	    this.headers = options.flowOptions.headers;
	    this.options = options;
	    this.restoreFiles();
	    this.createFlowInputs();
	
	    this.flow.on('filesSubmitted', function (flowFiles) {
	      _this.flow.upload();
	      _this.appendFiles(flowFiles);
	    });
	    this.flow.on('fileSuccess', function (flowFile, message) {
	      var _JSON$parse = JSON.parse(message);
	
	      var filename = _JSON$parse.filename;
	
	      _this.uploadedFiles[filename] = flowFile.name;
	      _this.files[flowFile.uniqueIdentifier].setFilename(filename);
	      _this.updateValue();
	    });
	  }
	
	  _createClass(FlowFileInput, [{
	    key: 'updateValue',
	    value: function updateValue() {
	      var keys = Object.keys(this.uploadedFiles);
	      if (keys.length) {
	        this.$input.val(JSON.stringify(this.uploadedFiles));
	      } else {
	        this.$input.val('');
	      }
	    }
	  }, {
	    key: 'appendFiles',
	    value: function appendFiles(flowFiles) {
	      var _this2 = this;
	
	      flowFiles.forEach(function (flowFile) {
	        var file = new _File2.default(flowFile, _this2);
	        file.appendTo(_this2.$container.find('[data-el=files]'));
	        _this2.files[flowFile.uniqueIdentifier] = file;
	      });
	    }
	  }, {
	    key: 'removeFile',
	    value: function removeFile(flowFileId) {
	      if (flowFileId in this.files) {
	        if (this.files.hasOwnProperty(flowFileId)) {
	          var filename = this.files[flowFileId].getFilename();
	          delete this.files[flowFileId];
	          this.removeUploadedFile(filename);
	        }
	      }
	    }
	  }, {
	    key: 'removeUploadedFile',
	    value: function removeUploadedFile(filename) {
	      if (filename !== null && filename !== undefined && filename in this.uploadedFiles) {
	        delete this.uploadedFiles[filename];
	        this.updateValue();
	        var url = this.options.deleteUrl + '?filename=' + filename;
	        $.ajax({
	          url: url,
	          type: 'POST',
	          headers: this.headers
	        });
	      }
	    }
	  }, {
	    key: 'restoreFiles',
	    value: function restoreFiles() {
	      var value = this.$input.val();
	      if (!value) {
	        return;
	      }
	      this.uploadedFiles = JSON.parse(value);
	      var keys = Object.keys(this.uploadedFiles);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var key = _step.value;
	
	          var data = {
	            filename: key,
	            viewName: this.uploadedFiles[key]
	          };
	          var file = new _UploadedFile2.default(data, this);
	          file.appendTo(this.$container.find('[data-el=files]'));
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'createFlowInputs',
	    value: function createFlowInputs() {
	      this.flow.assignBrowse(this.$container.find('[data-el=browseLink]')[0]);
	      this.flow.assignDrop(this.$container.find('[data-el=dropArea]')[0]);
	    }
	  }]);
	
	  return FlowFileInput;
	})();
	
	exports.default = FlowFileInput;

/***/ },
/* 3 */
/*!*****************************************************!*\
  !*** ./src/assets/src/templates/flowFileInput.jade ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(/*! ./~/jade/lib/runtime.js */ 4);
	
	module.exports = function template(locals) {
	var jade_debug = [ new jade.DebugItem( 1, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ) ];
	try {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (style) {
	jade_debug.unshift(new jade.DebugItem( 0, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ));
	jade_debug.unshift(new jade.DebugItem( 1, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ));
	style = __webpack_require__(/*! ../css/main.css */ 6);
	jade_debug.shift();
	jade_debug.unshift(new jade.DebugItem( 3, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ));
	buf.push("<div data-el=\"dropArea\"" + (jade.cls([style.dropArea], [true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.unshift(new jade.DebugItem( 4, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ));
	buf.push("<span class=\"glyphicon glyphicon-cloud-download\">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.shift();
	buf.push("</span>");
	jade_debug.shift();
	jade_debug.unshift(new jade.DebugItem( 5, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ));
	buf.push(" Перетащите сюда файл или ");
	jade_debug.shift();
	jade_debug.unshift(new jade.DebugItem( 6, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ));
	buf.push("<span data-el=\"browseLink\"" + (jade.cls([style.browseLink], [true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.unshift(new jade.DebugItem( 6, jade_debug[0].filename ));
	buf.push("выберите");
	jade_debug.shift();
	jade_debug.shift();
	buf.push("</span>");
	jade_debug.shift();
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.unshift(new jade.DebugItem( 7, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\flowFileInput.jade" ));
	buf.push("<div data-el=\"files\">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.shift();}.call(this,"style" in locals_for_with?locals_for_with.style:typeof style!=="undefined"?style:undefined));;return buf.join("");
	} catch (err) {
	  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "- style = require('../css/main.css');\r\n\r\ndiv(class=style.dropArea data-el='dropArea')\r\n  span.glyphicon.glyphicon-cloud-download\r\n  |  Перетащите сюда файл или \r\n  span(class=style.browseLink data-el='browseLink') выберите\r\ndiv(data-el='files')\r\n");
	}
	}

/***/ },
/* 4 */
/*!*******************************!*\
  !*** ./~/jade/lib/runtime.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */
	
	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];
	
	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }
	
	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	};
	
	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function nulls(val) {
	  return val != null && val !== '';
	}
	
	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}
	
	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};
	
	
	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};
	
	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];
	
	  var keys = Object.keys(obj);
	
	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];
	
	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }
	
	  return buf.join('');
	};
	
	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */
	
	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;
	
	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}
	
	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};
	
	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */
	
	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(/*! fs */ 5).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);
	
	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');
	
	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};
	
	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 5 */
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 6 */
/*!*************************************!*\
  !*** ./src/assets/src/css/main.css ***!
  \*************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"browseLink":"main__browseLink___2hfax","dropArea":"main__dropArea___1um-E"};

/***/ },
/* 7 */,
/* 8 */
/*!***********************************!*\
  !*** ./src/assets/src/js/File.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /* global $ */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _file = __webpack_require__(/*! ../templates/file */ 9);
	
	var _file2 = _interopRequireDefault(_file);
	
	var _ProgressBar = __webpack_require__(/*! ./ProgressBar */ 11);
	
	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var File = (function () {
	  function File(flowFile, inputObj) {
	    var _this = this;
	
	    _classCallCheck(this, File);
	
	    this.flowFile = flowFile;
	    this.inputObj = inputObj;
	    this.$container = $('<div/>');
	    this.render();
	    this.$container.on('click', '[data-el=remove]', function () {
	      _this.destroy();
	    });
	    this.progressBar = new _ProgressBar2.default(this.$container.find('[data-el=progress]'));
	    this.updateProgress();
	  }
	
	  _createClass(File, [{
	    key: 'render',
	    value: function render() {
	      var data = {
	        filename: this.flowFile.name
	      };
	      this.$container.html((0, _file2.default)(data));
	    }
	  }, {
	    key: 'appendTo',
	    value: function appendTo($el) {
	      this.$container.appendTo($el);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.$container.remove();
	      this.flowFile.cancel();
	      this.inputObj.removeFile(this.flowFile.uniqueIdentifier);
	    }
	  }, {
	    key: 'updateProgress',
	    value: function updateProgress() {
	      if (!this.flowFile.isComplete()) {
	        this.progressBar.setProgress(this.flowFile.progress(false));
	        setTimeout(this.updateProgress.bind(this), 100);
	      } else {
	        this.progressBar.complete();
	      }
	    }
	  }, {
	    key: 'setFilename',
	    value: function setFilename(filename) {
	      this.filename = filename;
	    }
	  }, {
	    key: 'getFilename',
	    value: function getFilename() {
	      return this.filename;
	    }
	  }]);
	
	  return File;
	})();
	
	exports.default = File;

/***/ },
/* 9 */
/*!********************************************!*\
  !*** ./src/assets/src/templates/file.jade ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(/*! ./~/jade/lib/runtime.js */ 4);
	
	module.exports = function template(locals) {
	var jade_debug = [ new jade.DebugItem( 1, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ) ];
	try {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (filename, style) {
	jade_debug.unshift(new jade.DebugItem( 0, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	jade_debug.unshift(new jade.DebugItem( 1, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	style = __webpack_require__(/*! ../css/file.css */ 10);
	jade_debug.shift();
	jade_debug.unshift(new jade.DebugItem( 3, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	buf.push("<div" + (jade.cls([style.file], [true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.unshift(new jade.DebugItem( 4, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	buf.push("<div" + (jade.cls([style.info], [true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.unshift(new jade.DebugItem( 5, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	buf.push("<div" + (jade.cls([style.filename], [true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.unshift(new jade.DebugItem( 5, jade_debug[0].filename ));
	buf.push("" + (jade.escape((jade_interp = filename) == null ? '' : jade_interp)) + "");
	jade_debug.shift();
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.unshift(new jade.DebugItem( 6, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	buf.push("<div>");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.unshift(new jade.DebugItem( 7, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	buf.push("<div data-el=\"progress\"" + (jade.cls([style.progressLine,style.progressLineCompleted], [true,true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.unshift(new jade.DebugItem( 8, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	buf.push("<div" + (jade.cls([style.control], [true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.unshift(new jade.DebugItem( 9, "D:\\v\\default\\yii2-file-upload\\vendor\\cyhalothrin\\yiiflow\\src\\assets\\src\\templates\\file.jade" ));
	buf.push("<span data-el=\"remove\"" + (jade.cls(['glyphicon','glyphicon-remove',style.iconButton], [null,null,true])) + ">");
	jade_debug.unshift(new jade.DebugItem( undefined, jade_debug[0].filename ));
	jade_debug.shift();
	buf.push("</span>");
	jade_debug.shift();
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.shift();
	buf.push("</div>");
	jade_debug.shift();
	jade_debug.shift();}.call(this,"filename" in locals_for_with?locals_for_with.filename:typeof filename!=="undefined"?filename:undefined,"style" in locals_for_with?locals_for_with.style:typeof style!=="undefined"?style:undefined));;return buf.join("");
	} catch (err) {
	  jade.rethrow(err, jade_debug[0].filename, jade_debug[0].lineno, "- style = require('../css/file.css');\r\n\r\ndiv(class=style.file)\r\n  div(class=style.info)\r\n    div(class=style.filename) #{filename}\r\n    div\r\n      div(class=style.progressLine class=style.progressLineCompleted data-el='progress')\r\n    div(class=style.control)\r\n      span.glyphicon.glyphicon-remove(class=style.iconButton data-el='remove')\r\n");
	}
	}

/***/ },
/* 10 */
/*!*************************************!*\
  !*** ./src/assets/src/css/file.css ***!
  \*************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"file":"file__file___maN0q","iconButton":"file__iconButton___2XDe0","progressLine":"file__progressLine___jdYor","progressLineUploading":"file__progressLineUploading___3_7T1","progressLineCompleted":"file__progressLineCompleted___KrHh3","info":"file__info___2k1CK","control":"file__control___3qPwK","filename":"file__filename___3hFCB"};

/***/ },
/* 11 */
/*!******************************************!*\
  !*** ./src/assets/src/js/ProgressBar.js ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _file = __webpack_require__(/*! ../css/file */ 10);
	
	var _file2 = _interopRequireDefault(_file);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ProgressBar = (function () {
	  function ProgressBar($el) {
	    _classCallCheck(this, ProgressBar);
	
	    this.$el = $el;
	    this.$el.removeClass(_file2.default.progressLineCompleted);
	    this.$el.addClass(_file2.default.progressLineUploading);
	    this.setProgress(0);
	  }
	
	  _createClass(ProgressBar, [{
	    key: 'setProgress',
	    value: function setProgress(value) {
	      if (this.progress === value) {
	        return;
	      }
	      var width = Math.round(value * 100);
	      this.$el.css({ width: width + '%' });
	      this.progress = value;
	    }
	  }, {
	    key: 'complete',
	    value: function complete() {
	      this.$el.removeClass(_file2.default.progressLineUploading);
	      this.$el.addClass(_file2.default.progressLineCompleted);
	      this.setProgress(1);
	    }
	  }]);
	
	  return ProgressBar;
	})();
	
	exports.default = ProgressBar;

/***/ },
/* 12 */
/*!*******************************************!*\
  !*** ./src/assets/src/js/UploadedFile.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /* global $ */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _file = __webpack_require__(/*! ../templates/file */ 9);
	
	var _file2 = _interopRequireDefault(_file);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UploadedFile = (function () {
	  function UploadedFile(data, inputObj) {
	    var _this = this;
	
	    _classCallCheck(this, UploadedFile);
	
	    this.inputObj = inputObj;
	    this.filename = data.filename;
	    this.$container = $(document.createElement('div'));
	    this.$container.html((0, _file2.default)({
	      filename: data.viewName
	    }));
	    this.$container.on('click', '[data-el=remove]', function () {
	      _this.destroy();
	    });
	  }
	
	  _createClass(UploadedFile, [{
	    key: 'appendTo',
	    value: function appendTo($el) {
	      this.$container.appendTo($el);
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.$container.remove();
	      this.inputObj.removeUploadedFile(this.filename);
	    }
	  }]);
	
	  return UploadedFile;
	})();
	
	exports.default = UploadedFile;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map