const PDFDocument = require('pdfkit');
const { Base64Encode } = require('base64-stream');

exports.getLabel = function (res) {
  var doc = new PDFDocument();
  
  // write to PDF
  doc.fontSize(25).text('Some text with an embedded font!', 100, 100);

    
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