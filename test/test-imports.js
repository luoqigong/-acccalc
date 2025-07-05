/**
 * Test environment imports - 测试环境模块导入
 * 将浏览器环境的JS代码适配到Node.js测试环境
 */

// 模拟浏览器环境中的一些全局对象和方法
global.console = console;

// 从utils.js复制并修改为可导出的模块
const UNIT_CONVERSIONS = {
    distance: {
        'm': 1,
        'km': 1000,
        'ft': 0.3048,
        'mile': 1609.344
    },
    time: {
        's': 1,
        'min': 60,
        'h': 3600
    },
    velocity: {
        'm/s': 1,
        'km/h': 1/3.6,
        'ft/s': 0.3048,
        'mph': 0.44704
    },
    mass: {
        'kg': 1,
        'g': 0.001,
        'lb': 0.453592
    },
    force: {
        'N': 1,
        'kN': 1000,
        'lbf': 4.44822
    },
    acceleration: {
        'm/s²': 1,
        'ft/s²': 0.3048,
        'g': 9.80665
    }
};

// 单位转换函数
function convertUnit(value, fromUnit, toUnit, type) {
    if (!UNIT_CONVERSIONS[type]) {
        throw new Error(`不支持的单位类型: ${type}`);
    }
    
    const conversions = UNIT_CONVERSIONS[type];
    
    if (!conversions[fromUnit] || !conversions[toUnit]) {
        throw new Error(`不支持的单位: ${fromUnit} 或 ${toUnit}`);
    }
    
    const baseValue = value * conversions[fromUnit];
    return baseValue / conversions[toUnit];
}

// 转换为标准单位
function toStandardUnit(value, unit, type) {
    const standardUnits = {
        distance: 'm',
        time: 's',
        velocity: 'm/s',
        mass: 'kg',
        force: 'N',
        acceleration: 'm/s²'
    };
    
    return convertUnit(value, unit, standardUnits[type], type);
}

// 数值格式化
function formatNumber(value, decimals = 4) {
    if (isNaN(value) || !isFinite(value)) {
        return '无效';
    }
    
    if (Math.abs(value) < 1e-10) {
        return '0';
    }
    
    // 科学计数法处理 - 极大或极小数字
    if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-5 && Math.abs(value) > 1e-10)) {
        return value.toExponential(1);
    }
    
    // 大数字千分位处理 - 百万及以上
    if (Math.abs(value) >= 1000000) {
        return value.toLocaleString();
    }
    
    // 小数精度处理
    const fixed = value.toFixed(decimals);
    const parsed = parseFloat(fixed);
    
    // 去除末尾零
    return parsed.toString();
}

// 输入验证
function validateInput(value, type = 'number') {
    const result = {
        isValid: false,
        value: null,
        error: null
    };
    
    // 特殊处理数字0
    if (value === 0 || value === '0') {
        const numValue = 0;
        switch (type) {
            case 'positive':
                result.error = '数值必须大于0';
                return result;
            case 'time':
                result.error = '时间必须大于0';
                return result;
            case 'mass':
                result.error = '质量必须大于0';
                return result;
            case 'non-negative':
                result.isValid = true;
                result.value = numValue;
                return result;
            default:
                result.isValid = true;
                result.value = numValue;
                return result;
        }
    }
    
    // 特殊处理NaN和Infinity
    if (isNaN(value) || !isFinite(value)) {
        result.error = '请输入有效的数字';
        return result;
    }
    
    if (!value || value.toString().trim() === '') {
        result.error = '请输入数值';
        return result;
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || !isFinite(numValue)) {
        result.error = '请输入有效的数字';
        return result;
    }
    
    switch (type) {
        case 'positive':
            if (numValue <= 0) {
                result.error = '数值必须大于0';
                return result;
            }
            break;
            
        case 'non-negative':
            if (numValue < 0) {
                result.error = '数值不能为负';
                return result;
            }
            break;
            
        case 'time':
            if (numValue <= 0) {
                result.error = '时间必须大于0';
                return result;
            }
            break;
            
        case 'mass':
            if (numValue <= 0) {
                result.error = '质量必须大于0';
                return result;
            }
            break;
    }
    
    result.isValid = true;
    result.value = numValue;
    return result;
}

// 解释计算结果
function explainResult(acceleration, mode) {
    const absAccel = Math.abs(acceleration);
    let magnitude, comparison, safety;
    let direction = acceleration >= 0 ? '正加速度' : '负加速度';
    
    if (absAccel < 1) {
        magnitude = '较小';
        comparison = '相当于缓慢的电梯启动';
    } else if (absAccel < 5) {
        magnitude = '中等';
        comparison = '相当于汽车正常加速';
    } else if (absAccel < 10) {
        magnitude = '较大';
        comparison = '相当于汽车急加速或急刹车';
    } else {
        magnitude = '极大';
        comparison = '相当于高性能跑车加速';
    }
    
    if (absAccel > 15) {
        safety = '⚠️ 注意：如此大的加速度可能对人体造成不适';
    } else {
        safety = '✅ 在正常范围内';
    }
    
    const description = `这是${direction}，数值属于${magnitude}范围，${comparison}。${safety}`;
    
    return {
        magnitude,
        comparison,
        safety,
        direction,
        description
    };
}

// 加速度计算器类
class AccelerationCalculator {
    constructor() {
        this.currentMode = 'velocity';
        this.lastResult = null;
    }

    /**
     * 模式A：基于速度变化计算加速度
     * 公式：a = (vf - vi) / t
     */
    calculateFromVelocity(vi, vf, t, viUnit = 'm/s', vfUnit = 'm/s', tUnit = 's') {
        try {
            // 输入验证
            const viValidation = validateInput(vi, 'non-negative');
            const vfValidation = validateInput(vf, 'non-negative');
            const tValidation = validateInput(t, 'time');

            if (!viValidation.isValid) {
                throw new Error(`初始速度${viValidation.error}`);
            }
            if (!vfValidation.isValid) {
                throw new Error(`最终速度${vfValidation.error}`);
            }
            if (!tValidation.isValid) {
                throw new Error(`时间${tValidation.error}`);
            }

            // 转换为标准单位
            const viStandard = toStandardUnit(viValidation.value, viUnit, 'velocity');
            const vfStandard = toStandardUnit(vfValidation.value, vfUnit, 'velocity');
            const tStandard = toStandardUnit(tValidation.value, tUnit, 'time');

            // 计算加速度 (m/s²)
            const acceleration = (vfStandard - viStandard) / tStandard;

            this.lastResult = {
                value: acceleration,
                unit: 'm/s²',
                mode: 'velocity',
                inputs: {
                    vi: { value: viValidation.value, unit: viUnit },
                    vf: { value: vfValidation.value, unit: vfUnit },
                    t: { value: tValidation.value, unit: tUnit }
                }
            };

            return {
                success: true,
                result: acceleration,
                explanation: explainResult(acceleration, 'velocity').description
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 模式B：基于距离和时间计算加速度
     * 公式：a = 2 * (s - vi * t) / t²
     */
    calculateFromDistance(vi, s, t, viUnit = 'm/s', sUnit = 'm', tUnit = 's') {
        try {
            // 输入验证
            const viValidation = validateInput(vi, 'non-negative');
            const sValidation = validateInput(s, 'positive');
            const tValidation = validateInput(t, 'time');

            if (!viValidation.isValid) {
                throw new Error(`初始速度${viValidation.error}`);
            }
            if (!sValidation.isValid) {
                throw new Error(`距离${sValidation.error}`);
            }
            if (!tValidation.isValid) {
                throw new Error(`时间${tValidation.error}`);
            }

            // 转换为标准单位
            const viStandard = toStandardUnit(viValidation.value, viUnit, 'velocity');
            const sStandard = toStandardUnit(sValidation.value, sUnit, 'distance');
            const tStandard = toStandardUnit(tValidation.value, tUnit, 'time');

            // 计算加速度 (m/s²)
            const acceleration = 2 * (sStandard - viStandard * tStandard) / (tStandard * tStandard);

            this.lastResult = {
                value: acceleration,
                unit: 'm/s²',
                mode: 'distance',
                inputs: {
                    vi: { value: viValidation.value, unit: viUnit },
                    s: { value: sValidation.value, unit: sUnit },
                    t: { value: tValidation.value, unit: tUnit }
                }
            };

            return {
                success: true,
                result: acceleration,
                explanation: explainResult(acceleration, 'distance').description
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 模式C：基于力和质量计算加速度
     * 公式：a = F / m (牛顿第二定律)
     */
    calculateFromForce(m, F, mUnit = 'kg', FUnit = 'N') {
        try {
            // 输入验证
            const mValidation = validateInput(m, 'mass');
            const FValidation = validateInput(F, 'non-negative'); // 允许零力

            if (!mValidation.isValid) {
                throw new Error(`质量${mValidation.error}`);
            }
            if (!FValidation.isValid) {
                throw new Error(`力${FValidation.error}`);
            }

            // 转换为标准单位
            const mStandard = toStandardUnit(mValidation.value, mUnit, 'mass');
            const FStandard = toStandardUnit(FValidation.value, FUnit, 'force');

            // 计算加速度 (m/s²)
            const acceleration = FStandard / mStandard;

            this.lastResult = {
                value: acceleration,
                unit: 'm/s²',
                mode: 'force',
                inputs: {
                    m: { value: mValidation.value, unit: mUnit },
                    F: { value: FValidation.value, unit: FUnit }
                }
            };

            return {
                success: true,
                result: acceleration,
                explanation: explainResult(acceleration, 'force').description
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取当前模式
     */
    getCurrentMode() {
        return this.currentMode;
    }

    /**
     * 设置当前模式
     */
    setCurrentMode(mode) {
        if (['velocity', 'distance', 'force'].includes(mode)) {
            this.currentMode = mode;
            return true;
        }
        return false;
    }

    /**
     * 获取最后计算结果
     */
    getLastResult() {
        return this.lastResult;
    }

    /**
     * 清除计算结果
     */
    clearResult() {
        this.lastResult = null;
    }
}

// 导出模块供测试使用
module.exports = {
    AccelerationCalculator,
    validateInput,
    toStandardUnit,
    formatNumber,
    convertUnit,
    explainResult,
    UNIT_CONVERSIONS
}; 