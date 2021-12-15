import { Order } from '../models/models.js';
import { StatusCodes } from 'http-status-codes';

//get
export  async function list_all_order (req, res)  {
    const records = await Order.find({});
    res.json(records);
  };

  //post
export  async function create_a_order (req, res)  {
    var new_order = new Order(req.body);
    await new_order.save();
    res.sendStatus(StatusCodes.OK);
};

//get por el atributo id
  export  async function read_a_order(req, res)  {
    const record = await Order.findById(req.params.orderId)
    res.json(record);
  };

//put
export async function update_a_order (req, res)  {
    await Order.findOneAndUpdate(
        {_id:req.params.orderId},
        req.body,
    );
    res.sendStatus(StatusCodes.OK);
}

//delete
export async function delete_a_order (req, res) {
    await Order.remove(
        {
        _id: req.params.orderId,
        }
    );
    res.sendStatus(StatusCodes.OK);
}

