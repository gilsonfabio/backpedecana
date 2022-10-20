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
    
    async detProduct(request, response) {
        let id = request.params.proId;
        const product = await connection('produtos')
            .where('idProd', id)
            .select('*')
            .first();
          
        if (!product) {
            return response.status(400).json({ error: 'Produto nao encontrado'});
        } 

        //console.log(product);

        return response.json(product);
    },
};
