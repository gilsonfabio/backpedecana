const { Console } = require('console');
const connection = require('../database/connection');

module.exports = {   
    async index (request, response) {
        const pedidos = await connection('pedidos').select('*');
         
        return response.json(pedidos);
    },
    
    async carcompras(request, response) {
        
        console.log(request.body);
        const { pedData, pedCliId, pedQtdTotal, pedVlrTotal, pedCupom, pedVlrPagar, pedEndEntrega,
             pedVlrTaxEntrega, pedFrmPagto, itePedProId, itePedQtde, itePedVlrUnit} = request.body;
        let id = request.body.pedCliId;
        let status = 'A';
        let iteVlrTotal = itePedQtde * itePedVlrUnit;
        let iteNro = 1;
        const car = await connection('pedidos')
            .where('pedCliId', id)
            .where('pedStatus', status)
            .select('*')
            .first();
        
        let nroCar = car.pedId;
        let ultIte = car.pedQtdTotal;

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
            });

            //console.log('criado o carrinho n.: ', pedId )

            const [item] = await connection('pedItens').insert({
                itePedId: pedId, 
                itePedIte: iteNro, 
                itePedProId,
                itePedQtde,
                itePedVlrUnit,
                itePedVlrtotal: iteVlrTotal,
            });
        }else {
            //console.log('Foi encontrado carrinho em aberto!')
            const item = await connection('carItems')
                .where('iteCarId', nroCar)
                .where('iteCarProId', iteCarProId)
                .increment('iteCarProQtde')
                .increment({iteCarProVlrtotal: iteCarProVlrUnit} );

            if (!item) {
                ultIte += 1 ;
                const [item] = await connection('carItems').insert({
                    iteCarId: nroCar, 
                    iteCarIte: ultIte, 
                    iteCarProId,
                    iteCarProQtde,
                    iteCarProVlrUnit,
                    iteCarProVlrtotal: iteVlrTotal,
                });
            }
            const cmp = await connection('carcompras')
                .where('carId', nroCar)
                .increment('carQtdTotal')
                .increment({carVlrTotal: iteCarProVlrUnit} )
                .increment({carVlrPagar: iteCarProVlrUnit} );
        } 

        return response.json(car);
    },
       
    async searchCar(request, response) {
        let id = request.params.idUsrCar;
        let status = 'A';

        const car = await connection('carcompras')
            .where('pedCliId', id)
            .where('pedStatus', status)
            .select('pedId', 'pedQtdtotal')
            .first();
          
        if (!car) {
            return response.status(400).json({ error: 'Não encontrou car. compras p/ este ID'});
        } 

        console.log(car);
        
        return response.json(car);
    },    

    async headerCar(request, response) {
        let id = request.params.carId;
        let status = 'A';

        const car = await connection('carcompras')
            .where('carId', id)
            .where('carStatus', status)
            .join('usrMovies', 'usrId', 'carcompras.carUser')
            .select(['carcompras.*', 'usrMovies.usrNome'])
            .first();
          
        if (!car) {
            return response.status(400).json({ error: 'Não encontrou car. compras p/ este ID'});
        } 

        console.log(car);
        
        return response.json(car);
    },

    async itemsCar(request, response) {
        let id = request.params.carId;
        let status = 'A';

        const item = await connection('carItems')
            .where('iteCarId', id) 
            .join('produtos', 'idProd', 'carItems.iteCarProId')
            .select(['carItems.*', 'produtos.proDescricao', 'produtos.proReferencia', 'produtos.proAvatar'])
          
        if (!item) {
            return response.status(400).json({ error: 'Não encontrou itens compras p/ este ID'});
        } 

        console.log(item);
        
        return response.json(item);
    },

    async adiprocar(request, response) {
        
        const { iteCarId, iteCarProId} = request.body;
        
        let id = request.body.iteCarId;
        let proId = request.body.iteCarProId;
        let prcUnit = request.body.iteCarProVlrUnit;

        //console.log(request.body);

        //console.log('carrinho:',id);
        //console.log('produto:', proId);
        //console.log('preço-U:', prcUnit);

        const car = await connection('carcompras')
            .where('carId', id)
            .increment('carQtdTotal')
            .increment({carVlrTotal: prcUnit} )
            .increment({carVlrPagar: prcUnit} );
        
        const item = await connection('carItems')
            .where('iteCarId',id)
            .where('iteCarProId', proId)
            .increment('iteCarProQtde')
            .increment({iteCarProVlrtotal: prcUnit} );

        return response.json(car);
    },
        
    async subprocar(request, response) {
        
        const { iteCarId, iteCarProId} = request.body;
        
        let id = request.body.iteCarId;
        let proId = request.body.iteCarProId;
        let prcUnit = request.body.iteCarProVlrUnit;

        //console.log(request.body);

        //console.log('carrinho:',id);
        //console.log('produto:', proId);
        //console.log('preço-U:', prcUnit);

        const car = await connection('carcompras')
            .where('carId', id)
            .decrement('carQtdTotal')
            .decrement({carVlrTotal: prcUnit} )
            .decrement({carVlrPagar: prcUnit} );
        
        const item = await connection('carItems')
            .where('iteCarId',id)
            .where('iteCarProId', proId)
            .decrement('iteCarProQtde')
            .decrement({iteCarProVlrtotal: prcUnit} );

        return response.json(car);
    },
};
