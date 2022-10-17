const { Console } = require('console');
const crypto = require('crypto');
const { addListener } = require('../database/connection');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const users = await connection('clientes')
        .orderBy('cliNome')
        .select('*');
    
        return response.json(users);
    },    
        
    async signIn(request, response) {
        let email = request.params.email;
        let senha = request.params.password;

        var encodedVal = crypto.createHash('md5').update(senha).digest('hex');
        const user = await connection('clientes')
            .where('cliEmail', email)
            .where('cliPassword', encodedVal)
            .select('cliId', 'cliNome')
            .first();
          
        if (!user) {
            return response.status(400).json({ error: 'Não encontrou cliente com este ID'});
        } 

        return response.json(user);
    },
    
    async create(request, response) {
        const {cliNome, cliApelido, cliEmail, cliPassword, cliCelular, cliCpf, cliNascimento, cliPontos, cliUltLocalizacao, cliStatus} = request.body;
        var status = 'A'; 
        var senha = crypto.createHash('md5').update(usrPassword).digest('hex');
        const [cliId] = await connection('clientes').insert({
            cliNome, 
            cliApelido, 
            cliEmail, 
            cliPassword,
            cliCelular, 
            cliCpf, 
            cliNascimento, 
            cliPontos, 
            cliUltLocalizacao, 
            cliStatus
        });
           
        return response.json({cliId});
    },
};
