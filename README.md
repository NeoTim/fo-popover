# fo-popover
A nice popover

[Demo](http://forsigner.com/fo-popover/)

## Install

```bash
$ bower install fo-popover --save
```

### Require
[Beside](https://github.com/forsigner/beside)

```bash
$ bower install beside --save
```

## Usage

```html
<link rel="stylesheet" href="bower_components/fo-popover/dist/css/fo-popover.css" />

<script src="bower_components/beside/dist/js/beside.js"></script>
<script src="bower_components/fo-popover/dist/js/fo-popover.js"></script>
```


#### As a directive

```js
angular.module('app', ['foPopover']);
```

```html
<button
  class="btn btn-success"
  fo-popover
  popover-position="top center"
  popover-template="popover.html"
>删除</button>

<script id="popover.html" type="text/ng-template">
  <div class="popover-header">
    email
  </div>
  <div class="popover-body">
    <label class="control-label" for="email">email</label>
    <input class="form-control" id="email" ng-model="email" type="email">
  </div>
  <div class="popover-footer">
    <button class="btn btn-primary" ng-click="yes()">确认</button>
    <button class="btn btn-default" ng-click="closePopover()">取消</button>
  </div>
</script>
```

#### As a service

``` html
<div class="text-center">
  <button id="delete" class="btn btn-default" type="button" ng-click="open()">
    delete
  </button>
</div>

<script id="delete.html" type="text/ng-template">
  <div class="popover-header">
    Delete ?
  </div>
  <div class="popover-body">
    <button class="btn btn-primary" ng-click="yes()">确认</button>
    <button class="btn btn-default" ng-click="closePopover()">取消</button>
  </div>
</script>
```

```js
angular.module('app', ['foPopover'])
.controller('HomeCtrl', function($scope, foPopover) {
  $scope.open = function() {
    foPopover.open({
      target: document.querySelector('#delete'),
      template: 'delete.hmtl',
      position: 'bottom center',
      scope: $scope
    });
  };

  $scope.yes = function () {
    // todo
    foPopover.close();
  };

});
```
