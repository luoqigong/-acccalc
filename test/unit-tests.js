/**
 * 智能加速度计算器 - 单元测试
 * 使用 Jest 测试框架
 * 运行命令: npm test
 */

// 导入计算器类和工具函数
const { 
    AccelerationCalculator, 
    validateInput, 
    toStandardUnit, 
    formatNumber,
    convertUnit,
    explainResult,
    UNIT_CONVERSIONS
} = require('./test-imports');

describe('AccelerationCalculator 核心功能测试', () => {
    let calculator;

    beforeEach(() => {
        // 每个测试前重新创建计算器实例
        calculator = new AccelerationCalculator();
    });

    describe('速度变化模式计算测试', () => {
        test('FT-001: 基本速度变化计算', () => {
            const result = calculator.calculateFromVelocity(10, 30, 5, 'm/s', 'm/s', 's');
            
            expect(result.success).toBe(true);
            expect(result.result).toBeCloseTo(4, 2);
            expect(result.explanation).toContain('正加速度');
        });

        test('FT-002: 负加速度计算', () => {
            const result = calculator.calculateFromVelocity(50, 20, 6, 'm/s', 'm/s', 's');
            
            expect(result.success).toBe(true);
            expect(result.result).toBeCloseTo(-5, 2);
            expect(result.explanation).toContain('负加速度');
        });

        test('FT-003: 单位转换测试 - km/h to m/s', () => {
            const result = calculator.calculateFromVelocity(36, 72, 4, 'km/h', 'km/h', 's');
            
            expect(result.success).toBe(true);
            // 36 km/h = 10 m/s, 72 km/h = 20 m/s
            // a = (20 - 10) / 4 = 2.5 m/s²
            expect(result.result).toBeCloseTo(2.5, 2);
        });

        test('FT-004: 零时间异常处理', () => {
            const result = calculator.calculateFromVelocity(10, 30, 0, 'm/s', 'm/s', 's');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('时间');
            expect(result.error).toContain('大于0');
        });

        test('负时间异常处理', () => {
            const result = calculator.calculateFromVelocity(10, 30, -5, 'm/s', 'm/s', 's');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('时间');
        });

        test('非数字输入处理', () => {
            const result = calculator.calculateFromVelocity('abc', 30, 5, 'm/s', 'm/s', 's');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('初始速度');
        });
    });

    describe('距离时间模式计算测试', () => {
        test('FT-005: 基本距离时间计算', () => {
            const result = calculator.calculateFromDistance(0, 100, 10, 'm/s', 'm', 's');
            
            expect(result.success).toBe(true);
            // a = 2 * (s - v₀ * t) / t² = 2 * (100 - 0 * 10) / 10² = 2
            expect(result.result).toBeCloseTo(2, 2);
        });

        test('FT-006: 带初速度的计算', () => {
            const result = calculator.calculateFromDistance(5, 60, 4, 'm/s', 'm', 's');
            
            expect(result.success).toBe(true);
            // a = 2 * (60 - 5 * 4) / 4² = 2 * (60 - 20) / 16 = 5
            expect(result.result).toBeCloseTo(5, 2);
        });

        test('FT-007: 负距离异常处理', () => {
            const result = calculator.calculateFromDistance(5, -50, 4, 'm/s', 'm', 's');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('距离');
            expect(result.error).toContain('大于0');
        });

        test('零距离处理', () => {
            const result = calculator.calculateFromDistance(0, 0, 5, 'm/s', 'm', 's');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('距离');
        });
    });

    describe('力质量模式计算测试', () => {
        test('FT-008: 基本力质量计算', () => {
            const result = calculator.calculateFromForce(10, 20, 'kg', 'N');
            
            expect(result.success).toBe(true);
            // a = F / m = 20 / 10 = 2
            expect(result.result).toBeCloseTo(2, 2);
        });

        test('FT-009: 小质量大力计算', () => {
            const result = calculator.calculateFromForce(0.5, 100, 'kg', 'N');
            
            expect(result.success).toBe(true);
            // a = 100 / 0.5 = 200
            expect(result.result).toBeCloseTo(200, 2);
        });

        test('FT-010: 零质量异常处理', () => {
            const result = calculator.calculateFromForce(0, 20, 'kg', 'N');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('质量');
            expect(result.error).toContain('大于0');
        });

        test('负质量异常处理', () => {
            const result = calculator.calculateFromForce(-5, 20, 'kg', 'N');
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('质量');
        });

        test('零力计算', () => {
            const result = calculator.calculateFromForce(10, 0, 'kg', 'N');
            
            expect(result.success).toBe(true);
            expect(result.result).toBeCloseTo(0, 2);
        });
    });
});

describe('工具函数测试', () => {
    describe('输入验证函数测试', () => {
        test('FT-011: 数字验证', () => {
            expect(validateInput('123', 'number').isValid).toBe(true);
            expect(validateInput('abc', 'number').isValid).toBe(false);
            expect(validateInput('', 'number').isValid).toBe(false);
            expect(validateInput('12.34', 'number').isValid).toBe(true);
        });

        test('时间验证', () => {
            expect(validateInput('5', 'time').isValid).toBe(true);
            expect(validateInput('0', 'time').isValid).toBe(false);
            expect(validateInput('-1', 'time').isValid).toBe(false);
        });

        test('质量验证', () => {
            expect(validateInput('10', 'mass').isValid).toBe(true);
            expect(validateInput('0', 'mass').isValid).toBe(false);
            expect(validateInput('-5', 'mass').isValid).toBe(false);
        });

        test('正数验证', () => {
            expect(validateInput('10', 'positive').isValid).toBe(true);
            expect(validateInput('0', 'positive').isValid).toBe(false);
            expect(validateInput('-5', 'positive').isValid).toBe(false);
        });
    });

    describe('单位转换函数测试', () => {
        test('速度单位转换', () => {
            // km/h to m/s
            expect(toStandardUnit(36, 'km/h', 'velocity')).toBeCloseTo(10, 2);
            expect(toStandardUnit(1, 'm/s', 'velocity')).toBeCloseTo(1, 2);
            
            // mph to m/s  
            expect(toStandardUnit(22.369, 'mph', 'velocity')).toBeCloseTo(10, 1);
        });

        test('距离单位转换', () => {
            expect(toStandardUnit(1000, 'm', 'distance')).toBeCloseTo(1000, 2);
            expect(toStandardUnit(1, 'km', 'distance')).toBeCloseTo(1000, 2);
            expect(toStandardUnit(3.28084, 'ft', 'distance')).toBeCloseTo(1, 2);
        });

        test('时间单位转换', () => {
            expect(toStandardUnit(60, 's', 'time')).toBeCloseTo(60, 2);
            expect(toStandardUnit(1, 'min', 'time')).toBeCloseTo(60, 2);
            expect(toStandardUnit(1, 'h', 'time')).toBeCloseTo(3600, 2);
        });

        test('质量单位转换', () => {
            expect(toStandardUnit(1000, 'g', 'mass')).toBeCloseTo(1, 2);
            expect(toStandardUnit(1, 'kg', 'mass')).toBeCloseTo(1, 2);
            expect(toStandardUnit(2.20462, 'lb', 'mass')).toBeCloseTo(1, 1);
        });

        test('力单位转换', () => {
            expect(toStandardUnit(1, 'N', 'force')).toBeCloseTo(1, 2);
            expect(toStandardUnit(1, 'kN', 'force')).toBeCloseTo(1000, 2);
            expect(toStandardUnit(1, 'lbf', 'force')).toBeCloseTo(4.44822, 1);
        });
    });

    describe('数字格式化函数测试', () => {
        test('FT-013: 小数精度处理', () => {
            expect(formatNumber(3.14159265)).toBe('3.1416');
            expect(formatNumber(1000000)).toBe('1,000,000');
            expect(formatNumber(0.000001)).toBe('1.0e-6');
            expect(formatNumber(0)).toBe('0');
        });

        test('科学计数法格式化', () => {
            expect(formatNumber(1e10)).toContain('e');
            expect(formatNumber(1e-6)).toContain('e');
        });
    });
});

describe('边界条件和异常测试', () => {
    let calculator;

    beforeEach(() => {
        calculator = new AccelerationCalculator();
    });

    test('FT-012: 超大数值处理', () => {
        const result = calculator.calculateFromVelocity(1e10, 2e10, 1e5, 'm/s', 'm/s', 's');
        
        expect(result.success).toBe(true);
        expect(result.result).toBeCloseTo(1e5, 0);
    });

    test('极小数值处理', () => {
        const result = calculator.calculateFromVelocity(1e-6, 2e-6, 1e-3, 'm/s', 'm/s', 's');
        
        expect(result.success).toBe(true);
        expect(result.result).toBeCloseTo(1e-3, 6);
    });

    test('无穷大输入处理', () => {
        const result = calculator.calculateFromVelocity(Infinity, 30, 5, 'm/s', 'm/s', 's');
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('有效');
    });

    test('NaN输入处理', () => {
        const result = calculator.calculateFromVelocity(NaN, 30, 5, 'm/s', 'm/s', 's');
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('有效');
    });
});

describe('状态管理测试', () => {
    let calculator;

    beforeEach(() => {
        calculator = new AccelerationCalculator();
    });

    test('模式切换测试', () => {
        expect(calculator.getCurrentMode()).toBe('velocity');
        
        calculator.setCurrentMode('distance');
        expect(calculator.getCurrentMode()).toBe('distance');
        
        calculator.setCurrentMode('force');
        expect(calculator.getCurrentMode()).toBe('force');
    });

    test('无效模式处理', () => {
        calculator.setCurrentMode('invalid_mode');
        // 应该保持原有模式
        expect(calculator.getCurrentMode()).toBe('velocity');
    });

    test('计算结果存储', () => {
        expect(calculator.getLastResult()).toBeNull();
        
        calculator.calculateFromVelocity(10, 30, 5, 'm/s', 'm/s', 's');
        const result = calculator.getLastResult();
        
        expect(result).not.toBeNull();
        expect(result.value).toBeCloseTo(4, 2);
        expect(result.mode).toBe('velocity');
    });

    test('结果清除', () => {
        calculator.calculateFromVelocity(10, 30, 5, 'm/s', 'm/s', 's');
        expect(calculator.getLastResult()).not.toBeNull();
        
        calculator.clearResult();
        expect(calculator.getLastResult()).toBeNull();
    });
});

// 性能测试
describe('性能测试', () => {
    let calculator;

    beforeEach(() => {
        calculator = new AccelerationCalculator();
    });

    test('PF-003: 计算响应时间测试', () => {
        const startTime = performance.now();
        
        for (let i = 0; i < 1000; i++) {
            calculator.calculateFromVelocity(10, 30, 5, 'm/s', 'm/s', 's');
        }
        
        const endTime = performance.now();
        const avgTime = (endTime - startTime) / 1000;
        
        // 平均每次计算应该小于1ms
        expect(avgTime).toBeLessThan(1);
    });

    test('大量连续计算稳定性', () => {
        let successCount = 0;
        
        for (let i = 0; i < 10000; i++) {
            const result = calculator.calculateFromVelocity(
                Math.random() * 100, 
                Math.random() * 100, 
                Math.random() * 10 + 1, 
                'm/s', 'm/s', 's'
            );
            if (result.success) successCount++;
        }
        
        // 所有有效输入都应该成功计算
        expect(successCount).toBe(10000);
    });
});

// 集成测试示例
describe('集成测试', () => {
    test('完整计算流程测试', () => {
        const calculator = new AccelerationCalculator();
        
        // 1. 设置模式
        calculator.setCurrentMode('velocity');
        
        // 2. 执行计算
        const result = calculator.calculateFromVelocity(0, 20, 4, 'm/s', 'm/s', 's');
        
        // 3. 验证结果
        expect(result.success).toBe(true);
        expect(result.result).toBeCloseTo(5, 2);
        
        // 4. 检查状态
        const lastResult = calculator.getLastResult();
        expect(lastResult.mode).toBe('velocity');
        expect(lastResult.value).toBeCloseTo(5, 2);
        
        // 5. 切换模式并验证结果保留
        calculator.setCurrentMode('distance');
        expect(calculator.getLastResult()).not.toBeNull();
    });
});

// 错误处理综合测试
describe('错误处理综合测试', () => {
    let calculator;

    beforeEach(() => {
        calculator = new AccelerationCalculator();
    });

    test('各种无效输入的错误处理', () => {
        const invalidInputs = [
            ['', 30, 5],      // 空字符串
            ['abc', 30, 5],   // 非数字
            [null, 30, 5],    // null
            [undefined, 30, 5], // undefined
            [10, 30, 0],      // 零时间
            [10, 30, -5],     // 负时间
        ];

        invalidInputs.forEach(([vi, vf, t]) => {
            const result = calculator.calculateFromVelocity(vi, vf, t, 'm/s', 'm/s', 's');
            expect(result.success).toBe(false);
            expect(result.error).toBeTruthy();
        });
    });
}); 