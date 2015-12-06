(function(){
  'use strict';

  // 000. Simplest form.
  //window.AppView = Marionette.LayoutView.extend({
  //  template: '#template-app-view',
  //});

  // 001. with products view.
  window.AppView = Marionette.LayoutView.extend({
    template: '#template-app-view',
    regions: {
      'products': '#products .products.container',
      'cart': '#cart',
    },
    onRender: function(){
      // called .render() will be actually called this onBeforeRender first and
      // then the onRender().
      // People usually initialized the "regions" in this function.
      
      var productsView = new window.ProductsView({
        collection: window.products,
      });
      this.getRegion('products').show(productsView);

      var cartView = new window.CartView({
        collection: window.cart,
      });
      this.getRegion('cart').show(cartView);
    },
  });

  window.ProductsItemView = Marionette.ItemView.extend({
    template: '#template-products-item-view',
    className: 'col-xs-6',
    onBeforeRender: function(){
      console.log(this.model);
    },

    // Define UI elements that we will use frequently.
    // They will be cached and released properly (I suppose no memory leak (o:)
    ui: {
      'addToCartBtn': '[data-action=add-to-cart]',
    },

    // We can use the traditional 'events' dict. but very often we need to propagate the event to the upper level. so Marionette defined a new dict called triggers.
    triggers: {
      // 'UI event'   'Targeted UI':    'The event name to be triggered'
      'click @ui.addToCartBtn': 'click:addToCartBtn',
    },

    onClickAddToCartBtn: function(e){
      console.log('Add to cart!');
    },
  });

  // 001. Simplest Version I can imagine...
  window.ProductsEmptyView = Marionette.ItemView.extend({
    // Instead of specify the template with a selector, we can put a function as well.
    template: _.template('<div>No products at this moment. Revisit later.</div>'),
  });

  window.ProductsView = Marionette.CollectionView.extend({
    // required
    // When we define a Collection View, we have to define its childView and
    // emptyView.
    template: '#template-products-view',
    childView: window.ProductsItemView,   // The View used for each model in a collection.
    emptyView: window.ProductsEmptyView,  // In case the collection is empty.
    // optionals
    tagName: 'div',
    className: 'row',

    // We can listen to child views' events.
    childEvents: {
      // !!!    case sensitive    !!!
      'click:addToCartBtn': 'onClickAddToCartBtn',
    },

    onClickAddToCartBtn: function(childView, args){
      // the first argument is always the childView
      // The 2nd argument is the argument passed to the child's event callback.
      console.log('It is also the parent responsibilty to handle the children event...');
      console.log(arguments);
      var cartItem = new window.CartModel();
      cartItem.createFromProduct(args.model, 1);
      window.cart.add(cartItem);
    },
  });

  window.CartItemView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#template-cart-item-view',
    templateHelpers: function(){
      var ret = {};
      ret.idx = this._index;
      ret.total = this.model.getTotal();
      return ret;
    },
  });

  window.CartEmptyView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: _.template('<td colspan="6"><p class="text-center">No item yet.</p></td>')
  });

  window.CartView = Marionette.CompositeView.extend({
    // CompositeView is a special case of CollectionView
    template: '#template-cart-view',
    childView: window.CartItemView,
    childViewContainer: 'tbody',
    emptyView: window.CartEmptyView,

    // Optionals
    // Inherit from Marionette.Item
    collectionEvents: {
      'add': 'itemAddedToCart',
    },
    ui: {
      total: 'tfoot .total span.total',
    },
    itemAddedToCart: function(e){
      var total = this.collection.reduce(function(memo, cartItem){
        return memo += cartItem.getTotal();
      }, 0.0);
      this.ui.total.text(s.numberFormat(total, 2));
    },
  });
})();
