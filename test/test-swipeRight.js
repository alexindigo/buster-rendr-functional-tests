var buster = require('buster')
  , common = require('./common')
  , assert = buster.referee.assert
  , refute = buster.referee.refute
  , testObject
  ;

buster.testCase('swipeRight',
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
    this.testObject.swipeRight(target, callback);

    // Invoked _swipe
    assert.calledWith(this.testObject._swipe, target, [200, 0], callback);

    done();

  },

  'Invoke _swipe with windows innerWidth': function(done)
  {
    var target = common.createTargetElement.call(this)
      , innerWidth = 250
      , offsetFactor = 0.7
      , callback = this.spy()
      ;

    this.stub(this.testObject, '_swipe');
    this.testObject.window = {innerWidth: innerWidth};

    // invoke test subject
    this.testObject.swipeRight(target, callback);

    // Invoked _swipe
    assert.calledWith(this.testObject._swipe, target, [Math.abs(innerWidth * offsetFactor), 0], callback);

    done();

  }
});