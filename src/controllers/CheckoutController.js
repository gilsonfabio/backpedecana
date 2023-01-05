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
        console.log('dados do body:',request.body)    
        let proPreco = request.body.testeJson.price;
        let endereco = request.body.testeJson.address;
        let emailCli = request.body.testeJson.cliEmail;
        let nomeCli = request.body.testeJson.cliNome;

        console.log(proPreco);
        console.log(endereco);
        
        mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN);
        mercadopago.configure({
          access_token: process.env.ACCESS_TOKEN
        });

        let preference = {
          items: [{
            title: endereco,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: parseFloat(proPreco)
          }],
          payer: {
            email: emailCli,
            name: nomeCli
          },
          back_urls:{
            failure: "https://innvento.com.br/failure",
            pending: "https://innvento.com.br/pending",
            success: "https://innvento.com.br/success",
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
