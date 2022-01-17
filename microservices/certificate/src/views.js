import {RecordNotFound} from 'art-marketplace-common';
import { Certificate } from './models.js';
import { StatusCodes } from 'http-status-codes';
import pdfCreation from './pdfCreation.js';
import moment from 'moment';
import fs from 'fs';

export default [{
  url: '/certificates',
  access: {
    get: 'public'
  },
  roles: {
    post: ['admin', 'artist']
  },
  methods: {
    post: async (req, res) => {
      const data = req.body;
      if (!(data.artName && data.artDescription && data.artCreationDate && data.categoryName && data.username)) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
      }

      pdfCreation.createPDF(data);

      try {
        const certificate = new Certificate({
          artName: data.artName,
          artDescription: data.artDescription,
          artCreationDate: data.artCreationDate,
          categoryName: data.categoryName,
          username: data.username,
          certificatePath: './src/documents/' + artName + '.pdf',
          createdAt: moment()
        });

        await certificate.save();

        res.status(StatusCodes.CREATED).json(certificate.toClient());
      } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
      }
    },
    get: async (req, res) => {
      const records = await Certificate.find({});
      res.sendStatus(StatusCodes.OK);
      res.json(records.map(record => record.toClient()));
    }
  },
  children: {
    item: {
      url: '/:certificateId',
      access: {
        get: 'public'
      },
      roles: {
        put: ['admin', 'artist'],
        delete: ['admin']
      },
      methods: {
        get: async (req, res) => {
          try {
            const record = await Certificate.findById(req.params.certificateId);

            if (!record) {
              return next(new RecordNotFound());
            }

            const rs = fs.createReadStream('./' + record.certificatePath);
            res.sendStatus(StatusCodes.OK);
            res.json(record.toClient());
            res.setHeader('Content-Disposition', 'attachment; ' + record.artName + '.pdf');
            rs.pipe(res);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
          }
        },
        put: async (req, res) => {
          const data = req.body;
          const certificateID = req.params.certificateID;

          if (!(data.artName && data.artDescription && data.artCreationDate && data.categoryName && data.username)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
          }

          const record = await Certificate.findById(certificateId);
          if (!record) {
            return next(new RecordNotFound());
          }

          pdfCreation.createPDF(data);

          record.artName = data.artName,
          record.artDescription = data.artDescription,
          record.artCreationDate = data.artCreationDate,
          record.categoryName = data.categoryName,
          record.username = data.username,

          await record.save();

          res.json(record.toClient());
        },
        delete: async (req, res) => {
          try {
            const record = await Certificate.findById(req.params.certificateId);

            if (!record) {
              return next(new RecordNotFound());
            }

            fs.unlink(record.certificatePath, function (err) {
              if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
              } else {
                await record.remove();
                res.sendStatus(StatusCodes.NO_CONTENT);
              }
            });
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
          }
        }
      }
    }
  }
}];
