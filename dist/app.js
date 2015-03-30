System.register(["./dataservice", "aurelia-framework"], function (_export) {
  var DataService, LogManager, ObserverLocator, _createClass, _classCallCheck, logger, App;

  return {
    setters: [function (_dataservice) {
      DataService = _dataservice.DataService;
    }, function (_aureliaFramework) {
      LogManager = _aureliaFramework.LogManager;
      ObserverLocator = _aureliaFramework.ObserverLocator;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      logger = LogManager.getLogger("DataService");
      App = _export("App", (function () {
        function App(dataservice, observerLocator) {
          var _this = this;

          _classCallCheck(this, App);

          this.dataservice = dataservice;
          this.suspendSave = false;
          this.newTodoDescription = "";
          this.items = [];

          this.includeArchived = false;
          observerLocator.getObserver(this, "includeArchived").subscribe(function () {
            return _this.getTodos();
          });

          this.getTodos();
          this.dataservice.addPropertyChangeHandler(this.propertyChanged.bind(this));
        }

        _createClass(App, {
          markAllCompleted: {
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
          },
          archiveCompletedMessage: {
            get: function () {
              var count = this.getStateOfItems().itemsDoneCount;
              if (count > 0) {
                return "Archive " + count + " completed item" + (count > 1 ? "s" : "");
              }
              return null;
            }
          },
          itemsLeftMessage: {
            get: function () {
              var count = this.getStateOfItems().itemsLeftCount;
              if (count > 0) {
                return count + " item" + (count > 1 ? "s" : "") + " left";
              }
              return null;
            }
          },
          archiveCompletedItems: {
            value: function archiveCompletedItems() {
              var _this = this;

              var state = this.getStateOfItems();
              this.suspendSave = true;
              state.itemsDone.forEach(function (item) {
                if (!_this.includeArchived) {
                  _this.items.splice(_this.items.indexOf(item), 1);
                }
                item.IsArchived = true;
              });
              this.suspendSave = false;
              this.save();
            }
          },
          getTodos: {
            value: function getTodos() {
              var _this = this;

              this.dataservice.getTodos(this.includeArchived).then(function (data) {
                _this.items = data.results;
                logger.info("Fetched Todos " + (_this.includeArchived ? "including archived" : "excluding archived"));
              }, function (error) {
                return logger.error(error.message, "Query failed");
              });
            }
          },
          addItem: {
            value: function addItem() {
              var _this = this;

              var description = this.newTodoDescription;
              if (!description) {
                return;
              }

              var item = this.dataservice.createTodo({
                Description: description,
                CreatedAt: new Date(),
                IsDone: false
              });

              this.save(true)["catch"](function () {
                var index = _this.items.indexOf(item);
                if (index > -1) {
                  setTimeout(function () {
                    return _this.items.splice(index, 1);
                  }, 2000);
                }
              });
              this.items.push(item);
              this.newTodoDescription = "";
            }
          },
          editBegin: {
            value: function editBegin(item) {
              item.isEditing = true;
            }
          },
          editEnd: {
            value: function editEnd(item) {
              item.isEditing = false;
            }
          },
          deleteItem: {
            value: function deleteItem(item) {
              this.items.splice(this.items.indexOf(item), 1);
              this.dataservice.deleteTodoAndSave(item);
            }
          },
          getStateOfItems: {
            value: function getStateOfItems() {
              var itemsDone = [],
                  itemsLeft = [];

              this.items.forEach(function (item) {
                if (item.IsDone) {
                  if (!item.IsArchived) {
                    itemsDone.push(item); // only unarchived items
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
          },
          propertyChanged: {
            value: function propertyChanged(changeArgs) {
              // propertyChanged triggers save attempt UNLESS the property is the 'Id'
              // because THEN the change is actually the post-save Id-fixup
              // rather than user data entry so there is actually nothing to save.
              if (changeArgs.args.propertyName !== "Id") {
                this.save();
              }
            }
          },
          purge: {
            value: function purge() {
              var _this = this;

              return this.dataservice.purge(function () {
                return _this.getTodos();
              });
            }
          },
          reset: {
            value: function reset() {
              var _this = this;

              return this.dataservice.reset(function () {
                return _this.getTodos();
              });
            }
          },
          save: {
            value: function save(force) {
              // Save if have changes to save AND
              // if must save OR save not suspended
              if (this.dataservice.hasChanges() && (force || !this.suspendSave)) {
                return this.dataservice.saveChanges();
              }
              // Decided not to save; return resolved promise w/ no result
              return new Promise(function (resolve, reject) {
                return resolve(false);
              });
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [DataService, ObserverLocator];
            }
          }
        });

        return App;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,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