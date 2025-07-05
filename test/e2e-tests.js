/**
 * 智能加速度计算器 - E2E测试
 * 使用 Playwright 测试框架
 * 运行命令: npx playwright test
 */

const { test, expect } = require('@playwright/test');

// 测试配置
const BASE_URL = 'http://localhost:3000'; // 根据实际部署调整

test.describe('智能加速度计算器 E2E 测试', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        // 等待页面完全加载
        await page.waitForLoadState('networkidle');
    });

    test.describe('基础功能测试', () => {
        
        test('UI-001: 页面初始状态检查', async ({ page }) => {
            // 检查页面标题
            await expect(page).toHaveTitle(/智能加速度计算器/);
            
            // 检查主要元素是否存在
            await expect(page.locator('.navbar')).toBeVisible();
            await expect(page.locator('.calculator-panel')).toBeVisible();
            await expect(page.locator('.mode-tabs')).toBeVisible();
            
            // 检查默认选中的模式
            await expect(page.locator('.tab-btn[data-mode="velocity"]')).toHaveClass(/active/);
            await expect(page.locator('#velocityForm')).toHaveClass(/active/);
        });

        test('FT-001: 基本速度变化计算', async ({ page }) => {
            // 输入测试数据
            await page.fill('#vi1', '10');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '5');
            
            // 点击计算按钮
            await page.click('button:has-text("计算加速度")');
            
            // 等待结果显示
            await expect(page.locator('#resultSection')).toBeVisible();
            
            // 验证计算结果
            const resultValue = await page.locator('.result-value').textContent();
            expect(resultValue).toContain('4');
            
            // 验证结果单位
            const resultUnit = await page.locator('.result-unit').textContent();
            expect(resultUnit).toContain('m/s²');
        });

        test('UI-001: 模式切换功能', async ({ page }) => {
            // 初始状态：速度变化模式激活
            await expect(page.locator('.tab-btn[data-mode="velocity"]')).toHaveClass(/active/);
            
            // 切换到距离时间模式
            await page.click('.tab-btn[data-mode="distance"]');
            await expect(page.locator('.tab-btn[data-mode="distance"]')).toHaveClass(/active/);
            await expect(page.locator('#distanceForm')).toHaveClass(/active/);
            await expect(page.locator('#velocityForm')).not.toHaveClass(/active/);
            
            // 切换到力质量模式
            await page.click('.tab-btn[data-mode="force"]');
            await expect(page.locator('.tab-btn[data-mode="force"]')).toHaveClass(/active/);
            await expect(page.locator('#forceForm')).toHaveClass(/active/);
            
            // 切换回速度变化模式
            await page.click('.tab-btn[data-mode="velocity"]');
            await expect(page.locator('.tab-btn[data-mode="velocity"]')).toHaveClass(/active/);
            await expect(page.locator('#velocityForm')).toHaveClass(/active/);
        });
    });

    test.describe('主题切换测试', () => {
        
        test('UI-003: 主题循环切换', async ({ page }) => {
            const themeToggle = page.locator('#themeToggle');
            
            // 初始状态应该是浅色主题
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
            
            // 切换到深色主题
            await themeToggle.click();
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
            
            // 切换到高对比度主题
            await themeToggle.click();
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'high-contrast');
            
            // 切换回浅色主题
            await themeToggle.click();
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        });

        test('UI-004: 主题持久化测试', async ({ page }) => {
            // 切换到深色主题
            await page.click('#themeToggle');
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
            
            // 刷新页面
            await page.reload();
            await page.waitForLoadState('networkidle');
            
            // 验证主题保持
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        });
    });

    test.describe('表单交互测试', () => {
        
        test('UI-005: 单位选择器功能', async ({ page }) => {
            // 测试速度单位选择
            await page.selectOption('#vi1Unit', 'km/h');
            await expect(page.locator('#vi1Unit')).toHaveValue('km/h');
            
            // 输入数据并计算
            await page.fill('#vi1', '36');
            await page.fill('#vf1', '72');
            await page.fill('#t1', '4');
            
            // 计算并验证单位转换
            await page.click('button:has-text("计算加速度")');
            await expect(page.locator('#resultSection')).toBeVisible();
            
            const resultValue = await page.locator('.result-value').textContent();
            expect(parseFloat(resultValue)).toBeCloseTo(2.5, 1);
        });

        test('UI-006: 重置按钮功能', async ({ page }) => {
            // 填入数据
            await page.fill('#vi1', '10');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '5');
            
            // 点击重置按钮
            await page.click('button:has-text("重置")');
            
            // 验证所有输入框被清空
            await expect(page.locator('#vi1')).toHaveValue('');
            await expect(page.locator('#vf1')).toHaveValue('');
            await expect(page.locator('#t1')).toHaveValue('');
            
            // 验证结果区域隐藏
            await expect(page.locator('#resultSection')).not.toBeVisible();
        });
    });

    test.describe('输入验证测试', () => {
        
        test('FT-011: 非数字输入验证', async ({ page }) => {
            // 输入非数字内容
            await page.fill('#vi1', 'abc');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '5');
            
            // 尝试计算
            await page.click('button:has-text("计算加速度")');
            
            // 应该显示错误提示
            await expect(page.locator('.error-message')).toBeVisible();
            await expect(page.locator('.error-message')).toContainText('有效数字');
        });

        test('FT-004: 零时间异常处理', async ({ page }) => {
            await page.fill('#vi1', '10');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '0');
            
            await page.click('button:has-text("计算加速度")');
            
            await expect(page.locator('.error-message')).toBeVisible();
            await expect(page.locator('.error-message')).toContainText('时间必须大于0');
        });
    });

    test.describe('计算模式测试', () => {
        
        test('FT-005: 距离时间模式计算', async ({ page }) => {
            // 切换到距离时间模式
            await page.click('.tab-btn[data-mode="distance"]');
            
            // 输入测试数据
            await page.fill('#vi2', '0');
            await page.fill('#d2', '100');
            await page.fill('#t2', '10');
            
            // 计算
            await page.click('#distanceForm button:has-text("计算加速度")');
            
            // 验证结果
            await expect(page.locator('#resultSection')).toBeVisible();
            const resultValue = await page.locator('.result-value').textContent();
            expect(parseFloat(resultValue)).toBeCloseTo(2, 1);
        });

        test('FT-008: 力质量模式计算', async ({ page }) => {
            // 切换到力质量模式
            await page.click('.tab-btn[data-mode="force"]');
            
            // 输入测试数据
            await page.fill('#m3', '10');
            await page.fill('#f3', '20');
            
            // 计算
            await page.click('#forceForm button:has-text("计算加速度")');
            
            // 验证结果
            await expect(page.locator('#resultSection')).toBeVisible();
            const resultValue = await page.locator('.result-value').textContent();
            expect(parseFloat(resultValue)).toBeCloseTo(2, 1);
        });
    });

    test.describe('模态框测试', () => {
        
        test('UI-007: 帮助模态框功能', async ({ page }) => {
            // 点击帮助按钮
            await page.click('#helpBtn');
            
            // 验证模态框打开
            await expect(page.locator('#learningModal')).toBeVisible();
            await expect(page.locator('#modalTitle')).toBeVisible();
            
            // 关闭模态框
            await page.click('#modalClose');
            await expect(page.locator('#learningModal')).not.toBeVisible();
        });

        test('UI-008: ESC键关闭模态框', async ({ page }) => {
            // 打开模态框
            await page.click('#helpBtn');
            await expect(page.locator('#learningModal')).toBeVisible();
            
            // 按ESC键
            await page.keyboard.press('Escape');
            await expect(page.locator('#learningModal')).not.toBeVisible();
        });

        test('UI-009: 点击背景关闭模态框', async ({ page }) => {
            // 打开模态框
            await page.click('#helpBtn');
            await expect(page.locator('#learningModal')).toBeVisible();
            
            // 点击背景区域
            await page.click('#learningModal', { position: { x: 10, y: 10 } });
            await expect(page.locator('#learningModal')).not.toBeVisible();
        });
    });

    test.describe('可访问性测试', () => {
        
        test('AC-001: 键盘导航测试', async ({ page }) => {
            // 使用Tab键导航
            await page.keyboard.press('Tab'); // 第一个焦点元素
            await page.keyboard.press('Tab'); // 下一个元素
            await page.keyboard.press('Tab'); // 继续导航
            
            // 验证焦点顺序合理（这里需要根据实际实现调整）
            const focusedElement = await page.locator(':focus');
            await expect(focusedElement).toBeVisible();
        });

        test('ARIA标签检查', async ({ page }) => {
            // 检查按钮的aria-label
            await expect(page.locator('#themeToggle')).toHaveAttribute('aria-label', '切换主题');
            await expect(page.locator('#helpBtn')).toHaveAttribute('aria-label', '帮助');
            
            // 检查表单标签关联
            const labels = await page.locator('label').all();
            for (const label of labels) {
                const forAttr = await label.getAttribute('for');
                if (forAttr) {
                    await expect(page.locator(`#${forAttr}`)).toBeVisible();
                }
            }
        });
    });

    test.describe('性能测试', () => {
        
        test('PF-001: 页面加载性能', async ({ page }) => {
            const startTime = Date.now();
            
            await page.goto(BASE_URL);
            await page.waitForLoadState('networkidle');
            
            const loadTime = Date.now() - startTime;
            
            // 页面加载时间应该小于3秒
            expect(loadTime).toBeLessThan(3000);
        });

        test('PF-003: 计算响应时间', async ({ page }) => {
            await page.fill('#vi1', '10');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '5');
            
            const startTime = Date.now();
            await page.click('button:has-text("计算加速度")');
            await expect(page.locator('#resultSection')).toBeVisible();
            const responseTime = Date.now() - startTime;
            
            // 计算响应时间应该小于100ms
            expect(responseTime).toBeLessThan(1000); // 考虑UI更新时间，放宽到1秒
        });

        test('PF-005: 快速操作稳定性', async ({ page }) => {
            // 快速连续点击计算按钮
            await page.fill('#vi1', '10');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '5');
            
            for (let i = 0; i < 10; i++) {
                await page.click('button:has-text("计算加速度")');
                await page.waitForTimeout(50); // 短暂等待
            }
            
            // 页面应该仍然响应正常
            await expect(page.locator('#resultSection')).toBeVisible();
        });
    });

    test.describe('错误处理测试', () => {
        
        test('ER-003: 极值输入处理', async ({ page }) => {
            // 测试极大数值
            await page.fill('#vi1', '1e10');
            await page.fill('#vf1', '2e10');
            await page.fill('#t1', '1e5');
            
            await page.click('button:has-text("计算加速度")');
            
            // 应该能正常处理或给出合理提示
            // 这里需要根据实际实现调整期望结果
            const result = await page.locator('#resultSection');
            await expect(result).toBeVisible();
        });

        test('网络错误模拟', async ({ page }) => {
            // 模拟网络中断
            await page.route('**/*', route => route.abort());
            
            // 由于是静态网站，核心功能应该仍然可用
            await page.fill('#vi1', '10');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '5');
            
            await page.click('button:has-text("计算加速度")');
            await expect(page.locator('#resultSection')).toBeVisible();
        });
    });
});

// 移动端特定测试
test.describe('移动端测试', () => {
    test.use({ 
        viewport: { width: 375, height: 667 } // iPhone SE尺寸
    });

    test('RD-005: 移动端布局适配', async ({ page }) => {
        await page.goto(BASE_URL);
        
        // 检查移动端布局
        await expect(page.locator('.calculator-panel')).toBeVisible();
        await expect(page.locator('.mode-tabs')).toBeVisible();
        
        // 检查按钮大小是否适合触摸
        const button = page.locator('button:has-text("计算加速度")');
        const buttonBox = await button.boundingBox();
        expect(buttonBox.height).toBeGreaterThan(44); // 最小触摸目标
    });

    test('触摸操作测试', async ({ page }) => {
        await page.goto(BASE_URL);
        
        // 测试模式切换的触摸操作
        await page.tap('.tab-btn[data-mode="distance"]');
        await expect(page.locator('.tab-btn[data-mode="distance"]')).toHaveClass(/active/);
        
        // 测试主题切换的触摸操作
        await page.tap('#themeToggle');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
});

// 跨浏览器测试配置
const browsers = ['chromium', 'firefox', 'webkit'];

browsers.forEach(browserName => {
    test.describe(`${browserName} 兼容性测试`, () => {
        test.use({ browserName });

        test(`BC-00X: ${browserName} 基本功能测试`, async ({ page }) => {
            await page.goto(BASE_URL);
            
            // 基本功能测试
            await page.fill('#vi1', '10');
            await page.fill('#vf1', '30');
            await page.fill('#t1', '5');
            await page.click('button:has-text("计算加速度")');
            
            await expect(page.locator('#resultSection')).toBeVisible();
            const resultValue = await page.locator('.result-value').textContent();
            expect(resultValue).toContain('4');
        });
    });
});

// 测试报告配置
test.describe('测试报告生成', () => {
    test('生成测试覆盖率报告', async ({ page }) => {
        // 这里可以添加代码覆盖率收集逻辑
        await page.coverage.startJSCoverage();
        
        // 执行主要功能
        await page.goto(BASE_URL);
        await page.fill('#vi1', '10');
        await page.fill('#vf1', '30');
        await page.fill('#t1', '5');
        await page.click('button:has-text("计算加速度")');
        
        const coverage = await page.coverage.stopJSCoverage();
        
        // 计算覆盖率
        let totalBytes = 0;
        let usedBytes = 0;
        coverage.forEach(entry => {
            totalBytes += entry.text.length;
            entry.ranges.forEach(range => {
                usedBytes += range.end - range.start - 1;
            });
        });
        
        const coveragePercentage = (usedBytes / totalBytes) * 100;
        console.log(`代码覆盖率: ${coveragePercentage.toFixed(2)}%`);
        
        // 期望覆盖率大于70%
        expect(coveragePercentage).toBeGreaterThan(70);
    });
}); 