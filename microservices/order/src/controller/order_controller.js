import moment from 'moment';
import { Cart, Order } from '../models.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Método GET:
 * este metodo devuelve un listado de todas las ordenes
 */
export async function listAllOrder (req, res) {
  const user = req.app.locals.user;

  const records = await Order.find({ user: user.id }).populate('user cart');
  res.json(records.map(record => record.toClient()));
}

/**
 * Crear la orden
 */
export async function createAnOrder (payment) {
  const order = new Order({
    user: payment.userId,
    cart: payment.cartId,
    total: payment.amount,
    createdAt: moment().unix()
  });

  await order.save();
  await Cart.findByIdAndUpdate(payment.cartId, { state: 'inactive' });

  return order;
}

/**
 * Método GET:
 * Buscar por el atributo id
 */
export async function readAnOrder (req, res) {
  const record = await Order.findById(req.params.orderId).populate('cart');
  res.json(record);
}

/**
 * Método PUT:
 * Modificar una orden
 */
export async function updateAnOrder (req, res) {
  await Order.findOneAndUpdate({ _id: req.params.orderId }, req.body);
  res.sendStatus(StatusCodes.OK);
}

/**
 * Método DELETE:
 * Eliminar una orden
 */
export async function deleteAnOrder (req, res) {
  await Order.remove({
    _id: req.params.orderId
  });
  res.sendStatus(StatusCodes.OK);
}
