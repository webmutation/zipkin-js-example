/* eslint-env browser */
/* eslint-disable import/newline-after-import */
// use higher-precision time than milliseconds
import { hrtime } from 'browser-process-hrtime';
process.hrtime = hrtime;

// setup tracer
import { recorder } from './recorder';
import { Tracer, ExplicitContext } from 'zipkin';

const ctxImpl = new ExplicitContext();
const localServiceName = 'browser-DAN-KINGPIG';
const tracer = new Tracer({ctxImpl, recorder, localServiceName});

// instrument fetch
import wrapFetch from 'zipkin-instrumentation-fetch';
const zipkinFetch = wrapFetch(fetch, {tracer});

const logEl = document.getElementById('log');
const log = text => logEl.innerHTML = `${logEl.innerHTML}\n${text}`;

// wrap fetch call so that it is traced
zipkinFetch('http://localhost:8081/')
  .then(response => (response.text()))
  .then(text => log(text))
  .catch(err => log(`Failed:\n${err.stack}`));
