import {LogManager} from 'aurelia-framework';
import {ToastrAppender} from './logger';

LogManager.addAppender(new ToastrAppender());
LogManager.setLevel(LogManager.levels.debug);

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-breeze');

  aurelia.start().then(a => a.setRoot());
}
