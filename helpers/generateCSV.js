const json2csv = require('json2csv').parse;
const fs = require('fs');
const randomString = require('./../helpers/randomString');

const generateCSV = async ({ fields, records, module })=> {
  const csv = await json2csv(records, { fields });
  const randomStr = randomString();
  const filepath = `${module}-csv-${randomStr}.csv`;

  new Promise((resolve, reject) => {
    fs.writeFile(filepath, csv, function (err) {
      if (err) {
        console.log(err)
        reject(err);
        return false;
      }
  
      // setTimeout(function () {
      //   fs.unlinkSync(filePath);
      // }, 500000)
      resolve(filepath);
    });
  })
};

module.exports = generateCSV;