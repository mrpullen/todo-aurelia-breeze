System.register(["aurelia-framework", "./logger"], function (_export) {
  var LogManager, ToastrAppender;

  _export("configure", configure);

  function configure(aurelia) {
    aurelia.use.standardConfiguration().developmentLogging().plugin("aurelia-breeze");

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
      "use strict";

      LogManager.addAppender(new ToastrAppender());
      LogManager.setLevel(LogManager.levels.debug);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtNQUFRLFVBQVUsRUFDVixjQUFjOzt1QkFLTixTQUFTOztBQUFsQixXQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUU7QUFDakMsV0FBTyxDQUFDLEdBQUcsQ0FDUixxQkFBcUIsRUFBRSxDQUN2QixrQkFBa0IsRUFBRSxDQUNwQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFNUIsV0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO0tBQUEsQ0FBQyxDQUFDO0dBQ3hDOzs7O0FBYk8sZ0JBQVUscUJBQVYsVUFBVTs7QUFDVixvQkFBYyxXQUFkLGNBQWM7Ozs7O0FBRXRCLGdCQUFVLENBQUMsV0FBVyxDQUFDLElBQUksY0FBYyxFQUFFLENBQUMsQ0FBQztBQUM3QyxnQkFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==