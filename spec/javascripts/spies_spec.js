jasmine.include("../../lib/spies.js", true);
describe("Spies", function() {
  describe("#spyOn", function() {
    describe("spying on multiple objects", function() {
      var obj1, obj2, obj1Spy, obj2Spy;
      beforeEach(function() {
        obj1 = {foo: function() {}};
        obj2 = {foo: function() {}};
        obj1Spy = Spies.spyOn(obj1, "foo");
        obj2Spy = Spies.spyOn(obj2, "foo");
      });

      it("keeps track of which object had method called on it", function() {
        obj1.foo();

        expect(obj1Spy.wasCalled("foo")).toEqual(true);
        expect(obj2Spy.wasCalled("foo")).toEqual(false);
      });

    });


    describe("not passing an object", function() {
      var spy;
      beforeEach(function() {
        spy = Spies.spyOn("foo");
      });

      it("tells if method was not called", function() {
        expect(spy.wasCalled()).toEqual(false);
      });

      it("tells if method was called", function() {
        spy.spyFunction();
        expect(spy.wasCalled()).toEqual(true);
      });

      it("returns the desired value", function() {
        var returnValue;

        spy = Spies.spyOn("bar", "returnValue");

        returnValue = spy.spyFunction();

        expect(returnValue).toEqual("returnValue");

      });

      describe("can resetSpy to forget previous interactions", function() {
        it("resets to not having been called", function() {
            spy.spyFunction();

            spy.resetSpy();

            expect(spy.wasCalled()).toEqual(false);
        });

        it("resets the passedArguments to empty", function() {
            spy.spyFunction("1", "2", "3");

            spy.resetSpy();

            expect(spy.passedArguments().length).toEqual(0);
        });
      });

      describe("accessing passedArguments", function() {
        it("allows you to access by index", function() {
          spy.spyFunction("argument1", "argument2");

          expect(spy.passedArguments(1)).toEqual("argument1");
          expect(spy.passedArguments(2)).toEqual("argument2");
        });

        it("passing no index returns all arguments", function() {
          spy.spyFunction("argument1", "argument2");
          
          expect(spy.passedArguments()[0]).toEqual("argument1");
          expect(spy.passedArguments()[1]).toEqual("argument2");
          expect(spy.passedArguments().length).toEqual(2);
        });
      });
      
    });
    describe("spying on a single object", function() {
      var obj, spies;
      beforeEach(function() {
        obj = {foo: function() {}, bar: function() {}};
        spies = Spies.spyOn(obj, "foo");
      });

      it("tells if method was not called", function() {
        expect(spies.wasCalled()).toEqual(false);
      });

      it("tells if method was called", function() {
        obj.foo();
        expect(spies.wasCalled()).toEqual(true);
      });

      it("returns the desired value", function() {
        var returnValue;

        spy = Spies.spyOn(obj, "bar", "returnValue");

        returnValue = obj.bar();

        expect(returnValue).toEqual("returnValue");

      });

      it("holds a reference to the object spied upon", function() {
        var obj, spy;
        obj = { id: "me" };

        spy = Spies.spyOn(obj, "foo");

        expect(spy.object.id).toEqual("me");
      });

      it("holds a reference to the function being spied upon", function() {
        var spy, spiedUponFunction;

        spy = Spies.spyOn({}, "foo", "i am spied upon");

        spiedUponFunction = spy.spyFunction;

        expect(spiedUponFunction()).toEqual("i am spied upon");
      });

      it("can stopSpying to restore function", function() {
          var originalCalled;
          originalCalled = false;

          obj.foo = function() { originalCalled = true; };

          spies = Spies.spyOn(obj, "foo");

          spies.stopSpying();

          obj.foo();

          expect(originalCalled).toEqual(true);
      });

      describe("can resetSpy to forget previous interactions", function() {
        it("resets to not having been called", function() {
            obj.foo();

            spies.resetSpy();

            expect(spies.wasCalled()).toEqual(false);
        });

        it("resets the passedArguments to empty", function() {
            obj.foo("1", "2", "3");

            spies.resetSpy();

            expect(spies.passedArguments().length).toEqual(0);
        });
      });

      describe("accessing passedArguments", function() {
        it("allows you to access by index", function() {
          obj.foo("argument1", "argument2");

          expect(spies.passedArguments(1)).toEqual("argument1");
          expect(spies.passedArguments(2)).toEqual("argument2");
        });

        it("passing no index returns all arguments", function() {
          obj.foo("argument1", "argument2");
          
          expect(spies.passedArguments()[0]).toEqual("argument1");
          expect(spies.passedArguments()[1]).toEqual("argument2");
          expect(spies.passedArguments().length).toEqual(2);
        });
      });
      
    });
  });
  describe("#stub", function(){
    describe("multiple methods", function() {
      var obj;
      beforeEach(function() {
        obj = { wasFooCalled: false, wasBarCalled: false,
                foo: function() { this.wasFooCalled = true; },
                bar: function() { this.wasBarCalled = true; }
              };
      });

      it("can stub both methods", function() {
        Spies.stub(obj, "foo");
        Spies.stub(obj, "bar");

        obj.foo();
        obj.bar();

        expect(obj.wasFooCalled).toEqual(false);
        expect(obj.wasBarCalled).toEqual(false);
      });

      it("can stub one method, leaving the other", function() {
        Spies.stub(obj, "foo");

        obj.foo();
        obj.bar();

        expect(obj.wasFooCalled).toEqual(false);
        expect(obj.wasBarCalled).toEqual(true);
      });

      it("can remove the stub from one method, leaving the other stubbed", function() {
        var fooSpy;
        fooSpy = Spies.stub(obj, "foo");
        Spies.stub(obj, "bar");

        fooSpy.removeStub();

        obj.foo();
        obj.bar();

        expect(obj.wasFooCalled).toEqual(true);
        expect(obj.wasBarCalled).toEqual(false);
      });

      it("can set a separate return value for each function stubbed", function() {
          var fooReturn, barReturn;

          Spies.stub(obj, "foo", "foo return");
          Spies.stub(obj, "bar", "bar return");

          fooReturn = obj.foo();
          barReturn = obj.bar();

          expect(fooReturn).toEqual("foo return");
          expect(barReturn).toEqual("bar return");
      });
    });

    describe("single method", function() {
      var obj;
      beforeEach(function() {
        obj = { wasCalled:false, foo: function(){ this.wasCalled = true; } };
      });
      it("prevents the original function from being called", function() {
        var spy;
        spy = Spies.stub(obj, "foo");

        obj.foo();

        expect(obj.wasCalled).toEqual(false);
      });

      it("can be told to return a certain value", function() {
        var spy, returnValue;

        spy = Spies.stub(obj, "foo", "return value");

        returnValue = obj.foo();

        expect(returnValue).toEqual("return value");
      });
    
      it("can be removed to allow the original function to be called again", function() {
        var spy;

        spy = Spies.stub(obj, "foo");

        spy.removeStub();
      
        obj.foo();

        expect(obj.wasCalled).toEqual(true);
      });
    });
  });
});
