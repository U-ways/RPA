/* httpLogger middleware
============================================================================= */

import fileSystem from 'fs';
import path       from 'path';
import logger     from 'morgan';
import rfs        from 'rotating-file-stream';

const env = process.env;

/** location of log directory */
const LOG_DIR = path.join(__dirname, '../../log');
/** check if the log directory exists, else create one */
fileSystem.existsSync(LOG_DIR) || fileSystem.mkdirSync(LOG_DIR);

/** creates a rotating write stream */
let rotationLogging = rfs(
  'http-server.log', {
    size: '5M',
    interval: '1d',
    compress: 'gzip',
    maxFiles: 90, // remove logs older than 3 months
    maxSize: '250M',
    path: LOG_DIR
  }
);

/** request logger implementation */

let reqLogFormat =
'REQ :remote-addr     :method :url :req[header] :user-agent';

const requestLogger = logger(
  reqLogFormat,
  {
    immediate: true,
    skip: (req, res) => res.statusCode < 400,
    stream: rotationLogging
  }
);

/** response logger implementation */

let resLogFormat =
'RES :remote-addr :status :method :url :res[header] :res[content-length] :response-time ms';

const responseLogger = logger(
  resLogFormat,
  {
    skip: (req, res) => res.statusCode < 400,
    stream: rotationLogging
  }
);

/** export loggers as an object for convenience */

export const httpLogger = {
  dev: logger('dev'),
  request:  requestLogger,
  response: responseLogger,
}
