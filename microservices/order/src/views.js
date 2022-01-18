import { listAllOrder, readAnOrder } from "./controller/order_controller.js";
import { InvalidRequest, RecordNotFound } from "art-marketplace-common";
import { StatusCodes } from "http-status-codes";
import { Cart } from "./models.js";

export default [
  {
    url: "/cart",
    methods: {
      /**
       * @swagger
       * /cart:
       *   get:
       *     description: Get the active cart by the current user
       *     responses:
       *       200:
       *         description: An array with the list of users
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Cart'
       */
      get: async (req, res) => {
        const user = req.app.locals.user;

        try {
          let cart = await Cart.findOne({ user: user.id, state: "active" });
          if (!cart) {
            cart = new Cart({
              user: user.id,
              items: [],
            });
            await cart.save();
          }

          res.status(StatusCodes.OK).json(cart.toClient());
        } catch (e) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
        }
      },
    },
    children: {
      item: {
        url: "/:cartId",
        methods: {
          /**
           * @swagger
           * /cart/{cartId}:
           *   put:
           *     description: Update a particular cart
           *     parameters:
           *       - name: cartId
           *         type: string
           *         in: path
           *         required: true
           *     requestBody:
           *       required: true
           *       content:
           *         application/json:
           *           schema:
           *             $ref: '#/components/schemas/UserPayload'
           *     responses:
           *       200:
           */
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
                    "Debes espeficiar una obra para agregar al carrito."
                  )
                );
              }

              cart.items.push(item);
              await cart.save();

              res.sendStatus(StatusCodes.OK);
            } catch (e) {
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
            }
          },
        },
        children: {
          item: {
            url: "/:artworkId",
            methods: {
              /**
               * @swagger
               * /cart/{cartId}/{artworkId}:
               *   delete:
               *     description: Delete a particular artwork from a particular cart
               *     parameters:
               *       - name: artworkId
               *         type: string
               *         in: path
               *         required: true
               *       - name: cartId
               *         type: string
               *         in: path
               *         required: true
               *     responses:
               *       204:
               *         description: User was deleted successfully
               */
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
                    new InvalidRequest("La obra no está en el carrito.")
                  );
                }

                cart.items = cart.items.filter(
                  ($item) => $item.id !== artworkId
                );
                await cart.save();

                res.sendStatus(StatusCodes.NO_CONTENT);
              },
            },
          },
        },
      },
    },
  },
  {
    url: "/orders",
    methods: {
      /**
       * @swagger
       * /orders:
       *   get:
       *     description: Get the list of all orders
       *     responses:
       *       200:
       *         description: An array with the list of orders
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/OrderList'
       */
      get: listAllOrder,
    },
    children: {
      item: {
        url: "/:orderId",
        methods: {
          /**
           * @swagger
           * /orders/{orderId}:
           *   get:
           *     description: Get the a specific order
           *     parameters:
           *       - name: orderId
           *         type: string
           *         in: path
           *         required: true
           *     responses:
           *       200:
           *         description: An Order
           *         content:
           *           application/json:
           *             schema:
           *               $ref: '#/components/schemas/Order'
           */
          get: readAnOrder,
        },
      },
    },
  },
];
