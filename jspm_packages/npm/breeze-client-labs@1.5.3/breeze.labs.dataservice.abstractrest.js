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
    "use strict";
    var ctor = function() {};
    breeze.AbstractRestDataServiceAdapter = ctor;
    var abstractDsaProto = breeze.AbstractDataServiceAdapter.prototype;
    ctor.prototype = {
      executeQuery: executeQuery,
      fetchMetadata: fetchMetadata,
      initialize: initialize,
      saveChanges: saveChanges,
      ChangeRequestInterceptor: abstractDsaProto.changeRequestInterceptor,
      checkForRecomposition: checkForRecomposition,
      saveOnlyOne: false,
      ignoreDeleteNotFound: true,
      _addToSaveContext: _addToSaveContext,
      _addKeyMapping: _addKeyMapping,
      _ajaxImpl: undefined,
      _catchNoConnectionError: abstractDsaProto._catchNoConnectionError,
      _changeRequestSucceeded: _changeRequestSucceeded,
      _createErrorFromResponse: _createErrorFromResponse,
      _createChangeRequest: _createChangeRequest,
      _createJsonResultsAdapter: _createJsonResultsAdapter,
      _clientTypeNameToServer: _clientTypeNameToServer,
      _getEntityTypeFromMappingContext: _getEntityTypeFromMappingContext,
      _getNodeEntityType: _getNodeEntityType,
      _getResponseData: _getResponseData,
      _processSavedEntity: _processSavedEntity,
      _serializeToJson: _serializeToJson,
      _serverTypeNameToClient: _serverTypeNameToClient,
      _transformSaveValue: _transformSaveValue
    };
    function initialize() {
      var adapter = this;
      var ajaxImpl = adapter._ajaxImpl = breeze.config.getAdapterInstance("ajax");
      if (!ajaxImpl) {
        throw new Error("Unable to initialize ajax for " + adapter.name);
      }
      var ajax = ajaxImpl.ajax;
      if (!ajax) {
        throw new Error("Breeze was unable to find an 'ajax' adapter for " + adapter.name);
      }
      adapter.Q = breeze.Q;
      if (!adapter.jsonResultsAdapter) {
        adapter.jsonResultsAdapter = adapter._createJsonResultsAdapter();
      }
    }
    function checkForRecomposition(interfaceInitializedArgs) {
      if (interfaceInitializedArgs.interfaceName === "ajax" && interfaceInitializedArgs.isDefault) {
        this.initialize();
      }
    }
    function executeQuery(mappingContext) {
      var adapter = this;
      var deferred = adapter.Q.defer();
      var url = mappingContext.getUrl();
      var headers = {'Accept': 'application/json'};
      adapter._ajaxImpl.ajax({
        type: "GET",
        url: url,
        headers: headers,
        params: mappingContext.query.parameters,
        success: querySuccess,
        error: function(response) {
          deferred.reject(adapter._createErrorFromResponse(response, url, mappingContext));
        }
      });
      return deferred.promise;
      function querySuccess(response) {
        try {
          var rData = {
            results: adapter._getResponseData(response).results,
            httpResponse: response
          };
          deferred.resolve(rData);
        } catch (e) {
          deferred.reject(new Error("Program error: failed while parsing successful query response"));
        }
      }
    }
    function fetchMetadata() {
      throw new Error("Cannot process server metadata; create your own and use that instead");
    }
    function saveChanges(saveContext, saveBundle) {
      var adapter = saveContext.adapter = this;
      var Q = adapter.Q;
      try {
        if (adapter.saveOnlyOne && saveBundle.entities.length > 1) {
          return Q.reject(new Error("Only one entity may be saved at a time."));
        }
        adapter._addToSaveContext(saveContext);
        var requests = createChangeRequests(saveContext, saveBundle);
        var promises = sendChangeRequests(saveContext, requests);
        var comboPromise = Q.all(promises);
        return comboPromise.then(reviewSaveResult).then(null, saveFailed);
      } catch (err) {
        return Q.reject(err);
      }
      function reviewSaveResult() {
        var saveResult = saveContext.saveResult;
        var entitiesWithErrors = saveResult.entitiesWithErrors;
        var errorCount = entitiesWithErrors.length;
        if (!errorCount) {
          return saveResult;
        }
        saveContext.processSavedEntities(saveResult);
        var error;
        if (requests.length === 1 || requests.length === errorCount) {
          error = entitiesWithErrors[0].error;
        } else {
          error = new Error("\n The save failed although some entities were saved.");
        }
        error.message = (error.message || "Save failed") + "  \n See 'error.saveResult' for more details.\n";
        error.saveResult = saveResult;
        return Q.reject(error);
      }
      function saveFailed(error) {
        return Q.reject(error);
      }
    }
    function _addToSaveContext() {}
    function _addKeyMapping(saveContext, index, saved) {
      var tempKey = saveContext.tempKeys[index];
      if (tempKey) {
        var entityType = tempKey.entityType;
        var tempValue = tempKey.values[0];
        var realKey = getRealKey(entityType, saved);
        var keyMapping = {
          entityTypeName: entityType.name,
          tempValue: tempValue,
          realValue: realKey.values[0]
        };
        saveContext.saveResult.keyMappings.push(keyMapping);
      }
    }
    function _clientTypeNameToServer(typeName) {
      var jrAdapter = this.jsonResultsAdapter;
      return jrAdapter.clientTypeNameToServer ? jrAdapter.clientTypeNameToServer(typeName) : typeName;
    }
    function _createChangeRequest() {
      throw new Error("Need a concrete implementation of _createChangeRequest");
    }
    function _createErrorFromResponse(response, url, context, errorEntity) {
      var err = new Error();
      err.response = response;
      if (url) {
        err.url = url;
      }
      err.status = response.status || '???';
      err.statusText = response.statusText;
      err.message = response.message || response.error || response.statusText;
      fn_.catchNoConnectionError(err);
      return err;
    }
    function _createJsonResultsAdapter() {
      return new breeze.JsonResultsAdapter({
        name: "noop",
        visitNode: function() {
          return {};
        }
      });
    }
    function _getEntityTypeFromMappingContext(mappingContext) {
      var query = mappingContext.query;
      if (!query) {
        return null;
      }
      var entityType = query.entityType || query.resultEntityType;
      if (!entityType) {
        var metadataStore = mappingContext.metadataStore;
        var etName = metadataStore.getEntityTypeNameForResourceName(query.resourceName);
        if (etName) {
          entityType = metadataStore.getEntityType(etName);
        }
      }
      return entityType;
    }
    function _getNodeEntityType(mappingContext, typeName) {
      if (!typeName) {
        return undefined;
      }
      var jsonResultsAdapter = mappingContext.jsonResultsAdapter;
      var typeMap = jsonResultsAdapter.typeMap;
      if (!typeMap) {
        typeMap = {"": {_mappedPropertiesCount: NaN}};
        jsonResultsAdapter.typeMap = typeMap;
      }
      var entityType = typeMap[typeName];
      if (!entityType) {
        entityType = mappingContext.metadataStore.getEntityType(typeName, true);
        typeMap[typeName] = entityType || typeMap[""];
      }
      return entityType;
    }
    function _getResponseData(response) {
      return response.data;
    }
    function _processSavedEntity() {}
    function _serializeToJson(rawEntityData) {
      return JSON.stringify(rawEntityData);
    }
    function _serverTypeNameToClient(mappingContext, typeName) {
      var jrAdapter = mappingContext.jsonResultsAdapter;
      return jrAdapter.serverTypeNameToClient ? jrAdapter.serverTypeNameToClient(typeName) : typeName;
    }
    function _transformSaveValue(prop, val) {
      if (prop.isUnmapped) {
        return undefined;
      }
      if (prop.dataType === breeze.DataType.DateTimeOffset) {
        val = val && new Date(val.getTime() - (val.getTimezoneOffset() * 60000));
      } else if (prop.dataType.quoteJsonOData) {
        val = val != null ? val.toString() : val;
      }
      return val;
    }
    function createChangeRequests(saveContext, saveBundle) {
      var adapter = saveContext.adapter;
      var originalEntities = saveContext.originalEntities = saveBundle.entities;
      saveContext.tempKeys = [];
      var changeRequestInterceptor = abstractDsaProto._createChangeRequestInterceptor(saveContext, saveBundle);
      var requests = originalEntities.map(function(entity, index) {
        var request = adapter._createChangeRequest(saveContext, entity, index);
        return changeRequestInterceptor.getRequest(request, entity, index);
      });
      changeRequestInterceptor.done(requests);
      return requests;
    }
    function getRealKey(entityType, rawEntity) {
      return entityType.getEntityKeyFromRawEntity(rawEntity, breeze.DataProperty.getRawValueFromServer);
    }
    function sendChangeRequests(saveContext, requests) {
      var saveResult = {
        entities: [],
        entitiesWithErrors: [],
        keyMappings: []
      };
      saveContext.saveResult = saveResult;
      return requests.map(function(request, index) {
        return sendChangeRequest(saveContext, request, index);
      });
    }
    function sendChangeRequest(saveContext, request, index) {
      var adapter = saveContext.adapter;
      var deferred = adapter.Q.defer();
      var url = request.requestUri;
      adapter._ajaxImpl.ajax({
        url: url,
        type: request.method,
        headers: request.headers,
        data: request.data,
        success: tryRequestSucceeded,
        error: tryRequestFailed
      });
      return deferred.promise;
      function tryRequestSucceeded(response) {
        try {
          var status = +response.status;
          if ((!status) || status >= 400) {
            tryRequestFailed(response);
          } else {
            var savedEntity = adapter._changeRequestSucceeded(saveContext, response, index);
            adapter._processSavedEntity(savedEntity, response, saveContext, index);
            deferred.resolve(true);
          }
        } catch (e) {
          deferred.reject("Program error: failed while processing successful save response");
        }
      }
      function tryRequestFailed(response) {
        try {
          var status = +response.status;
          if (status && status === 404 && adapter.ignoreDeleteNotFound && saveContext.originalEntities[index].entityAspect.entityState.isDeleted()) {
            response.status = 204;
            response.statusText = 'resource was already deleted; no content';
            response.data = undefined;
            tryRequestSucceeded(response);
          } else {
            var errorEntity = saveContext.originalEntities[index];
            saveContext.saveResult.entitiesWithErrors.push({
              entity: errorEntity,
              error: adapter._createErrorFromResponse(response, url, saveContext, errorEntity)
            });
            deferred.resolve(false);
          }
        } catch (e) {
          deferred.reject("Program error: failed while processing save error");
        }
      }
    }
    function _changeRequestSucceeded(saveContext, response, index) {
      var saved = saveContext.adapter._getResponseData(response);
      if (saved && typeof saved === 'object') {
        saved.$entityType = saveContext.originalEntities[index].entityType;
        saveContext.adapter._addKeyMapping(saveContext, index, saved);
      } else {
        saved = saveContext.originalEntities[index];
      }
      saveContext.saveResult.entities.push(saved);
      return saved;
    }
  }));
})(require("process"));
