System.register(['./dataservice', 'aurelia-framework'], function (_export) {
  var DataService, inject, LogManager, ObserverLocator, _classCallCheck, _createClass, logger, App;

  return {
    setters: [function (_dataservice) {
      DataService = _dataservice.DataService;
    }, function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      LogManager = _aureliaFramework.LogManager;
      ObserverLocator = _aureliaFramework.ObserverLocator;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      logger = LogManager.getLogger('DataService');

      App = (function () {
        function App(dataservice, observerLocator) {
          var _this = this;

          _classCallCheck(this, _App);

          this.dataservice = dataservice;
          this.suspendSave = false;
          this.newTodoDescription = '';
          this.items = [];

          this.includeArchived = false;
          observerLocator.getObserver(this, 'includeArchived').subscribe(function () {
            return _this.getTodos();
          });

          this.getTodos();
          this.dataservice.addPropertyChangeHandler(this.propertyChanged.bind(this));
        }

        _createClass(App, [{
          key: 'markAllCompleted',
          get: function () {
            return this.items.filter(function (x) {
              return !x.IsDone && !x.IsArchived;
            }).length === 0;
          },
          set: function (newValue) {
            this.items.filter(function (x) {
              return !x.IsArchived;
            }).forEach(function (x) {
              return x.IsDone = newValue;
            });
            this.save();
          }
        }, {
          key: 'archiveCompletedMessage',
          get: function () {
            var count = this.getStateOfItems().itemsDoneCount;
            if (count > 0) {
              return 'Archive ' + count + ' completed item' + (count > 1 ? 's' : '');
            }
            return null;
          }
        }, {
          key: 'itemsLeftMessage',
          get: function () {
            var count = this.getStateOfItems().itemsLeftCount;
            if (count > 0) {
              return count + ' item' + (count > 1 ? 's' : '') + ' left';
            }
            return null;
          }
        }, {
          key: 'archiveCompletedItems',
          value: function archiveCompletedItems() {
            var _this2 = this;

            var state = this.getStateOfItems();
            this.suspendSave = true;
            state.itemsDone.forEach(function (item) {
              if (!_this2.includeArchived) {
                _this2.items.splice(_this2.items.indexOf(item), 1);
              }
              item.IsArchived = true;
            });
            this.suspendSave = false;
            this.save();
          }
        }, {
          key: 'getTodos',
          value: function getTodos() {
            var _this3 = this;

            this.dataservice.getTodos(this.includeArchived).then(function (data) {
              _this3.items = data.results;
              logger.info('Fetched Todos ' + (_this3.includeArchived ? 'including archived' : 'excluding archived'));
            }, function (error) {
              return logger.error(error.message, 'Query failed');
            });
          }
        }, {
          key: 'addItem',
          value: function addItem() {
            var _this4 = this;

            var description = this.newTodoDescription;
            if (!description) {
              return;
            }

            var item = this.dataservice.createTodo({
              Description: description,
              CreatedAt: new Date(),
              IsDone: false
            });

            this.save(true)['catch'](function () {
              var index = _this4.items.indexOf(item);
              if (index > -1) {
                setTimeout(function () {
                  return _this4.items.splice(index, 1);
                }, 2000);
              }
            });
            this.items.push(item);
            this.newTodoDescription = '';
          }
        }, {
          key: 'editBegin',
          value: function editBegin(item) {
            item.isEditing = true;
          }
        }, {
          key: 'editEnd',
          value: function editEnd(item) {
            item.isEditing = false;
          }
        }, {
          key: 'deleteItem',
          value: function deleteItem(item) {
            this.items.splice(this.items.indexOf(item), 1);
            this.dataservice.deleteTodoAndSave(item);
          }
        }, {
          key: 'getStateOfItems',
          value: function getStateOfItems() {
            var itemsDone = [],
                itemsLeft = [];

            this.items.forEach(function (item) {
              if (item.IsDone) {
                if (!item.IsArchived) {
                  itemsDone.push(item);
                }
              } else {
                itemsLeft.push(item);
              }
            });

            return {
              itemsDone: itemsDone,
              itemsDoneCount: itemsDone.length,
              itemsLeft: itemsLeft,
              itemsLeftCount: itemsLeft.length
            };
          }
        }, {
          key: 'propertyChanged',
          value: function propertyChanged(changeArgs) {
            if (changeArgs.args.propertyName !== 'Id') {
              this.save();
            }
          }
        }, {
          key: 'purge',
          value: function purge() {
            var _this5 = this;

            return this.dataservice.purge(function () {
              return _this5.getTodos();
            });
          }
        }, {
          key: 'reset',
          value: function reset() {
            var _this6 = this;

            return this.dataservice.reset(function () {
              return _this6.getTodos();
            });
          }
        }, {
          key: 'save',
          value: function save(force) {
            if (this.dataservice.hasChanges() && (force || !this.suspendSave)) {
              return this.dataservice.saveChanges();
            }

            return new Promise(function (resolve, reject) {
              return resolve(false);
            });
          }
        }]);

        var _App = App;
        App = inject(DataService, ObserverLocator)(App) || App;
        return App;
      })();

      _export('App', App);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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