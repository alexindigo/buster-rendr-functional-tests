# buster-functional [![Build Status](https://img.shields.io/travis/alexindigo/buster-functional/master.svg?style=flat-square)](https://travis-ci.org/alexindigo/buster-functional) [![Coverage Status](https://img.shields.io/coveralls/alexindigo/buster-functional/master.svg?style=flat-square)](https://coveralls.io/r/alexindigo/buster-functional?branch=master)

Functional tests helper for BusterJS. Adds helper functions to simulate basic user interactions.

*Requires: [BusterJS](http://busterjs.org/) as peer dependency.*

*Expects: [jQuery](http://jquery.com) to be present on the test target page.*

## Install

```
npm install buster-functional --save-dev
```

Add following snippet to your project's `package.json` to allow `buster-server` support
proxying without session prefixes.

```
"scripts":
{
  "postinstall": "test ! -d ./node_modules/buster-functional || ./node_modules/buster-functional/bin/install_wrapper"
},
```

*You might need to run `npm run-script postinstall` for the first time.*

## Examples

### Config

Just include `buster-functional` as extension,
list proxied paths as resources, see [Proxy resources](http://docs.busterjs.org/en/latest/modules/buster-configuration/#proxy-resources).

```javascript
'Functional tests':
{
  environment: 'browser',
  tests:
  [
    'tests/functional/**/*.js'
  ],
  resources:
  [
    // provide proxy paths, "/" is occupied by buster itself
    // so provide some alternative, like "/index"
    {path: '/index', backend: 'http://localhost:3030/'},
    {path: '/js', backend: 'http://localhost:3030/js'},
    {path: '/css', backend: 'http://localhost:3030/css'},
    {path: '/api', backend: 'http://localhost:3030/api'},
  ],
  extensions:
  [
    require('buster-functional')
  ],
  'buster-functional':
  {
    timeout: 120 // seconds
  }
}
```

### .load(uri, [callback])

Loads requested page into iframe and waits for the `App` object to be resolved.

*Note: When page is loaded, references to it's `window`, `document`, `$` and `App`
are attached to the test's context.*

```javascript
setUp: function(done)
{
  // load new app's homepage for each test
  this.load('/index').wait('postPageRender', done);
}
```

### .unload([callback])

Cleans up iframe and proxy-cookie, leaving stage clean for the next test.

```javascript
tearDown: function(done)
{
  this.unload(done);
}
```

### .touch(selector|element, [callback])

Simulates browser events related to touch, in the right order and with proper pauses.

```javascript
'Change search type to for-rent': function(done)
{
  // initially loads as For Sale search type
  assert.className(this.$('#searchTypeTabs>[data-tab=for_sale]')[0], 'backgroundLowlight');

  // change tab
  this.touch('#searchTypeTabs>[data-tab=for_rent]', function()
  {
    // for rent tab should be highlighted
    assert.className(this.$('#searchTypeTabs>[data-tab=for_rent]')[0], 'backgroundLowlight');
    // and for sale tab should not
    refute.className(this.$('#searchTypeTabs>[data-tab=for_sale]')[0], 'backgroundLowlight');

    done();
  });
}
```

### .type(selector|target, text, [callback])

Simulates user's typing, with all related events and proper timing.

```javascript
'Get autocomplete suggestions': function(done)
{
  this.type('[data-action=searchForm]', 'Palo Al', function()
  {
    // Check first line of autosuggest
    // should contain "Palo Alto, CA"
    assert.contains(this.$('[data-role=autosuggest_list]>li:first-child').text(), 'Palo Alto, CA');

    done();
  });
}
```

### .select(selector|target, optionValue, [callback])

Simulates user's select drop-down action, with all related events and proper timing.

```javascript
'Set value for select drop-down': function(done)
{
  this.select('[data-role=selectTag]', '1000', function()
  {
    // Check correct drop-down value is selected
    // should have selected "1000"
    assert.isTrue(this.$('[data-role=selectTag] > option[value=1000]').is(':selected'));
    done();
  });
}
```

### .scroll(selector|target, callback)

Scrolls the window to the middle of the provided element.

```javascript
'Header should be hidden when user scrolls past the first item': function(done) {
  var $header = this.$('[data-role=header]');
  var $item = this.$('[data-itemindex=2]')
  this.scroll(item, function() {
    assert.isFalse($header.is(':visible'));
  });
}
```

### .focus(selector|target)

Makes sure focus event is triggered on the provided element.

*Note: `.type` uses it internally. It's a synchronous function.*

```javascript
'Test': function(done)
{
  this.focus('[data-action=searchForm]');
}
```

### .blur(selector|target)

Makes sure blur event is triggered on the provided element.

*Note: It's a synchronous function.*

```javascript
'Test': function(done)
{
  this.blur('[data-action=searchForm]');
}
```

### .wait([event], callback, [delay])

Waits for the App level events, if no `window.App` is available,
puts callbacks into queue and continues to check for the `App` object
every once in a while.

```javascript
'Go to the property page': function(done)
{
  // no property page yet
  refute.contains(this.$('[data-action=pdpDesc]').text(), 'Home Details');

  // tap on the property
  this.touch('[data-action=property] .propertyPhoto');

  // wait for the new page to activate
  this.wait('currentViewActive', function()
  {
    // property page is here
    assert.contains(this.$('[data-action=pdpDesc]').text(), 'Home Details');

    done();
  });
}
```

### .waitForCss(selector|element, [callback])

Waits for CSS Transition to finish, triggers provided callback after that.

```javascript
'Open side menu': function(done)
{
  // define target element
  var target = this.$('body>[data-view*=side_nav]');

  // when menu closed it has position absolute
  assert.equals(target.css('position'), 'absolute');

  // Toggle menu
  this.touch('#navToggle');

  // there is animation delay for sliding in, wait till animation is done
  this.waitForCss(target, function()
  {
    // when open, side menu has position fixed
    assert.equals(target.css('position'), 'fixed');

    done();
  });
}
```

### .waitForText(selector|element, text, [callback])

Waits for element to show up on the page and contain provided text.
Better to use with selectors rather than elements,
to allow it to catch newly created elements.

*Another autocomplete example, this time much closer to the real life.*

```javascript
'Get autocomplete suggestions': function(done)
{
  this.type('[data-action=searchForm]', 'Palo Al', function()
  {
    // need to wait for all the autocomplete requests to be resolved
    this.waitForText('[data-role=autosuggest_list]>li:first-child b', 'Palo Al', function()
    {
      // Check first line of autosuggest
      // should contain "Palo Alto, CA"
      assert.contains(this.$('[data-role=autosuggest_list]>li:first-child').text(), 'Palo Alto, CA');

      done();
    });
  });
}

```

### .enhance(callback)

Provides means to enhance testable environment by enhancing in-iframe window object.

*Note: Enhance handler function will called bound to the test object.*

```javascript
setUp: function(done)
{
  // load new app's homepage for each test
  this.load('/index').wait('postPageRender', done);

  this.enhance(function(iframeWindow)
  {
    // channel App's console.log output into test reporting
    iframeWindow.console.log = console.log.bind(console);
  });
}
```

## PhantomJS

At the moment PhantomJS uses older version of webkit
that doesn't support `Function.prototype.bind`.
As workaround you can add `es5-shim` to the list of libraries:

```javascript
'Functional tests':
{
  environment: 'browser',
  libs:
  [
    // PhantomJS - https://github.com/ariya/phantomjs/issues/10522
    'assets/js/vendor/es5-shim.js'
  ],
  tests:
  [
    'tests/functional/**/*.js'
  ]
}
```

And add `bind` to the test page loaded in iframe:

```javascript
setUp: function(done)
{
  // load new app's homepage for each test
  this.load('/index').wait('postPageRender', done);

  this.enhance(function(iframeWindow)
  {
    iframeWindow.Function.prototype.bind = Function.prototype.bind;
  });
}
```

## Real Life Example

[Functional testing of Trulia Mobile website](https://vimeo.com/118677083) using `Buster.JS` with `buster-functional` module in real browsers on mobile devices, including iPhones 6+ and 5S with iOS8/Safari, Androids 4.4 with Stock and Chrome browsers.

## TODO

- Add support for desktop events.
- Integrate resource proxy changes into `buster-server`.
- Improve documentation.

## License

MIT
