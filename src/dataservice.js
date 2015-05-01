/*
*  This file is an ES7/Aurelia port of https://github.com/Breeze/breeze.js.samples/blob/master/net/Todo-Knockout/Todo-Knockout/app/dataservice.js
*/
import breeze from 'breeze';
import saveQueuing from 'breeze-client-labs/breeze.savequeuing';
import {HttpClient} from 'aurelia-http-client';
import {LogManager} from 'aurelia-framework';

var logger = LogManager.getLogger('DataService');

export class DataService {
  constructor() {
    var serviceName = 'http://sampleservice.breezejs.com/api/todos/';

    this.httpClient = new HttpClient();
    this.httpClient.configure(builder => builder.withBaseUrl(serviceName));

    this.manager = new breeze.EntityManager(serviceName);
    this.manager.enableSaveQueuing(true);

    this.addTodoProperties();
  }

  addPropertyChangeHandler(handler) {
    // call handler when an entity property of any entity changes
    return this.manager.entityChanged.subscribe(changeArgs => {
      var action = changeArgs.entityAction;
      if (action === breeze.EntityAction.PropertyChange) {
        handler(changeArgs);
      }
    });
  }

  addTodoProperties() {
    // untracked 'isEditing' property to the 'TodoItem' type
    // see http://www.breezejs.com/sites/all/apidocs/classes/MetadataStore.html#method_registerEntityTypeCtor
    var metadataStore = this.manager.metadataStore;
    metadataStore.registerEntityTypeCtor('TodoItem', null, todoInit);

    function todoInit(todo) {
      todo.isEditing = false;
    }
  }

  createTodo(initialValues) {
    return this.manager.createEntity('TodoItem', initialValues);
  }

  deleteTodoAndSave(todoItem) {
    if (todoItem) {
      var aspect = todoItem.entityAspect;
      if (aspect.isBeingSaved && aspect.entityState.isAdded()) {
        // wait to delete added entity while it is being saved
        setTimeout(() => this.deleteTodoAndSave (todoItem), 100);
        return;
      }
      aspect.setDeleted();
      this.saveChanges();
    }
  }

  getTodos(includeArchived) {
    var query = breeze.EntityQuery
        .from("Todos")
        .orderBy("CreatedAt");

    if (!includeArchived) { // exclude archived Todos
      // add filter clause limiting results to non-archived Todos
      query = query.where("IsArchived", "==", false);
    }

    return this.manager.executeQuery(query);
  }

  handleSaveValidationError(error) {
    var message = "Not saved due to validation error";
    try { // fish out the first error
      var firstErr = error.entityErrors[0];
      message += ": " + firstErr.errorMessage;
    } catch (e) { /* eat it for now */ }
    return message;
  }

  hasChanges() {
    return this.manager.hasChanges();
  }

  saveChanges() {
    return this.manager.saveChanges()
      .then(saveSucceeded, saveFailed);

    function saveSucceeded(saveResult) {
      logger.debug("# of Todos saved = " + saveResult.entities.length);
    }

    function saveFailed(error) {
      var reason = error.message,
          detail = error.detail;

      if (error.entityErrors) {
        reason = this.handleSaveValidationError(error);
      } else if (detail && detail.ExceptionType &&
        detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
        // Concurrency error
        reason =
          "Another user, perhaps the server, " +
          "may have deleted one or all of the todos." +
          " You may have to restart the app.";
      } else {
        reason = `Failed to save changes: ${reason} You may have to restart the app.`;
      }

      logger.error(error, reason);
      // DEMO ONLY: discard all pending changes
      // Let them see the error for a second before rejecting changes
      setTimeout(() => this.manager.rejectChanges(), 1000);
      throw error; // so caller can see it
    }
  }

  purge(callback) {
    return this.httpClient.post('purge')
      .then(
        () => {
          logger.debug("database purged.");
          this.manager.clear();
          if (callback) callback();
        },
        error => logger.error(`database purge failed: ${error}`));
  }

  reset(callback) {
    return this.httpClient.post('reset')
      .then(
        () => {
          logger.debug("database reset.");
          this.manager.clear();
          if (callback) callback();
        },
        error => logger.error(`database reset failed: ${error}`));
  }
}
