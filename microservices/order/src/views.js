import {
  listAllOrder,
  readAnOrder,
  updateAnOrder,
  deleteAnOrder
} from './controller/order_controller.js';
import { InvalidRequest, RecordNotFound } from 'art-marketplace-common';
import { StatusCodes } from 'http-status-codes';
import { Cart } from './models/models.js';

export default [
  {
    url: '/cart',
    methods: {
      get: async (req, res) => {
        const user = req.app.locals.user;

        try {
          let cart = await Cart.findOne({ user: user.id, state: 'active' });
          if (!cart) {
            cart = new Cart({
              user: user.id,
              items: []
            });
            await cart.save();
          }

          res.status(StatusCodes.OK).json(cart.toClient());
        } catch (e) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
        }
      }
    },
    children: {
      item: {
        url: '/:cartId',
        methods: {
          patch: async (req, res, next) => {
            const cartId = req.params.cartId;
            const { item } = req.body;

            try {
              const cart = await Cart.findById(cartId);
              if (!cart) {
                return next(new RecordNotFound());
              }
              if (!item) {
                return next(
                  new InvalidRequest(
                    'Debes espeficiar una obra para agregar al carrito.'
                  )
                );
              }

              cart.items.push(item);
              await cart.save();

              res.sendStatus(StatusCodes.OK);
            } catch (e) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
            }
          }
        },
        children: {
          item: {
            url: '/:artworkId',
            methods: {
              delete: async (req, res, next) => {
                const cartId = req.params.cartId;
                const artworkId = req.params.artworkId;

                const cart = await Cart.findById(cartId);
                if (!cart) {
                  return next(new RecordNotFound());
                }

                const hasItem = await Cart.hasItem(artworkId);
                if (!hasItem) {
                  return next(
                    new InvalidRequest('La obra no está en el carrito.')
                  );
                }

                cart.items = cart.items.filter(
                  ($item) => $item.id !== artworkId
                );
                await cart.save();

                res.sendStatus(StatusCodes.NO_CONTENT);
              }
            }
          }
        }
      },
      orders: {
        url: '/orders',
        methods: {
          get: listAllOrder
        },
        children: {
          item: {
            url: '/:orderId',
            methods: {
              get: readAnOrder,
            }
          }
        }
      }
    }
  }
];
