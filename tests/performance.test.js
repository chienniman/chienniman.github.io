const { performance } = require('perf_hooks');
const axios = require('axios');

describe('Website performance test', () => {
  jest.setTimeout(10000);

  test('Website loads in under 2 seconds', async () => {
    const start = performance.now();

    const response = await axios.get('https://chienniman-devlogs.onrender.com/');

    const duration = performance.now() - start;

    expect(duration).toBeLessThanOrEqual(2000);
  });
});
