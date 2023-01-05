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

        console.log(email);
        console.log(senha);

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
        console.log(request.body);
        const {nome, cpf, nascimento, email, celular , password} = request.body;
        let cliApelido = nome;
        let cliPontos = 0;
        let cliUltLocalizacao = 1;
        var status = 'A'; 
        var senha = crypto.createHash('md5').update(password).digest('hex');
        const [cliId] = await connection('clientes').insert({
            cliNome: nome, 
            cliApelido, 
            cliEmail: email, 
            cliPassword: senha,
            cliCelular: celular, 
            cliCpf: cpf, 
            cliNascimento: nascimento, 
            cliPontos, 
            cliUltLocalizacao, 
            cliStatus: status
        });
           
        return response.json({cliId});
    },
};
