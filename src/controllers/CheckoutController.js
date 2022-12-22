const connection = require('../database/connection');
const mercadopago = require('mercadopago');

module.exports = {   
    async index (request, response) {
        const grupos = await connection('grupos')
        .orderBy('grpDescricao')
        .select('*');
    
        return response.json(grupos);
    },    
        
    async pagCartao(request, response) {
        const {grpDescricao} = request.body;
        const [grpId] = await connection('grupos').insert({
            grpDescricao, 
        });
           
        return response.json({grpId});
    },

    async checkout (request, response) {
        mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN);
        mercadopago.configure({
            access_token: process.env.ACCESS_TOKEN
        });
        
        var preference = {
          items: [
            {
              title: 'Test',
              quantity: 1,
              currency_id: 'ARS',
              unit_price: 10.5
            }
          ],
          notification_url: ""
        };
        
        mercadopago.preferences.create(preference)
        
    },
    
};
