let popover = require('./popover');
let foPopoverInnerDirective = require('./fo-popover-inner.directive');

module.exports = angular
  .module('foPopover.services', [
    foPopoverInnerDirective.name
  ])
  .factory('foPopover', foPopover);

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
    close: function() {
      angular.element(document.querySelector('.fo-popover.open')).removeClass('open');
    },
    create:function create(options){
      popovers[options.template] = new popover($document, $templateCache, $compile, $rootScope, options);
      popovers[options.template].checkOptions();
      return popovers[options.template];
    },
    open: function(options) {
      event.stopPropagation();

      if (!isNewInstance(options)) {
        popovers[options.template] = new popover($document, $templateCache, $compile, $rootScope, options);
      }
      popovers[options.template].checkOptions();
      popovers[options.template].open();

    }
  };
}
