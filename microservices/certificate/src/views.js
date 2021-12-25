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
  access: {
    post: 'public',
    put: 'public'
  },
  roles: {
    post: ['admin', 'artist'],
    put: ['admin', 'artist']
  },
  methods: {
    post: async (req, res) => {
      const artworkId = req.body.id;
      ArtworksResource.getArtworkById(artworkId).then(async (body) => {
        console.log(body);
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
        res.sendStatus(StatusCodes.CREATED);
      }).catch((error) => {
        console.log('error: ' + error);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      });
    },
    put: async (req, res) => {
      const artworkId = req.body.id;
      ArtworksResource.getArtworkById(artworkId).then(async (body) => {
        console.log(body);
        const data = JSON.parse(body);
        const artName = jsonParserName(data);
        pdfCreation.createPDF(artName, data);

        Certificate.updateOne({ artID: artworkId }, { artName: artName, certificatePath: './src/documents/' + artName + '.pdf' }, (err) => {
          if (err) {
            console.log(Date() + ' - ' + err);
            res.sendStatus(500);
          } else {
            res.sendStatus(StatusCodes.OK);
          }
        });
      }).catch((error) => {
        console.log('error: ' + error);
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
      methods: {
        get: async (req, res) => {
          const artworkId = req.params.artworkId;
          Certificate.findOne({ artID: artworkId }, (err, data) => {
            if (err) {
              console.log(Date() + '-' + err);
              res.sendStatus(400);
            } else {
              console.log(data);

              if (!data) {
                res.sendStatus(StatusCodes.NOT_FOUND);
              }
              const rs = fs.createReadStream('./' + data.certificatePath);

              res.setHeader('Content-Disposition', 'attachment; ' + data.artName + '.pdf');

              rs.pipe(res);
            }
          });
        }
      }
    }
  }
}];
