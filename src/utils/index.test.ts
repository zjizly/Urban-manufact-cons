import { http, app } from '.';

describe('http util', () => {
  it('judge the result', () => {
    expect(http.ok(0)).toBeTruthy();
    expect(http.ok(1)).toBeFalsy();
  });
});

describe('app util', () => {
  it('retrieve props without null check', () => {
    const obj = { a: 'a' };

    expect(app.retrieveProp(undefined, 'a')).toBeUndefined();
    expect(app.retrieveProp(obj, 'a')).toBe('a');
    expect(app.retrieveProp(obj, 'b')).toBeUndefined();
  });

  it('delay some ms', async () => {
    const before = new Date().getTime();
    await app.delay(1000);
    expect(new Date().getTime() - before).toBeGreaterThanOrEqual(1000);
  });
});