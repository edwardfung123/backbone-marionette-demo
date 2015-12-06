var express = require('express');
var _ = require('underscore');
var router = express.Router();

var product1 = {
  id: 1,
  name: 'Hello',
  price: 1.2,
};

var product2 = {
  id: 2,
  name: 'World',
  price: 3.4,
};

var product3 = {
  id: 3,
  name: 'Foo',
  price: 5.6,
};

var product4 = {
  id: 4,
  name: 'Bar',
  price: 7.8,
};

var products = [
  product1, product2, product3, product4,
];

/* GET products. */
router.get('/products/', function(req, res, next) {
  return res.json(products);
});

/* GET a product */
router.get('/products/:id', function(req, res, next){
  var id = parseInt(req.params.id, 10);
  var p = _.find(products, function(p){
    return p.id == id
  });
  if (!p){
    res.type('json').status(404).end();
    return;
  }
  return res.json(p);
})

module.exports = router;
