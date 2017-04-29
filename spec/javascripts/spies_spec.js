jasmine.include("../../lib/spies.js", true);
describe("Spies", () => {
  describe("#spyOn", () => {
    describe("spying on multiple objects", () => {
      var obj1;
      var obj2;
      var obj1Spy;
      var obj2Spy;
      beforeEach(() => {
        obj1 = {foo() {}};
        obj2 = {foo() {}};
        obj1Spy = Spies.spyOn(obj1, "foo");
        obj2Spy = Spies.spyOn(obj2, "foo");
      });

      it("keeps track of which object had method called on it", () => {
        obj1.foo();

        expect(obj1Spy.wasCalled("foo")).toEqual(true);
        expect(obj2Spy.wasCalled("foo")).toEqual(false);
      });
    });


    describe("not passing an object", () => {
      var spy;
      beforeEach(() => {
        spy = Spies.spyOn("foo");
      });

      it("tells if method was not called", () => {
        expect(spy.wasCalled()).toEqual(false);
      });

      it("tells if method was called", () => {
        spy.spyFunction();
        expect(spy.wasCalled()).toEqual(true);
      });

      it("returns the desired value", () => {
        var returnValue;

        spy = Spies.spyOn("bar", "returnValue");

        returnValue = spy.spyFunction();

        expect(returnValue).toEqual("returnValue");

      });

      describe("can resetSpy to forget previous interactions", () => {
        it("resets to not having been called", () => {
            spy.spyFunction();

            spy.resetSpy();

            expect(spy.wasCalled()).toEqual(false);
        });

        it("resets the passedArguments to empty", () => {
            spy.spyFunction("1", "2", "3");

            spy.resetSpy();

            expect(spy.passedArguments().length).toEqual(0);
        });
      });

      describe("accessing passedArguments", () => {
        it("allows you to access by index", () => {
          spy.spyFunction("argument1", "argument2");

          expect(spy.passedArguments(1)).toEqual("argument1");
          expect(spy.passedArguments(2)).toEqual("argument2");
        });

        it("passing no index returns all arguments", () => {
          spy.spyFunction("argument1", "argument2");
          
          expect(spy.passedArguments()[0]).toEqual("argument1");
          expect(spy.passedArguments()[1]).toEqual("argument2");
          expect(spy.passedArguments().length).toEqual(2);
        });
      });
      
    });
    describe("spying on a single object", () => {
      var obj;
      var spies;
      beforeEach(() => {
        obj = {foo() {}, bar() {}};
        spies = Spies.spyOn(obj, "foo");
      });

      it("tells if method was not called", () => {
        expect(spies.wasCalled()).toEqual(false);
      });

      it("tells if method was called", () => {
        obj.foo();
        expect(spies.wasCalled()).toEqual(true);
      });

      it("returns the desired value", () => {
        var returnValue;

        spy = Spies.spyOn(obj, "bar", "returnValue");

        returnValue = obj.bar();

        expect(returnValue).toEqual("returnValue");

      });

      it("holds a reference to the object spied upon", () => {
        var obj;
        var spy;
        obj = { id: "me" };

        spy = Spies.spyOn(obj, "foo");

        expect(spy.object.id).toEqual("me");
      });

      it("holds a reference to the function being spied upon", () => {
        var spy;
        var spiedUponFunction;

        spy = Spies.spyOn({}, "foo", "i am spied upon");

        spiedUponFunction = spy.spyFunction;

        expect(spiedUponFunction()).toEqual("i am spied upon");
      });

      it("can stopSpying to restore function", () => {
          var originalCalled;
          originalCalled = false;

          obj.foo = () => { originalCalled = true; };

          spies = Spies.spyOn(obj, "foo");

          spies.stopSpying();

          obj.foo();

          expect(originalCalled).toEqual(true);
      });

      describe("can resetSpy to forget previous interactions", () => {
        it("resets to not having been called", () => {
            obj.foo();

            spies.resetSpy();

            expect(spies.wasCalled()).toEqual(false);
        });

        it("resets the passedArguments to empty", () => {
            obj.foo("1", "2", "3");

            spies.resetSpy();

            expect(spies.passedArguments().length).toEqual(0);
        });
      });

      describe("accessing passedArguments", () => {
        it("allows you to access by index", () => {
          obj.foo("argument1", "argument2");

          expect(spies.passedArguments(1)).toEqual("argument1");
          expect(spies.passedArguments(2)).toEqual("argument2");
        });

        it("passing no index returns all arguments", () => {
          obj.foo("argument1", "argument2");
          
          expect(spies.passedArguments()[0]).toEqual("argument1");
          expect(spies.passedArguments()[1]).toEqual("argument2");
          expect(spies.passedArguments().length).toEqual(2);
        });
      });
    });
  });
  describe("#stub", () => {
    describe("multiple methods", () => {
      var obj;
      beforeEach(() => {
        obj = { wasFooCalled: false, wasBarCalled: false,
                foo() { this.wasFooCalled = true; },
                bar() { this.wasBarCalled = true; }
              };
      });

      it("can stub both methods", () => {
        Spies.stub(obj, "foo");
        Spies.stub(obj, "bar");

        obj.foo();
        obj.bar();

        expect(obj.wasFooCalled).toEqual(false);
        expect(obj.wasBarCalled).toEqual(false);
      });

      it("can stub one method, leaving the other", () => {
        Spies.stub(obj, "foo");

        obj.foo();
        obj.bar();

        expect(obj.wasFooCalled).toEqual(false);
        expect(obj.wasBarCalled).toEqual(true);
      });

      it("can remove the stub from one method, leaving the other stubbed", () => {
        var fooSpy;
        fooSpy = Spies.stub(obj, "foo");
        Spies.stub(obj, "bar");

        fooSpy.removeStub();

        obj.foo();
        obj.bar();

        expect(obj.wasFooCalled).toEqual(true);
        expect(obj.wasBarCalled).toEqual(false);
      });

      it("can set a separate return value for each function stubbed", () => {
        var fooReturn;
        var barReturn;

        Spies.stub(obj, "foo", "foo return");
        Spies.stub(obj, "bar", "bar return");

        fooReturn = obj.foo();
        barReturn = obj.bar();

        expect(fooReturn).toEqual("foo return");
        expect(barReturn).toEqual("bar return");
      });
    });

    describe("single method", () => {
      var obj;
      beforeEach(() => {
        obj = { wasCalled:false, foo() { this.wasCalled = true; } };
      });
      it("prevents the original function from being called", () => {
        var spy;
        spy = Spies.stub(obj, "foo");

        obj.foo();

        expect(obj.wasCalled).toEqual(false);
      });

      it("can be told to return a certain value", () => {
        var spy;
        var returnValue;

        spy = Spies.stub(obj, "foo", "return value");

        returnValue = obj.foo();

        expect(returnValue).toEqual("return value");
      });
    
      it("can be removed to allow the original function to be called again", () => {
        var spy;

        spy = Spies.stub(obj, "foo");

        spy.removeStub();
      
        obj.foo();

        expect(obj.wasCalled).toEqual(true);
      });
    });
  });
});
