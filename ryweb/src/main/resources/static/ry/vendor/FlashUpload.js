'use strict';
(function(win) {

	var uploadUId = 1010;
	var cache = {};
	var hiddenStyle = {
		overflow: 'hidden',
		position: 'absolute',
		height: '1px',
		left: '-9999px',
		width: '1px'
	};

	var defaultOptions = {
		allowedExts: ['jpg', 'jpeg', 'gif', 'png'],
		fileDescription: 'Images',
		moviePath: 'FileToDataURI.swf',
		token:'',
		domain:'',
		multiple : false,
		onSelect: function(files) {}
	};

	function extend(obj,other) {
		if (arguments.length === 0) {
			return;
		}
		var obj = arguments[0];
		for(var i = 1,len = arguments.length; i<len; i++) {
			var other = arguments[i];
			for(var item in other) {
				obj[item] = other[item];
			}	
		}
		return obj;
	}

	function getOffset(Node, offset) {
		var box = Node.getBoundingClientRect();
		return {
			top:box.top + document.body.scrollTop - document.body.clientTop,
			left:box.left + document.body.scrollLeft - document.body.clientLeft
		}
	}

	function setStyle(Node, obj) {
		var str = '';
		for (var item in obj) {
			str += item + ':' + obj[item] + ';';
		}
		Node.setAttribute('style', str);
	}

	var FlashUpload = function(options) {

		this.options = extend({}, defaultOptions, options);
		this.el = document.querySelector(options.el);
		this.uId = uploadUId++;
		cache[this.uId] = {
			options: options
		};
	}

	FlashUpload.create = function(options) {
		var instance = new FlashUpload(options);
		instance.init();
		return instance;
	}

	FlashUpload.prototype.init = function() {
		var that = this;

		var flashContainer = document.createElement('div');
		flashContainer.setAttribute('id', 'flashupload_container' + this.uId);
		setStyle(flashContainer, hiddenStyle);

		var html = '';
		var flashvars = 'id=' + this.uId + '&allowedExts=' + this.options.allowedExts.join(',') + '&fileDescription=' + this.options.fileDescription + '&multiple=' + this.options.multiple + '&token=' + this.options.token + '&domain=' + this.options.domain;

		if (/msie|trident/.test(window.navigator.userAgent.toLowerCase())) {
			html = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' +
				'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' +
				' width="500" height="500" id="falshupload' + this.uId + '" align="middle">' +
				'<param name="allowScriptAccess" value="always" />' +
				'<param name="movie" value="' + this.options.moviePath + '" />' +
				'<param name="flashvars" value="' + flashvars + '"/>' +
				'<param name="wmode" value="transparent"/>' +
				'</object>';
			// Others
		} else {
			html = '<embed id="flashupload' + this.uId + '" src="' + this.options.moviePath + '" width="500" height="500" name="flashupload' + this.uId + '" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
		}

		flashContainer.innerHTML = html;
		document.body.appendChild(flashContainer);
		
		this.mouseOver = function (e) {
			var el = this;
			var coords = getOffset(el);
			var zIndex = 2147483647; // Max z-index allowed by most browsers

			setStyle(flashContainer, {
				overflow: 'hidden',
				position: 'absolute',
				top: coords.top + 'px',
				left: coords.left + 'px',
				width: el.offsetWidth + 'px',
				height: el.offsetHeight + 'px',
				'z-index': zIndex
			});
	    }

		this.el.addEventListener('mouseover', this.mouseOver);

		flashContainer.addEventListener('mouseout', function(e) {
			setStyle(this, hiddenStyle);
		});
	}

	FlashUpload.prototype.destroy = function() {

		var flashContainer = document.querySelector('#flashupload_container' + this.uId);
		document.body.removeChild(flashContainer);
		this.el.removeEventListener('mouseover', this.mouseOver);
		cache[this.uId] = null;

		this.el = null;

	}

	if (!win.jQuery) {
		win.jQuery = {
			fn: {}
		};
	}
	win.jQuery.fn.FileToDataURI = function(){

	};
	win.jQuery.fn.FileToDataURI.javascriptReceiver = function(id, filesData, response) {
		
		var onSelect = cache[id] && cache[id].options.onSelect;
		if (typeof onSelect === 'function') {
			onSelect(filesData, response);
		}
	}

	win.FlashUpload = FlashUpload;

})(window);