let positions = require('./positions');

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

  function getCurrentPosition(options) {
    return options.position.split(' ').join('_');
  }

  function closeAllPopover() {
    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
  }

  function isCreated() {
    return document.querySelector('.' + guid) ? true : false;
  }

  this.open = function() {
    $popover = getPopoverElement(options);

    if (!isCreated()) {
      appendToBody($popover)
      compileToScope($popover, $rootScope);

      let tetherOption = {
        element: $popover[0],
        target: options.target,
        attachment: 'bottom middle',
        targetAttachment: 'top middle',
        offset: options.offset
      };

      let currentPosition = getCurrentPosition(options);
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
