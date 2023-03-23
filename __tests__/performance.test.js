const { performance } = require('perf_hooks');
const axios = require('axios');

describe('Website performance test', () => {
  jest.setTimeout(10000);

  test('Website_loads_in_under_2_seconds', async () => {
    const start = performance.now();

    const response = await axios.get('https://chienniman-devlogs.onrender.com/');

    const duration = performance.now() - start;

    expect(duration).toBeLessThanOrEqual(2000);
  });
});
