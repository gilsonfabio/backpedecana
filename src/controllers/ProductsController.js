const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const products = await connection('produtos')
        .orderBy('prdDescricao')
        .select('*');
    
        return response.json(products);
    },    
        
    async create(request, response) {
        const {prdDescricao, prdReferencia, prdGrupo, prdLinha, prdCstUnitario, prdVdaUnitario, prdQtdEstoque, prdDscPermitido, prdStatus, prdUrlPhoto} = request.body;
        var status = 'A'; 
        const [prdId] = await connection('produtos').insert({
            prdDescricao, 
            prdReferencia, 
            prdGrupo, 
            prdLinha, 
            prdCstUnitario, 
            prdVdaUnitario, 
            prdQtdEstoque, 
            prdDscPermitido, 
            prdStatus: status, 
            prdUrlPhoto
        });
           
        return response.json({prdId});
    },
};
