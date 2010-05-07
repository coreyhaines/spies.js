var Spies;
if(Spies) {
  throw "The Spies namespace has already been defined by a previously loaded library";
}
Spies = {};
Spies.v2 = {};

Spies.v2.stub = function(obj, functionName, returnValue){
  var spy;

  spy = Spies.v2.spyOn(obj, functionName, returnValue);
  spy.removeStub = spy.stopSpying;

  return spy;
};

Spies.v2.spyOn = function() {
  var obj, functionName, returnValue, wasCalled, capturedArgs, originalFunction, spy;

  if(typeof arguments[0] === 'string') {
    obj = {};
    functionName = arguments[0];
    returnValue = arguments[1];
  }else{
    obj = arguments[0];
    functionName = arguments[1];
    returnValue = arguments[2];
  }

  function initialize() {
    wasCalled = false;
    capturedArgs = [];
  }

  function spyFunction() { 
    capturedArgs = arguments;
    wasCalled = true;
    return returnValue;
  }

  originalFunction = obj[functionName];

  function resetOriginalFunction() {
    obj[functionName] = originalFunction; 
  }

  obj[functionName] = spyFunction;
  spy = {
    wasCalled: function() {return wasCalled;},
    passedArguments: function(index) {
      if(arguments.length === 0) {
        return capturedArgs;
      } else {
        return capturedArgs[index - 1];
      }
    },
    stopSpying: resetOriginalFunction,
    resetSpy: initialize,
    object: obj,
    spyFunction: spyFunction
  };

  spy.resetSpy();
  return spy;
};

// Spies.spyOn = (function() {
  // function createSpyBehaviorsFor(objectToSpyOn, functionName, originalFunction, returnValue) {
    // var functionWasCalled, passedArguments, spyBehavior;

    // function initialize() {
      // functionWasCalled = false;
      // passedArguments = [];
    // }

    // spyBehavior = {
      // wasCalled: function() { return functionWasCalled; },
      // passedArguments: function(index) { 
        // if(arguments.length > 0) { return passedArguments[index-1]; }else{ return passedArguments; }
      // },
      // stopSpying: function() { objectToSpyOn[functionName] = originalFunction; },
      // resetSpy: initialize
    // };

    // spyBehavior[functionName] = function() {
      // functionWasCalled = true;
      // passedArguments = arguments;
      // return returnValue;
    // };

    // spyBehavior.resetSpy();

    // return spyBehavior;
  // }

  // return function(objectToSpyOn, functionName) {
    // var returnValue = arguments[2];

    // var originalFunction = objectToSpyOn[functionName];

    // var spyBehaviors = createSpyBehaviorsFor(objectToSpyOn, functionName, originalFunction, returnValue);

    // objectToSpyOn.spyFramework = { spies: spyBehaviors };

    // objectToSpyOn[functionName] = spyBehaviors[functionName];
    // return objectToSpyOn;
  // };
// }());

// Spies.stub = (function() {
  // return function(obj, functionName) {
    // var returnValue;
    // returnValue = arguments[2];

    // if(!obj.spyFramework) {
      // obj.spyFramework = {};
    // }

    // if(!obj.spyFramework.stubs) {
      // obj.spyFramework.stubs = {};
    // }

    // obj.spyFramework.stubs[functionName] = obj[functionName];

    // obj[functionName] = function() { return returnValue; };

    // obj.removeStub = function(functionName) { obj[functionName] = obj.spyFramework.stubs[functionName]; };
    // return obj;
  // };
// }());
