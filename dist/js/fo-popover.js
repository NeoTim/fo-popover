(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

var popover = require('./lib/popover');

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
      var p = new popover($templateCache, element, attr);

      appendToBody(p.element);
      compileToScope(p.element, scope);

      scope.closePopover = p.close;

      element.bind('click', function (e) {
        closeAllPopover();
        e.stopPropagation();
        if (p.isOpened()) return p.close();
        p.open();
      });

      p.element.bind('click', function (e) {
        e.stopPropagation();
      });

      $tagLink.bind('click', function (e) {
        if (p.element.hasClass('open')) e.preventDefault();
      });

      $document.bind('click', function () {
        p.close();
      });
    }
  };
}

},{"./lib/popover":5}],3:[function(require,module,exports){
'use strict';

var positions = require('./lib/positions');
var instance = require('./lib/instance');
var foPopoverInnerDirective = require('./fo-popover-inner.directive');

module.exports = angular.module('foPopover.services', [foPopoverInnerDirective.name]).factory('foPopover', foPopover);

foPopover.$inject = ['$rootScope', '$document', '$templateCache', '$compile'];

function foPopover($rootScope, $document, $templateCache, $compile) {
  var $popover;

  var instances = {};

  function isOpened($popover) {
    return $popover.hasClass('open');
  }

  function isNewInstance(options) {
    var result = false;
    for (var i in instances) {
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
        instances[options.template] = new instance($document, $templateCache, $compile, $rootScope, options);
      }

      instances[options.template].open();
    }
  };
}

},{"./fo-popover-inner.directive":1,"./lib/instance":4,"./lib/positions":6}],4:[function(require,module,exports){
'use strict';

var positions = require('./positions');

module.exports = function ($document, $templateCache, $compile, $rootScope, options) {
  var guid = 'fo-popover-' + Date.now();
  var $popover;

  function createPopoverELement() {
    var templateString = $templateCache.get(options.template);
    var $wrapper = angular.element('<div fo-popover-inner fo-popover-id=' + guid + ' class="fo-popover"></div>');
    $wrapper[0].id = options.id;
    $wrapper.addClass(options['class']);
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

  function getCurrentPosition(options) {
    return options.position.split(' ').join('_');
  }

  function closeAllPopover() {
    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
  }

  function isCreated() {
    return document.querySelector('.' + guid) ? true : false;
  }

  this.open = function () {
    $popover = getPopoverElement(options);

    if (!isCreated()) {
      appendToBody($popover);
      compileToScope($popover, options.scope || $rootScope);

      var tetherOption = {
        element: $popover[0],
        target: options.target,
        attachment: 'bottom middle',
        targetAttachment: 'top middle',
        offset: options.offset
      };

      var currentPosition = getCurrentPosition(options);
      tetherOption = angular.extend(tetherOption, positions[currentPosition]);

      closeAllPopover();
      $popover.addClass('open');
      new Tether(tetherOption);
    } else {
      closeAllPopover();
      $popover.addClass('open');
    }
  };
};

},{"./positions":6}],5:[function(require,module,exports){
'use strict';

var positions = require('./positions');

module.exports = function ($templateCache, element, attr) {

  function createPopoverELement() {
    var templateString = $templateCache.get(attr.popoverTemplate);
    var $wrapper = angular.element('<div class="fo-popover"></div>');
    $wrapper[0].id = attr.popoverId;
    $wrapper.addClass(attr.popoverClass);
    $wrapper.css('width', attr.popoverWidth);

    return angular.element($wrapper).append(templateString);
  }

  function getCurrentPosition() {
    return attr.popoverPosition.split(' ').join('_');
  }

  this.element = createPopoverELement();

  this.isOpened = (function () {
    return this.element.hasClass('open');
  }).bind(this);

  this.open = (function () {
    var tetherOption = {
      element: this.element[0],
      target: element[0],
      attachment: 'bottom middle',
      targetAttachment: 'top middle',
      offset: attr.popoverOffset
    };

    var currentPosition = getCurrentPosition();
    tetherOption = angular.extend(tetherOption, positions[currentPosition]);

    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
    this.element.addClass('open');

    new Tether(tetherOption);
  }).bind(this);

  this.close = (function () {
    this.element.removeClass('open');
  }).bind(this);
};

},{"./positions":6}],6:[function(require,module,exports){
'use strict';

module.exports = {
  // top
  top_middle: {
    attachment: 'bottom middle',
    targetAttachment: 'top middle'
  },
  top_left: {
    attachment: 'bottom left',
    targetAttachment: 'top left'
  },
  top_right: {
    attachment: 'bottom right',
    targetAttachment: 'top right'
  },

  // bottom
  bottom_middle: {
    attachment: 'top middle',
    targetAttachment: 'bottom middle'
  },
  bottom_left: {
    attachment: 'top left',
    targetAttachment: 'bottom left'
  },
  bottom_right: {
    attachment: 'top right',
    targetAttachment: 'bottom right'
  },

  // left
  left_middle: {
    attachment: 'middle right',
    targetAttachment: 'middle left'
  },
  left_top: {
    attachment: 'top right',
    targetAttachment: 'top left'
  },
  left_bottom: {
    attachment: 'bottom right',
    targetAttachment: 'bottom left'
  },

  // right
  right_middle: {
    attachment: 'middle left',
    targetAttachment: 'middle right'
  },
  right_top: {
    attachment: 'top left',
    targetAttachment: 'top right'
  },
  right_bottom: {
    attachment: 'bottom left',
    targetAttachment: 'bottom right'
  },

  //diagonal
  top_left_diagonal: {
    attachment: 'bottom right',
    targetAttachment: 'top left'
  },
  top_right_diagonal: {
    attachment: 'bottom left',
    targetAttachment: 'top right'
  },
  bottom_left_diagonal: {
    attachment: 'top right',
    targetAttachment: 'bottom left'
  },
  bottom_right_diagonal: {
    attachment: 'top left',
    targetAttachment: 'bottom right'
  }

};

},{}],7:[function(require,module,exports){
'use strict';

var foPopoverDirective = require('./fo-popover.directive');
var foPopoverService = require('./fo-popover.service');

module.exports = angular.module('foPopover', [foPopoverDirective.name, foPopoverService.name]);

},{"./fo-popover.directive":2,"./fo-popover.service":3}]},{},[7]);
