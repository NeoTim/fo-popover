let Popover = require('./popover');

module.exports = angular
  .module('foPopover.directive', [])
  .directive('foPopover', foPopover);

// @ngInject
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
    link: function(scope, element, attr) {
      let $tagLink = angular.element(document).find('a');
      let popover = new Popover($templateCache, element, attr);

      appendToBody(popover.element);
      compileToScope(popover.element, scope);

      scope.closePopover = popover.close;

      element.bind('click', function(e) {
        closeAllPopover();
        e.stopPropagation();
        if (popover.isOpened()) return popover.close();
        popover.open();
      });

      popover.element.bind('click', function(e) {
        e.stopPropagation();
      });

      $tagLink.bind('click', function(e) {
        if (popover.element.hasClass('open')) e.preventDefault();
      });

      $document.bind('click', function() {
        popover.close();
      });

    }
  };
}
