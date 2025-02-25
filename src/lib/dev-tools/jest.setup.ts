import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { expect } from '@jest/globals';

// Mock global fetch
global.fetch = jest.fn();

// Setup TextEncoder/Decoder for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;

// Custom test utilities
const customMatchers = {
  toBeValidDate: function (received: any) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      pass,
      message: () =>
        `Expected ${received} to${pass ? ' not' : ''} be a valid date`,
    };
  },
};

expect.extend(customMatchers);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test timeout
jest.setTimeout(10000);