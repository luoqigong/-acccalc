// 单位转换表
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
function formatNumber(value, decimals = 3) {
    if (isNaN(value) || !isFinite(value)) {
        return '无效';
    }
    
    if (Math.abs(value) < 1e-10) {
        return '0';
    }
    
    if (Math.abs(value) >= 1e6) {
        return value.toExponential(decimals);
    }
    
    if (Math.abs(value) >= 100) {
        decimals = Math.max(0, decimals - 2);
    } else if (Math.abs(value) >= 10) {
        decimals = Math.max(1, decimals - 1);
    }
    
    return parseFloat(value.toFixed(decimals)).toString();
}

// 输入验证
function validateInput(value, type = 'number') {
    const result = {
        isValid: false,
        value: null,
        error: null
    };
    
    if (!value || value.trim() === '') {
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

// 显示错误信息
function showError(element, message) {
    element.classList.add('error');
    
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    element.parentNode.insertBefore(errorElement, element.nextSibling);
    
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// 清除错误状态
function clearError(element) {
    element.classList.remove('error');
    
    const errorElement = element.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// 防抖函数
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// 解释计算结果
function explainResult(acceleration, mode) {
    const absAccel = Math.abs(acceleration);
    let magnitude, comparison, safety;
    
    if (absAccel < 1) {
        magnitude = '较小';
    } else if (absAccel < 5) {
        magnitude = '中等';
    } else if (absAccel < 10) {
        magnitude = '较大';
    } else {
        magnitude = '极大';
    }
    
    if (absAccel < 0.1) {
        comparison = '相当于缓慢变速';
    } else if (absAccel < 2) {
        comparison = '相当于电梯启动或制动';
    } else if (absAccel < 5) {
        comparison = '相当于汽车正常加速或制动';
    } else if (absAccel < 10) {
        comparison = '相当于汽车紧急制动';
    } else if (absAccel < 20) {
        comparison = '相当于过山车或高性能汽车';
    } else {
        comparison = '相当于火箭发射或极端情况';
    }
    
    if (absAccel > 15) {
        safety = '⚠️ 注意：如此大的加速度可能对人体造成不适或伤害。';
    } else if (absAccel > 30) {
        safety = '🚨 警告：极高的加速度，可能造成严重伤害！';
    } else {
        safety = '';
    }
    
    let explanation = `这是一个${magnitude}的加速度值，${comparison}。`;
    
    if (acceleration < 0) {
        explanation += ' 负值表示减速（制动）。';
    }
    
    if (safety) {
        explanation += ` ${safety}`;
    }
    
    return explanation;
}

// 动画数字变化
function animateNumber(element, startValue, endValue, duration = 500) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOut;
        
        element.textContent = formatNumber(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 显示提示
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}
