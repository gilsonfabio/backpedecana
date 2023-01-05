const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const pedidos = await connection('pedidos').select('*');
         
        return response.json(pedidos);
    },
    
    async carcompras(request, response) {
        
        //console.log(request.body);
        const { pedData, pedCliId, pedQtdTotal, pedVlrTotal, pedCupom, pedVlrPagar, pedEndEntrega,
             pedVlrTaxEntrega, pedFrmPagto, itePedProId, itePedQtde, itePedVlrUnit} = request.body;
        let id = request.body.pedCliId;
        let status = 1;
        let iteVlrTotal = itePedQtde * itePedVlrUnit;
        let iteNro = 1;
        const car = await connection('pedidos')
            .where('pedCliId', id)
            .where('pedStatus', status)
            .select('*')
            .first();
        
        if (!car) {
            const [pedId] = await connection('pedidos').insert({
                pedData, 
                pedCliId, 
                pedQtdTotal, 
                pedVlrTotal, 
                pedCupom, 
                pedVlrPagar,                 
                pedEndEntrega,
                pedVlrTaxEntrega, 
                pedFrmPagto,
                pedStatus: status,
                pedUltItem: iteNro 
            });

            //console.log('criado o carrinho n.: ', pedId )

            const [item] = await connection('pedItens').insert({
                itePedId: pedId, 
                itePedItem: iteNro, 
                itePedProId,
                itePedQtde,
                itePedVlrUnit,
                itePedVlrtotal: iteVlrTotal,
            });
        }else {
            let nroCar = car.pedId;
            let ultIte = car.pedUltItem;
            //console.log('Foi encontrado carrinho em aberto!')
            const item = await connection('pedItens')
                .where('itePedId', nroCar)
                .where('itePedProId', itePedProId)
                .increment('itePedQtde')
                .increment({itePedVlrtotal: itePedVlrUnit} );

            if (!item) {
                ultIte += 1 ;
                const [item] = await connection('pedItens').insert({
                    itePedId: nroCar, 
                    itePedItem: ultIte, 
                    itePedProId,
                    itePedQtde,
                    itePedVlrUnit,
                    itePedVlrtotal: iteVlrTotal,
                });

                const cmp = await connection('pedidos')
                    .where('pedId', nroCar)
                    .increment('pedQtdTotal')
                    .increment('pedUltItem')
                    .increment({pedVlrTotal: itePedVlrUnit} )
                    .increment({pedVlrPagar: itePedVlrUnit} );
            }else {
                const cmp = await connection('pedidos')
                    .where('pedId', nroCar)
                    .increment('pedQtdTotal')
                    .increment({pedVlrTotal: itePedVlrUnit} )
                    .increment({pedVlrPagar: itePedVlrUnit} );
                }
        } 
        return response.json(car);
    },
       
    async searchCar(request, response) {
        let id = request.params.idUsrCar;
        let status = 1;

        console.log('Procurando carrinho de compras do usuário:',id);

        const car = await connection('pedidos')
            .where('pedCliId', id)
            .where('pedStatus', status)
            .select('pedId', 'pedQtdtotal')
            .first();
          
        if (!car) {
            return response.status(400).json({ error: 'Não encontrou car. compras p/ este ID'});
        } 

        return response.json(car);
    },    

    async headerCar(request, response) {
        let id = request.params.carId;
        let status = 1;
        
        //console.log('Pedido de compra:', id);

        const car = await connection('pedidos')
            .where('pedId', id)
            .where('pedStatus', status)
            .join('clientes', 'cliId', 'pedidos.pedCliId')
            .select(['pedidos.*', 'clientes.cliNome'])
            .first();
          
        if (!car) {
            return response.status(400).json({ error: 'Não encontrou car. compras p/ este ID'});
        } 

        console.log(car);
        
        return response.json(car);
    },

    async itemsCar(request, response) {
        let id = request.params.carId;

        const item = await connection('pedItens')
            .where('itePedId', id) 
            .join('produtos', 'prdId', 'pedItens.itePedProId')
            .select(['pedItens.*', 'produtos.prdDescricao', 'produtos.prdReferencia', 'produtos.prdUrlPhoto'])
          
        if (!item) {
            return response.status(400).json({ error: 'Não encontrou itens compras p/ este ID'});
        } 

        //console.log(item);
        
        return response.json(item);
    },

    async adiprocar(request, response) {
        
        const { itePedId, itePedProId} = request.body;
        
        let id = request.body.itePedId;
        let proId = request.body.itePedProId;
        let prcUnit = request.body.itePedVlrUnit;

        //console.log(request.body);

        //console.log('carrinho:',id);
        //console.log('produto:', proId);
        //console.log('preço-U:', prcUnit);

        const car = await connection('pedidos')
            .where('pedId', id)
            .increment('pedQtdTotal')
            .increment({pedVlrTotal: prcUnit} )
            .increment({pedVlrPagar: prcUnit} );
        
        const item = await connection('pedItens')
            .where('itePedId',id)
            .where('itePedProId', proId)
            .increment('itePedQtde')
            .increment({itePedVlrtotal: prcUnit} );

        return response.json(car);
    },
        
    async subprocar(request, response) {
        
        const { itePedId, itePedProId} = request.body;
        
        let id = request.body.itePedId;
        let proId = request.body.itePedProId;
        let prcUnit = request.body.itePedVlrUnit;

        //console.log(request.body);

        //console.log('carrinho:',id);
        //console.log('produto:', proId);
        //console.log('preço-U:', prcUnit);

        const car = await connection('pedidos')
            .where('pedId', id)
            .decrement('pedQtdTotal')
            .decrement({pedVlrTotal: prcUnit} )
            .decrement({pedVlrPagar: prcUnit} );
        
        const item = await connection('pedItens')
            .where('itePedId',id)
            .where('itePedProId', proId)
            .decrement('itePedQtde')
            .decrement({itePedVlrtotal: prcUnit} );

        const product = await connection('pedItens')
            .where('itePedId',id)
            .where('itePedProId', proId)
            .first();
                
        if (product.itePedQtde === 0) {
            await connection('pedItens')
                .where('itePedId',id)
                .where('itePedProId', proId)
                .delete();            
        }    

        return response.json(car);
           
    },
};


/*

//      console.log('Foi encontrado carrinho em aberto!')
            const item = await connection('pedItens')
                .where('itePedId', nroCar)
                .where('itePedProId', itePedProId)
                .increment('itePedQtde')
                .increment({itePedVlrtotal: itePedVlrUnit} );

            if (!item) {
                ultIte += 1 ;
                const [item] = await connection('pedItens').insert({
                    itePedId: nroCar, 
                    itePedItem: ultIte, 
                    itePedProId,
                    itePedQtde,
                    itePedVlrUnit,
                    itePedVlrtotal: iteVlrTotal,
                });
            }
            const cmp = await connection('pedidos')
                .where('pedId', nroCar)
                .increment('pedQtdTotal')
                .increment({pedVlrTotal: itePedVlrUnit} )
                .increment({pedVlrPagar: itePedVlrUnit} );
        } 


*/
