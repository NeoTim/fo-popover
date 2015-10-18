# fo-popover
A nice popover

[Demo](http://fo.popover.mipinr.com)

## Install

```
bower install fo-popover --save
```

### Require
[Tether](https://github.com/HubSpot/tether)

## Usage

```html
<link rel="stylesheet" href="bower_components/fo-popover/dist/css/fo-popover.css" />

<script src="bower_components/tether/dist/js/tether.js"></script>
<script src="bower_components/fo-popover/dist/js/fo-popover.js"></script>
```

```js
angular.module('app', ['foPopover']);
```

```html
<button
  class="btn btn-success"
  fo-popover
  popover-position="top middle"
  popover-template="popover.html"
>删除</button>

<script id="popover.html" type="text/ng-template">
  <div class="popover-header">
    email
  </div>
  <div class="popover-body">
    <label class="control-label" for="ips">email</label>
    <input class="form-control" id="ips" ng-model="email" placeholder="email" type="email">
  </div>
  <div class="popover-footer">
    <button class="btn btn-primary" ng-click="yes()">确认</button>
    <button class="btn btn-default" ng-click="closePopover()">取消</button>
  </div>
</script>
```
