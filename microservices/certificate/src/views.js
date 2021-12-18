import { Certificate } from './models.js';
import { StatusCodes } from 'http-status-codes';

export default [{
  url: '/certificates',
  access: 'public',
  methods: {
    get: async (req, res) => {
      const records = await Certificate.find({});
      res.json(records);
    },
    post: async (req, res) => {
      const artwork = new Certificate({
        name: req.body.name
      });

      await artwork.save();
      res.sendStatus(StatusCodes.OK);
    }
  },
  children: {
    item: {
      url: '/:certificateId',
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
