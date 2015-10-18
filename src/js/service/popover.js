let positions = require('../lib/positions');

module.exports = function($document, $templateCache, $compile, $rootScope, options) {
  var guid = 'fo-popover-' + Date.now();
  var $popover;

  function createPopoverELement() {
    let templateString = $templateCache.get(options.template);
    let $wrapper = angular.element('<div fo-popover-inner fo-popover-id=' + guid + ' class="fo-popover"></div>');
    $wrapper[0].id = options.id;
    $wrapper.addClass(options.class);
    $wrapper.addClass(guid);

    return angular.element($wrapper).append(templateString);
  }

  function getPopoverElement(options) {
    if (isCreated()) {
      return angular.element(document.querySelector('.' + guid));
    } else {
      return createPopoverELement(options)
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
    let tetherOption = {
      element: popoverElement,
      target: options.target
    };

    let currentPosition = getCurrentPosition(options);
    tetherOption = angular.extend(tetherOption, currentPosition);
    new Tether(tetherOption);
  }

  function getCurrentPosition(options) {
    var position = options.position.split(' ').join('_');
    if (options.offset) {
      return angular.extend(positions[position], {offset: options.offset});
    };
    return positions[position];
  }

  this.open = function() {
    $popover = getPopoverElement(options);
    closeAllPopover();

    if (!isCreated()) {
      appendToBody($popover)
      compileToScope($popover, options.scope || $rootScope);
      $popover.addClass('open');
      placePopover($popover[0], options);
    } else {
      $popover.addClass('open');
    }
  };


};
