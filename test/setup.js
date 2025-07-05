/**
 * Jest 测试环境设置
 */

// 模拟 DOM 环境
const { TextEncoder, TextDecoder } = require('util');

// 全局设置
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 模拟 localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// 模拟 performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
};

// 模拟 console 方法以避免测试输出干扰
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// 设置测试超时
jest.setTimeout(10000);

// 测试前后的清理工作
beforeEach(() => {
  // 清除所有 mock 的调用历史
  jest.clearAllMocks();
  
  // 重置 localStorage mock
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

afterEach(() => {
  // 清理 DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

// 全局错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 设置测试环境变量
process.env.NODE_ENV = 'test'; 