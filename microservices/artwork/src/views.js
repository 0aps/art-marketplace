import { Artwork } from './models.js';
import { StatusCodes } from 'http-status-codes';

export default [{
  url: '/artworks',
  methods: {
    get: async (req, res) => {
      const records = await Artwork.find({});
      res.json(records);
    },
    post: async (req, res) => {
      const artwork = new Artwork({
        name: req.body.name
      });

      await artwork.save();
      res.sendStatus(StatusCodes.OK);
    }
  },
  children: {
    item: {
      url: '/:artworkId',
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
