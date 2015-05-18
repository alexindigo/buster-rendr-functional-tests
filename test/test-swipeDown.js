var buster = require('buster')
  , common = require('./common')
  , assert = buster.referee.assert
  , refute = buster.referee.refute
  , testObject
  ;

buster.testCase('swipeDown',
{
  // create new test object for each test
  setUp: common.setUp,

  'Invokes _swipe with target and default offset': function(done)
  {
    var target = common.createTargetElement.call(this)
      , callback = this.spy()
      ;

    this.stub(this.testObject, '_swipe');

    // invoke test subject
    this.testObject.swipeDown(target, callback);

    // Invoked _swipe
    assert.calledWith(this.testObject._swipe, target, [0, -350], callback);

    done();

  },

  'Invoke _swipe with windows innerHeight': function(done)
  {
    var target = common.createTargetElement.call(this)
      , innerHeight = 500
      , offsetFactor = 0.45
      , callback = this.spy()
      ;

    this.stub(this.testObject, '_swipe');
    this.testObject.window = {innerHeight: innerHeight};

    // invoke test subject
    this.testObject.swipeDown(target, callback);

    // Invoked _swipe
    assert.calledWith(this.testObject._swipe, target, [0, -Math.abs(innerHeight * offsetFactor)], callback);

    done();

  }
});