import { describe, expect, test, jest } from '@jest/globals';

import { createDisposable, injectDisposable } from './disposable';

describe('disposable', () => {
  test('createDisposable', () => {
    const dispose = jest.fn();
    const myDisposable = createDisposable(dispose);

    function use() {
      using obj = myDisposable;
    }
    use();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('createDisposable thisArg', () => {
    const myObj = {
      callMe: jest.fn(),
    };
    const dispose = jest.fn(myObj.callMe);
    const myDisposable = createDisposable(dispose, myObj);

    function use() {
      using obj = myDisposable;
    }
    use();
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(myObj.callMe).toHaveBeenCalledTimes(1);
  });

  test('injectDisposable', () => {
    const myObj = {
      callMe: jest.fn(),
    };
    const dispose = jest.fn(myObj.callMe);
    const myDisposable = injectDisposable(myObj, dispose);

    function use() {
      using obj = myDisposable;
    }
    use();
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(myObj.callMe).toHaveBeenCalledTimes(1);
  });

  test('double disposed', () => {
    const dispose = jest.fn();
    const myDisposable = createDisposable(dispose);

    function use() {
      using obj = myDisposable;
    }
    use();
    use();
    expect(dispose).toHaveBeenCalledTimes(1);
  });
});
