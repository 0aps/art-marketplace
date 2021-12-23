import { Certificate } from './models.js';
import { StatusCodes } from 'http-status-codes';
import pdfCreation from './pdfCreation.js';
import fs from 'fs';

function jsonParserName (stringValue) {
  const string = JSON.stringify(stringValue);
  const objectValue = JSON.parse(string);
  return objectValue.name;
}

function jsonParserID (stringValue) {
  const string = JSON.stringify(stringValue);
  const objectValue = JSON.parse(string);
  return objectValue._id;
}

export default [{
  url: '/certificates',
  access: 'public',
  methods: {
    get: async (req, res) => {
      Certificate.findOne({ artID: req.body.id }, (err, data) => {
        if (err) {
          console.log(Date() + '-' + err);
          res.sendStatus(400);
        } else {
          const rs = fs.createReadStream('./' + data.certificatePath);

          res.setHeader('Content-Disposition', 'attachment; ' + data.artName + '.pdf');

          rs.pipe(res);
        }
      });
    },
    post: async (req, res) => {
      // The query has to be changed to the artwork one
      Certificate.findOne({ name: req.body.name }).lean().exec(async (err, data) => {
        if (err) {
          console.log(Date() + '-' + err);
          res.sendStatus(400);
        } else {
          console.log(data);
          const artName = jsonParserName(data);
          pdfCreation.createPDF(artName, data);

          const artID = jsonParserID(data);

          try {
            const certificate = new Certificate({
              artName: artName,
              artID: artID,
              certificatePath: 'documents/' + artName + '.pdf',
              creationDate: new Date()
            });

            await certificate.save();
            res.sendStatus(StatusCodes.CREATED);
          } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
          }
  
        }
      });
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
