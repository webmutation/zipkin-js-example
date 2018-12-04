/* eslint-disable import/newline-after-import */
// initialize tracer
import express from 'express';
import CLSContext from 'zipkin-context-cls';
import { Tracer } from 'zipkin';
import { recorder } from './recorder';

const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'backend';
const tracer = new Tracer({ctxImpl, recorder, localServiceName});

const app = express();

// instrument the server
import { expressMiddleware as zipkinMiddleware } from 'zipkin-instrumentation-express';
app.use(zipkinMiddleware({tracer}));

app.get('/api', (req, res) => res.send(new Date().toString()));

app.listen(9000, () => {
  console.log('Backend listening on port 9000!');
});
