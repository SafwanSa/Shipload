const PDFDocument = require('pdfkit');
const { Base64Encode } = require('base64-stream');
const fs = require('fs');
const upload = require('./upload_attachments');
const dotenv = require('dotenv');
const aws = require('aws-sdk');

const label = function (res, shipments) {
  uploadFile(res, shipments);
}

function generatePDF(doc, shipments) {
    for(let shipment of shipments) {
      generatePDFPage(doc, shipment);
      if(shipments.indexOf(shipment) !== shipments.length - 1)
        doc.addPage();
    }
}

function generatePDFPage(doc, shipment) {
  doc.rect(16, 16, 250, 450).fillAndStroke('#fff', '#000');
  doc.fill('#000').stroke();
  doc.fontSize(16);
  doc.text(`Tracking No.: ${shipment.tracking_number}`, 32, 32, {lineBreak: false} );

  doc.image('./barcode.jpg', 32, 50, {fit: [300, 100]})
  doc.fontSize(12);

  doc.text(`Shipped From:\n${shipment.ship_from.country}, ${shipment.ship_from.city}\n${shipment.ship_from.address1}\n${shipment.ship_from.address2 | ''}\n${shipment.ship_from.postal_code}`, 32, 186 );

  doc.text("Shipped To:\nSA, Riyadh\nBarchal\nSaoud\n23335", 32, 12*8 + 16 + 186 );

  doc.rect(16, (12*8*2 + 16 + 186), 250, 100).fillAndStroke('#fff', '#000');
  doc.fill('#000').stroke();
  doc.text("Weight: 3kg\nDimensions\nHeight: 67cm\nWidth: 40cm", 32, (12*8*2 + 16 + 186) + 16 );

  doc.image('./barcode.jpg', 150, (12*8*2 + 16 + 186) + 16, {fit: [100, 100]})
}

async function uploadFile(res, shipments) {
    var thisPDF = new PDFDocument();
    generatePDF(thisPDF, shipments);
    let buffers = [];
    thisPDF.on('data', buffers.push.bind(buffers));
    thisPDF.end();
    thisPDF.on('end', () => {
      pdfData = Buffer.concat(buffers);
      dotenv.config();
      aws.config.update({
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      });
      console.log("dd");
      const s3 = new aws.S3();
      const fileName = 'shipments_labels';
      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Body: pdfData,
        Key: (+new Date())+'-'+fileName,
        ContentType : 'application/pdf',
      };
      s3.upload(s3Params, (err, data) => {
        delete pdfData, thisPDF;
        pdfData = null;
        thisPDF = null;
        if(err) res.stats(400).send('Error while getting the labels!');
        
        res.send(data.Location);
      });
    });
    
}

module.exports = label;

