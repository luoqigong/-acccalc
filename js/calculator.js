/**
 * 加速度计算器核心逻辑
 */

// 计算器类
class AccelerationCalculator {
    constructor() {
        this.currentMode = 'velocity';
        this.lastResult = null;
    }

    /**
     * 模式A：基于速度变化计算加速度
     * 公式：a = (vf - vi) / t
     */
    calculateFromVelocity(vi, vf, t, viUnit, vfUnit, tUnit) {
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
                explanation: explainResult(acceleration, 'velocity')
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
    calculateFromDistance(vi, s, t, viUnit, sUnit, tUnit) {
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
                explanation: explainResult(acceleration, 'distance')
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
    calculateFromForce(m, F, mUnit, FUnit) {
        try {
            // 输入验证
            const mValidation = validateInput(m, 'mass');
            const FValidation = validateInput(F, 'positive');

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
                explanation: explainResult(acceleration, 'force')
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
        }
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

    /**
     * 验证计算结果的合理性
     */
    validateResult(result) {
        if (!result || result.success === false) {
            return { isValid: false, warnings: ['计算失败'] };
        }

        const warnings = [];
        const value = Math.abs(result.result);

        // 检查是否为极值
        if (value > 100) {
            warnings.push('加速度值异常大，请检查输入参数');
        }

        if (value < 0.001) {
            warnings.push('加速度值非常小，可能接近静止状态');
        }

        // 检查物理合理性
        if (value > 1000) {
            warnings.push('加速度超过常见物理现象范围，请确认计算无误');
        }

        return {
            isValid: warnings.length === 0,
            warnings: warnings
        };
    }
}

// 创建全局计算器实例
const calculator = new AccelerationCalculator();

// 计算函数（供HTML调用）
function calculate(mode) {
    calculator.setCurrentMode(mode);
    let result;

    try {
        switch (mode) {
            case 'velocity':
                result = calculator.calculateFromVelocity(
                    document.getElementById('vi1').value,
                    document.getElementById('vf1').value,
                    document.getElementById('t1').value,
                    document.getElementById('vi1Unit').value,
                    document.getElementById('vf1Unit').value,
                    document.getElementById('t1Unit').value
                );
                break;

            case 'distance':
                result = calculator.calculateFromDistance(
                    document.getElementById('vi2').value,
                    document.getElementById('d2').value,
                    document.getElementById('t2').value,
                    document.getElementById('vi2Unit').value,
                    document.getElementById('d2Unit').value,
                    document.getElementById('t2Unit').value
                );
                break;

            case 'force':
                result = calculator.calculateFromForce(
                    document.getElementById('m3').value,
                    document.getElementById('f3').value,
                    document.getElementById('m3Unit').value,
                    document.getElementById('f3Unit').value
                );
                break;

            default:
                throw new Error('未知的计算模式');
        }

        displayResult(result);

    } catch (error) {
        console.error('计算错误:', error);
        showToast('计算失败，请检查输入参数', 3000);
    }
}

// 显示计算结果
function displayResult(result) {
    const resultSection = document.getElementById('resultSection');
    const resultValue = document.getElementById('resultValue');
    const resultExplanation = document.getElementById('resultExplanation');

    if (result.success) {
        // 显示结果区域
        resultSection.style.display = 'block';

        // 格式化并显示数值
        const numberElement = resultValue.querySelector('.result-number');
        const unitElement = resultValue.querySelector('.result-unit');

        // 动画显示数字
        const currentValue = parseFloat(numberElement.textContent) || 0;
        const newValue = parseFloat(formatNumber(result.result));
        animateNumber(numberElement, currentValue, newValue);
        
        unitElement.textContent = 'm/s²';
        resultExplanation.textContent = result.explanation;

        // 验证结果合理性
        const validation = calculator.validateResult(result);
        if (!validation.isValid && validation.warnings.length > 0) {
            const warningText = validation.warnings.join('；');
            resultExplanation.innerHTML += `<br><span style="color: var(--warning-color);">⚠️ ${warningText}</span>`;
        }

        // 添加成功动画
        resultSection.classList.add('fade-in');
        showToast('计算完成！', 2000);

    } else {
        // 隐藏结果区域并显示错误
        resultSection.style.display = 'none';
        showToast(result.error || '计算失败', 3000);
    }
}

// 重置表单
function resetForm(mode) {
    const forms = {
        velocity: 'velocityForm',
        distance: 'distanceForm',
        force: 'forceForm'
    };

    const formId = forms[mode];
    if (formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input');
        const selects = form.querySelectorAll('select');

        // 清空输入框
        inputs.forEach(input => {
            input.value = '';
            clearError(input.parentNode);
        });

        // 重置选择框到默认值
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        // 隐藏结果区域
        document.getElementById('resultSection').style.display = 'none';
        
        // 清除计算器结果
        calculator.clearResult();

        showToast(`${mode === 'velocity' ? '速度变化' : mode === 'distance' ? '距离时间' : '力质量'}模式已重置`, 1500);
    }
}
