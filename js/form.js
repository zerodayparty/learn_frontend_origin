"use strict";

window.PortfolioForm = (() => { // 연락 폼 검증 기능을 한 묶음으로 만든다.

    const form = document.querySelector(".contact-form"); // 검증할 연락 폼을 찾는다.
    const successMessage = document.querySelector(".form-success"); // 전체 검증 결과를 표시할 요소를 찾는다.

    const getError = (field) => { // 한 입력칸의 오류 문장을 계산한다.
        const value = field.value.trim(); // 입력값 앞뒤의 빈칸을 제거한다.
        if (!value) return field.id === "name" ? "이름을 입력해라." : field.id === "email" ? "이메일을 입력해라." : "메시지를 입력해라."; // 비어 있으면 입력칸별 필수 문장을 돌려준다.
        if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "name@example.com 형태로 입력해라."; // 이메일 형태가 잘못되면 안내한다.
        if (field.id === "name" && value.length < 2) return "이름은 두 글자 이상 입력해라."; // 이름이 너무 짧으면 안내한다.
        if (field.id === "message" && value.length < 10) return "메시지는 열 글자 이상 입력해라."; // 메시지가 너무 짧으면 안내한다.
        return ""; // 모든 검사를 통과하면 빈 문장을 돌려준다.
    }; // 오류 문장 계산을 끝낸다.

    const validateField = (field) => { // 한 입력칸의 검증 결과를 화면에 표시한다.
        const error = getError(field); // 현재 입력값의 오류 문장을 계산한다.

        const errorElement = document.querySelector(`#${field.id}-error`); // 입력칸과 연결된 오류 표시 요소를 찾는다.

        field.classList.toggle("invalid", Boolean(error)); // 오류가 있으면 빨간 테두리 클래스를 추가한다.

        field.setAttribute("aria-invalid", String(Boolean(error))); // 보조 기술에 오류 여부를 알려준다.

        errorElement.textContent = error; // 입력칸 가까이에 오류 문장을 표시한다.

        return !error; // 오류가 없으면 참을 돌려준다.
    }; // 한 입력칸 검증을 끝낸다.

    const handleSubmit = (event) => { // 연락 폼 제출을 처리한다.
        event.preventDefault(); // 실제 전송과 페이지 새로고침을 막는다.
        const fields = [...form.querySelectorAll("input, textarea")]; // 모든 입력칸을 배열로 만든다.
        const formIsValid = fields.map(validateField).every(Boolean); // 각 입력칸을 검사하고 모두 통과했는지 계산한다.
        successMessage.textContent = formIsValid ? "입력값 검증을 통과했다. 실제 전송이나 저장은 하지 않았다." : "입력값을 다시 확인해라."; // 전체 결과를 표시한다.
        if (!formIsValid) fields.find((field) => getError(field))?.focus(); // 처음 잘못된 입력칸으로 초점을 옮긴다.
    }; // 폼 제출 처리를 끝낸다.

    const initialize = () => { // 폼 기능을 시작한다.
        form.addEventListener("submit", handleSubmit); // 폼 제출과 전체 검증을 연결한다.
        form.addEventListener("input", (event) => { validateField(event.target); successMessage.textContent = ""; }); // 입력할 때 한 칸을 검사하고 이전 성공 문장을 지운다.
    }; // 폼 기능 시작을 끝낸다.

    return { initialize }; // app.js가 사용할 시작 함수만 외부에 공개한다.

})(); // 폼 기능 묶음을 완성한다.
