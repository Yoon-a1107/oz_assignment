// calculator.js

const display = document.getElementById('display');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const enterBtn = document.querySelector('.enter');
const clearBtn = document.querySelector('.clear');
const onOffBtn = document.querySelector('.on-off');

let isOn = true; // 기본 켜짐 상태
let currentOperand = '';
let previousOperand = '';
let operation = undefined;

// 디스플레이 업데이트 함수
function updateDisplay() {
    if (!isOn) {
        display.value = '';
        return;
    }
    // 입력값이 없으면 0 표시
    display.value = currentOperand === '' ? '0' : currentOperand;
}

// ON/OFF 버튼 로직
onOffBtn.addEventListener('click', () => {
    isOn = !isOn;
    if (isOn) {
        onOffBtn.classList.add('on');
        currentOperand = '';
        previousOperand = '';
        operation = undefined;
    } else {
        onOffBtn.classList.remove('on');
    }
    updateDisplay();
});

// 숫자 및 소수점 버튼 로직
numberBtns.forEach(button => {
    button.addEventListener('click', () => {
        if (!isOn) return;
        
        const number = button.innerText;
        
        // 소수점 중복 입력 방지
        if (number === '.' && currentOperand.includes('.')) return;
        
        // 맨 처음 0이 연속으로 찍히는 것 방지 (예: 0005 -> 5)
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
        updateDisplay();
    });
});

// 연산자 버튼 로직 (+, -, *, /)
operatorBtns.forEach(button => {
    button.addEventListener('click', () => {
        if (!isOn) return;
        if (currentOperand === '') return;
        
        // 연산자가 이미 있는 상태에서 다른 연산자를 누르면 누적 계산
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = button.innerText;
        previousOperand = currentOperand;
        currentOperand = '';
    });
});

// 실제 계산 로직
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // 숫자가 아니면 계산 중단
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            // 0으로 나누기 방지
            if (current === 0) {
                currentOperand = 'Error';
                operation = undefined;
                previousOperand = '';
                updateDisplay();
                currentOperand = ''; // 에러 표시 후 초기화를 위해 비움
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    // 자바스크립트 부동소수점 오차 보정 (예: 0.1 + 0.2 = 0.3)
    currentOperand = Math.round(computation * 100000000) / 100000000;
    currentOperand = currentOperand.toString();
    operation = undefined;
    previousOperand = '';
}

// Enter(=) 버튼 로직
enterBtn.addEventListener('click', () => {
    if (!isOn || currentOperand === '' || previousOperand === '') return;
    calculate();
    updateDisplay();
});

// Clear(C) 버튼 로직
clearBtn.addEventListener('click', () => {
    if (!isOn) return;
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
});

// 스크립트 로드 시 초기 화면 설정
updateDisplay();