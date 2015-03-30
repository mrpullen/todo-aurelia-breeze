import toastr from 'CodeSeven/toastr';

toastr.options.timeOut = 2000; // 2 second toast timeout
toastr.options.positionClass = 'toast-bottom-right';

export class ToastrAppender {
  constructor(){}

  debug(logger, message, ...rest){
    toastr.success(message, rest[0]);
  }

  info(logger, message, ...rest){
    toastr.info(message, rest[0]);
  }

  warn(logger, message, ...rest){
    toastr.warning(message, rest[0]);
  }

  error(logger, message, ...rest){
    toastr.error(message, rest[0]);
  }
}
//
// ﻿app.logger = (function () {
//
//     // This logger wraps the toastr logger and also logs to console
//     // toastr.js is library by John Papa that shows messages in pop up toast.
//     // https://github.com/CodeSeven/toastr
//
//     toastr.options.timeOut = 2000; // 2 second toast timeout
//     toastr.options.positionClass = 'toast-bottom-right';
//
//     var logger = {
//         error: error,
//         info: info,
//         success: success,
//         warning: warning,
//         log: log // straight to console; bypass toast
//     };
//
//     function error(message, title) {
//         toastr.error(message, title);
//         log("Error: " + message);
//     };
//     function info(message, title) {
//         toastr.info(message, title);
//         log("Info: " + message);
//     };
//     function success(message, title) {
//         toastr.success(message, title);
//         log("Success: " + message);
//     };
//     function warning(message, title) {
//         toastr.warning(message, title);
//         log("Warning: " + message);
//     };
//
//     // IE and google chrome workaround
//     // http://code.google.com/p/chromium/issues/detail?id=48662
//     function log() {
//         var console = window.console;
//         !!console && console.log && console.log.apply && console.log.apply(console, arguments);
//     }
//
//     return logger;
// })();
