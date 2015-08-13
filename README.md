Example [DaSpec JS](http://daspec.com) setup running inside a browser, with components managed using Bower, for testing javascript projects.

Check out the git repository, then do 

    bower install

to pull the dependencies. You should be able to open the [index.html](index.html) page and execute DaSpec specifications in your browser.

## How this works

The magic is in [layout-example.js](layout-example.js) - the `runDaSpec` function shows how to wire up DaSpec with a minimal configuration that outputs markdown and produces a counter for passed, failed and skipped steps. 


For more information on DaSpec, see [http://daspec.com](http://daspec.com)
