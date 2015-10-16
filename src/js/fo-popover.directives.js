let popover = require('./lib/popover');

module.exports = angular
  .module('foPopover.directive', [])
  .directive('foPopover', foPopover);

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
    link: function(scope, element, attr) {
      let $tagLink = angular.element(document).find('a');
      let p = new popover($templateCache, element, attr);

      appendToBody(p.element);
      compileToScope(p.element, scope);

      scope.closePopover = p.close;

      element.bind('click', function(e) {
        closeAllPopover();
        e.stopPropagation();
        if (p.isOpened()) return p.close();
        p.open();
      });

      p.element.bind('click', function(e) {
        e.stopPropagation();
      });

      $tagLink.bind('click', function(e) {
        if (p.element.hasClass('open')) e.preventDefault();
      });

      $document.bind('click', function() {
        p.close();
      });

    }
  };
}
