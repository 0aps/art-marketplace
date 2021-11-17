import { Payment } from './models.js';
import { StatusCodes } from 'http-status-codes';

export default [{
  url: '/payments',
  methods: {
    get: async (req, res) => {
      const records = await Payment.find({});
      res.json(records);
    },
    post: async (req, res) => {
      const artwork = new Payment({
        name: req.body.name
      });

      await artwork.save();
      res.sendStatus(StatusCodes.OK);
    }
  },
  children: {
    item: {
      url: '/:paymentId',
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
