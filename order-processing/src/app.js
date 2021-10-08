'use strict';
const _services = require('../../lib/services');

const AppInit = async (input) => {
    const data = input

    // console.log(data)
    // console.log(data.resource)
    // console.log(data.resource.typeId)

    if (data.resource.typeId === "order") {
        const orderId = data.resource.id        
        console.log('Fetching orderId: ' + orderId)

        const ordersUri = _services.requestBuilder.orders.byId(orderId).build()
        const orderRequest = {
            uri: ordersUri,
            method: 'GET'
        }
        
        //load order to process further
        _services.client.execute(orderRequest).then(res => {
            const order = res.body;                        
            
            if (order.returnInfo && order.returnInfo.length > 0) {                
                
                const totalNumberOfReturns = order.returnInfo.length;

                order.returnInfo.forEach(returnInfo => {
                    if (returnInfo.items && returnInfo.items.length >0) {                        
                        returnInfo.items.forEach(item => {                            
                            
                            // lineItem should contain more product data
                            let lineItem = order.lineItems.find(li => li.id === item.lineItemId );

                            if (!lineItem) {
                                lineItem = order.customLineItems.find(li => li.id === item.customLineItemId );
                            }
                                                        
                            // Some additional info
                            const returnReason = item.comment;
                            
                            // TODO: Finalize processing code
                            // Like send to bigquery etc                            
                        })
                    }
                })
            } else {
                // No returns, so skip
            }            
        }).catch(err => console.log(err))
    }
}

module.exports = {
    AppInit
}
