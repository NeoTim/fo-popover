let positions = require('./lib/positions');
let instance = require('./lib/instance');
let foPopoverInnerDirective = require('./fo-popover-inner.directive');

module.exports = angular
  .module('foPopover.services', [
    foPopoverInnerDirective.name
  ])
  .factory('foPopover', foPopover);

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
    close: function() {
      angular.element(document.querySelector('.fo-popover.open')).removeClass('open');
    },
    open: function(options) {
      event.stopPropagation();

      if (!isNewInstance(options)) {
        instances[options.template] = new instance($document, $templateCache, $compile, $rootScope, options);
      }

      instances[options.template].open();
    }
  };
}
