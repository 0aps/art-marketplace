import { Order } from '../models/models.js';
import { StatusCodes } from 'http-status-codes';


/**
 * Método GET:
 * este metodo devuelve un listado de todas las ordenes 
 */
export  async function list_all_order (req, res)  {
  const records = await Order.find({});
  res.json(records);
};

/**
 * Crear la orden 
 */
export  async function create_a_order (payment)  {
  
    var new_order = new Order(req.body);

    if(new_order.items.length === 0){
      res.sendStatus(StatusCodes.BAD_REQUEST);
    } else {
      await new_order.save();
      res.sendStatus(StatusCodes.OK);
    }
   
};


/**
 * Método GET:
 * Buscar por el atributo id 
 */
  export  async function read_a_order(req, res)  {
    const record = await Order.findById(req.params.orderId)
    res.json(record);
  };


/**
 * Método PUT:
 * Modificar una orden 
 */
export async function update_a_order (req, res)  {
    await Order.findOneAndUpdate(
        {_id:req.params.orderId},
        req.body,
    );
    res.sendStatus(StatusCodes.OK);
}


/**
 * Método DELETE:
 * Eliminar una orden 
 */
export async function delete_a_order (req, res) {
    await Order.remove(
        {
        _id: req.params.orderId,
        }
    );
    res.sendStatus(StatusCodes.OK);
}

