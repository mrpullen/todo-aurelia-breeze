System.register(["breeze", "breeze-client-labs/breeze.savequeuing", "aurelia-http-client", "aurelia-framework"], function (_export) {
  var breeze, saveQueuing, HttpClient, LogManager, _createClass, _classCallCheck, logger, DataService;

  return {
    setters: [function (_breeze) {
      breeze = _breeze["default"];
    }, function (_breezeClientLabsBreezeSavequeuing) {
      saveQueuing = _breezeClientLabsBreezeSavequeuing["default"];
    }, function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }, function (_aureliaFramework) {
      LogManager = _aureliaFramework.LogManager;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      logger = LogManager.getLogger("DataService");
      DataService = _export("DataService", (function () {
        function DataService() {
          _classCallCheck(this, DataService);

          var serviceName = "http://sampleservice.breezejs.com/api/todos/";

          this.httpClient = new HttpClient();
          this.httpClient.configure(function (builder) {
            return builder.withBaseUri(serviceName);
          });

          this.manager = new breeze.EntityManager(serviceName);
          this.manager.enableSaveQueuing(true);

          this.addTodoProperties();
        }

        _createClass(DataService, {
          addPropertyChangeHandler: {
            value: function addPropertyChangeHandler(handler) {
              // call handler when an entity property of any entity changes
              return this.manager.entityChanged.subscribe(function (changeArgs) {
                var action = changeArgs.entityAction;
                if (action === breeze.EntityAction.PropertyChange) {
                  handler(changeArgs);
                }
              });
            }
          },
          addTodoProperties: {
            value: function addTodoProperties() {
              // untracked 'isEditing' property to the 'TodoItem' type
              // see http://www.breezejs.com/sites/all/apidocs/classes/MetadataStore.html#method_registerEntityTypeCtor
              var metadataStore = this.manager.metadataStore;
              metadataStore.registerEntityTypeCtor("TodoItem", null, todoInit);

              function todoInit(todo) {
                todo.isEditing = false;
              }
            }
          },
          createTodo: {
            value: function createTodo(initialValues) {
              return this.manager.createEntity("TodoItem", initialValues);
            }
          },
          deleteTodoAndSave: {
            value: function deleteTodoAndSave(todoItem) {
              var _this = this;

              if (todoItem) {
                var aspect = todoItem.entityAspect;
                if (aspect.isBeingSaved && aspect.entityState.isAdded()) {
                  // wait to delete added entity while it is being saved
                  setTimeout(function () {
                    return _this.deleteTodoAndSave(todoItem);
                  }, 100);
                  return;
                }
                aspect.setDeleted();
                this.saveChanges();
              }
            }
          },
          getTodos: {
            value: function getTodos(includeArchived) {
              var query = breeze.EntityQuery.from("Todos").orderBy("CreatedAt");

              if (!includeArchived) {
                // exclude archived Todos
                // add filter clause limiting results to non-archived Todos
                query = query.where("IsArchived", "==", false);
              }

              return this.manager.executeQuery(query);
            }
          },
          handleSaveValidationError: {
            value: function handleSaveValidationError(error) {
              var message = "Not saved due to validation error";
              try {
                // fish out the first error
                var firstErr = error.entityErrors[0];
                message += ": " + firstErr.errorMessage;
              } catch (e) {}
              return message;
            }
          },
          hasChanges: {
            value: function hasChanges() {
              return this.manager.hasChanges();
            }
          },
          saveChanges: {
            value: function saveChanges() {
              return this.manager.saveChanges().then(saveSucceeded, saveFailed);

              function saveSucceeded(saveResult) {
                logger.debug("# of Todos saved = " + saveResult.entities.length);
              }

              function saveFailed(error) {
                var _this = this;

                var reason = error.message,
                    detail = error.detail;

                if (error.entityErrors) {
                  reason = this.handleSaveValidationError(error);
                } else if (detail && detail.ExceptionType && detail.ExceptionType.indexOf("OptimisticConcurrencyException") !== -1) {
                  // Concurrency error
                  reason = "Another user, perhaps the server, " + "may have deleted one or all of the todos." + " You may have to restart the app.";
                } else {
                  reason = "Failed to save changes: " + reason + " You may have to restart the app.";
                }

                logger.error(error, reason);
                // DEMO ONLY: discard all pending changes
                // Let them see the error for a second before rejecting changes
                setTimeout(function () {
                  return _this.manager.rejectChanges();
                }, 1000);
                throw error; // so caller can see it
              }
            }
          },
          purge: {
            value: function purge(callback) {
              var _this = this;

              return this.httpClient.post("purge").then(function () {
                logger.debug("database purged.");
                _this.manager.clear();
                if (callback) callback();
              }, function (error) {
                return logger.error("database purge failed: " + error);
              });
            }
          },
          reset: {
            value: function reset(callback) {
              var _this = this;

              return this.httpClient.post("reset").then(function () {
                logger.debug("database reset.");
                _this.manager.clear();
                if (callback) callback();
              }, function (error) {
                return logger.error("database reset failed: " + error);
              });
            }
          }
        });

        return DataService;
      })());
    }
  };
});
/* eat it for now */
//# sourceMappingURL=data:application/json;base64,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