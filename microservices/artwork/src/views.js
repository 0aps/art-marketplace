import { RecordNotFound } from 'art-marketplace-common';
import { Artwork, Category } from './models.js';
import { StatusCodes } from 'http-status-codes';
import Constants from './constants.js';
import s3 from './s3.js';
import moment from 'moment';

export default [{
  url: '/artworks',
  access: {
    get: 'public'
  },
  roles: {
    post: ['admin', 'artist']
  },
  methods: {
    get: async (req, res) => {
      let { perPage, page, sort, ...query } = req.query;
      const [field, sortType] = sort ? sort.split(',') : Constants.defaultSort;
      perPage = perPage ? parseInt(perPage) : Constants.defaultPerPage;
      page = Math.max(0, page ?? 0);

      try {
        const records = await Artwork.find(query).populate('user category').skip(perPage * page).limit(perPage).sort({ [field]: sortType }).exec();
        const count = await Artwork.countDocuments();
        res.json({
          records: records.map(record => record.toClient()),
          page: page,
          pages: count / perPage
        });
      } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
      }
    },
    post: async (req, res) => {
      const payload = req.body;
      const pictures = [];
      try {
        const fileFields = Object.keys(req.files);
        for (let i = 0; i < fileFields.length; ++i) {
          const key = fileFields[i];
          const file = req.files[key];
          const data = await s3.upload({
            Bucket: Constants.defaultBucket,
            Key: file.name,
            ContentType: file.mimetype,
            Body: file.data
          }).promise();
          pictures.push({ name: file.name, path: data.Location, createdAt: moment().unix() });
        }

        const artwork = new Artwork({
          name: payload.name,
          description: payload.description,
          user: payload.user,
          price: payload.price,
          category: payload.category,
          createdAt: moment().unix(),
          pictures: pictures
        });

        await artwork.save();
        res.status(StatusCodes.OK).json(artwork.toClient());
      } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
      }
    }
  },
  children: {
    category: {
      url: '/category',
      roles: {
        get: ['admin', 'artist'],
        post: ['admin', 'artist']
      },
      methods: {
        get: async (req, res) => {
          try {
            const records = await Category.find({});
            res.status(StatusCodes.OK).json(records.map(record => record.toClient()));
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
          }
        },
        post: async (req, res) => {
          const payload = req.body;
          try {
            const category = new Category({
              name: payload.name,
              description: payload.description,
              createdAt: moment().unix()
            });

            await category.save();
            res.status(StatusCodes.OK).json(category.toClient());
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
          }
        }
      }
    },
    item: {
      url: '/:artworkId',
      access: {
        get: 'public'
      },
      methods: {
        get: async (req, res, next) => {
          try {
            const record = await Artwork.findById(req.params.artworkId).populate('user category');

            if (!record) {
              return next(new RecordNotFound());
            }

            res.json(record.toClient());
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
          }
        },
        delete: async (req, res, next) => {
          try {
            const record = await Artwork.findById(req.params.artworkId);

            if (!record) {
              return next(new RecordNotFound());
            }

            await record.remove();

            res.sendStatus(StatusCodes.NO_CONTENT);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
          }
        }
      }
    }
  }
}];
