/* */ 
"format cjs";
(function(process) {
  (function(definition) {
    if (typeof breeze === "object") {
      definition(breeze);
    } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
      var b = require("breeze");
      definition(b);
    } else if (typeof define === "function" && define["amd"] && !window.breeze) {
      define(["breeze"], definition);
    } else {
      throw new Error("Can't find breeze");
    }
  }(function(breeze) {
    'use strict';
    var service = {
      getErrorMessage: getErrorMessage,
      getEntityName: getEntityName,
      getMessageFromEntityError: getMessageFromEntityError,
      reviewServerErrors: reviewServerErrors
    };
    breeze.saveErrorMessageService = service;
    function getErrorMessage(error) {
      var msg = error.message;
      var entityErrors = error.entityErrors;
      if (!entityErrors && error.innerError) {
        entityErrors = error.innerError.entityErrors;
      }
      if (entityErrors && entityErrors.length) {
        service.reviewServerErrors(entityErrors);
        return getValidationMessages(entityErrors);
      }
      return msg;
    }
    function getValidationMessages(entityErrors) {
      var isServerError = entityErrors[0].isServerError;
      try {
        return entityErrors.map(service.getMessageFromEntityError).join('; <br/>');
      } catch (e) {
        return (isServerError ? 'server' : 'client') + ' validation error';
      }
    }
    function getMessageFromEntityError(entityError) {
      var entity = entityError.entity;
      if (entity) {
        var name = service.getEntityName(entity);
      }
      name = name ? name += ' - ' : '';
      return name + '\'' + entityError.errorMessage + '\'';
    }
    function getEntityName(entity) {
      var key = entity.entityAspect.getKey();
      var name = key.entityType.shortName;
      var id = key.values.join(',');
      return name + ' (' + id + ')';
    }
    function reviewServerErrors(entityErrors) {
      var entitiesWithServerErrors = [];
      entityErrors.forEach(function(entityError) {
        var entity = entityError.isServerError && entityError.entity;
        if (entity && entitiesWithServerErrors.indexOf(entity) === -1) {
          entitiesWithServerErrors.push(entity);
          clearServerErrorsOnNextChange(entity);
        }
      });
    }
    function clearServerErrorsOnNextChange(badEntity) {
      if (badEntity.entityAspect.entityState.isDetached()) {
        return ;
      }
      (function(entity) {
        var manager = entity.entityAspect.entityManager;
        var subKey = manager.entityChanged.subscribe(function(changeArgs) {
          if (changeArgs.entity === entity) {
            manager.entityChanged.unsubscribe(subKey);
            var aspect = entity.entityAspect;
            aspect.getValidationErrors().forEach(function(err) {
              if (err.isServerError) {
                aspect.removeValidationError(err);
              }
            });
          }
        });
      })(badEntity);
    }
  }));
})(require("process"));
