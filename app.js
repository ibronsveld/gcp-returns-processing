const commander = require('commander')
const program = new commander.Command()
const fs = require('fs')
const _services = require('./lib/services')

program.version('0.0.1')

program
  .command('orders')
  .argument('<templateOrderFileName>', 'JSON file to use as the template order')
  .argument('[quantity]', 'number of orders to import', 5)
  .description('Adds a number of test orders using the supplied template file')
  .action((templateOrderFileName, quantity) => {
    console.log('Create %d new orders using template %s', quantity, templateOrderFileName)

    try {

      // Load the file
      fs.readFile(templateOrderFileName, 'utf-8', (err, f) => {
        if (err) {
          console.error("Error loading file", err)
        }

        const templateOrder = JSON.parse(f);
        // TODO: Set additional values
        // For example, add more products, do dynamic order numbers etc

        // Do Import
        startImportProcess(templateOrder, quantity).then((ids) => {
          console.log('Import completed ', ids)
        })
      })

    } catch (error) {
      console.error('Error executing order import', error)
    }
  })

program
  .command('return')
  .argument('<orderId>', 'The id of the order to add the return to') 
  .argument('<comment>', 'The value for the comment field of the return') 
  .option('-l --lineItemId [lineItemId]', 'The id of the line item to add the return to. Uses first line item or custom line item if not specified')
  .description('Adds a return to the specified order')
  .action((orderId, comment) => {

    const options = program.opts()

    let lineItemId = options.lineItemId ? options.lineItemId : undefined
    console.log('Add return to order %s', orderId)

    getOrder(orderId).then((order) => {        
      let isCustom = false
      // Process the order here      
      if (!lineItemId) {
        if (order.lineItems && order.lineItems[0]) {
          lineItemId = order.lineItems[0].id
        } else {
          lineItemId = order.customLineItems[0].id
          isCustom = true
        }
      } 
              
      let lineItem = order.lineItems.find(li => li.id === lineItemId );

      if (!lineItem) {
        lineItem = order.customLineItems.find(li => li.id = lineItemId)
        isCustom = true
      }

      let items = [
        {
          "quantity": lineItem.quantity,
          "lineItemId": lineItem.id,
          "customLineItemId": lineItem.id,
          "comment": comment,
          "shipmentState": 'Advised'
        }
      ]

      if (isCustom) {
        delete items[0].lineItemId
      } else {
        delete items[0].customLineItemId
      }

      console.log('Adding to line item %s', lineItemId)
      
      addReturnInfo(order, items).then((updatedOrder) => {
          // Do magic
          console.log("Done")
      })
    })
  })


const startImportProcess = async (order, quantity) => {
  let counter = 0;
  let orderIds = [];

  // Create the request URL
  const ordersUri = _services.requestBuilder.orderImport.build()

  // Do work
  while (counter < quantity) {
    let orderId = await doImport(order, counter, ordersUri);
    orderIds.push(orderId);
    counter++;
  }

  return orderIds;
}

// Does the actual import
const doImport = async (order, idx, ordersUri) => {
  const orderRequest = {
    uri: ordersUri,
    method: 'POST',
    body: order
  }

  return _services.client.execute(orderRequest).then(res => {
    if (res && res.body) {
      const newOrder = res.body
      return newOrder.id
    }
  })
}


const getOrder = async (orderId) => {
  const ordersUri = _services.requestBuilder.orders.byId(orderId).build()

  const orderRequest = {
    uri: ordersUri,
    method: 'GET'
  }

  return _services.client.execute(orderRequest).then(res => {
    return res.body
  })
}

const addReturnInfo = async (order, items, returnTrackingId='optional') => {

  //
  const date = new Date()

  const updateActions = {
    "version": order.version,
    "actions": [
      {
        "action": "addReturnInfo",      
        "items": items,
        "returnTrackingId": returnTrackingId,
        "returnDate": date.toISOString()
      }
    ]
  }

  const ordersUri = _services.requestBuilder.orders.byId(order.id).build()

  const orderRequest = {
    uri: ordersUri,
    method: 'POST',
    body: updateActions
  }

  return _services.client.execute(orderRequest).then(res => {
    if (res && res.body) {
      const newOrder = res.body
      return newOrder
    }
  })

}


program.parse(process.argv);