System.register(['CodeSeven/toastr'], function (_export) {
  var toastr, _classCallCheck, _createClass, ToastrAppender;

  return {
    setters: [function (_CodeSevenToastr) {
      toastr = _CodeSevenToastr['default'];
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzZDQVFhLGNBQWM7Ozs7Ozs7Ozs7Ozs7QUFIM0IsWUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFlBQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLG9CQUFvQixDQUFDOztBQUV2QyxvQkFBYztBQUNkLGlCQURBLGNBQWMsR0FDWjtnQ0FERixjQUFjO1NBQ1Y7O3FCQURKLGNBQWM7O2lCQUdwQixlQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVU7QUFDN0Isa0JBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNsQzs7O2lCQUVHLGNBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVTtBQUM1QixrQkFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1dBQy9COzs7aUJBRUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFVO0FBQzVCLGtCQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDbEM7OztpQkFFSSxlQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVU7QUFDN0Isa0JBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztXQUNoQzs7O2VBakJVLGNBQWM7OztnQ0FBZCxjQUFjIiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9