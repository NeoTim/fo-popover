let foPopoverDirective = require('./fo-popover.directive');
let foPopoverService = require('./fo-popover.service');

module.exports = angular
  .module('foPopover', [
    foPopoverDirective.name,
    foPopoverService.name
  ]);
