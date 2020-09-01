/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require("glob");
const path = require("path");
const AWS = require("aws-sdk/global");
require("aws-sdk/clients/s3");

const fs = require("fs");

const s3 = new AWS.S3();

const bucket = process.env.BUCKET;
const commitId = process.env.CIRCLE_SHA1;
const sourcePath = "dist";
const destinationPath = "/";

const files = glob.sync("./**/*", { cwd: sourcePath, nodir: true });

const extnames = new Set();

const mimeTypes = {
  ".js": "text/javascript",
  ".map": "binary/octet-stream",
  ".css": "text/css",
  ".gz": "application/gzip",
  ".svg": "image/svg+xml",
  ".woff": "application/font-woff",
  ".ttf": "application/x-font-ttf",
  ".woff2": "application/font-woff",
  ".eot": "application/vnd.ms-fontobject",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain",
  ".html": "text/html",
  ".json": "application/json",
  default: "binary/octet-stream"
};
(async () => {
  try {
    const promises = [];
    for (const file of files) {
      const fileContent = fs.readFileSync(path.join(sourcePath, file));
      const extname = path.extname(file);
      const mimeType = mimeTypes[extname] || mimeTypes["default"];
      const params = {
        Bucket: bucket,
        Key: path
          .join(
            destinationPath,
            file.replace(/^\.\/index\.html$/, `/index.${commitId}.html`)
          )
          .replace(/^\//, ""),
        Body: fileContent,
        ContentType: mimeType,
        ACL: "public-read"
      };
      console.log("start", file, params.Key);
      promises.push(
        (async () => {
          await s3.upload(params).promise();
          console.log("finished", params.Key);
        })()
      );
    }
    await Promise.all(promises);
    console.log("all finished", extnames);
  } catch (e) {
    console.error(e);
  }
})();
