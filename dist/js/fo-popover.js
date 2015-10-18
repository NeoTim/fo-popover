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

var positions = require('../lib/positions');

module.exports = function ($templateCache, element, attr) {

  function createPopoverELement() {
    var templateString = $templateCache.get(attr.popoverTemplate);
    var $wrapper = angular.element('<div class="fo-popover"></div>');
    $wrapper[0].id = attr.popoverId;
    $wrapper.addClass(attr.popoverClass);
    $wrapper.css('width', attr.popoverWidth);

    return angular.element($wrapper).append(templateString);
  }

  function closeAllPopover() {
    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
  }

  function placePopover(popoverElement) {
    var tetherOption = {
      element: popoverElement[0],
      target: element[0],
      attachment: 'bottom middle',
      targetAttachment: 'top middle'
    };
    var currentPosition = getCurrentPosition();
    tetherOption = angular.extend(tetherOption, currentPosition);
    new Tether(tetherOption);
  }

  function getCurrentPosition() {
    var position = attr.popoverPosition.split(' ').join('_');
    if (attr.popoverOffset) {
      return angular.extend(positions[position], { offset: attr.popoverOffset });
    };
    return positions[position];
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

},{"../lib/positions":3}],3:[function(require,module,exports){
'use strict';

module.exports = {
  // top
  top_middle: {
    offset: '10px 0',
    attachment: 'bottom middle',
    targetAttachment: 'top middle'
  },
  top_left: {
    offset: '10px 0',
    attachment: 'bottom left',
    targetAttachment: 'top left'
  },
  top_right: {
    offset: '10px 0',
    attachment: 'bottom right',
    targetAttachment: 'top right'
  },

  // bottom
  bottom_middle: {
    offset: '-10px 0',
    attachment: 'top middle',
    targetAttachment: 'bottom middle'
  },
  bottom_left: {
    offset: '-10px 0',
    attachment: 'top left',
    targetAttachment: 'bottom left'
  },
  bottom_right: {
    offset: '-10px 0',
    attachment: 'top right',
    targetAttachment: 'bottom right'
  },

  // left
  left_middle: {
    offset: '0 10px',
    attachment: 'middle right',
    targetAttachment: 'middle left'
  },
  left_top: {
    offset: '0 10px',
    attachment: 'top right',
    targetAttachment: 'top left'
  },
  left_bottom: {
    offset: '0 10px',
    attachment: 'bottom right',
    targetAttachment: 'bottom left'
  },

  // right
  right_middle: {
    offset: '0 -10px',
    attachment: 'middle left',
    targetAttachment: 'middle right'
  },
  right_top: {
    offset: '0 -10px',
    attachment: 'top left',
    targetAttachment: 'top right'
  },
  right_bottom: {
    offset: '0 -10px',
    attachment: 'bottom left',
    targetAttachment: 'bottom right'
  },

  //diagonal
  top_left_diagonal: {
    offset: '0 -10px',
    attachment: 'bottom right',
    targetAttachment: 'top left'
  },
  top_right_diagonal: {
    offset: '0 -10px',
    attachment: 'bottom left',
    targetAttachment: 'top right'
  },
  bottom_left_diagonal: {
    offset: '0 -10px',
    attachment: 'top right',
    targetAttachment: 'bottom left'
  },
  bottom_right_diagonal: {
    offset: '0 -10px',
    attachment: 'top left',
    targetAttachment: 'bottom right'
  }

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

      popovers[options.template].open();
    }
  };
}

},{"./fo-popover-inner.directive":5,"./popover":7}],7:[function(require,module,exports){
'use strict';

var positions = require('../lib/positions');

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

  function closeAllPopover() {
    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
  }

  function isCreated() {
    return document.querySelector('.' + guid) ? true : false;
  }

  function placePopover(popoverElement, options) {
    var tetherOption = {
      element: popoverElement,
      target: options.target,
      attachment: 'bottom middle',
      targetAttachment: 'top middle'
    };

    var currentPosition = getCurrentPosition(options);
    tetherOption = angular.extend(tetherOption, currentPosition);
    new Tether(tetherOption);
  }

  function getCurrentPosition(options) {
    var position = options.position.split(' ').join('_');
    if (options.offset) {
      return angular.extend(positions[position], { offset: options.offset });
    };
    return positions[position];
  }

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

},{"../lib/positions":3}]},{},[4]);
