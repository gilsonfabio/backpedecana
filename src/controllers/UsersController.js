const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv/config');

module.exports = {       
    
    async signIn(request, response) {
        let email = request.body.email;
        let senha = request.body.password;

        console.log('Email:', email);
        console.log('Password:', senha);

        const usuario = await connection('clientes')
            .where('cliEmail', email)
            .select(`cliId`, `cliNome`, `cliEmail`, `cliPassword`)
            .first();
        
        if (!usuario) {            
            return response.status(400).json({ error: 'Não encontrou usuário com este ID'});
        } 

        //console.log(user.usrPassword)
        //let pass = usuario.usrPassword;
        //const match = await bcrypt.compare(senha, pass)

        //if(!match) {
        //    return response.status(403).send({ auth: false, message: 'User invalid!' });
        //}

        const user = {
            id: usuario.cliId,
            name: usuario.cliNome,
            email: usuario.cliEmail
        }

        //let token = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso }, process.env.SECRET_JWT, {
        //    expiresIn: '1h'
        //});
        //let refreshToken = jwt.sign({ id: user.usrId, name: user.usrNome, email: user.usrEmail, nivel: user.usrNivAcesso  }, process.env.SECRET_JWT_REFRESH, {
        //    expiresIn: '2h'
        //});
        console.log(user);
        
        return response.json(user);

    },

    async newuser(request, response) {
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

    async busAddress(request, response) {
        let id = request.params.idUsr;

        //console.log('Procurando endereço do usuario:',id);

        const endereco = await connection('enderecos')
            .where('endCliId', id)
            .join('clientes', 'cliId', 'enderecos.endCliId')
            .join('bairros', 'baiId', 'enderecos.endBairro')
            .join('cidades', 'cidId', 'enderecos.endCidade')
            .select(['enderecos.*', 'clientes.cliNome', 'clientes.cliEmail', 'clientes.cliCelular', 'bairros.baiDescricao', 'cidades.cidDescricao']);
          
        if (!endereco) {
            return response.status(400).json({ error: 'Não encontrou usuario c/ este ID'});
        } 

        //console.log(endereco)

        return response.json(endereco);
    },
};
