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
