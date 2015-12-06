(function(){
  'use strict';

  window.products = new ProductCollection();
  window.cart =new CartCollection();

  $(document).ready(function(){
    var app = new Marionette.Application();

    app.on('start', function(){
      console.log('start!');
      Backbone.history.start();
      // Initialize the views
      this.appView = new AppView({
        el: $('#app'),
      });
      this.appView.render();
    });

    var loadData = function(){
      // Load the data, do whatever you want to like collection.fetch, login and ...
      var deferred = $.Deferred();
      // 000. deferred demo
      //setTimeout(function(){
      //  // 'hello' and 'world' will be passed to the callback in 'then()'.
      //  deferred.resolve('hello', 'world');
      //}, 2000);

      // 001. Uncomment for loading the real data.
      var productsFetch = window.products.fetch();

      $.when(productsFetch).then(function(){
        deferred.resolve(window.products);
      });
      return deferred;
    };

    console.log('set up then');
    loadData().then(function(products){
      console.log(arguments);
      app.start();
    });

  });
})();
