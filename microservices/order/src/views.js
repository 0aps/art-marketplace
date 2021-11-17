import { Order } from './models.js';
import { StatusCodes } from 'http-status-codes';

export default [{
  url: '/orders',
  methods: {
    get: async (req, res) => {
      const records = await Order.find({});
      res.json(records);
    },
    post: async (req, res) => {
      const artwork = new Order({
        name: req.body.name
      });

      await artwork.save();
      res.sendStatus(StatusCodes.OK);
    }
  },
  children: {
    item: {
      url: '/:orderId',
      methods: {
        get: (req, res, next) => {
          res.json({
            test: 'mychild'
          });
        }
      }
    }
  }
}];
