// ============================================================
//  calculator.js — 계산기 핵심 로직
//  📝 과제: 💡 표시된 빈칸을 채워 기능을 완성하세요.
// ============================================================

const mainDisplay = document.getElementById("mainDisplay");
const subDisplay  = document.getElementById("subDisplay");

let expression     = "";    // 현재 입력 중인 수식 문자열
let justCalculated = false; // 방금 = 을 눌렀는지 여부

// 디스플레이 갱신 — main.js에서도 호출합니다 (수정 금지)
export const updateDisplay = () => {
    mainDisplay.textContent = expression || "0";
    mainDisplay.style.fontSize = expression.length > 10 ? "1.8rem" : "2.6rem";
};

// ── 과제 1: 숫자 / 소수점 입력 ──────────────────────────────
/**
 * 버튼에서 눌린 숫자(또는 '.')를 expression에 추가합니다.
 *
 * 구현해야 할 규칙:
 *  1. justCalculated가 true이면 expression을 ""로 초기화 후 입력 (새 계산 시작)
 *  2. expression이 "0"일 때 숫자를 누르면 "0"을 대체 (앞자리 0 방지)
 *  3. 소수점(.)은 현재 숫자 구간에 이미 있으면 추가하지 않음
 *
 * @param {string} num - 입력된 숫자 문자 ("0"~"9", ".")
 */
export const appendNumber = (num) => {
    // 💡 [과제 1] 아래 규칙에 따라 코드를 작성하세요.
    //
    // 규칙 1. justCalculated가 true이면 expression을 ""로 초기화 후 입력
    //         (새로운 계산 시작)
    //
    // 규칙 2. expression이 "0"일 때 숫자를 누르면 "0"을 대체
    //         (예: "0" + "5" → "5",  "0" + "." → "0.")
    //
    // 규칙 3. 소수점(.)은 현재 숫자 구간에 이미 있으면 추가하지 않음
    //         (예: "3.14" 상태에서 "." 을 눌러도 무시)
    //         힌트: expression.split(/[+\-*\/]/) 로 숫자 구간을 나눌 수 있습니다.

   // 계산 직후 숫자를 입력하면 새로운 계산 시작
    if (justCalculated) {
        expression = "";
        subDisplay.textContent = "";
    }

    // 연산자를 기준으로 나누어 현재 숫자 구간 확인
    const currentNumber = expression.split(/[+\-*\/]/).pop();

    if (num === ".") {
        // 현재 숫자에 이미 소수점이 있으면 추가하지 않음
        if (currentNumber.includes(".")) {
            return;
        }

        // 처음이나 연산자 뒤에서는 "0."으로 입력
        expression += currentNumber === "" ? "0." : ".";
    } else if (currentNumber === "0") {
        // 앞자리 0을 새 숫자로 대체
        // 예: "0" → "5", "3+0" → "3+5"
        expression = expression.slice(0, -1) + num;
    } else {
        expression += num;
    }


    justCalculated = false;
    updateDisplay();
};

// ── 과제 2: 연산자 입력 ─────────────────────────────────────
/**
 * 연산자(+, -, *, /)를 expression 끝에 추가합니다.
 *
 * 구현해야 할 규칙:
 *  1. expression이 비어 있으면 무시 (연산자로 시작 불가)
 *  2. 마지막 문자가 이미 연산자이면 새 연산자로 교체
 *  3. justCalculated가 true이면 이전 결과에 이어서 연산 가능 (expression 유지)
 *
 * @param {string} op - 연산자 문자 ("+", "-", "*", "/")
 */
export const appendOperator = (op) => {
    // 💡 [과제 2] 아래 규칙에 따라 코드를 작성하세요.
    //
    // 규칙 1. expression이 비어 있으면 무시 (연산자로 시작 불가)
    //
    // 규칙 2. 마지막 문자가 이미 연산자이면 새 연산자로 교체
    //         (예: "3+" 상태에서 "*" 누르면 → "3*")
    //
    // 규칙 3. justCalculated가 true이면 expression을 유지하고 연산자 추가
    //         (= 누른 직후 이어서 계산 가능)
    //
    // 힌트: 문자열의 마지막 문자 → expression[expression.length - 1]
    // 힌트: 마지막 문자 제거    → expression.slice(0, -1)

  // 수식이 비어 있으면 연산자 입력 무시
    if (expression === "") {
        return;
    }

    const lastChar = expression[expression.length - 1];

    if ("+-*/".includes(lastChar)) {
        // 마지막 문자가 연산자이면 새 연산자로 교체
        expression = expression.slice(0, -1) + op;
    } else {
        // 계산 직후에도 기존 결과를 유지하고 연산자 추가
        expression += op;
    }

    justCalculated = false;
    updateDisplay();
};

// ── 과제 3: 계산 실행 ───────────────────────────────────────
/**
 * expression을 계산하여 결과를 화면에 출력합니다.
 *
 * 구현해야 할 규칙:
 *  1. expression이 비어 있거나 연산자로 끝나면 null 반환 (계산 안 함)
 *  2. 0으로 나누기 감지 → subDisplay에 에러 메시지 표시 후 null 반환
 *  3. 성공 시:
 *     - mainDisplay → 결과값
 *     - subDisplay  → "입력한 수식 ="
 *     - justCalculated = true
 *  4. 반환값: { expression, result } 객체 (기록 저장에 사용)
 *
 * 힌트 — 수식 문자열을 안전하게 계산하는 방법:
 *   Function('"use strict"; return (' + expression + ')')()
 *   eval() 과 같은 역할이지만 전역 스코프에 접근하지 않아 조금 더 안전합니다.
 *
 * 힌트 — 부동소수점 오류 처리:
 *   parseFloat(result.toFixed(10)).toString()
 *
 * @returns {{ expression: string, result: string } | null}
 */
export const calculate = () => {
    // 💡 [과제 3] 아래 규칙에 따라 코드를 작성하세요.
    //
    // 규칙 1. expression이 비어 있거나 연산자로 끝나면 null 반환
    //
    // 규칙 2. 0으로 나누기 감지 → subDisplay에 에러 메시지 표시 후 null 반환
    //         (힌트: /\/0/.test(expression) 으로 감지)
    //
    // 규칙 3. 계산 성공 시:
    //         - mainDisplay.textContent    = 결과값
    //         - mainDisplay.style.fontSize = 결과값 길이에 따라 조정
    //         - subDisplay.textContent     = "수식 ="
    //         - justCalculated = true
    //         - expression = 결과값 (이후 연산에 이어 쓸 수 있도록)
    //
    // 규칙 4. 반환값: { expression: 수식, result: 결과값 문자열 }
    //         (main.js에서 기록 저장에 사용합니다)

 // 비어 있거나 연산자로 끝나는 수식은 계산하지 않음
    if (expression === "" || /[+\-*\/]$/.test(expression)) {
        return null;
    }

    // 계산 결과로 변경하기 전에 원래 수식 저장
    const originalExpression = expression;

    // 일반 숫자와 지수 표기 숫자 허용
    // 예: 12, 0.5, 3., 1e-7
    const numberPattern = String.raw`(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?`;

    // 숫자와 사칙연산으로 이루어진 수식인지 확인
    const validExpression = new RegExp(
        `^[+-]?${numberPattern}(?:[+*/-]${numberPattern})*$`,
        "i"
    );

    if (!validExpression.test(expression)) {
        subDisplay.textContent = "올바른 수식을 입력하세요.";
        return null;
    }

    // 나눗셈 뒤에 있는 숫자가 실제로 0인지 확인
    const divisionPattern = new RegExp(
        `/(${numberPattern})`,
        "gi"
    );

    for (const match of expression.matchAll(divisionPattern)) {
        if (Number(match[1]) === 0) {
            subDisplay.textContent = "0으로 나눌 수 없습니다.";
            return null;
        }
    }

    try {
        // 힌트의 Function을 사용하여 계산
        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            subDisplay.textContent = "계산 가능한 범위를 벗어났습니다.";
            return null;
        }

        // 힌트에 따라 소수점 아래 10자리로 반올림하여 오차 정리
        const resultString = parseFloat(result.toFixed(10)).toString();

        // 이전 수식과 결과 표시
        subDisplay.textContent = originalExpression + " =";
        expression = resultString;
        justCalculated = true;

        // 결과 표시 및 글자 크기 조정
        updateDisplay();

        // 기록 저장에 사용할 객체 반환
        return {
            expression: originalExpression,
            result: resultString
        };
    } catch (error) {
        subDisplay.textContent = "올바른 수식을 입력하세요.";
        return null;
    }

};

// ── 과제 4: 마지막 문자 삭제 ────────────────────────────────
/**
 * expression의 마지막 글자 하나를 제거합니다.
 * justCalculated 상태(계산 직후)라면 전체를 초기화합니다.
 */
export const deleteLast = () => {
    // 💡 [과제 4] 아래 규칙에 따라 코드를 작성하세요.
    //
    // 규칙 1. justCalculated가 true이면 전체 초기화 (clearAll 호출)
    //
    // 규칙 2. 그렇지 않으면 expression의 마지막 글자 하나만 제거
    //         (힌트: expression.slice(0, -1))

 if (justCalculated) {
        // 계산 직후 삭제 버튼을 누르면 전체 초기화
        clearAll();
        return;
    }

    // 마지막 문자 하나 삭제
    expression = expression.slice(0, -1);

    updateDisplay();
};

// ── 도전 1: % 연산 (선택 과제) ──────────────────────────────
/**
 * 현재 입력된 마지막 숫자를 100으로 나눕니다.
 * 연산자로 끝나거나 expression이 비어 있으면 무시합니다.
 *
 * 예) "50"    → % 클릭 → "0.5"
 *     "100+50" → % 클릭 → "100+0.5"
 *     연산자 뒤에는 동작하지 않습니다.
 *
 * 힌트: expression.lastIndexOf("+") 등으로 마지막 연산자 위치를 찾고
 *       그 뒤의 숫자 부분만 parseFloat(numStr) / 100 으로 교체합니다.
 */
export const appendPercent = () => {
    // 💡 [도전 1] 여기에 코드를 작성하세요.

      if (expression === "" || /[+\-*/]$/.test(expression)) {
        return;
    }

    // 지수 표기(예: 1e-7)의 부호는 연산자에서 제외
    const operatorSearch = expression.replace(/e[+-]/gi, "e_");

    // 마지막 연산자 위치 찾기
    const lastOperatorIndex = Math.max(
        operatorSearch.lastIndexOf("+"),
        operatorSearch.lastIndexOf("-"),
        operatorSearch.lastIndexOf("*"),
        operatorSearch.lastIndexOf("/")
    );

    // 마지막 숫자를 100으로 나누기
    const numStr = expression.slice(lastOperatorIndex + 1);
    const percentValue = parseFloat(numStr) / 100;

    if (!Number.isFinite(percentValue)) {
        return;
    }

    // 앞의 수식은 유지하고 마지막 숫자만 교체
    expression =
        expression.slice(0, lastOperatorIndex + 1) +
        Number(percentValue.toPrecision(15)).toString();

    justCalculated = false;
    subDisplay.textContent = "";
    updateDisplay();

};

// ── 도전 3: 기록 클릭 시 결과 불러오기 (선택 과제) ──────────
/**
 * 외부에서 expression 값을 직접 설정합니다.
 * 기록 항목을 클릭했을 때 해당 결과를 계산기에 불러오는 데 사용합니다.
 *
 * 힌트: expression = value 로 대입하고
 *       justCalculated = true, updateDisplay() 를 호출합니다.
 */
export const setExpression = (value) => {
    // 💡 [도전 3] 여기에 코드를 작성하세요.
 // 기록의 결과를 문자열로 불러오기
  expression = String(value);

    // 이후 숫자를 누르면 새 계산 시작,
    // 연산자를 누르면 불러온 결과에 이어서 계산
    justCalculated = true;

    subDisplay.textContent = "";
    updateDisplay();


};

// ── 전체 초기화 (완성 코드 — 수정 금지) ─────────────────────
export const clearAll = () => {
    expression     = "";
    justCalculated = false;
    mainDisplay.textContent    = "0";
    mainDisplay.style.fontSize = "2.6rem";
    subDisplay.textContent     = "";
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
};
