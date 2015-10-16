let positions = require('./positions');

module.exports = function($templateCache, element, attr) {

  function createPopoverELement() {
    let templateString = $templateCache.get(attr.popoverTemplate);
    let $wrapper = angular.element('<div class="fo-popover"></div>');
    $wrapper[0].id = attr.popoverId;
    $wrapper.addClass(attr.popoverClass);
    $wrapper.css('width', attr.popoverWidth);

    return angular.element($wrapper).append(templateString);
  }

  function getCurrentPosition() {
    return attr.popoverPosition.split(' ').join('_');
  }

  this.element = createPopoverELement();

  this.isOpened = function() {
    return this.element.hasClass('open');
  }.bind(this);

  this.open = function() {
    let tetherOption = {
      element: this.element[0],
      target: element[0],
      attachment: 'bottom middle',
      targetAttachment: 'top middle',
      offset: attr.popoverOffset
    };

    let currentPosition = getCurrentPosition();
    tetherOption = angular.extend(tetherOption, positions[currentPosition]);

    angular.element(document.querySelectorAll('.fo-popover')).removeClass('open');
    this.element.addClass('open');

    new Tether(tetherOption);
  }.bind(this);

  this.close = function() {
    this.element.removeClass('open');
  }.bind(this);


};
