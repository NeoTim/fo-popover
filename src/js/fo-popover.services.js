module.exports = angular
  .module('foPopover.services', [])
  .factory('foPopover', foPopover);

foPopover.$inject = ['$rootScope', '$document', '$templateCache', '$compile'];

function foPopover($rootScope, $document, $templateCache, $compile) {

  function createPopoverELement(options) {
    let templateString = $templateCache.get(options.template);
    let $wrapper = angular.element('<div fo-popover-inner fo-popover-id=fo-popover-' + Date.now() + ' class="fo-popover"></div>');
    $wrapper[0].id = options.id;
    $wrapper.addClass(options.class);
    $wrapper.addClass('fo-popover-' + Date.now());

    return angular.element($wrapper).append(templateString);
  }


  return {
    close: function(id) {
      angular.element(document.querySelector('.fo-popover.open')).removeClass('open');
    },
    open: function(options) {
      event.stopPropagation();
      console.log(options);
      var $popover = createPopoverELement(options);
      let element = angular.element($popover);
      var $body = angular.element($document).find('body');

      $body.append($popover);

      $compile($popover)($rootScope);


      let tetherOption = {
        element: element[0],
        target: options.target,
        attachment: 'bottom middle',
        targetAttachment: 'top middle',
        offset: options.offset
      };

      if (!element.hasClass('open')) {
        element.addClass('open');
      }

      // let currentPosition = getCurrentPosition();
      // tetherOption = angular.extend(tetherOption, positions[currentPosition]);
      //
      // angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
      // this.element.addClass('open');

      new Tether(tetherOption);

    }
  };
}
