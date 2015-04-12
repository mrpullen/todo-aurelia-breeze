/*
*  This file is an ES7/Aurelia port of https://github.com/Breeze/breeze.js.samples/blob/master/net/Todo-Knockout/Todo-Knockout/app/viewModel.js
*/
import {DataService} from './dataservice';
import {inject, LogManager, ObserverLocator} from 'aurelia-framework';

var logger = LogManager.getLogger('DataService');

@inject(DataService, ObserverLocator)
export class App {
  constructor(dataservice, observerLocator) {
    this.dataservice = dataservice;
    this.suspendSave = false;
    this.newTodoDescription = '';
    this.items = [];

    this.includeArchived = false;
    observerLocator.getObserver(this, 'includeArchived')
      .subscribe(() => this.getTodos());

    this.getTodos();
    this.dataservice.addPropertyChangeHandler(this.propertyChanged.bind(this));
  }

  get markAllCompleted() {
    return this.items.filter(x => !x.IsDone && !x.IsArchived).length === 0;
  }
  set markAllCompleted(newValue) {
    this.items.filter(x => !x.IsArchived).forEach(x => x.IsDone = newValue);
    this.save();
  }

  get archiveCompletedMessage() {
    var count = this.getStateOfItems().itemsDoneCount;
    if (count > 0) {
      return "Archive " + count + " completed item" + (count > 1 ? "s" : "");
    }
    return null;
  }

  get itemsLeftMessage() {
    var count = this.getStateOfItems().itemsLeftCount;
    if (count > 0) {
      return count + " item" + (count > 1 ? "s" : "") + " left";
    }
    return null;
  }

  archiveCompletedItems() {
    var state = this.getStateOfItems();
    this.suspendSave = true;
    state.itemsDone.forEach(item => {
      if (!this.includeArchived) {
        this.items.splice(this.items.indexOf(item), 1);
      }
      item.IsArchived = true;
    });
    this.suspendSave = false;
    this.save();
  }

  getTodos() {
    this.dataservice.getTodos(this.includeArchived)
      .then(
        data => {
          this.items = data.results;
          logger.info('Fetched Todos ' + (this.includeArchived ? 'including archived' : 'excluding archived'));
        },
        error => logger.error(error.message, "Query failed"));
  }

  addItem() {
    var description = this.newTodoDescription;
    if (!description) { return; }

    var item = this.dataservice.createTodo({
      Description: description,
      CreatedAt: new Date(),
      IsDone: false
    });

    this.save(true).catch(
      () => {
        var index = this.items.indexOf(item);
        if (index > -1) {
          setTimeout(() => this.items.splice(index, 1), 2000);
        }
      });
    this.items.push(item);
    this.newTodoDescription = '';
  }

  editBegin(item) {
    item.isEditing = true;
  }

  editEnd(item) {
    item.isEditing = false;
  }

  deleteItem(item) {
    this.items.splice(this.items.indexOf(item), 1);
    this.dataservice.deleteTodoAndSave(item);
  };

  getStateOfItems() {
    var itemsDone = [], itemsLeft = [];

    this.items.forEach(item => {
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

  propertyChanged(changeArgs) {
    // propertyChanged triggers save attempt UNLESS the property is the 'Id'
    // because THEN the change is actually the post-save Id-fixup
    // rather than user data entry so there is actually nothing to save.
    if (changeArgs.args.propertyName !== 'Id') {
      this.save();
    }
  }

  purge() {
    return this.dataservice.purge(() => this.getTodos());
  }

  reset() {
    return this.dataservice.reset(() => this.getTodos());
  }

  save(force) {
    // Save if have changes to save AND
    // if must save OR save not suspended
    if (this.dataservice.hasChanges() && (force || !this.suspendSave)) {
      return this.dataservice.saveChanges();
    }
    // Decided not to save; return resolved promise w/ no result
    return new Promise((resolve, reject) => resolve(false));
  }
}
