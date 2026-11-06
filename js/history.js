// ============================================================
//  history.js — 계산 기록 관리 (localStorage)
//  📝 과제: 💡 표시된 빈칸을 채워 기능을 완성하세요.
// ============================================================

const STORAGE_KEY = "calc_history";
const MAX_COUNT   = 20;

// ── 과제 5: 기록 불러오기 ────────────────────────────────────
/**
 * localStorage에서 계산 기록 배열을 불러옵니다.
 *
 * 힌트:
 *  - localStorage.getItem(STORAGE_KEY) 로 값을 가져옵니다.
 *  - 저장된 값이 없으면(null이면) 빈 배열 []을 반환합니다.
 *  - JSON.parse() 로 문자열 → 배열 변환이 필요합니다.
 *
 * @returns {Array} 기록 배열
 */
export const loadHistory = () => {
    // 💡 [과제 5] 여기에 코드를 작성하세요.
  const storedHistory = localStorage.getItem(STORAGE_KEY);

    // 저장된 기록이 없으면 빈 배열 반환
    if (storedHistory === null) {
        return [];
    }

    // 저장된 문자열을 배열로 변환하여 반환
    return JSON.parse(storedHistory);


};

// ── 과제 6: 기록 저장 ────────────────────────────────────────
/**
 * 계산 기록 배열을 localStorage에 저장합니다.
 *
 * 힌트:
 *  - JSON.stringify() 로 배열 → 문자열 변환 후 저장합니다.
 *  - MAX_COUNT(20)개 초과분은 제거하세요. (힌트: history.slice(0, MAX_COUNT))
 *
 * @param {Array} history - 저장할 기록 배열
 */
export const saveHistory = (history) => {
    // 💡 [과제 6] 여기에 코드를 작성하세요.
// 앞에서부터 최대 20개까지만 유지
    const limitedHistory = history.slice(0, MAX_COUNT);

    // 배열을 문자열로 변환하여 저장
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(limitedHistory)
    );


};

// ── 과제 7: 기록 항목 추가 ───────────────────────────────────
/**
 * 새 계산 결과를 기록 맨 앞에 추가하고 저장합니다.
 *
 * 저장할 항목 형식:
 *   { expression, result, date: new Date().toLocaleString("ko-KR") }
 *
 * 구현 순서:
 *  1. loadHistory() 로 기존 기록을 가져옵니다.
 *  2. 새 항목을 배열 맨 앞에 추가합니다. (힌트: [새항목, ...기존배열])
 *  3. saveHistory() 로 저장합니다.
 *  4. 업데이트된 배열을 반환합니다.
 *
 * @param {string} expression - 계산 수식 (예: "3+4")
 * @param {string} result     - 계산 결과 (예: "7")
 * @returns {Array} 업데이트된 기록 배열
 */
export const addHistory = (expression, result) => {
    // 💡 [과제 7] 여기에 코드를 작성하세요.
// 1. 기존 기록 가져오기
    const history = loadHistory();

    // 2. 새 기록을 만들어 배열 맨 앞에 추가
    const newItem = {
        expression,
        result,
        date: new Date().toLocaleString("ko-KR")
    };

    const updatedHistory = [newItem, ...history].slice(0, MAX_COUNT);

    // 3. 업데이트된 기록 저장
    saveHistory(updatedHistory);

    // 4. 업데이트된 배열 반환
    return updatedHistory;


};

// ── 도전 2: 기록 개별 삭제 (선택 과제) ──────────────────────
/**
 * 특정 인덱스의 기록 항목을 삭제하고 저장합니다.
 *
 * 힌트 1: loadHistory()로 배열을 가져옵니다.
 * 힌트 2: filter() 또는 splice()로 해당 인덱스 항목을 제거합니다.
 * 힌트 3: saveHistory()로 저장하고 업데이트된 배열을 반환합니다.
 *
 * @param {number} index - 삭제할 항목의 인덱스
 * @returns {Array} 업데이트된 기록 배열
 */
export const deleteHistoryItem = (index) => {
    // 💡 [도전 2] 여기에 코드를 작성하세요.
// 1. 기존 기록 불러오기
    const history = loadHistory();

    // 2. 해당 인덱스의 기록만 제외
    const updatedHistory = history.filter(
        (item, itemIndex) => itemIndex !== index
    );

    // 3. 변경된 기록 저장
    saveHistory(updatedHistory);

    // 4. 화면 갱신에 사용할 배열 반환
    return updatedHistory;


};

// ── 기록 전체 삭제 (완성 코드 — 수정 금지) ──────────────────
export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};
