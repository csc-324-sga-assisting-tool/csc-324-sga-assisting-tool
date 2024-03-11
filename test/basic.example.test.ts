import {assert, describe, expect, it, test} from 'vitest';

// Basic test suite to test setup
//

// single test example
test('Math.sqrt()', () => {
  expect(Math.sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});

describe('example test-suite', () => {
  it('foo', () => {
    assert.equal(Math.sqrt(4), 2);
  });

  it('bar', () => {
    expect(1 + 1).eq(2);
  });
});
