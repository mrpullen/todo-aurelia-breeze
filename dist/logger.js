System.register(['CodeSeven/toastr'], function (_export) {
  var toastr, ToastrAppender;

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  return {
    setters: [function (_CodeSevenToastr) {
      toastr = _CodeSevenToastr['default'];
    }],
    execute: function () {
      'use strict';

      toastr.options.timeOut = 2000;
      toastr.options.positionClass = 'toast-bottom-right';

      ToastrAppender = (function () {
        function ToastrAppender() {
          _classCallCheck(this, ToastrAppender);
        }

        _createClass(ToastrAppender, [{
          key: 'debug',
          value: function debug(logger, message) {
            toastr.success(message, arguments[2]);
          }
        }, {
          key: 'info',
          value: function info(logger, message) {
            toastr.info(message, arguments[2]);
          }
        }, {
          key: 'warn',
          value: function warn(logger, message) {
            toastr.warning(message, arguments[2]);
          }
        }, {
          key: 'error',
          value: function error(logger, message) {
            toastr.error(message, arguments[2]);
          }
        }]);

        return ToastrAppender;
      })();

      _export('ToastrAppender', ToastrAppender);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO2NBUWEsY0FBYzs7Ozs7Ozs7Ozs7OztBQUgzQixZQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDOUIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsb0JBQW9CLENBQUM7O0FBRXZDLG9CQUFjO0FBQ2QsaUJBREEsY0FBYyxHQUNaO2dDQURGLGNBQWM7U0FDVjs7cUJBREosY0FBYzs7aUJBR3BCLGVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVTtBQUM3QixrQkFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ2xDOzs7aUJBRUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFVO0FBQzVCLGtCQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDL0I7OztpQkFFRyxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVU7QUFDNUIsa0JBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNsQzs7O2lCQUVJLGVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVTtBQUM3QixrQkFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQ2hDOzs7ZUFqQlUsY0FBYzs7O2dDQUFkLGNBQWMiLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6Ii9zcmMvIn0=