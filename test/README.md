# 智能加速度计算器 - 测试套件

## 概述

这是一个完整的测试套件，用于验证智能加速度计算器的所有功能。包含单元测试、端到端测试、性能测试和可访问性测试。

## 目录结构

```
test/
├── unit-tests.js          # 单元测试
├── e2e-tests.js           # 端到端测试
├── setup.js              # Jest 测试环境设置
├── playwright.config.js   # Playwright 配置
├── package.json          # 依赖和脚本配置
├── README.md             # 本文档
└── reports/              # 测试报告输出目录
```

## 安装依赖

```bash
cd test
npm install
```

## 运行测试

### 单元测试

```bash
# 运行所有单元测试
npm test

# 观察模式运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 端到端测试

```bash
# 安装 Playwright 浏览器
npx playwright install

# 运行 E2E 测试
npm run test:e2e

# 有界面模式运行（方便调试）
npm run test:e2e:headed

# 调试模式
npm run test:e2e:debug
```

### 综合测试

```bash
# 运行所有测试
npm run test:all

# CI 环境测试
npm run test:ci
```

### 性能和可访问性测试

```bash
# 生成 Lighthouse 报告
npm run lighthouse

# 可访问性测试
npm run accessibility
```

## 测试用例说明

### 单元测试 (unit-tests.js)

测试核心计算功能和工具函数：

- **FT-001 到 FT-013**: 功能测试用例
- **计算模式测试**: 三种计算模式的准确性
- **输入验证测试**: 各种边界条件和异常处理
- **单位转换测试**: 不同单位之间的转换准确性
- **性能测试**: 计算响应时间和稳定性

### 端到端测试 (e2e-tests.js)

测试用户界面交互：

- **UI-001 到 UI-009**: 界面交互测试用例
- **RD-001 到 RD-006**: 响应式设计测试
- **BC-001 到 BC-006**: 浏览器兼容性测试
- **PF-001 到 PF-005**: 性能测试
- **AC-001 到 AC-006**: 可访问性测试

## 测试覆盖率要求

- **代码覆盖率**: ≥ 80%
- **分支覆盖率**: ≥ 80%
- **函数覆盖率**: ≥ 80%
- **语句覆盖率**: ≥ 80%

## 浏览器支持

测试在以下浏览器中运行：

- **桌面端**:
  - Chrome 119+
  - Firefox 118+
  - Safari 16+
  - Edge 119+

- **移动端**:
  - iOS Safari (iPhone 12)
  - Android Chrome (Pixel 5)
  - iPad Pro

## 测试环境配置

### 本地开发环境

1. 确保项目根目录可以通过 HTTP 服务器访问
2. 默认端口: 3000
3. 测试将自动启动本地服务器

### CI/CD 环境

测试已配置为在 CI 环境中运行：

- 自动重试失败的测试 (最多2次)
- 生成 JUnit XML 报告
- 生成 HTML 测试报告
- 收集测试覆盖率

## 测试报告

测试运行后会生成以下报告：

### 单元测试报告
- `coverage/` - 代码覆盖率报告
- `coverage/lcov-report/index.html` - HTML 覆盖率报告

### E2E 测试报告
- `test-results/html-report/` - Playwright HTML 报告
- `test-results/results.json` - JSON 格式测试结果
- `test-results/junit.xml` - JUnit XML 报告

### 性能报告
- `reports/lighthouse.html` - Lighthouse 性能报告
- `reports/lighthouse.json` - JSON 格式性能数据

### 可访问性报告
- `reports/accessibility.json` - 可访问性测试结果

## 调试测试

### 单元测试调试

```bash
# 在 VSCode 中设置断点，然后运行
npm run test:watch

# 使用 Node.js 调试器
node --inspect-brk node_modules/.bin/jest --runInBand
```

### E2E 测试调试

```bash
# 调试模式 - 会暂停执行并开启浏览器开发者工具
npm run test:e2e:debug

# 有界面模式 - 可以看到测试执行过程
npm run test:e2e:headed
```

## 测试最佳实践

### 编写新测试用例

1. **命名规范**: 使用测试用例ID (如 FT-001)
2. **测试描述**: 清晰描述测试目标
3. **断言明确**: 使用具体的期望值
4. **测试独立**: 每个测试应该独立运行

### 测试数据

```javascript
// 好的测试用例
test('FT-001: 基本速度变化计算', () => {
  const result = calculator.calculateFromVelocity(10, 30, 5, 'm/s', 'm/s', 's');
  expect(result.success).toBe(true);
  expect(result.result).toBeCloseTo(4, 2);
});

// 避免魔法数字
const TEST_DATA = {
  BASIC_VELOCITY: { vi: 10, vf: 30, t: 5, expected: 4 }
};
```

### 异步测试

```javascript
// 使用 async/await
test('异步计算测试', async () => {
  const result = await calculator.calculateAsync(...);
  expect(result).toBeDefined();
});
```

## 持续集成

测试套件已配置为在以下情况下运行：

- **Pull Request**: 运行所有测试
- **主分支提交**: 运行所有测试 + 性能测试
- **定时任务**: 每日运行完整测试套件

## 故障排除

### 常见问题

1. **端口冲突**: 修改 `playwright.config.js` 中的端口号
2. **浏览器未安装**: 运行 `npx playwright install`
3. **测试超时**: 增加 `timeout` 配置值
4. **网络问题**: 检查本地服务器是否正常运行

### 获取帮助

如果遇到测试相关问题：

1. 查看测试报告中的详细错误信息
2. 检查浏览器控制台的错误日志
3. 运行单个测试用例进行调试
4. 查看生成的截图和视频录制

## 贡献指南

添加新测试用例时请：

1. 遵循现有的命名规范
2. 添加详细的测试描述
3. 更新测试用例文档
4. 确保测试覆盖率不降低
5. 验证测试在所有浏览器中通过 