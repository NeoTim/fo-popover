module.exports = angular
  .module('foPopover.services', [])
  .factory('foPopover', foPopover);

function foPopover() {
  return {
    close: function(id) {
      angular.element(document.querySelector('.fo-popover.open')).removeClass('open');
    }
  };
}
