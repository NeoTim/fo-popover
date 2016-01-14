module.exports = angular
  .module('foPopoverInner.directive', [])
  .directive('foPopoverInner', foPopoverInner);

// @ngInject
function foPopoverInner($document) {

  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attr) {
      let $tagLink = angular.element(document).find('a');

      scope.closePopover = function() {
        angular.element(document.querySelector('.fo-popover.open')).removeClass('open');
      };

      element.bind('click', function(e) {
        e.stopPropagation();
      });

      angular.element(document.querySelector('.' + attr.foPopoverId)).bind('click', function(e) {
        e.stopPropagation();
      });

      $tagLink.bind('click', function(e) {
        if (p.element.hasClass('open')) e.preventDefault();
      });

      $document.bind('click', function() {
        angular.element(document.querySelector('.' + attr.foPopoverId)).removeClass('open');
      });

    }
  };
}
