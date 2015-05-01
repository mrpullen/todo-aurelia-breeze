System.config({
  "transpiler": "traceur",
  "paths": {
    "*": "dist/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "todo-aurelia-breeze/*": "dist/*.js"
  }
});

System.config({
  "map": {
    "CodeSeven/toastr": "github:CodeSeven/toastr@2.1.1",
    "aurelia-bootstrapper": "github:aurelia/bootstrapper@0.12.0",
    "aurelia-breeze": "github:jdanyow/aurelia-breeze@0.5.0",
    "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
    "aurelia-framework": "github:aurelia/framework@0.11.0",
    "aurelia-http-client": "github:aurelia/http-client@0.8.0",
    "aurelia-router": "github:aurelia/router@0.8.0",
    "breeze": "npm:breeze-client@1.5.4",
    "breeze-client-labs": "npm:breeze-client-labs@1.5.3",
    "jquery": "github:components/jquery@2.1.3",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "github:aurelia/binding@0.6.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.4.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/bootstrapper@0.12.0": {
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.4.0",
      "aurelia-framework": "github:aurelia/framework@0.11.0",
      "aurelia-history": "github:aurelia/history@0.4.0",
      "aurelia-history-browser": "github:aurelia/history-browser@0.4.0",
      "aurelia-loader-default": "github:aurelia/loader-default@0.7.0",
      "aurelia-logging-console": "github:aurelia/logging-console@0.4.0",
      "aurelia-router": "github:aurelia/router@0.8.0",
      "aurelia-templating": "github:aurelia/templating@0.11.0",
      "aurelia-templating-binding": "github:aurelia/templating-binding@0.11.0",
      "aurelia-templating-resources": "github:aurelia/templating-resources@0.11.0",
      "aurelia-templating-router": "github:aurelia/templating-router@0.12.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/dependency-injection@0.7.0": {
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/framework@0.11.0": {
      "aurelia-binding": "github:aurelia/binding@0.6.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
      "aurelia-loader": "github:aurelia/loader@0.6.0",
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "aurelia-path": "github:aurelia/path@0.6.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.4.0",
      "aurelia-templating": "github:aurelia/templating@0.11.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/history-browser@0.4.0": {
      "aurelia-history": "github:aurelia/history@0.4.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/http-client@0.8.0": {
      "aurelia-path": "github:aurelia/path@0.6.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/loader-default@0.7.0": {
      "aurelia-loader": "github:aurelia/loader@0.6.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0"
    },
    "github:aurelia/loader@0.6.0": {
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-path": "github:aurelia/path@0.6.0",
      "core-js": "npm:core-js@0.9.6",
      "webcomponentsjs": "github:webcomponents/webcomponentsjs@0.6.1"
    },
    "github:aurelia/metadata@0.5.0": {
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/route-recognizer@0.4.0": {
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/router@0.8.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
      "aurelia-event-aggregator": "github:aurelia/event-aggregator@0.4.0",
      "aurelia-history": "github:aurelia/history@0.4.0",
      "aurelia-path": "github:aurelia/path@0.6.0",
      "aurelia-route-recognizer": "github:aurelia/route-recognizer@0.4.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/templating-binding@0.11.0": {
      "aurelia-binding": "github:aurelia/binding@0.6.0",
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-templating": "github:aurelia/templating@0.11.0"
    },
    "github:aurelia/templating-resources@0.11.0": {
      "aurelia-binding": "github:aurelia/binding@0.6.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-templating": "github:aurelia/templating@0.11.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:aurelia/templating-router@0.12.0": {
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "aurelia-path": "github:aurelia/path@0.6.0",
      "aurelia-router": "github:aurelia/router@0.8.0",
      "aurelia-templating": "github:aurelia/templating@0.11.0"
    },
    "github:aurelia/templating@0.11.0": {
      "aurelia-binding": "github:aurelia/binding@0.6.0",
      "aurelia-dependency-injection": "github:aurelia/dependency-injection@0.7.0",
      "aurelia-html-template-element": "github:aurelia/html-template-element@0.2.0",
      "aurelia-loader": "github:aurelia/loader@0.6.0",
      "aurelia-logging": "github:aurelia/logging@0.4.0",
      "aurelia-metadata": "github:aurelia/metadata@0.5.0",
      "aurelia-path": "github:aurelia/path@0.6.0",
      "aurelia-task-queue": "github:aurelia/task-queue@0.4.0",
      "core-js": "npm:core-js@0.9.6"
    },
    "github:jdanyow/aurelia-breeze@0.5.0": {
      "aurelia-binding": "github:aurelia/binding@0.6.0",
      "aurelia-http-client": "github:aurelia/http-client@0.8.0",
      "breeze": "npm:breeze-client@1.5.4"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:breeze-client-labs@1.5.3": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.6": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

