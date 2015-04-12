System.register(['breeze', 'breeze-client-labs/breeze.savequeuing', 'aurelia-http-client', 'aurelia-framework'], function (_export) {
  var breeze, saveQueuing, HttpClient, LogManager, _classCallCheck, _createClass, logger, DataService;

  return {
    setters: [function (_breeze) {
      breeze = _breeze['default'];
    }, function (_breezeClientLabsBreezeSavequeuing) {
      saveQueuing = _breezeClientLabsBreezeSavequeuing['default'];
    }, function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }, function (_aureliaFramework) {
      LogManager = _aureliaFramework.LogManager;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      logger = LogManager.getLogger('DataService');

      DataService = (function () {
        function DataService() {
          _classCallCheck(this, DataService);

          var serviceName = 'http://sampleservice.breezejs.com/api/todos/';

          this.httpClient = new HttpClient();
          this.httpClient.configure(function (builder) {
            return builder.withBaseUri(serviceName);
          });

          this.manager = new breeze.EntityManager(serviceName);
          this.manager.enableSaveQueuing(true);

          this.addTodoProperties();
        }

        _createClass(DataService, [{
          key: 'addPropertyChangeHandler',
          value: function addPropertyChangeHandler(handler) {
            return this.manager.entityChanged.subscribe(function (changeArgs) {
              var action = changeArgs.entityAction;
              if (action === breeze.EntityAction.PropertyChange) {
                handler(changeArgs);
              }
            });
          }
        }, {
          key: 'addTodoProperties',
          value: function addTodoProperties() {
            var metadataStore = this.manager.metadataStore;
            metadataStore.registerEntityTypeCtor('TodoItem', null, todoInit);

            function todoInit(todo) {
              todo.isEditing = false;
            }
          }
        }, {
          key: 'createTodo',
          value: function createTodo(initialValues) {
            return this.manager.createEntity('TodoItem', initialValues);
          }
        }, {
          key: 'deleteTodoAndSave',
          value: function deleteTodoAndSave(todoItem) {
            var _this = this;

            if (todoItem) {
              var aspect = todoItem.entityAspect;
              if (aspect.isBeingSaved && aspect.entityState.isAdded()) {
                setTimeout(function () {
                  return _this.deleteTodoAndSave(todoItem);
                }, 100);
                return;
              }
              aspect.setDeleted();
              this.saveChanges();
            }
          }
        }, {
          key: 'getTodos',
          value: function getTodos(includeArchived) {
            var query = breeze.EntityQuery.from('Todos').orderBy('CreatedAt');

            if (!includeArchived) {
              query = query.where('IsArchived', '==', false);
            }

            return this.manager.executeQuery(query);
          }
        }, {
          key: 'handleSaveValidationError',
          value: function handleSaveValidationError(error) {
            var message = 'Not saved due to validation error';
            try {
              var firstErr = error.entityErrors[0];
              message += ': ' + firstErr.errorMessage;
            } catch (e) {}
            return message;
          }
        }, {
          key: 'hasChanges',
          value: function hasChanges() {
            return this.manager.hasChanges();
          }
        }, {
          key: 'saveChanges',
          value: function saveChanges() {
            return this.manager.saveChanges().then(saveSucceeded, saveFailed);

            function saveSucceeded(saveResult) {
              logger.debug('# of Todos saved = ' + saveResult.entities.length);
            }

            function saveFailed(error) {
              var _this2 = this;

              var reason = error.message,
                  detail = error.detail;

              if (error.entityErrors) {
                reason = this.handleSaveValidationError(error);
              } else if (detail && detail.ExceptionType && detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
                reason = 'Another user, perhaps the server, ' + 'may have deleted one or all of the todos.' + ' You may have to restart the app.';
              } else {
                reason = 'Failed to save changes: ' + reason + ' You may have to restart the app.';
              }

              logger.error(error, reason);

              setTimeout(function () {
                return _this2.manager.rejectChanges();
              }, 1000);
              throw error;
            }
          }
        }, {
          key: 'purge',
          value: function purge(callback) {
            var _this3 = this;

            return this.httpClient.post('purge').then(function () {
              logger.debug('database purged.');
              _this3.manager.clear();
              if (callback) callback();
            }, function (error) {
              return logger.error('database purge failed: ' + error);
            });
          }
        }, {
          key: 'reset',
          value: function reset(callback) {
            var _this4 = this;

            return this.httpClient.post('reset').then(function () {
              logger.debug('database reset.');
              _this4.manager.clear();
              if (callback) callback();
            }, function (error) {
              return logger.error('database reset failed: ' + error);
            });
          }
        }]);

        return DataService;
      })();

      _export('DataService', DataService);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGFzZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7a0ZBUUksTUFBTSxFQUVHLFdBQVc7Ozs7Ozs7O3NDQUxoQixVQUFVOztxQ0FDVixVQUFVOzs7Ozs7Ozs7QUFFZCxZQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7O0FBRW5DLGlCQUFXO0FBQ1gsaUJBREEsV0FBVyxHQUNSO2dDQURILFdBQVc7O0FBRXBCLGNBQUksV0FBVyxHQUFHLDhDQUE4QyxDQUFDOztBQUVqRSxjQUFJLENBQUMsVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDbkMsY0FBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBQSxPQUFPO21CQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO1dBQUEsQ0FBQyxDQUFDOztBQUV2RSxjQUFJLENBQUMsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyRCxjQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyQyxjQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjs7cUJBWFUsV0FBVzs7aUJBYUUsa0NBQUMsT0FBTyxFQUFFO0FBRWhDLG1CQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN4RCxrQkFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztBQUNyQyxrQkFBSSxNQUFNLEtBQUssTUFBTSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUU7QUFDakQsdUJBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztlQUNyQjthQUNGLENBQUMsQ0FBQztXQUNKOzs7aUJBRWdCLDZCQUFHO0FBR2xCLGdCQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUMvQyx5QkFBYSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRWpFLHFCQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDdEIsa0JBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ3hCO1dBQ0Y7OztpQkFFUyxvQkFBQyxhQUFhLEVBQUU7QUFDeEIsbUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1dBQzdEOzs7aUJBRWdCLDJCQUFDLFFBQVEsRUFBRTs7O0FBQzFCLGdCQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0FBQ25DLGtCQUFJLE1BQU0sQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtBQUV2RCwwQkFBVSxDQUFDO3lCQUFNLE1BQUssaUJBQWlCLENBQUUsUUFBUSxDQUFDO2lCQUFBLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDekQsdUJBQU87ZUFDUjtBQUNELG9CQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDcEIsa0JBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUNwQjtXQUNGOzs7aUJBRU8sa0JBQUMsZUFBZSxFQUFFO0FBQ3hCLGdCQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQ2IsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUUxQixnQkFBSSxDQUFDLGVBQWUsRUFBRTtBQUVwQixtQkFBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNoRDs7QUFFRCxtQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUN6Qzs7O2lCQUV3QixtQ0FBQyxLQUFLLEVBQUU7QUFDL0IsZ0JBQUksT0FBTyxHQUFHLG1DQUFtQyxDQUFDO0FBQ2xELGdCQUFJO0FBQ0Ysa0JBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMscUJBQU8sSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQzthQUN6QyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQXdCO0FBQ3BDLG1CQUFPLE9BQU8sQ0FBQztXQUNoQjs7O2lCQUVTLHNCQUFHO0FBQ1gsbUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztXQUNsQzs7O2lCQUVVLHVCQUFHO0FBQ1osbUJBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FDOUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFbkMscUJBQVMsYUFBYSxDQUFDLFVBQVUsRUFBRTtBQUNqQyxvQkFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2xFOztBQUVELHFCQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUU7OztBQUN6QixrQkFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU87a0JBQ3RCLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOztBQUUxQixrQkFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO0FBQ3RCLHNCQUFNLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO2VBQ2hELE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsSUFDdkMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUV2RSxzQkFBTSxHQUNKLG9DQUFvQyxHQUNwQywyQ0FBMkMsR0FDM0MsbUNBQW1DLENBQUM7ZUFDdkMsTUFBTTtBQUNMLHNCQUFNLGdDQUE4QixNQUFNLHNDQUFtQyxDQUFDO2VBQy9FOztBQUVELG9CQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFHNUIsd0JBQVUsQ0FBQzt1QkFBTSxPQUFLLE9BQU8sQ0FBQyxhQUFhLEVBQUU7ZUFBQSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JELG9CQUFNLEtBQUssQ0FBQzthQUNiO1dBQ0Y7OztpQkFFSSxlQUFDLFFBQVEsRUFBRTs7O0FBQ2QsbUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQ2pDLElBQUksQ0FDSCxZQUFNO0FBQ0osb0JBQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNqQyxxQkFBSyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckIsa0JBQUksUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO2FBQzFCLEVBQ0QsVUFBQSxLQUFLO3FCQUFJLE1BQU0sQ0FBQyxLQUFLLDZCQUEyQixLQUFLLENBQUc7YUFBQSxDQUFDLENBQUM7V0FDL0Q7OztpQkFFSSxlQUFDLFFBQVEsRUFBRTs7O0FBQ2QsbUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQ2pDLElBQUksQ0FDSCxZQUFNO0FBQ0osb0JBQU0sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNoQyxxQkFBSyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDckIsa0JBQUksUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO2FBQzFCLEVBQ0QsVUFBQSxLQUFLO3FCQUFJLE1BQU0sQ0FBQyxLQUFLLDZCQUEyQixLQUFLLENBQUc7YUFBQSxDQUFDLENBQUM7V0FDL0Q7OztlQWxJVSxXQUFXOzs7NkJBQVgsV0FBVyIsImZpbGUiOiJkYXRhc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9