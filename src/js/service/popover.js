let positions = require('../lib/offset');

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
    let besideOption = {
      me: options.target,
      you: popoverElement,
      where: 'bottom center',
      offset: '0 0'
    };

    var position = options.position.split(' ').join('_');

    besideOption = angular.extend(besideOption, {offset: offset[position]});

    besideOption = angular.extend(besideOption, {where:options.position});

    beside.init(besideOption);
  }

  this.checkOptions = function () {
    if (!options.template) throw new Error('template is empty');
    if (!$templateCache.get(options.template)) throw new Error('template is invalid');
  };

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
