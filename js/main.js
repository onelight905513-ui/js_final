// ============================================================
//  main.js — 이벤트 연결 및 초기화 (완성 코드 — 수정 금지)
// ============================================================

import { appendNumber, appendOperator, calculate, deleteLast, clearAll, setExpression } from './calculator.js';
import {
    loadHistory,
    addHistory,
    clearHistory,
    deleteHistoryItem
} from './history.js';

// DOM 요소
const historyPanel = document.getElementById("historyPanel");
const historyList  = document.getElementById("historyList");
const historyBtn   = document.getElementById("historyBtn");
const clearAllBtn  = document.getElementById("clearAllBtn");
const themeBtn     = document.getElementById("themeBtn");
const badge        = document.getElementById("badge");

// ── 기록 렌더링 ──────────────────────────────────────────────
const renderHistory = (history) => {
    badge.textContent = history.length;

    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-msg">아직 계산 기록이 없어요 🧮</li>';
        return;
    }

historyList.innerHTML = history.map((item, index) => `
        <li class="history-item" style="padding-right: 40px;">
            <div class="hist-expr">${item.expression} =</div>
            <div class="hist-result">${item.result}</div>
            <div class="hist-date">${item.date}</div>

            
            <button
                type="button"
                class="del-item-btn"
                data-index="${index}"
                aria-label="이 기록 삭제"
                title="이 기록 삭제"
                style="opacity: 1;"
            >×</button>
        </li>
    `).join("");
};

// ── 버튼 이벤트 ──────────────────────────────────────────────
document.querySelectorAll(".btn-num").forEach(btn =>
    btn.addEventListener("click", () => appendNumber(btn.dataset.num))
);

document.querySelectorAll(".btn-op").forEach(btn =>
    btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        appendOperator(btn.dataset.op);
    })
);

document.querySelector("[data-action='equals']").addEventListener("click", () => {
    const r = calculate();
    if (r) renderHistory(addHistory(r.expression, r.result));
    document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
});

document.querySelector("[data-action='clear']").addEventListener("click", clearAll);

document.querySelector("[data-action='delete']").addEventListener("click", deleteLast);

// ── 키보드 입력 ──────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
    if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
        appendNumber(e.key);
        return;
    }
    if (["+", "-", "*", "/"].includes(e.key)) {
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
        const opBtn = document.querySelector(`[data-op="${e.key}"]`);
        if (opBtn) opBtn.classList.add("active");
        appendOperator(e.key);
        return;
    }
    if (e.key === "Enter" || e.key === "=") {
        const r = calculate();
        if (r) renderHistory(addHistory(r.expression, r.result));
        document.querySelectorAll(".btn-op").forEach(b => b.classList.remove("active"));
    }
    if (e.key === "Backspace") deleteLast();
    if (e.key === "Escape")    clearAll();
});

// ── 기록 패널 토글 ───────────────────────────────────────────
historyBtn.addEventListener("click", () =>
    historyPanel.classList.toggle("open")
);

clearAllBtn.addEventListener("click", () => renderHistory(clearHistory()));

historyList.addEventListener("click", (event) => {
    const item = event.target.closest(".history-item");

    // 기록 항목을 클릭한 경우에만 처리
    if (!item || !historyList.contains(item)) {
        return;
    }

    // ① × 버튼 클릭 → 해당 기록 삭제
    const deleteButton = event.target.closest(".del-item-btn");

    if (deleteButton) {
        event.stopPropagation();

        const index = Number(deleteButton.dataset.index);
        const updatedHistory = deleteHistoryItem(index);

        renderHistory(updatedHistory);

        // 삭제한 결과를 계산기에 불러오지 않도록 종료
        return;
    }

    // ② 기록 클릭 → 해당 결과 불러오기
    const result = item.querySelector(".hist-result");

    if (result) {
        setExpression(result.textContent.trim());

        // 이전 연산자 버튼의 선택 표시 해제
        document.querySelectorAll(".btn-op").forEach(button => {
            button.classList.remove("active");
        });
    }
});

// ── 다크모드 ─────────────────────────────────────────────────
const applyTheme = (dark) => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    themeBtn.textContent = dark ? "☀️" : "🌙";
};

themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(!isDark);
    localStorage.setItem("calc_theme", !isDark ? "dark" : "light");
});

// ── 초기화 ───────────────────────────────────────────────────
applyTheme(localStorage.getItem("calc_theme") === "dark");
renderHistory(loadHistory());
