import { User } from './models.js';
import { StatusCodes } from 'http-status-codes';

export default [{
  url: '/users',
  methods: {
    get: async (req, res) => {
      const records = await User.find({});
      res.json(records);
    },
    post: async (req, res) => {
      const artwork = new User({
        name: req.body.name
      });

      await artwork.save();
      res.sendStatus(StatusCodes.OK);
    }
  },
  children: {
    item: {
      url: '/:userId',
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
