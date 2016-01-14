(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Popover = require('./popover');

module.exports = angular.module('foPopover.directive', []).directive('foPopover', foPopover);

foPopover.$inject = ['$templateCache', '$document', '$compile'];

function foPopover($templateCache, $document, $compile) {

  function appendToBody(popoverElement) {
    $document.find('body').append(popoverElement);
  }

  function compileToScope(popoverElement, scope) {
    $compile(popoverElement)(scope);
  }

  function closeAllPopover() {
    angular.element(document.querySelector('.fo-popover')).removeClass('open');
  }

  return {
    restrict: 'A',
    scope: true,
    link: function link(scope, element, attr) {
      var $tagLink = angular.element(document).find('a');
      var popover = new Popover($templateCache, element, attr);

      appendToBody(popover.element);
      compileToScope(popover.element, scope);

      scope.closePopover = popover.close;

      element.bind('click', function (e) {
        closeAllPopover();
        e.stopPropagation();
        if (popover.isOpened()) return popover.close();
        popover.open();
      });

      popover.element.bind('click', function (e) {
        e.stopPropagation();
      });

      $tagLink.bind('click', function (e) {
        if (popover.element.hasClass('open')) e.preventDefault();
      });

      $document.bind('click', function () {
        popover.close();
      });
    }
  };
}

},{"./popover":2}],2:[function(require,module,exports){
'use strict';

var offset = require('../lib/offset');

module.exports = function ($templateCache, element, attr) {

  function createPopoverELement() {
    var templateString = $templateCache.get(attr.popoverTemplate);
    var $wrapper = angular.element('<div class="fo-popover"></div>');

    if (attr.popoverId) {
      $wrapper[0].id = attr.popoverId;
    }

    $wrapper.addClass(attr.popoverClass);
    $wrapper.css('width', attr.popoverWidth);

    return angular.element($wrapper).append(templateString);
  }

  function closeAllPopover() {
    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
  }

  function placePopover(popoverElement) {
    var besideOption = {
      me: element[0],
      you: popoverElement[0],
      where: 'bottom center',
      offset: '0 0'
    };

    var position = attr.popoverPosition.split(' ').join('_');

    besideOption = angular.extend(besideOption, { offset: offset[position] });

    if (attr.popoverTarget) {
      besideOption = angular.extend(besideOption, {
        me: document.querySelector(attr.popoverTarget)
      });
    }

    besideOption = angular.extend(besideOption, {
      where: attr.popoverPosition
    });

    beside.init(besideOption);
  }

  this.element = createPopoverELement();

  this.isOpened = (function () {
    return this.element.hasClass('open');
  }).bind(this);

  this.open = (function () {
    closeAllPopover();
    this.element.addClass('open');
    placePopover(this.element);
  }).bind(this);

  this.close = (function () {
    this.element.removeClass('open');
  }).bind(this);
};

},{"../lib/offset":3}],3:[function(require,module,exports){
'use strict';

module.exports = {

  //top
  top_center: '0 -10px',
  top_left: '0 -10px',
  top_right: '0 -10px',

  // bottom
  bottom_center: '0 10px',
  bottom_left: '0 10px',
  bottom_right: '0 10px',

  // left
  left_center: '-10px 0',
  left_top: '-10px 0',
  left_bottom: '-10px 0',

  // right
  right_center: '10px 0',
  right_top: '10px 0',
  right_bottom: '10px 0',

  //diagonal
  top_left_diagonal: '-10px -10px',
  top_right_diagonal: '10px -10px',
  bottom_left_diagonal: '-10px 10px',
  bottom_right_diagonal: '10px 10px'
};

},{}],4:[function(require,module,exports){
'use strict';

var foPopoverDirective = require('./directive/fo-popover.directive');
var foPopoverService = require('./service/fo-popover.service');

module.exports = angular.module('foPopover', [foPopoverDirective.name, foPopoverService.name]);

},{"./directive/fo-popover.directive":1,"./service/fo-popover.service":6}],5:[function(require,module,exports){
'use strict';

module.exports = angular.module('foPopoverInner.directive', []).directive('foPopoverInner', foPopoverInner);

foPopoverInner.$inject = ['$document'];

function foPopoverInner($document) {

  return {
    restrict: 'A',
    scope: true,
    link: function link(scope, element, attr) {
      var $tagLink = angular.element(document).find('a');

      scope.closePopover = function () {
        angular.element(document.querySelector('.fo-popover.open')).removeClass('open');
      };

      element.bind('click', function (e) {
        e.stopPropagation();
      });

      angular.element(document.querySelector('.' + attr.foPopoverId)).bind('click', function (e) {
        e.stopPropagation();
      });

      $tagLink.bind('click', function (e) {
        if (p.element.hasClass('open')) e.preventDefault();
      });

      $document.bind('click', function () {
        angular.element(document.querySelector('.' + attr.foPopoverId)).removeClass('open');
      });
    }
  };
}

},{}],6:[function(require,module,exports){
'use strict';

var popover = require('./popover');
var foPopoverInnerDirective = require('./fo-popover-inner.directive');

module.exports = angular.module('foPopover.services', [foPopoverInnerDirective.name]).factory('foPopover', foPopover);

foPopover.$inject = ['$rootScope', '$document', '$templateCache', '$compile'];

function foPopover($rootScope, $document, $templateCache, $compile) {
  var $popover;

  var popovers = {};

  function isOpened($popover) {
    return $popover.hasClass('open');
  }

  function isNewInstance(options) {
    var result = false;
    for (var i in popovers) {
      if (i === options.template) {
        result = true;
        break;
      }
    }
    return result;
  }

  return {
    close: function close() {
      angular.element(document.querySelector('.fo-popover.open')).removeClass('open');
    },
    open: function open(options) {
      event.stopPropagation();

      if (!isNewInstance(options)) {
        popovers[options.template] = new popover($document, $templateCache, $compile, $rootScope, options);
      }
      popovers[options.template].checkOptions();
      popovers[options.template].open();
    }
  };
}

},{"./fo-popover-inner.directive":5,"./popover":7}],7:[function(require,module,exports){
'use strict';

var positions = require('../lib/offset');

module.exports = function ($document, $templateCache, $compile, $rootScope, options) {
  var guid = 'fo-popover-' + Date.now();
  var $popover;

  function createPopoverELement() {
    var templateString = $templateCache.get(options.template);
    var $wrapper = angular.element('<div fo-popover-inner fo-popover-id=' + guid + ' class="fo-popover"></div>');
    $wrapper[0].id = options.id;
    $wrapper.addClass(options.class);
    $wrapper.addClass(guid);

    return angular.element($wrapper).append(templateString);
  }

  function getPopoverElement(options) {
    if (isCreated()) {
      return angular.element(document.querySelector('.' + guid));
    } else {
      return createPopoverELement(options);
    }
  }

  function appendToBody(popoverElement) {
    var $body = angular.element($document).find('body');
    $body.append(popoverElement);
  }

  function compileToScope(popoverElement, scope) {
    $compile(popoverElement)(scope);
  }

  function closeAllPopover() {
    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
  }

  function isCreated() {
    return document.querySelector('.' + guid) ? true : false;
  }

  function placePopover(popoverElement, options) {
    var besideOption = {
      me: options.target,
      you: popoverElement,
      where: 'bottom center',
      offset: '0 0'
    };

    var position = options.position.split(' ').join('_');

    besideOption = angular.extend(besideOption, { offset: offset[position] });

    besideOption = angular.extend(besideOption, { where: options.position });

    beside.init(besideOption);
  }

  this.checkOptions = function () {
    if (!options.template) throw new Error('template is empty');
    if (!$templateCache.get(options.template)) throw new Error('template is invalid');
  };

  this.open = function () {
    $popover = getPopoverElement(options);
    closeAllPopover();

    if (!isCreated()) {
      appendToBody($popover);
      compileToScope($popover, options.scope || $rootScope);
      $popover.addClass('open');
      placePopover($popover[0], options);
    } else {
      $popover.addClass('open');
    }
  };
};

},{"../lib/offset":3}]},{},[4]);
