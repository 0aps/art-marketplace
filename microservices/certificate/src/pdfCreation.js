import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import hbs from 'handlebars';
import path from 'path';

let certificateNumber = 1;

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), '/src/templates', `${templateName}.hbs`);
  if (!filePath) {
    throw new Error('Could not find template');
  }
  const html = await fs.readFile(filePath, 'utf-8');
  return hbs.compile(html)(data);
};

class pdfCreation {
  static async createPDF (artName, data) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const options = {
      path: './src/documents/' + artName + '.pdf',
      format: 'A4',
      printBackground: true
    };

    const newData = data;

    const unixTime = newData.createdAt;
    const date = new Date(unixTime * 1000);
    console.log(date.toLocaleDateString('en-GB'));

    newData.createdAt = date.toLocaleDateString('en-GB');
    newData.certificateNumber = certificateNumber;

    const content = await compile('certificate', newData);

    await page.setContent(content);
    await page.emulateMediaType('screen');
    await page.pdf(options);

    await browser.close();

    certificateNumber++;
  }
}

export default pdfCreation;
