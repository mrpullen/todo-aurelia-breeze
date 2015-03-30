System.register(["CodeSeven/toastr"], function (_export) {
  var toastr, _createClass, _classCallCheck, ToastrAppender;

  return {
    setters: [function (_CodeSevenToastr) {
      toastr = _CodeSevenToastr["default"];
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      toastr.options.timeOut = 2000; // 2 second toast timeout
      toastr.options.positionClass = "toast-bottom-right";

      ToastrAppender = _export("ToastrAppender", (function () {
        function ToastrAppender() {
          _classCallCheck(this, ToastrAppender);
        }

        _createClass(ToastrAppender, {
          debug: {
            value: function debug(logger, message) {
              toastr.success(message, arguments[2]);
            }
          },
          info: {
            value: function info(logger, message) {
              toastr.info(message, arguments[2]);
            }
          },
          warn: {
            value: function warn(logger, message) {
              toastr.warning(message, arguments[2]);
            }
          },
          error: {
            value: function error(logger, message) {
              toastr.error(message, arguments[2]);
            }
          }
        });

        return ToastrAppender;
      })());
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO01BQU8sTUFBTSxpQ0FLQSxjQUFjOzs7O0FBTHBCLFlBQU07Ozs7Ozs7OztBQUViLFlBQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUM5QixZQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQzs7QUFFdkMsb0JBQWM7QUFDZCxpQkFEQSxjQUFjLEdBQ1o7Z0NBREYsY0FBYztTQUNWOztxQkFESixjQUFjO0FBR3pCLGVBQUs7bUJBQUEsZUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFVO0FBQzdCLG9CQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEM7O0FBRUQsY0FBSTttQkFBQSxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVU7QUFDNUIsb0JBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvQjs7QUFFRCxjQUFJO21CQUFBLGNBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVTtBQUM1QixvQkFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xDOztBQUVELGVBQUs7bUJBQUEsZUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFVO0FBQzdCLG9CQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEM7Ozs7ZUFqQlUsY0FBYyIsImZpbGUiOiJsb2dnZXIuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==