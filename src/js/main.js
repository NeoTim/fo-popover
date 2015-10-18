let foPopoverDirective = require('./directive/fo-popover.directive');
let foPopoverService = require('./service/fo-popover.service');

module.exports = angular
  .module('foPopover', [
    foPopoverDirective.name,
    foPopoverService.name
  ]);
