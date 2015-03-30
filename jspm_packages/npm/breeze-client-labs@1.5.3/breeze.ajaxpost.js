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
    breeze.ajaxpost = function(ajaxAdapter) {
      wrapAjaxImpl(ajaxAdapter);
    };
    breeze.ajaxpost();
    function wrapAjaxImpl(ajaxAdapter) {
      if (!ajaxAdapter) {
        ajaxAdapter = breeze.config.getAdapterInstance("ajax");
      }
      if (ajaxAdapter.ajaxPostEnabled) {
        return ;
      }
      var ajaxFunction = ajaxAdapter.ajax;
      if (ajaxFunction) {
        ajaxAdapter.ajax = function(settings) {
          processSettings(settings);
          return ajaxFunction.call(ajaxAdapter, settings);
        };
        ajaxAdapter.ajaxPostEnabled = true;
      }
    }
    function processSettings(settings) {
      var parameters = settings && settings.params;
      if (!parameters)
        return settings;
      settings.type = parameters.$method || settings.type;
      var data = parameters.$data;
      if (data) {
        if (parameters.$encoding === 'JSON') {
          settings.processData = false;
          settings.contentType = "application/json; charset=UTF-8";
          if (typeof(data) === 'object') {
            settings.data = JSON.stringify(data);
          } else {
            settings.data = data;
          }
        } else {
          settings.data = data;
        }
        settings.params = null;
      }
      return settings;
    }
  }));
})(require("process"));
