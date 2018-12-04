/* eslint-env browser */
import zipkin from 'zipkin';
const { BatchRecorder, jsonEncoder: { JSON_V2 } } = zipkin;
import { HttpLogger } from 'zipkin-transport-http';

// Send spans to Zipkin asynchronously over HTTP
const zipkinBaseUrl = 'http://localhost:9411';
const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: `${zipkinBaseUrl}/api/v2/spans`,
    jsonEncoder: JSON_V2
  })
});

const _recorder = recorder;
export { _recorder as recorder };
