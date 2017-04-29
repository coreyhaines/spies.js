var Spies;
if(Spies) {
  throw "The Spies namespace has already been defined by a previously loaded library";
}
Spies = {};

Spies.stub = function(...args) {
  var spy;

  spy = Spies.spyOn.apply(null, args);
  spy.removeStub = spy.stopSpying;

  return spy;
};

Spies.spyOn = function(...args) {
  var obj;
  var functionName;
  var returnValue;
  var wasCalled;
  var capturedArgs;
  var originalFunction;
  var spy;

  if(typeof args[0] === 'string') {
    obj = {};
    functionName = args[0];
    returnValue = args[1];
  }else{
    obj = args[0];
    functionName = args[1];
    returnValue = args[2];
  }

  function initialize() {
    wasCalled = false;
    capturedArgs = [];
  }

  function passedArguments(index) {
    if(arguments.length === 0) {
      return capturedArgs;
    } else {
      return capturedArgs[index - 1];
    }
  }

  function spyFunction(...args) { 
    capturedArgs = args;
    wasCalled = true;
    return returnValue;
  }

  originalFunction = obj[functionName];

  function resetOriginalFunction() {
    obj[functionName] = originalFunction; 
  }

  obj[functionName] = spyFunction;

  spy = {
    wasCalled() {return wasCalled;},
    passedArguments,
    stopSpying: resetOriginalFunction,
    resetSpy: initialize,
    object: obj,
    spyFunction
  };

  spy.resetSpy();
  return spy;
};
