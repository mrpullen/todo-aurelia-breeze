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
            value: function markAllCompleted() {}
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

            //   vm.markAllCompleted = ko.computed({
            //     read: function () {
            //       var state = getStateOfItems();
            //       return state.itemsLeftCount === 0 && vm.items().length > 0;
            //     },
            //     write: function (value) {
            //       suspendSave = true;
            //       vm.items().forEach(function (item) {
            //         item.IsDone(value);
            //       });
            //       suspendSave = false;
            //       save();
            //     }
            //   });
            // }

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
                logger.info("Fetched Todos " + _this.includeArchived ? "including archived" : "excluding archived");
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
              item.isEditing(true);
            }
          },
          editEnd: {
            value: function editEnd(item) {
              item.isEditing(false);
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

// app.viewModel = (function (logger, dataservice) {
//
//   var vm = {
//     addItem: addItem,
//     archiveCompletedItems: archiveCompletedItems,
//     //archiveCompletedMessage - see addComputed()
//     deleteItem: deleteItem,
//     editBegin: editBegin,
//     editEnd: editEnd,
//     includeArchived: ko.observable(false),
//     items: ko.observableArray(),
//     //itemsLeftMessage - see addComputed()
//     //markAllCompleted - see addComputed()
//     newTodoDescription: ko.observable(""),
//     purge: purge,
//     reset: reset
//   };
//
//   var suspendSave = false;
//
//   initVm();
//
//   return vm; // done with setup; return module variable
//
//   /* Implementation */
//
//   function initVm() {
//     vm.includeArchived.subscribe(getTodos);
//     addComputeds();
//     getTodos();
//
//     // Listen for property change of ANY entity so we can (optionally) save
//     dataservice.addPropertyChangeHandler(propertyChanged);
//   }
//
//   function addComputeds() {
//     vm.archiveCompletedMessage = ko.computed(function () {
//       var count = getStateOfItems().itemsDoneCount;
//       if (count > 0) {
//         return "Archive " + count + " completed item" + (count > 1 ? "s" : "");
//       }
//       return null;
//     });
//
//     vm.itemsLeftMessage = ko.computed(function () {
//       var count = getStateOfItems().itemsLeftCount;
//       if (count > 0) {
//         return count + " item" + (count > 1 ? "s" : "") + " left";
//       }
//       return null;
//     });
//
//     vm.markAllCompleted = ko.computed({
//       read: function () {
//         var state = getStateOfItems();
//         return state.itemsLeftCount === 0 && vm.items().length > 0;
//       },
//       write: function (value) {
//         suspendSave = true;
//         vm.items().forEach(function (item) {
//           item.IsDone(value);
//         });
//         suspendSave = false;
//         save();
//       }
//     });
//   }
//
//   function archiveCompletedItems() {
//     var state = getStateOfItems();
//     suspendSave = true;
//     state.itemsDone.forEach(function (item) {
//       if (!vm.includeArchived()) {
//         vm.items.remove(item);
//       }
//       item.IsArchived(true);
//     });
//     suspendSave = false;
//     save();
//   }
//
//   function getTodos() {
//     dataservice.getTodos(vm.includeArchived())
//       .then(querySucceeded)
//       .fail(queryFailed);
//
//     function querySucceeded(data) {
//       vm.items(data.results);
//       logger.info("Fetched Todos " +
//         (vm.includeArchived() ? "including archived" : "excluding archived"));
//     }
//     function queryFailed(error) {
//       logger.error(error.message, "Query failed");
//     }
//   }
//
//   function addItem() {
//     var description = vm.newTodoDescription();
//     if (!description) { return; }
//
//     var item = dataservice.createTodo({
//       Description: description,
//       CreatedAt: new Date(),
//       IsDone: vm.markAllCompleted()
//     });
//
//     save(true).catch(addFailed);
//     vm.items.push(item);
//     vm.newTodoDescription("");
//
//     function addFailed() {
//       var index = vm.items.indexOf(item);
//       if (index > -1) {
//         setTimeout(function () { vm.items.splice(index, 1); }, 2000);
//       }
//     }
//   }
//
//   function editBegin(item) { item.isEditing(true); }
//
//   function editEnd(item) { item.isEditing(false); }
//
//   function deleteItem(item) {
//     vm.items.remove(item);
//     dataservice.deleteTodoAndSave(item);
//   };
//
//   function getStateOfItems() {
//     var itemsDone = [], itemsLeft = [];
//
//     vm.items().forEach(function (item) {
//       if (item.IsDone()) {
//         if (!item.IsArchived()) {
//           itemsDone.push(item); // only unarchived items
//         }
//       } else {
//         itemsLeft.push(item);
//       }
//     });
//
//     return {
//       itemsDone: itemsDone,
//       itemsDoneCount: itemsDone.length,
//       itemsLeft: itemsLeft,
//       itemsLeftCount: itemsLeft.length
//     };
//   }
//
//   function propertyChanged(changeArgs) {
//     // propertyChanged triggers save attempt UNLESS the property is the 'Id'
//     // because THEN the change is actually the post-save Id-fixup
//     // rather than user data entry so there is actually nothing to save.
//     if (changeArgs.args.propertyName !== 'Id') {
//       save();
//     }
//   }
//
//   function purge() {
//     return dataservice.purge(getTodos);
//   }
//
//   function reset() {
//     return dataservice.reset(getTodos);
//   }
//
//   function save(force) {
//     // Save if have changes to save AND
//     // if must save OR save not suspended
//     if (dataservice.hasChanges() && (force || !suspendSave)) {
//       return dataservice.saveChanges();
//     }
//     // Decided not to save; return resolved promise w/ no result
//     return Q(false);
//   }
//
// })(app.logger, app.dataservice);
//
// // Bind viewModel to view in index.html
// ko.applyBindings(app.viewModel);
//# sourceMappingURL=data:application/json;base64,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