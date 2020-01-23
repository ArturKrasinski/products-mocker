const { logHeadline, logSuccess, logError } = require('./helpers/logger');
const fs = require('fs');
const request = require('request');
const Path = require('path');
const dirTemp = 'data/temp';
const sourceFileName = 'data/products.json';
const sampleFileName = 'data/products-sample.json';

// environment config
const { env = {} } = process;
const { MAX_ITEMS = 5, CREATE_SAMPLE = false } = env;

const deleteFolderRecursive = function(sourcePath) {
  if (fs.existsSync(sourcePath)) {
    fs.readdirSync(sourcePath).forEach((file, index) => {
      const curPath = Path.join(sourcePath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
};

function downloadFile(uri, filename, callback) {
  request.head(uri, () => {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
      callback({ filename })
    });
  });
};

//Create temp dir
if (!fs.existsSync(dirTemp)){
  fs.mkdirSync(dirTemp);
}
let sourceData = fs.readFileSync(sourceFileName);
let sourceProducts = JSON.parse(sourceData);
const products = CREATE_SAMPLE ? sourceProducts.slice(1, MAX_ITEMS) : sourceProducts;

const downloadActions = [];
const processedProducts = [];

products.forEach((product) => {
    //Get base data from product
    const { image: url } = product;
    const fileName = url.split('/').pop();

    //Add download promise to queue
    downloadActions.push(() => {
      return new Promise((resolve) => {
          try {
            downloadFile(url, `${dirTemp}/${fileName}`, resolve);
          } catch {
            resolve({ filename: fileName + 'error' });
          }
      })
    });

    if (CREATE_SAMPLE) {
      //Remove url`s from products
      const { url: ignore, ...productWithoutUrl } = product;
      processedProducts.push({
        ...productWithoutUrl,
        image: fileName,
      })
    }
});

async function getSyncDownloadResults(arrayOfPromisesActions) {
  const results = [];
  const errors = [];

  deleteFolderRecursive(dirTemp);
  logHeadline('STARTD DOWNLOAD (OLD IMAGES REMOVED)');
  for (let promiseAction of arrayOfPromisesActions) {
    try {
      let r = await promiseAction().then(({filename}) => {
        logSuccess('[downloaded] ' + filename);
      } );
      results.push(r);
    } catch (e) {
      logError('[error] ' + filename);
      errors.push(e);
    }
  }
  return {
    results,
    errors,
  };
}

getSyncDownloadResults(downloadActions).then( ({ results: downloadResults, errors: downloadErrors }) => {
    logHeadline('DOWNLOAD COMPLEATED');
    logSuccess('    - success: ' + downloadResults.length);
    logError('    - errors: ' + downloadErrors.length);

    // Save created sample of products
    if (CREATE_SAMPLE) {
      fs.writeFile(sampleFileName, JSON.stringify(processedProducts), 'utf8', () => {
        logHeadline('NEW SAMPLE FILE SAVED - enjoy ;) ');
      });
    }
});

