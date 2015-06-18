var buster = require('buster')
  , common = require('./common')
  , assert = buster.referee.assert
  , refute = buster.referee.refute
  ;

buster.testCase('_createTouchEvent',
{
  // create new test object for each test
  setUp: common.setUp,

  'Creates touchstart event object': function()
  {
    var event
      , type = 'touchstart'
      , target = common.createTargetElement.call(this)
      , blankTouchEvent = common.blankTouchEvent(type)
      , blankTouchCoords = common.blankTouchCoords()
      ;

    // augment testObject with jQuery things
    event = this.testObject._createTouchEvent(type, target);
    assert.equals(common._jQuery_Event, event);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject.$.extend, true, {}, blankTouchEvent, blankTouchCoords);
  },

  'Creates touchmove event object': function()
  {
    var event
      , type = 'touchmove'
      , target = common.createTargetElement.call(this)
      , blankTouchEvent = common.blankTouchEvent(type)
      , eventCoordinates = [200, 0]
      , touchMoveCoordinates = {
          touches :
          [
            {
              clientX: common._targetX() + eventCoordinates[0],
              clientY: common._targetY() + eventCoordinates[1],
              pageX: common._targetX() + eventCoordinates[0],
              pageY: common._targetY() + eventCoordinates[1]
            }
          ]
        }
      ;

    // augment testObject with jQuery things
    event = this.testObject._createTouchEvent(type, target, eventCoordinates);
    assert.equals(common._jQuery_Event, event);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject.$.extend, true, {}, blankTouchEvent, touchMoveCoordinates);
  },

  'Creates touchend event object': function()
  {
    var event
      , type = 'touchend'
      , target = common.createTargetElement.call(this)
      , blankTouchEvent = common.blankTouchEvent(type)
      , blankTouchCoords = common.blankTouchCoords()
      ;

    // augment testObject with jQuery things
    event = this.testObject._createTouchEvent(type, target);
    assert.equals(common._jQuery_Event, event);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject.$.extend, true, {}, blankTouchEvent, {});
    // double check that coordinates not being passed for touchend
    refute.calledWith(this.testObject.$.extend, true, {}, blankTouchEvent, blankTouchCoords);
  }
});
