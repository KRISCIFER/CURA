import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStaticServer } from './serve.mjs';

// Exercise the real request handler without depending on sandbox loopback access.
const handler = createStaticServer().listeners('request')[0];
function request(url, method = 'GET') {
  const result = {};
  handler({ url, method }, {
    writeHead(status, headers) { result.status = status; result.headers = headers; },
    end(body) { result.body = body?.toString() || ''; }
  });
  return result;
}
test('serves the homepage and deep routes with and without trailing slashes', () => {
  for (const route of ['/', '/pulse', '/pulse/', '/pharmacy-mode/inventory/', '/search/ors/']) {
    const response = request(route);
    assert.equal(response.status, 200, route);
    assert.match(response.body, /<html/);
    assert.equal(response.headers['Content-Type'], 'text/html; charset=utf-8');
  }
});
test('serves URL-encoded Next assets with correct MIME types', () => {
  const html = request('/').body;
  const assets = [...html.matchAll(/(?:src|href)="(\/_next\/[^"?]+)/g)].map(m => m[1]);
  assert.ok(assets.length);
  for (const asset of assets) {
    const response = request(asset);
    assert.equal(response.status, 200, asset);
    assert.match(response.headers['Content-Type'], /text\/(javascript|css)/);
  }
});
test('handles HEAD, missing routes, invalid URLs, and traversal safely', () => {
  assert.equal(request('/', 'HEAD').body, '');
  assert.equal(request('/missing-page').status, 404);
  assert.equal(request('/%ZZ').status, 400);
  assert.equal(request('/..%2fpackage.json').status, 403);
  assert.equal(request('/', 'POST').status, 405);
});
