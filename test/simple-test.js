/**
 * 简单测试示例 - 验证测试环境
 */

// 简单的单元测试示例（不依赖外部模块）
describe('测试环境验证', () => {
    test('基础数学计算测试', () => {
        expect(2 + 2).toBe(4);
        expect(10 * 5).toBe(50);
        expect(Math.round(3.14159)).toBe(3);
    });

    test('字符串操作测试', () => {
        const text = 'Smart Acceleration Calculator';
        expect(text.toLowerCase()).toContain('acceleration');
        expect(text.split(' ')).toHaveLength(3);
    });

    test('数组操作测试', () => {
        const modes = ['velocity', 'distance', 'force'];
        expect(modes).toContain('velocity');
        expect(modes.length).toBe(3);
    });
});

// 模拟计算器核心函数的测试
describe('模拟计算器函数测试', () => {
    // 模拟加速度计算函数
    function calculateAcceleration(vi, vf, t) {
        if (t <= 0) {
            throw new Error('时间必须大于0');
        }
        return (vf - vi) / t;
    }

    // 模拟单位转换函数
    function convertKmhToMs(kmh) {
        return kmh / 3.6;
    }

    test('基本加速度计算', () => {
        const result = calculateAcceleration(10, 30, 5);
        expect(result).toBeCloseTo(4, 2);
    });

    test('负加速度计算', () => {
        const result = calculateAcceleration(50, 20, 6);
        expect(result).toBeCloseTo(-5, 2);
    });

    test('零时间异常处理', () => {
        expect(() => {
            calculateAcceleration(10, 30, 0);
        }).toThrow('时间必须大于0');
    });

    test('单位转换测试', () => {
        const result = convertKmhToMs(36);
        expect(result).toBeCloseTo(10, 2);
    });
});

// DOM 相关的测试（需要 jsdom 环境）
describe('DOM 环境测试', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('创建 DOM 元素', () => {
        const button = document.createElement('button');
        button.textContent = '计算';
        button.id = 'calculateBtn';
        
        document.body.appendChild(button);
        
        const foundButton = document.getElementById('calculateBtn');
        expect(foundButton).toBeTruthy();
        expect(foundButton.textContent).toBe('计算');
    });

    test('模拟表单输入', () => {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'velocity';
        input.value = '25';
        
        document.body.appendChild(input);
        
        const foundInput = document.getElementById('velocity');
        expect(foundInput.value).toBe('25');
        expect(parseFloat(foundInput.value)).toBe(25);
    });
});

// 本地存储测试
describe('本地存储测试', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('保存和获取主题设置', () => {
        localStorage.setItem('theme', 'dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('清除存储', () => {
        localStorage.setItem('test', 'value');
        localStorage.clear();
        expect(localStorage.getItem('test')).toBeNull();
    });
}); 