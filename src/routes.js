const express = require('express');
const routes = express.Router();

const UsersController = require('./controllers/UsersController');
const ProductsController = require('./controllers/ProductsController');
const GruposController = require('./controllers/GruposController');
const LinhasController = require('./controllers/LinhasController');

routes.get('/', (request, response) => {
    response.json({
        message: 'Bem-vindo ao servidor Pé de Cana!',
    });
});

routes.get('/users', UsersController.index);
routes.get('/signIn/:email/:password', UsersController.signIn);
routes.post('/newuser', UsersController.create);

routes.get('/products', ProductsController.index);
routes.post('/newproduct', UsersController.create);

routes.get('/grupos', GruposController.index);
routes.post('/newgrupo', GruposController.create);

routes.get('/linhas', LinhasController.index);
routes.post('/newlinha', LinhasController.create);

module.exports = routes;
