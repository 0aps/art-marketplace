import {RecordNotFound} from 'art-marketplace-common';
import { Certificate } from './models.js';
import { StatusCodes } from 'http-status-codes';
import pdfCreation from './pdfCreation.js';
import moment from 'moment';
import fs from 'fs';
import ArtworksResource from './artworksResource.js';

function jsonParserName (stringValue) {
  const string = JSON.stringify(stringValue);
  const objectValue = JSON.parse(string);
  return objectValue.name;
}

function jsonParserID (stringValue) {
  const string = JSON.stringify(stringValue);
  const objectValue = JSON.parse(string);
  return objectValue.id;
}

export default [{
  url: '/certificates',
  roles: {
    post: ['admin', 'artist']
  },
  methods: {
    post: async (req, res) => {
      const artworkId = req.body.id;
      ArtworksResource.getArtworkById(artworkId).then(async (body) => {
        const data = JSON.parse(body);
        const artName = jsonParserName(data);
        pdfCreation.createPDF(artName, data);

        const artID = jsonParserID(data);

        const certificate = new Certificate({
          artName: artName,
          artID: artID,
          certificatePath: './src/documents/' + artName + '.pdf',
          creationDate: moment()
        });

        await certificate.save();
        res.status(StatusCodes.CREATED).json(certificate.toClient());
      }).catch((error) => {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      });
    }
  },
  children: {
    item: {
      url: '/:artworkId',
      access: {
        get: 'public'
      },
      roles: {
        put: ['admin', 'artist'],
        delete: ['admin']
      },
      methods: {
        get: async (req, res) => {
          const artworkId = req.params.artworkId;
          Certificate.findOne({ artID: artworkId }, (err, data) => {
            if (err) {
              res.sendStatus(StatusCodes.BAD_REQUEST);
            } else {
              if (!data) {
                return next(new RecordNotFound());
              }
              const rs = fs.createReadStream('./' + data.certificatePath);
              res.sendStatus(StatusCodes.OK);
              res.setHeader('Content-Disposition', 'attachment; ' + data.artName + '.pdf');
              rs.pipe(res);
            }
          });
        },
        put: async (req, res) => {
          const artworkId = req.params.artworkId;
          ArtworksResource.getArtworkById(artworkId).then(async (body) => {
            const data = JSON.parse(body);
            const artName = jsonParserName(data);
            pdfCreation.createPDF(artName, data);
    
            Certificate.updateOne({ artID: artworkId }, { artName: artName, certificatePath: './src/documents/' + artName + '.pdf' }, (err) => {
              if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
              } else {
                res.sendStatus(StatusCodes.OK);
              }
            });
          }).catch((error) => {
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          });
        },
        delete: async (req, res) => {
          try {
            const record = await Certificate.findById(req.params.artworkId);

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
