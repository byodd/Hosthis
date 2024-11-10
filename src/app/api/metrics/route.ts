import { NextApiRequest, NextApiResponse } from 'next';
import { register, collectDefaultMetrics, Counter } from 'prom-client';

collectDefaultMetrics({ prefix: 'web_server_' });

const apiCallCounter = new Counter({
    name: 'api_calls_total',
    help: 'Total number of API calls'
  });

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
    apiCallCounter.inc()
    res.setHeader('Content-type', register.contentType);
    res.setHeader('Cache-Control', 'no-store');
    res.send(await register.metrics());
}
