const PDFDocument = require('pdfkit');
const { Base64Encode } = require('base64-stream');
const fs = require('fs');

const label = function (res, shipments) {
  var doc = new PDFDocument();
  
  // doc.pipe(fs.createWriteStream('output.pdf'));
  generatePDF(doc, shipments);

  // doc.end();
    
  var finalString = ''; // contains the base64 string
  var stream = doc.pipe(new Base64Encode());
  
  doc.end(); // will trigger the stream to end
  
  stream.on('data', function(chunk) {
      finalString += chunk;
  });
  
  stream.on('end', function() {
      // the stream is at its end, so push the resulting base64 string to the response
      // res.set('Content-Type', "application/octet-stream");
      // res.set('Content-Disposition', "attachment");
      // res.write(finalString, 'base64');
      res.json(finalString);
  });
}

function generatePDF(doc, shipments) {
    for(let shipment of shipments) {
      generatePDFPage(doc, shipment);
      doc.addPage();
    }
}

function generatePDFPage(doc, shipment) {
  doc.rect(16, 16, 250, 450).fillAndStroke('#fff', '#000');
  doc.fill('#000').stroke();
  doc.fontSize(16);
  doc.text(`Tracking No.: ${shipment.tracking_number}`, 32, 32, {lineBreak: false} );
  const path = '../images/barcode.jpg';
  doc.image(path, 32, 50, {fit: [300, 100]})
  doc.fontSize(12);

  doc.text(`Shipped From:\n${shipment.ship_from.country}, ${shipment.ship_from.city}\n${shipment.ship_from.address1}\n${shipment.ship_from.address2 | ''}\n${shipment.ship_from.postal_code}`, 32, 186 );

  doc.text("Shipped To:\nSA, Riyadh\nBarchal\nSaoud\n23335", 32, 12*8 + 16 + 186 );

  doc.rect(16, (12*8*2 + 16 + 186), 250, 100).fillAndStroke('#fff', '#000');
  doc.fill('#000').stroke();
  doc.text("Weight: 3kg\nDimensions\nHeight: 67cm\nWidth: 40cm", 32, (12*8*2 + 16 + 186) + 16 );

  doc.image(path, 150, (12*8*2 + 16 + 186) + 16, {fit: [100, 100]})
}

module.exports = label;