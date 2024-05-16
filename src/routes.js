const express = require('express');
const routes = express.Router();

const UsersController = require('./controllers/UsersController');
const ProductsController = require('./controllers/ProductsController');
const GruposController = require('./controllers/GruposController');
const LinhasController = require('./controllers/LinhasController');
const PedidosController = require('./controllers/PedidosController');
const CheckoutController = require('./controllers/CheckoutController');
const EfipayController = require('./controllers/EfipayController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Pé de Cana!',
    });
});

routes.post('/signIn', UsersController.signIn);
routes.post('/newuser', UsersController.newuser);
routes.get('/busAddress/:idUsr', UsersController.busAddress);

routes.get('/produtos', ProductsController.index);
routes.post('/newproduct', ProductsController.create);
routes.get('/detproduct/:proId', ProductsController.detProduct);
routes.get('/searchPro/:idPro', ProductsController.searchPro);
routes.get('/linprodutos/:idLnh', ProductsController.lnhProdutos);

routes.get('/grupos', GruposController.index);
routes.post('/newgrupo', GruposController.create);

routes.get('/linhas', LinhasController.index);
routes.post('/newlinha', LinhasController.create);

routes.post('/newprocar', PedidosController.carcompras);
routes.get('/searchCar/:idUsrCar', PedidosController.searchCar);
routes.get('/headerCar/:carId', PedidosController.headerCar);
routes.get('/itemsCar/:carId', PedidosController.itemsCar);
routes.post('/adiprocar', PedidosController.adiprocar);
routes.post('/subprocar', PedidosController.subprocar);

routes.post('/checkout', CheckoutController.checkout);

routes.post('/authorize', EfipayController.auth);
routes.post('/webhook', EfipayController.webhook);
routes.post('/certificado', EfipayController.certificado);

module.exports = routes;
