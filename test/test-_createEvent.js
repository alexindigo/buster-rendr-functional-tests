var buster = require('buster')
  , common = require('./common')
  , assert = buster.referee.assert
  , refute = buster.referee.refute
  ;

buster.testCase('_createEvent',
{
  // create new test object for each test
  setUp: common.setUp,

  'Routes keydown event with provided extra': function()
  {
    var event
      , type = 'keydown'
      , char = 'k'
      ;

    // stub expected sub method
    this.stub(this.testObject, '_createKeyEvent');

    // invoke test subject
    this.testObject._createEvent(type, char);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject._createKeyEvent, type, char);
  },

  'Routes touchstart event with provided extra': function()
  {
    var event
      , type = 'touchstart'
      , target = common.createTargetElement.call(this)
      , eventCoordinates = []
      ;

    // stub expected sub method
    this.stub(this.testObject, '_createTouchEvent');

    // invoke test subject
    this.testObject._createEvent(type, target, eventCoordinates);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject._createTouchEvent, type, target, eventCoordinates);
  },

  'Routes touchmove event with provided extra': function()
  {
    var event
      , type = 'touchmove'
      , target = common.createTargetElement.call(this)
      , eventCoordinates = [200, 0]
      ;

    // stub expected sub method
    this.stub(this.testObject, '_createTouchEvent');

    // invoke test subject
    this.testObject._createEvent(type, target, eventCoordinates);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject._createTouchEvent, type, target, eventCoordinates);
  },

  'Routes mouseup event with provided extra': function()
  {
    var event
      , type = 'mouseup'
      , target = common.createTargetElement.call(this)
      ;

    // stub expected sub method
    this.stub(this.testObject, '_createMouseEvent');

    // invoke test subject
    this.testObject._createEvent(type, target);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject._createMouseEvent, type, target);
  },

  'Routes click event with provided extra': function()
  {
    var event
      , type = 'click'
      , target = common.createTargetElement.call(this)
      ;

    // route click to the mouse event handler
    this.stub(this.testObject, '_createMouseEvent');

    // invoke test subject
    this.testObject._createEvent(type, target);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject._createMouseEvent, type, target);
  },

  'Routes focus event': function()
  {
    var event
      , type = 'focus'
      , target = common.createTargetElement.call(this)
      ;

    // route click to the mouse event handler
    this.stub(this.testObject, '_createGenericEvent');

    // invoke test subject
    this.testObject._createEvent(type, target);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject._createGenericEvent, type);
  },

  'Routes DOMFocusOut event': function()
  {
    var event
      , type = 'DOMFocusOut'
      , target = common.createTargetElement.call(this)
      ;

    // route click to the mouse event handler
    this.stub(this.testObject, '_createGenericEvent');

    // invoke test subject
    this.testObject._createEvent(type, target);

    // since no extend function is present check it's arguments
    assert.calledWith(this.testObject._createGenericEvent, type);
  },

  'Throws on unrecognized event type': function()
  {
    var event
      , type = 'unrecognized'
      , target = common.createTargetElement.call(this)
      ;

    // throws exception
    assert.exception(function()
    {
      this.testObject._createEvent(type, target);
    }.bind(this), {message: 'Unsupported event type: ' + type});
  }
});
