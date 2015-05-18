var buster = require('buster')
  , common = require('./common')
  , assert = buster.referee.assert
  , refute = buster.referee.refute
  , testObject
  ;

buster.testCase('swipeUp',
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
    this.testObject.swipeUp(target, callback);

    // Invoked _swipe
    assert.calledWith(this.testObject._swipe, target, [0, 350], callback);

    done();

  },

  'Invoke _swipe with windows innerHeight': function(done)
  {
    var target = common.createTargetElement.call(this)
      , innerHeightOffset = 500
      , offsetFactor = 0.45
      , callback = this.spy()
      ;

    this.stub(this.testObject, '_swipe');
    this.testObject.window = {innerHeight: innerHeightOffset};

    // invoke test subject
    this.testObject.swipeUp(target, callback);

    // Invoked _swipe
    assert.calledWith(this.testObject._swipe, target, [0, Math.abs(innerHeightOffset * offsetFactor)], callback);

    done();

  }
});