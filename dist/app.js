System.register(['./dataservice', 'aurelia-framework'], function (_export) {
  var DataService, inject, LogManager, ObserverLocator, logger, App;

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

        var _App = App;

        _createClass(_App, [{
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

        App = inject(DataService, ObserverLocator)(App) || App;
        return App;
      })();

      _export('App', App);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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