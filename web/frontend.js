/* eslint-disable import/newline-after-import */
// initialize tracer
import { wrap } from 'rest';
import express from 'express';
import CLSContext from 'zipkin-context-cls';
import { Tracer } from 'zipkin';
import { recorder } from './recorder';

const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'frontend';
const tracer = new Tracer({ctxImpl, recorder, localServiceName});

const app = express();

// instrument the server
import { expressMiddleware as zipkinMiddleware } from 'zipkin-instrumentation-express';
app.use(zipkinMiddleware({tracer}));

// instrument the client
import { restInterceptor } from 'zipkin-instrumentation-cujojs-rest';
const zipkinRest = wrap(restInterceptor, {tracer});

// Allow cross-origin, traced requests. See http://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', [
    'Origin', 'Accept', 'X-Requested-With', 'X-B3-TraceId',
    'X-B3-ParentSpanId', 'X-B3-SpanId', 'X-B3-Sampled'
  ].join(', '));
  next();
});

app.get('/', (req, res) => {
  tracer.local('pay-me', () =>
    zipkinRest('http://localhost:9000/api')
      .then(response => res.send(response.entity))
      .catch(err => console.error('Error', err.stack))
  );
});

app.listen(8081, () => {
  console.log('Frontend listening on port 8081!');
});
