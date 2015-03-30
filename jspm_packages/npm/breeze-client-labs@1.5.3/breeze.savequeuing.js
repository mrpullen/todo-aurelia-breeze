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
    var EntityManager = breeze.EntityManager;
    EntityManager.prototype.enableSaveQueuing = enableSaveQueuing;
    if (!EntityManager.prototype.saveChangesValidateOnClient) {
      EntityManager.prototype.saveChangesValidateOnClient = function() {
        return null;
      };
    }
    function enableSaveQueuing(enable) {
      var em = this;
      var saveQueuing = em._saveQueueing || (em._saveQueuing = new SaveQueuing(em));
      enable = (enable === undefined) ? true : enable;
      saveQueuing._isEnabled = enable;
      if (enable) {
        em.saveChanges = saveChangesWithQueuing;
      } else {
        em.saveChanges = em._saveQueuing.baseSaveChanges;
      }
    }
    ;
    function saveChangesWithQueuing(entities, saveOptions) {
      try {
        var saveQueuing = this._saveQueuing;
        if (saveQueuing.isSaving) {
          return saveQueuing.queueSaveChanges(entities);
        } else {
          saveQueuing.isSaving = true;
          saveQueuing.saveOptions = saveOptions;
          return saveQueuing.saveChanges(entities, saveOptions);
        }
      } catch (err) {
        return breeze.Q.reject(err);
      }
    }
    function SaveQueuing(entityManager) {
      this.entityManager = entityManager;
      this.baseSaveChanges = entityManager.saveChanges;
      this.isSaving = false;
      this.nextSaveDeferred = null;
      this.saveMemo = null;
    }
    ;
    SaveQueuing.prototype.isEnabled = function() {
      return this._isEnabled;
    };
    SaveQueuing.prototype.queueSaveChanges = queueSaveChanges;
    SaveQueuing.prototype.saveChanges = saveChanges;
    SaveQueuing.prototype.saveSucceeded = saveSucceeded;
    SaveQueuing.prototype.saveFailed = saveFailed;
    function getSavedNothingResult() {
      return {
        entities: [],
        keyMappings: []
      };
    }
    function queueSaveChanges(entities) {
      var self = this;
      var em = self.entityManager;
      var changes = entities || em.getChanges();
      if (changes.length === 0) {
        return breeze.Q.resolve(getSavedNothingResult());
      }
      var valError = em.saveChangesValidateOnClient(changes);
      if (valError) {
        return breeze.Q.reject(valError);
      }
      var saveMemo = self.nextSaveMemo || (self.nextSaveMemo = new SaveMemo());
      memoizeChanges();
      var deferred = self.nextSaveDeferred || (self.nextSaveDeferred = breeze.Q.defer());
      return deferred.promise;
      function memoizeChanges() {
        if (changes.length === 0) {
          return ;
        }
        var queuedChanges = saveMemo.queuedChanges;
        changes.forEach(function(e) {
          if (!e.entityAspect.isBeingSaved && queuedChanges.indexOf(e) === -1) {
            queuedChanges.push(e);
          }
        });
        saveMemo.updateEntityMemos(changes);
      }
    }
    ;
    function saveChanges(entities, saveOptions) {
      var self = this;
      var promise = self.baseSaveChanges.call(self.entityManager, entities, saveOptions || self.saveOptions).then(function(saveResult) {
        return self.saveSucceeded(saveResult);
      }).then(null, function(error) {
        return self.saveFailed(error);
      });
      rememberAddedOriginalValues(entities);
      return promise;
      function rememberAddedOriginalValues() {
        var added = entities ? entities.filter(function(e) {
          return e.entityAspect.entityState.isAdded();
        }) : self.entityManager.getChanges(null, breeze.EntityState.Added);
        added.forEach(function(entity) {
          var props = entity.entityType.dataProperties;
          var originalValues = entity.entityAspect.originalValues;
          props.forEach(function(dp) {
            if (dp.isPartOfKey) {
              return ;
            }
            originalValues[dp.name] = entity.getProperty(dp.name);
          });
        });
      }
    }
    ;
    function saveSucceeded(saveResult) {
      var self = this;
      var activeSaveDeferred = self.activeSaveDeferred;
      var nextSaveDeferred = self.nextSaveDeferred;
      var nextSaveMemo = self.nextSaveMemo;
      self.isSaving = false;
      self.activeSaveDeferred = null;
      self.activeSaveMemo = null;
      self.nextSaveDeferred = null;
      self.nextSaveMemo = null;
      if (nextSaveMemo) {
        nextSaveMemo.pkFixup(saveResult.keyMappings);
        nextSaveMemo.applyToSavedEntities(self.entityManager, saveResult.entities);
        var queuedChanges = nextSaveMemo.queuedChanges.filter(function(e) {
          return !e.entityAspect.entityState.isDetached();
        });
        if (queuedChanges.length > 0) {
          self.isSaving = true;
          self.activeSaveDeferred = nextSaveDeferred;
          self.activeSaveMemo = nextSaveMemo;
          self.saveChanges(queuedChanges);
        } else if (nextSaveDeferred) {
          nextSaveDeferred.resolve(getSavedNothingResult());
        }
      }
      if (activeSaveDeferred) {
        activeSaveDeferred.resolve(saveResult);
      }
      return saveResult;
    }
    ;
    function saveFailed(error) {
      var self = this;
      error = new QueuedSaveFailedError(error, self);
      var activeSaveDeferred = self.activeSaveDeferred;
      var nextSaveDeferred = self.nextSaveDeferred;
      self.isSaving = false;
      self.activeSaveDeferred = null;
      self.activeSaveMemo = null;
      self.nextSaveDeferred = null;
      self.nextSaveMemo = null;
      if (activeSaveDeferred) {
        activeSaveDeferred.reject(error);
      }
      if (nextSaveDeferred) {
        nextSaveDeferred.reject(error);
      }
      return breeze.Q.reject(error);
    }
    breeze.QueuedSaveFailedError = QueuedSaveFailedError;
    function QueuedSaveFailedError(errObject, saveQueuing) {
      this.innerError = errObject;
      this.message = "Queued save failed: " + errObject.message;
      this.failedSaveMemo = saveQueuing.activeSaveMemo;
      this.nextSaveMemo = saveQueuing.nextSaveMemo;
    }
    QueuedSaveFailedError.prototype = new Error();
    QueuedSaveFailedError.prototype.name = "QueuedSaveFailedError";
    QueuedSaveFailedError.prototype.constructor = QueuedSaveFailedError;
    function SaveMemo() {
      this.entityMemos = {};
      this.queuedChanges = [];
    }
    SaveMemo.prototype.applyToSavedEntities = applyToSavedEntities;
    SaveMemo.prototype.pkFixup = pkFixup;
    SaveMemo.prototype.updateEntityMemos = updateEntityMemos;
    function applyToSavedEntities(entityManager, savedEntities) {
      var entityMemos = this.entityMemos;
      var queuedChanges = this.queuedChanges;
      var restorePublishing = disableManagerPublishing(entityManager);
      try {
        savedEntities.forEach(function(saved) {
          var key = makeEntityMemoKey(saved);
          var entityMemo = entityMemos[key];
          var resave = entityMemo && entityMemo.applyToSavedEntity(saved);
          if (resave) {
            queuedChanges.push(saved);
          }
        });
      } finally {
        restorePublishing();
        var hasChanges = queuedChanges.length > 0;
        if (hasChanges) {
          entityManager._setHasChanges(true);
        }
      }
    }
    function disableManagerPublishing(manager) {
      var Event = breeze.core.Event;
      Event.enable('entityChanged', manager, false);
      Event.enable('hasChangesChanged', manager, false);
      return function restorePublishing() {
        Event.enable('entityChanged', manager, false);
        Event.enable('hasChangesChanged', manager, false);
      };
    }
    function pkFixup(keyMappings) {
      var entityMemos = this.entityMemos;
      keyMappings.forEach(function(km) {
        var type = km.entityTypeName;
        var tempKey = type + '|' + km.tempValue;
        if (entityMemos[tempKey]) {
          entityMemos[type + '|' + km.realValue] = entityMemos[tempKey];
          delete entityMemos[tempKey];
        }
        for (var memoKey in entityMemos) {
          entityMemos[memoKey].fkFixup(km);
        }
      });
    }
    function makeEntityMemoKey(entity) {
      var entityKey = entity.entityAspect.getKey();
      return entityKey.entityType.name + '|' + entityKey.values;
    }
    function updateEntityMemos(changes) {
      var entityMemos = this.entityMemos;
      changes.forEach(function(change) {
        if (!change.entityAspect.isBeingSaved) {
          return ;
        }
        var key = makeEntityMemoKey(change);
        var entityMemo = entityMemos[key] || (entityMemos[key] = new EntityMemo(change));
        entityMemo.update(change);
      });
    }
    function EntityMemo(entity) {
      this.entity = entity;
      this.pendingChanges = {};
    }
    EntityMemo.prototype.applyToSavedEntity = applyToSavedEntity;
    EntityMemo.prototype.fkFixup = fkFixup;
    EntityMemo.prototype.update = update;
    function applyToSavedEntity(saved) {
      var entityMemo = this;
      var aspect = saved.entityAspect;
      if (aspect.entityState.isDetached()) {
        return false;
      } else if (entityMemo.isDeleted) {
        aspect.setDeleted();
        return true;
      }
      var props = Object.keys(entityMemo.pendingChanges);
      if (props.length === 0) {
        return false;
      }
      var originalValues = aspect.originalValues;
      props.forEach(function(name) {
        originalValues[name] = saved.getProperty(name);
        saved.setProperty(name, entityMemo.pendingChanges[name]);
      });
      aspect.setModified();
      return true;
    }
    function fkFixup(keyMapping) {
      var entityMemo = this;
      var type = entityMemo.entity.entityType;
      var fkProps = type.foreignKeyProperties;
      fkProps.forEach(function(fkProp) {
        if (fkProp.parentType.name === keyMapping.entityTypeName && entityMemo.pendingChanges[fkProp.name] === keyMapping.tempValue) {
          entityMemo.pendingChanges[fkProp.name] = keyMapping.realValue;
        }
      });
    }
    function update() {
      var entityMemo = this;
      var props;
      var entity = entityMemo.entity;
      var aspect = entity.entityAspect;
      var stateName = aspect.entityState.name;
      switch (stateName) {
        case 'Added':
          var originalValues = aspect.originalValues;
          props = entity.entityType.dataProperties;
          props.forEach(function(dp) {
            if (dp.isPartOfKey) {
              return ;
            }
            var name = dp.name;
            var value = entity.getProperty(name);
            if (originalValues[name] !== value) {
              entityMemo.pendingChanges[name] = value;
            }
          });
          break;
        case 'Deleted':
          entityMemo.isDeleted = true;
          entityMemo.pendingChanges = {};
          break;
        case 'Modified':
          props = Object.keys(aspect.originalValues);
          props.forEach(function(name) {
            entityMemo.pendingChanges[name] = entity.getProperty(name);
          });
          break;
      }
    }
  }));
})(require("process"));
