"use strict";

window.PortfolioProjects = (() => {         // GitHub 프로젝트 기능을 한 묶음으로 만든다.
    const CONFIG = window.PortfolioConfig;  // config.js에서 만든 공통 설정을 가져온다.

    // 🔥 저장소, API 상태, 오류, 선택 언어를 상태 객체에 둔다.
    const state = { projects: [], status: "idle", error: "", language: "전체" }; // 프로젝트 데이터와 화면 상태를 저장한다.


    const elements = {                                      // 프로젝트 기능에 필요한 HTML 요소를 모은다.
        filterBar: document.querySelector(".filter-bar"),   // 언어 필터 버튼 영역을 찾는다.
        status: document.querySelector(".project-status"), // 로딩과 오류 상태 영역을 찾는다.
        grid: document.querySelector(".project-grid"),      // 프로젝트 카드 영역을 찾는다.
        source: document.querySelector(".project-source"), // GitHub 계정 안내 문장을 찾는다.
    }; // 프로젝트 화면 요소 모음을 끝낸다.


    const escapeHTML = (value) => String(value) // 외부 값을 안전한 문자열로 바꾼다.
        // escapeHTML을 사용하는 이유는 **XSS (Cross-Site Scripting, 크로스 사이트 스크립팅)**라는 사이버 해킹 공격을 막기 위해서다. 
        // 외부 데이터(GitHub 프로젝트 이름, 설명 등)나 사용자가 입력한 텍스트를 innerHTML로 화면에 그대로 넣으면, 
        // 브라우저가 해킹용 자바스크립트 코드를 진짜 웹페이지 명령어로 착각하고 실행해 버린다.
        .replaceAll("&", "&amp;")               // 앰퍼샌드를 HTML 문자 코드로 바꾼다.
        .replaceAll("<", "&lt;")                // 여는 꺾쇠를 HTML 문자 코드로 바꾼다.
        .replaceAll(">", "&gt;")                // 닫는 꺾쇠를 HTML 문자 코드로 바꾼다.
        .replaceAll('"', "&quot;")              // 큰따옴표를 HTML 문자 코드로 바꾼다.
        .replaceAll("'", "&#039;");             // 작은따옴표를 HTML 문자 코드로 바꾼다.


    const getSafeUrl = (value) => {                 // GitHub의 HTTPS 주소만 허용한다.
        try {                                       // 잘못된 주소가 들어와도 화면이 멈추지 않게 한다.
            const url = new URL(value);             // 문자열을 주소 객체로 바꾼다.
            return url.protocol === "https:" && url.hostname === "github.com" ? url.href : "https://github.com"; // 안전한 GitHub 주소만 돌려준다.
        } catch {                                   // 문자열이 주소 형식이 아니면 실행한다.
            return "https://github.com";             // 안전한 GitHub 첫 화면 주소를 대신 돌려준다.
        }                                           // 주소 오류 처리를 끝낸다.
    }; // 안전한 주소 검사를 끝낸다.


    const renderFilters = () => {                   // 현재 프로젝트로 언어 필터 버튼을 그린다.

        const languages = ["전체", ...new Set(state.projects.map(({ language }) => language).filter(Boolean))]; // map과 filter로 중복 없는 언어 목록을 만든다.

        elements.filterBar.innerHTML = languages.map((language) => {          // 각 언어를 버튼 HTML로 바꾼다.
            const safeLanguage = escapeHTML(language);                          // 언어 이름의 특수문자를 안전하게 바꾼다.

            const activeClass = language === state.language ? " active" : ""; // 선택된 언어의 활성 클래스를 만든다.

            return `<button class="filter-button${activeClass}" type="button" data-language="${safeLanguage}" aria-pressed="${language === state.language}">${safeLanguage}</button>`; // 안전한 필터 버튼 HTML을 돌려준다.

        }).join("");                                // 버튼 배열을 하나의 HTML 문자열로 합친다.
    }; // 필터 버튼 그리기를 끝낸다.


    const renderCards = () => {                 // 선택한 언어의 프로젝트 카드를 그린다.

        // 🔥 filter
        const visibleProjects = state.language === "전체" ? state.projects : state.projects.filter(({ language }) => language === state.language); // 선택한 언어에 맞는 프로젝트만 남긴다.
        // 선택한 언어가 "전체"가 아니라면 "state.projects.filter(" 실행
        // 현재 있는 project를 하나씩 인자로 넣고, 그 인자가 state.language와 같은 것만 모아서 return

        // 🔥 map
        // 구조분해와 map으로 각 프로젝트를 카드로 바꾼다.
        elements.grid.innerHTML = visibleProjects.map(({ name, description, html_url: url, language, stargazers_count: stars }) => {
            const safeName = escapeHTML(name);                          // 저장소 이름을 안전하게 바꾼다.

            const safeDescription = escapeHTML(description || "설명이 등록되지 않은 프로젝트다."); // 저장소 설명을 안전하게 바꾼다.

            const safeLanguage = escapeHTML(language || "기타"); // 언어 이름을 안전하게 바꾼다.

            const safeStars = Number.isFinite(stars) ? stars : 0; // 별 개수가 숫자가 아니면 0을 사용한다.

            return `<article class="project-card"><h3>${safeName}</h3><p class="project-description">${safeDescription}</p><div class="project-meta"><span><span class="language-dot" aria-hidden="true"></span>${safeLanguage}</span><span aria-label="별 ${safeStars}개">★ ${safeStars}</span></div><a class="project-link" href="${getSafeUrl(url)}" target="_blank" rel="noreferrer">저장소 보기 ↗</a></article>`; // 안전한 프로젝트 카드 HTML을 돌려준다.

        }).join("");                            // 카드 배열을 하나의 HTML 문자열로 합친다.

    }; // 프로젝트 카드 그리기를 끝낸다.


    const render = () => {                  // 현재 API 상태에 맞는 프로젝트 화면을 그린다.
        elements.grid.innerHTML = "";       // 이전 프로젝트 카드를 비운다.
        elements.status.innerHTML = "";     // 이전 상태 안내를 비운다.
        elements.filterBar.innerHTML = "";  // 이전 필터 버튼을 비운다.

        if (state.status === "loading") {   // 데이터를 불러오는 중인지 확인한다.
            elements.status.innerHTML = '<div class="status-card"><div><div class="spinner" aria-hidden="true"></div><p>GitHub 프로젝트를 불러오는 중...</p></div></div>'; // 로딩 화면을 표시한다.
            return;                         // 다른 상태를 그리지 않는다.
        }                                   // 로딩 상태 처리를 끝낸다.

        if (state.status === "error") {     // 요청이 실패했는지 확인한다.
            elements.status.innerHTML = `<div class="status-card"><div><p>${escapeHTML(state.error)}</p><button class="button button-primary retry-button" type="button">다시 시도</button></div></div>`; // 오류 문장과 재시도 버튼을 표시한다.
            return;                         // 다른 상태를 그리지 않는다.
        }                                   // 오류 상태 처리를 끝낸다.

        if (state.status === "empty") {     // 저장소 목록이 비어 있는지 확인한다.
            elements.status.innerHTML = '<div class="status-card"><p>표시할 프로젝트가 없다.</p></div>'; // 빈 상태 문장을 표시한다.
            return;                         // 다른 상태를 그리지 않는다.
        }                                   // 빈 상태 처리를 끝낸다.
        renderFilters();                    // 성공 상태의 언어 필터를 그린다.
        renderCards();                      // 성공 상태의 프로젝트 카드를 그린다.
    }; // 프로젝트 상태 화면 그리기를 끝낸다.


    // 🔥 GitHub Organization의 공개 저장소를 불러온다.
    const load = async () => {
        state.status = "loading";           // 요청 전 상태를 로딩으로 바꾼다.
        state.error = "";                   // 이전 오류 문장을 지운다.

        render();                           // 로딩 화면을 바로 보여준다.

        const controller = new AbortController(); // 오래 걸리는 요청을 중단할 도구를 만든다.
        const timeoutId = window.setTimeout(() => controller.abort(), 10000); // 10초 뒤 요청을 중단하도록 예약한다.

        try {                                   // 네트워크 요청과 데이터 처리를 시작한다.
            const safeOrganization = encodeURIComponent(CONFIG.githubOrganization); // Organization 이름이 URL 문법을 깨뜨리지 않도록 안전하게 바꾼다.

            const endpoint = `https://api.github.com/orgs/${safeOrganization}/repos?type=public&sort=updated&direction=desc&per_page=${CONFIG.projectLimit}`; // 공개 저장소를 최근 업데이트 순으로 요청하는 Organization API 주소를 만든다.

            const response = await fetch(endpoint, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal }); // GitHub 응답을 기다린다.

            if (!response.ok) throw new Error(response.status === 403 ? "GitHub API 호출 한도를 초과했다. 잠시 후 다시 시도해라." : `프로젝트를 불러올 수 없다. 응답 코드: ${response.status}`); // 실패 응답이면 알맞은 오류를 만든다.

            const data = await response.json(); // JSON 응답을 JavaScript 값으로 바꾼다.

            if (!Array.isArray(data)) throw new Error("GitHub 응답 형식이 예상과 다르다."); // 배열이 아니면 잘못된 응답으로 처리한다.

            state.projects = data;          // 저장소 배열을 상태에 저장한다.

            state.language = "전체";         // 새 데이터를 받으면 필터를 전체로 되돌린다.

            state.status = data.length ? "success" : "empty"; // 데이터 유무에 따라 성공 또는 빈 상태로 바꾼다.

        } catch (error) {                   // 네트워크나 데이터 오류가 발생하면 실행한다.
            state.status = "error";         // 상태를 오류로 바꾼다.
            state.error = error.name === "AbortError" ? "요청 시간이 10초를 넘었다. 네트워크를 확인하고 다시 시도해라." : error.message; // 시간 초과와 다른 오류를 구분한다.

        } finally {                         // 성공과 실패에 관계없이 마지막에 실행한다.
            window.clearTimeout(timeoutId); // 요청 중단 예약을 취소한다.
            render();                       // 최종 상태에 맞는 화면을 그린다.
        }                                   // 네트워크 요청 처리를 끝낸다.
    }; // GitHub 저장소 불러오기를 끝낸다.


    const handleClick = (event) => {                // 프로젝트 영역의 버튼 클릭을 처리한다.
        if (event.target.closest(".retry-button")) {// 재시도 버튼을 눌렀는지 확인한다.
            load();                                 // GitHub 요청을 다시 실행한다.
            return;                                 // 필터 버튼 검사를 하지 않는다.
        }                                           // 재시도 버튼 처리를 끝낸다.

        const filterButton = event.target.closest(".filter-button"); // 언어 필터 버튼을 눌렀는지 확인한다.
        if (!filterButton) return;                  // 필터 버튼이 아니면 끝낸다.
        state.language = filterButton.dataset.language; // 선택한 언어를 상태에 저장한다.
        renderFilters();                            // 선택 상태가 바뀐 필터 버튼을 다시 그린다.
        renderCards();                              // 선택한 언어의 프로젝트만 다시 그린다.
    };                                              // 프로젝트 영역 클릭 처리를 끝낸다.


    const initialize = () => {                      // GitHub 프로젝트 기능을 시작한다.
        elements.source.textContent = `${CONFIG.githubOrganization} Organization의 공개 저장소를 최근 업데이트 순으로 보여준다.`; // 어느 Organization에서 데이터를 가져왔는지 화면에 알린다.
        elements.status.addEventListener("click", handleClick);     // 동적으로 생기는 재시도 버튼을 처리한다.
        elements.filterBar.addEventListener("click", handleClick);  // 동적으로 생기는 필터 버튼을 처리한다.
        load();                                                     // 첫 GitHub 요청을 실행한다.
    };                                                              // GitHub 프로젝트 기능 시작을 끝낸다.


    return { initialize };           // app.js가 사용할 시작 함수만 외부에 공개한다.
})();                                // GitHub 프로젝트 기능 묶음을 완성한다.
