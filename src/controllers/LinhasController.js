const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const linhas = await connection('linhas')
        .orderBy('lnhDescricao')
        .select('*');
    
        return response.json(linhas);
    },    
        
    async create(request, response) {
        const {lnhDescricao} = request.body;
        const [lnhId] = await connection('linhas').insert({
            lnhDescricao, 
        });
           
        return response.json({lnhId});
    },
};
