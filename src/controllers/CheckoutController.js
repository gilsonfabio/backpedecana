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
        //console.log(request.body)
          
        mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN);
        mercadopago.configure({
          access_token: process.env.ACCESS_TOKEN
        });

        let preference = {
          items: [{
            title: 'Cerveja Heineken, Long Neck 330ml',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 5.60
          }],
          payer: {
            email: 'nivearabellosm@gmail.com',
            name: 'Nivea',
            surname: 'Rabello',
          },
          payment_methods: {
            installments: 3
          }
        };

        mercadopago.preferences.create(preference).then(function (data) {
          console.log(data)
          response.send(JSON.stringify(data.response.sandbox_init_point));
        }).catch(function (error) {
          console.log(error);
        })
    },
    
};
