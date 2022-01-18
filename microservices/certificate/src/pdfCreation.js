import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import hbs from 'handlebars';
import path from 'path';

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), '/src/templates', `${templateName}.hbs`);
  if (!filePath) {
    throw new Error('Could not find template');
  }
  const html = await fs.readFile(filePath, 'utf-8');
  return hbs.compile(html)(data);
};

class pdfCreation {
  static async createPDF (data) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox','--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    const options = {
      path: './src/documents/' + data.artName + '.pdf',
      format: 'A4',
      printBackground: true
    };

    const unixTime = data.artCreationDate;
    const date = new Date(unixTime * 1000);
    data.artCreationDate = date.toLocaleDateString('en-GB');

    const content = await compile('certificate', data);

    await page.setContent(content);
    await page.emulateMediaType('screen');
    await page.pdf(options);
    
    await page.close();
    await browser.close();
  }
}

export default pdfCreation;
