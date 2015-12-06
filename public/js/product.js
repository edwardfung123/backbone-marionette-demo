(function(){
  'use strict';

  // The usual model
  window.ProductModel = Backbone.Model.extend({
    urlRoot: '/api/products/',
    idAttribute: 'id',
  });

  window.ProductCollection = Backbone.Collection.extend({
    Model: window.ProductModel,
    url: '/api/products/',
  });

  window.CartModel = Backbone.Model.extend({
    createFromProduct: function(product, quantity){
      this.set({
        pid: product.get('id'),
        name: product.get('name'),
        price: product.get('price'),
        quantity: quantity,
      });
    },
    getTotal: function(){
      var price = this.get('price');
      var quantity = this.get('quantity');
      var total = price * quantity;
      return total;
    },
  });

  window.CartCollection = Backbone.Collection.extend({
    Model: window.CartModel,
  });
})();
