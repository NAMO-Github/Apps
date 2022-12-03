const express = require('express');
const path = require('path');
const router = express.Router();

// example: https://github.com/jsphkhan/cache-control-caching-example/blob/master/server.js
const options = {
  etag: true,
  lastModified: false,
  cacheControl: true,
  // maxAge: 604800000, // 1000 * 60 * 60 * 24 * 7 = 7 day (unit: milisecond)
  // Note: value max-age on setHeader is unit second
  // res.setHeader('Cache-Control', path.includes('index.html') ? 'no-store' : 'public, max-age=604800');

  setHeaders: (res, path) => {
    if (
      ['text/html', 'application/json'].indexOf(
        express.static.mime.lookup(path)
      ) > -1
    ) {
      // Custom Cache-Control for HTML files
      return res.setHeader('Cache-Control', 'no-store');
    }
    return res.setHeader('Cache-Control', 'public, max-age=604800');
  },
};

router.use(
  '/',
  express.static(path.join(__dirname, '../../dist/apps/namo-webapp'), options)
);
router.use(
  '/*',
  express.static(path.join(__dirname, '../../dist/apps/namo-webapp'), options)
);

// const options = {
//   etag: false,
//   lastModified: false,
//   setHeaders: function setCustomCacheControl(res, path) {
//     if (express.static.mime.lookup(path) === 'text/html') {
//       // Custom Cache-Control for HTML files
//       // res.setHeader('Cache-Control', 'public, max-age=0');
//       res.setHeader('Cache-Control', path.includes('index.html') ? 'no-store' : 'public, max-age=0');
//     }
//   }
// }
module.exports = router;
