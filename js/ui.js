"use strict";

window.PortfolioUI = (() => { // 메뉴, 테마, 스크롤처럼 공통 화면 기능을 한 묶음으로 만든다.
    const CONFIG = window.PortfolioConfig; // config.js에서 만든 공통 설정을 가져온다.

    // 🔥🔥🔥🔥🔥 다크/라이트 모드
    const state = { theme: "light", menuOpen: false }; // 테마와 모바일 메뉴의 현재 상태를 저장한다.

    const elements = {                                  // 공통 화면 기능에 필요한 HTML 요소를 모은다.
        root: document.documentElement,                 // 테마 속성을 바꿀 html 요소를 찾는다.
        body: document.body,                            // 모바일 메뉴가 열릴 때 스크롤을 잠글 body 요소를 찾는다.
        header: document.querySelector(".site-header"), // 스크롤 스타일을 바꿀 상단 메뉴를 찾는다.
        menuButton: document.querySelector(".menu-toggle"), // 모바일 메뉴 버튼을 찾는다.
        navPanel: document.querySelector(".nav-panel"), // 열고 닫을 메뉴 패널을 찾는다.
        navLinks: document.querySelectorAll('.nav-list a[href^="#"]'), // 내부 섹션 링크를 모두 찾는다.
        themeButton: document.querySelector(".theme-toggle"), // 테마 변경 버튼을 찾는다.
        themeIcon: document.querySelector(".theme-icon"), // 테마 버튼 아이콘을 찾는다.
        themeText: document.querySelector(".theme-text"), // 테마 버튼 글자를 찾는다.
        typingText: document.querySelector(".typing-text"), // 타자 효과 글자를 넣을 요소를 찾는다.
        scrollTopButton: document.querySelector(".scroll-top"), // 맨 위 이동 버튼을 찾는다.
        year: document.querySelector(".current-year"), // 현재 연도를 넣을 요소를 찾는다.
        displayName: document.querySelector(".display-name"), // 공개 이름을 넣을 요소를 찾는다.        
        githubLinks: document.querySelectorAll(".github-link"), // GitHub 주소를 연결할 링크를 찾는다.
    };  // 공통 화면 요소 모음을 끝낸다.


    const readStoredTheme = () => {                         // 브라우저에 저장된 테마를 읽는다.
        try {                                               // file 주소에서 저장 공간 접근이 제한돼도 화면이 멈추지 않게 한다.
            return localStorage.getItem("portfolio-theme"); // 이전에 저장한 테마 값을 돌려준다.
        } catch {                                           // 브라우저가 저장 공간 접근을 거부하면 실행한다.
            return null;                                    // 저장값이 없는 것처럼 처리한다.
        }                                                   // 저장 공간 오류 처리를 끝낸다.
    }; // 저장된 테마 읽기를 끝낸다.

    const saveTheme = () => {                                     // 현재 테마를 브라우저에 저장한다.
        try {                                                     // 저장 공간 사용이 막혀도 다른 기능은 계속 동작하게 한다.
            localStorage.setItem("portfolio-theme", state.theme); // 새로고침 뒤에도 유지할 테마를 저장한다.
        } catch {                                                 // 브라우저가 저장을 거부하면 실행한다.
            console.info("테마 저장을 사용할 수 없다.");                // 저장만 불가능하다고 개발자 도구에 알린다.
        }                                                         // 저장 공간 오류 처리를 끝낸다.
    }; // 테마 저장을 끝낸다.


    const renderTheme = () => { // 현재 테마 상태를 화면에 반영한다.
        const isDark = state.theme === "dark"; // 어두운 테마인지 참 또는 거짓으로 계산한다.

        elements.root.dataset.theme = state.theme; // html의 data-theme 값을 현재 테마로 바꾼다.

        elements.themeButton.setAttribute("aria-pressed", String(isDark)); // 보조 기술에 선택 상태를 알려준다.
        elements.themeButton.setAttribute("aria-label", isDark ? "라이트 모드로 변경" : "다크 모드로 변경"); // 버튼을 누른 뒤의 동작을 알려준다.

        elements.themeIcon.textContent = isDark ? "☀" : "☾"; // 현재 테마에 맞는 아이콘을 표시한다.
        elements.themeText.textContent = isDark ? "라이트 모드" : "다크 모드"; // 현재 누를 수 있는 동작을 글자로 표시한다.
    }; // 테마 화면 반영을 끝낸다.


    const initializeTheme = () => { // 처음 사용할 테마를 정한다.
        const storedTheme = readStoredTheme(); // 사용자가 전에 선택한 테마를 읽는다.
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches; // 운영체제의 다크 모드 설정을 확인한다.
        state.theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : systemDark ? "dark" : "light"; // 저장값을 우선하고 없으면 운영체제 설정을 사용한다.
        renderTheme(); // 결정한 테마를 화면에 반영한다.
    }; // 최초 테마 설정을 끝낸다.


    const toggleTheme = () => { // [🔥 다크모드 적용] 테마 버튼을 누르면 실행한다.
        state.theme = state.theme === "dark" ? "light" : "dark"; // 현재 테마를 반대 값으로 바꾼다.
        saveTheme();                        // 바뀐 테마를 저장한다.
        renderTheme();                      // 바뀐 테마를 화면에 반영한다.
    }; // 테마 변경을 끝낸다.

    const renderMenu = () => { // [🔥 햄버거 버튼] 모바일 메뉴 상태를 화면에 반영한다.
        elements.menuButton.classList.toggle("active", state.menuOpen); // 상태에 따라 햄버거 버튼을 X 모양으로 바꾼다.
        elements.navPanel.classList.toggle("active", state.menuOpen); // 상태에 따라 메뉴 패널을 보이거나 숨긴다.
        elements.body.classList.toggle("menu-open", state.menuOpen); // 열린 메뉴 뒤의 페이지 스크롤을 잠근다.
        elements.menuButton.setAttribute("aria-expanded", String(state.menuOpen)); // 보조 기술에 메뉴 상태를 알려준다.
        elements.menuButton.setAttribute("aria-label", state.menuOpen ? "메뉴 닫기" : "메뉴 열기"); // 버튼의 현재 동작을 알려준다.
    }; // 메뉴 화면 반영을 끝낸다.

    const closeMenu = () => {           // 모바일 메뉴를 닫는다.
        state.menuOpen = false;         // 메뉴 상태를 닫힘으로 바꾼다.
        renderMenu();                   // 닫힌 상태를 화면에 반영한다.
    }; // 메뉴 닫기를 끝낸다.

    const handleNavigation = (event) => {   // 내부 메뉴 링크 클릭을 처리한다.
        event.preventDefault();             // 브라우저의 즉시 이동 기본 동작을 막는다.
        const target = document.querySelector(event.currentTarget.getAttribute("href")); // 링크가 가리키는 섹션을 찾는다.
        closeMenu();                        // 모바일 메뉴를 닫는다.
        target?.scrollIntoView({ behavior: "smooth", block: "start" }); // 찾은 섹션으로 부드럽게 이동한다.
    }; // 내부 메뉴 이동 처리를 끝낸다.

    const handleScroll = () => { // [🔥 맨 위 버튼] 현재 스크롤 위치를 화면에 반영한다.
        elements.header.classList.toggle("scrolled", window.scrollY >= CONFIG.navScrollPoint); // 60픽셀부터 메뉴 배경을 표시한다.
        elements.scrollTopButton.classList.toggle("visible", window.scrollY >= CONFIG.topButtonScrollPoint); // 300픽셀부터 맨 위 버튼을 표시한다.
    }; // 스크롤 처리를 끝낸다.

    const initializeRevealAnimation = () => { // [🔥 스크롤 애니메이션] 화면에 들어온 요소의 등장 효과를 준비한다.
        const targets = document.querySelectorAll(".reveal"); // 등장 효과를 적용할 모든 요소를 찾는다.
        if (!("IntersectionObserver" in window)) { // 브라우저가 관찰 기능을 지원하지 않는지 확인한다.
            targets.forEach((target) => target.classList.add("visible")); // 지원하지 않으면 모든 요소를 바로 보여준다.
            return;                         // 관찰자를 만들지 않고 끝낸다.
        }                                   // 구형 브라우저 처리를 끝낸다.
        const observer = new IntersectionObserver((entries, currentObserver) => { // 화면 진입을 관찰할 도구를 만든다.
            entries.forEach((entry) => {    // 변한 모든 요소를 하나씩 확인한다.
                if (!entry.isIntersecting) return; // 화면에 들어오지 않았으면 건너뛴다.
                entry.target.classList.add("visible"); // 화면에 들어온 요소를 보이게 한다.
                currentObserver.unobserve(entry.target); // 한 번 나타난 요소의 관찰을 끝낸다.
            });                             // 각 요소 확인을 끝낸다.
        }, { threshold: CONFIG.revealThreshold }); // 요소가 20퍼센트 보일 때 실행한다.
        targets.forEach((target) => observer.observe(target)); // 모든 대상 요소의 관찰을 시작한다.
    }; // 등장 효과 준비를 끝낸다.


    const startTypingEffect = () => {   // Hero 기술 이름을 타자처럼 보여준다.
        const words = ["Semantic HTML", "Responsive CSS", "DOM & Events", "Async JavaScript"]; // 차례로 보여줄 기술 목록이다.

        let wordIndex = 0;              // 현재 단어의 순번을 저장한다.
        let letterIndex = 0;            // 현재까지 보여준 글자 수를 저장한다.
        let deleting = false;           // 글자를 지우는 중인지 저장한다.

        const typeNext = () => {        // 다음 글자를 처리한다.
            const word = words[wordIndex]; // 현재 순서의 기술 이름을 가져온다.
            letterIndex += deleting ? -1 : 1; // 지우는 중이면 줄이고 아니면 늘린다.
            elements.typingText.textContent = word.slice(0, letterIndex); // 현재 글자 수만큼 화면에 표시한다.

            if (!deleting && letterIndex === word.length) { // 단어를 끝까지 썼는지 확인한다.
                deleting = true; // 다음부터 지우는 상태로 바꾼다.
                window.setTimeout(typeNext, 1200); // 완성된 단어를 잠시 보여준다.
                return;                 // 아래 예약 코드를 실행하지 않는다.
            }                           // 단어 작성 완료 처리를 끝낸다.

            if (deleting && letterIndex === 0) { // 단어를 모두 지웠는지 확인한다.
                deleting = false;       // 다음부터 쓰는 상태로 바꾼다.
                wordIndex = (wordIndex + 1) % words.length; // 다음 단어로 이동한다.
            }                           // 단어 삭제 완료 처리를 끝낸다.
            window.setTimeout(typeNext, deleting ? 45 : 90); // 쓰기와 지우기 속도에 맞춰 다시 실행한다.
        };                              // 다음 글자 처리를 끝낸다.
        typeNext();                     // 타자 효과를 시작한다.
    };                                  // 타자 효과 준비를 끝낸다.


    const initializeIdentity = () => {  // 공개 이름, 연도, GitHub Organization 링크를 화면에 넣는다.
        elements.year.textContent = new Date().getFullYear(); // 현재 연도를 표시한다.
        elements.displayName.textContent = CONFIG.displayName; // 설정한 공개 이름을 표시한다.
        elements.githubLinks.forEach((link) => { // 모든 GitHub 링크를 하나씩 처리한다.
            link.href = `https://github.com/${encodeURIComponent(CONFIG.githubOrganization)}`; // 설정한 GitHub Organization 첫 화면 주소를 연결한다.
            link.setAttribute("aria-label", `${CONFIG.githubOrganization} GitHub Organization 새 창에서 열기`); // Organization 링크 대상과 새 창 동작을 알려준다.
        });                             // 모든 GitHub 링크 처리를 끝낸다.
    }; // 공개 이름과 Organization 링크 설정을 끝낸다.


    const initialize = () => {          // 공통 화면 기능을 한 번에 시작한다.
        initializeTheme();              // 저장값과 시스템 설정으로 첫 테마를 정한다.
        initializeIdentity();           // 공개 이름, 연도, GitHub 링크를 넣는다.
        initializeRevealAnimation();    // 스크롤 등장 효과를 시작한다.
        startTypingEffect();            // 타자 효과를 시작한다.
        elements.menuButton.addEventListener("click", () => { state.menuOpen = !state.menuOpen; renderMenu(); }); // 햄버거 버튼으로 메뉴 상태를 바꾼다.
        elements.themeButton.addEventListener("click", toggleTheme); // 테마 버튼과 테마 변경을 연결한다.
        elements.navLinks.forEach((link) => link.addEventListener("click", handleNavigation)); // 메뉴 링크와 부드러운 이동을 연결한다.
        elements.scrollTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" })); // 맨 위 버튼과 위쪽 이동을 연결한다.
        window.addEventListener("scroll", handleScroll, { passive: true }); // 스크롤과 화면 상태 변경을 연결한다.
        window.addEventListener("resize", () => { if (window.innerWidth >= 768 && state.menuOpen) closeMenu(); }); // 넓은 화면이 되면 열린 모바일 메뉴를 닫는다.
        handleScroll(); // 현재 위치에 맞춰 메뉴와 맨 위 버튼을 즉시 갱신한다.
    }; // 공통 화면 기능 시작을 끝낸다.

    return { initialize }; // app.js가 사용할 시작 함수만 외부에 공개한다.
})(); // 공통 화면 기능 묶음을 완성한다.
