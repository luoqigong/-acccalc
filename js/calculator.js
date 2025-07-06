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
     * 模式D：基于初速度、末速度和位移计算加速度
     * 公式：a = (v² - v₀²) / (2s)
     */
    calculateFromKinematic(vi, vf, s, viUnit, vfUnit, sUnit) {
        try {
            // 输入验证
            const viValidation = validateInput(vi, 'non-negative');
            const vfValidation = validateInput(vf, 'non-negative');
            const sValidation = validateInput(s, 'positive');

            if (!viValidation.isValid) {
                throw new Error(`初始速度${viValidation.error}`);
            }
            if (!vfValidation.isValid) {
                throw new Error(`最终速度${vfValidation.error}`);
            }
            if (!sValidation.isValid) {
                throw new Error(`位移${sValidation.error}`);
            }

            // 转换为标准单位
            const viStandard = toStandardUnit(viValidation.value, viUnit, 'velocity');
            const vfStandard = toStandardUnit(vfValidation.value, vfUnit, 'velocity');
            const sStandard = toStandardUnit(sValidation.value, sUnit, 'distance');

            // 计算加速度 (m/s²)
            const acceleration = (vfStandard * vfStandard - viStandard * viStandard) / (2 * sStandard);

            this.lastResult = {
                value: acceleration,
                unit: 'm/s²',
                mode: 'kinematic',
                inputs: {
                    vi: { value: viValidation.value, unit: viUnit },
                    vf: { value: vfValidation.value, unit: vfUnit },
                    s: { value: sValidation.value, unit: sUnit }
                }
            };

            return {
                success: true,
                result: acceleration,
                explanation: explainResult(acceleration, 'kinematic')
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
        if (['velocity', 'distance', 'force', 'kinematic'].includes(mode)) {
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
        // 验证模式参数
        if (!mode || typeof mode !== 'string') {
            throw new Error('无效的计算模式参数');
        }

        // 辅助函数：安全获取元素值
        function safeGetElementValue(id) {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`无法找到元素: ${id}`);
            }
            return element.value;
        }

        switch (mode) {
            case 'velocity':
                result = calculator.calculateFromVelocity(
                    safeGetElementValue('vi1'),
                    safeGetElementValue('vf1'),
                    safeGetElementValue('t1'),
                    safeGetElementValue('vi1Unit'),
                    safeGetElementValue('vf1Unit'),
                    safeGetElementValue('t1Unit')
                );
                break;

            case 'distance':
                result = calculator.calculateFromDistance(
                    safeGetElementValue('vi2'),
                    safeGetElementValue('d2'),
                    safeGetElementValue('t2'),
                    safeGetElementValue('vi2Unit'),
                    safeGetElementValue('d2Unit'),
                    safeGetElementValue('t2Unit')
                );
                break;

            case 'force':
                result = calculator.calculateFromForce(
                    safeGetElementValue('m3'),
                    safeGetElementValue('f3'),
                    safeGetElementValue('m3Unit'),
                    safeGetElementValue('f3Unit')
                );
                break;

            case 'kinematic':
                result = calculator.calculateFromKinematic(
                    safeGetElementValue('vi4'),
                    safeGetElementValue('vf4'),
                    safeGetElementValue('s4'),
                    safeGetElementValue('vi4Unit'),
                    safeGetElementValue('vf4Unit'),
                    safeGetElementValue('s4Unit')
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
    try {
        const resultSection = document.getElementById('resultSection');
        const resultValue = document.getElementById('resultValue');
        const resultExplanation = document.getElementById('resultExplanation');

        // 检查关键元素是否存在
        if (!resultSection || !resultValue || !resultExplanation) {
            console.error('关键结果显示元素不存在:', {
                resultSection: !!resultSection,
                resultValue: !!resultValue,
                resultExplanation: !!resultExplanation
            });
            showToast('显示结果失败：页面元素未找到', 3000);
            return;
        }

        if (result.success) {
            // 显示结果区域
            resultSection.style.display = 'block';

            // 格式化并显示数值
            const numberElement = resultValue.querySelector('.result-number');
            const unitElement = resultValue.querySelector('.result-unit');

            // 检查结果子元素是否存在
            if (!numberElement || !unitElement) {
                console.error('结果子元素不存在:', {
                    numberElement: !!numberElement,
                    unitElement: !!unitElement
                });
                showToast('显示结果失败：结果元素结构不完整', 3000);
                return;
            }

            // 动画显示数字
            const currentValue = parseFloat(numberElement.textContent) || 0;
            const newValue = parseFloat(formatNumber(result.result));
            
            // 检查 formatNumber 函数是否存在
            if (typeof formatNumber === 'function') {
                animateNumber(numberElement, currentValue, newValue);
            } else {
                // 如果 formatNumber 不存在，直接显示数字
                numberElement.textContent = result.result.toFixed(3);
            }
            
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
    } catch (error) {
        console.error('显示结果时发生错误:', error);
        showToast('显示结果失败，请刷新页面重试', 3000);
    }
}

// 重置表单
function resetForm(mode) {
    try {
        console.log('Reset form called with mode:', mode);
        
        // 验证输入参数
        if (!mode || typeof mode !== 'string') {
            console.error('Invalid mode parameter:', mode);
            showToast('重置失败：无效的模式参数', 2000);
            return;
        }
        
        const panelId = `${mode}-panel`;
        console.log('Looking for panel with ID:', panelId);
        
        // 等待一小段时间确保DOM完全加载
        setTimeout(() => {
            const panel = document.getElementById(panelId);
            console.log('Panel found:', panel);
            
            if (!panel) {
                console.error(`无法找到面板元素: ${panelId}`);
                showToast('重置失败：找不到对应的表单面板', 2000);
                return;
            }

            // 双重检查 panel 是否仍然存在
            if (!panel || typeof panel.querySelectorAll !== 'function') {
                console.error('Panel is null or invalid:', panel);
                showToast('重置失败：表单面板无效', 2000);
                return;
            }
            
            const inputs = panel.querySelectorAll('input');
            const selects = panel.querySelectorAll('select');
            
            console.log('Inputs found:', inputs.length);
            console.log('Selects found:', selects.length);

            // 清空输入框
            if (inputs && inputs.length > 0) {
                inputs.forEach(input => {
                    if (input && typeof input.value !== 'undefined') {
                        input.value = '';
                        const inputGroup = input.closest('.input-group');
                        if (inputGroup && typeof clearError === 'function') {
                            clearError(inputGroup);
                        }
                    }
                });
            }

            // 重置选择框到默认值
            if (selects && selects.length > 0) {
                selects.forEach(select => {
                    if (select && typeof select.selectedIndex !== 'undefined') {
                        select.selectedIndex = 0;
                    }
                });
            }

            // 隐藏结果区域
            const resultSection = document.getElementById('resultSection');
            if (resultSection) {
                resultSection.style.display = 'none';
            }
            
            // 清除计算器结果
            if (calculator && typeof calculator.clearResult === 'function') {
                calculator.clearResult();
            }

            const modeNames = {
                'velocity': '速度变化',
                'distance': '距离时间',
                'force': '力质量',
                'kinematic': '运动学'
            };
            
            const modeName = modeNames[mode] || mode;
            showToast(`${modeName}模式已重置`, 1500);
            
        }, 10); // 10ms 延迟确保DOM完全准备好
        
    } catch (error) {
        console.error('Reset form error:', error);
        showToast('重置失败，请刷新页面重试', 2000);
    }
}
