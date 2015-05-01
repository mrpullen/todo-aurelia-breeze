System.register(['aurelia-framework', './logger'], function (_export) {
  var LogManager, ToastrAppender;

  _export('configure', configure);

  function configure(aurelia) {
    aurelia.use.standardConfiguration().developmentLogging().plugin('aurelia-breeze');

    aurelia.start().then(function (a) {
      return a.setRoot();
    });
  }

  return {
    setters: [function (_aureliaFramework) {
      LogManager = _aureliaFramework.LogManager;
    }, function (_logger) {
      ToastrAppender = _logger.ToastrAppender;
    }],
    execute: function () {
      'use strict';

      LogManager.addAppender(new ToastrAppender());
      LogManager.setLevel(LogManager.logLevel.debug);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3VCQU1nQixTQUFTOztBQUFsQixXQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUU7QUFDakMsV0FBTyxDQUFDLEdBQUcsQ0FDUixxQkFBcUIsRUFBRSxDQUN2QixrQkFBa0IsRUFBRSxDQUNwQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFNUIsV0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO0tBQUEsQ0FBQyxDQUFDO0dBQ3hDOzs7O3FDQWJPLFVBQVU7OytCQUNWLGNBQWM7Ozs7O0FBRXRCLGdCQUFVLENBQUMsV0FBVyxDQUFDLElBQUksY0FBYyxFQUFFLENBQUMsQ0FBQztBQUM3QyxnQkFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==