import { Order } from "../models/models.js";
import { StatusCodes } from "http-status-codes";

/**
 * Método GET:
 * este metodo devuelve un listado de todas las ordenes
 */
export async function listAllOrder(req, res) {
  const records = await Order.find({});
  res.json(records);
}

/**
 * Crear la orden
 */
export async function createAnOrder(payment) {
  var new_order = new Order({
    id_user: "1234578",
    items: [
      {
        id_artwork: 5341,
        name: "Mona lisa",
        precio: 455.54,
      },
    ],
  });

  if (new_order.items.length === 0) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  } else {
    await new_order.save();
    res.sendStatus(StatusCodes.OK);
  }
}

/**
 * Método GET:
 * Buscar por el atributo id
 */
export async function readAnOrder(req, res) {
  const record = await Order.findById(req.params.orderId);
  res.json(record);
}

/**
 * Método PUT:
 * Modificar una orden
 */
export async function updateAnOrder(req, res) {
  await Order.findOneAndUpdate({ _id: req.params.orderId }, req.body);
  res.sendStatus(StatusCodes.OK);
}

/**
 * Método DELETE:
 * Eliminar una orden
 */
export async function deleteAnOrder(req, res) {
  await Order.remove({
    _id: req.params.orderId,
  });
  res.sendStatus(StatusCodes.OK);
}
