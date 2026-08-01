import assert from "node:assert/strict"; // 검사 실패 시 이유를 알려주는 Node.js 기본 도구를 불러온다.
import { readFile } from "node:fs/promises"; // 프로젝트 파일을 비동기로 읽는 Node.js 기본 도구를 불러온다.

const html = await readFile(new URL("../index.html", import.meta.url), "utf8"); // HTML 파일 전체를 글자로 읽는다.
const baseCss = await readFile(new URL("../css/base.css", import.meta.url), "utf8"); // 공통 디자인 CSS 파일을 글자로 읽는다.
const headerCss = await readFile(new URL("../css/header.css", import.meta.url), "utf8"); // 상단 메뉴 CSS 파일을 글자로 읽는다.
const sectionsCss = await readFile(new URL("../css/sections.css", import.meta.url), "utf8"); // 본문 섹션 CSS 파일을 글자로 읽는다.
const responsiveCss = await readFile(new URL("../css/responsive.css", import.meta.url), "utf8"); // 반응형 CSS 파일을 글자로 읽는다.
const css = [baseCss, headerCss, sectionsCss, responsiveCss].join("\n"); // 네 CSS 파일을 실제 적용 순서대로 합쳐 전체 디자인을 검사한다.
const configJs = await readFile(new URL("../js/config.js", import.meta.url), "utf8"); // 공개 설정 JavaScript 파일을 글자로 읽는다.
const uiJs = await readFile(new URL("../js/ui.js", import.meta.url), "utf8"); // 공통 화면 JavaScript 파일을 글자로 읽는다.
const formJs = await readFile(new URL("../js/form.js", import.meta.url), "utf8"); // 폼 검증 JavaScript 파일을 글자로 읽는다.
const projectsJs = await readFile(new URL("../js/projects.js", import.meta.url), "utf8"); // GitHub 프로젝트 JavaScript 파일을 글자로 읽는다.
const appJs = await readFile(new URL("../js/app.js", import.meta.url), "utf8"); // 기능 시작 JavaScript 파일을 글자로 읽는다.
const js = [configJs, uiJs, formJs, projectsJs, appJs].join("\n"); // 모든 JavaScript를 하나로 합쳐 전체 기능을 검사한다.

const checks = [ // 요구사항별 자동 검사 목록을 시작한다.
    ["시맨틱 header", /<header\b/.test(html)], // HTML에 header 태그가 있는지 검사한다.
    ["시맨틱 nav", /<nav\b/.test(html)], // HTML에 nav 태그가 있는지 검사한다.
    ["시맨틱 main", /<main\b/.test(html)], // HTML에 main 태그가 있는지 검사한다.
    ["시맨틱 section", /<section\b/.test(html)], // HTML에 section 태그가 있는지 검사한다.
    ["시맨틱 article", /<article\b/.test(html)], // HTML에 article 태그가 있는지 검사한다.
    ["시맨틱 footer", /<footer\b/.test(html)], // HTML에 footer 태그가 있는지 검사한다.
    ["의미 있는 이미지 대체 설명", /<img[^>]+alt="[^"]+"/.test(html)], // 이미지에 비어 있지 않은 alt 설명이 있는지 검사한다.
    ["이름 label 연결", /<label for="name"/.test(html) && /id="name"/.test(html)], // 이름 제목과 입력칸이 연결됐는지 검사한다.
    ["이메일 label 연결", /<label for="email"/.test(html) && /id="email"/.test(html)], // 이메일 제목과 입력칸이 연결됐는지 검사한다.
    ["메시지 label 연결", /<label for="message"/.test(html) && /id="message"/.test(html)], // 메시지 제목과 입력칸이 연결됐는지 검사한다.
    ["외부 CSS 연결", (html.match(/href="css\/(?:base|header|sections|responsive)\.css"/g) || []).length === 4], // 네 CSS 파일이 역할별로 연결됐는지 검사한다.
    ["defer JavaScript 연결", /<script src="js\/config\.js" defer><\/script>[\s\S]*<script src="js\/ui\.js" defer><\/script>[\s\S]*<script src="js\/form\.js" defer><\/script>[\s\S]*<script src="js\/projects\.js" defer><\/script>[\s\S]*<script src="js\/app\.js" defer><\/script>/.test(html) && (html.match(/<script[^>]+\bdefer\b/g) || []).length === 5], // 다섯 JavaScript가 defer 속성과 올바른 순서로 연결됐는지 검사한다.
    ["인라인 onclick 금지", !/onclick\s*=/.test(html)], // HTML에 onclick 속성이 없는지 검사한다.
    ["인라인 style 금지", !/style\s*=/.test(html)], // HTML에 style 속성이 없는지 검사한다.
    ["CSS :root 변수", /:root\s*\{/.test(css) && /--color-primary:/.test(css)], // 밝은 테마 CSS 변수가 있는지 검사한다.
    ["다크 모드 CSS 변수", /\[data-theme="dark"\]/.test(css)], // 어두운 테마 CSS 변수가 있는지 검사한다.
    ["Flexbox 네비게이션", /\.nav\s*\{[^}]*display:\s*flex/s.test(css)], // 네비게이션에 Flexbox가 쓰였는지 검사한다.
    ["스크롤 후 모바일 메뉴 기준 영역", /\.site-header\.scrolled\s*\{[^}]*backdrop-filter:\s*none/s.test(css)], // 스크롤 Header가 fixed 모바일 메뉴의 화면 기준을 바꾸지 않는지 검사한다.
    ["Grid 프로젝트 카드", /\.project-grid\s*\{[^}]*display:\s*grid/s.test(css)], // 프로젝트 목록에 Grid가 쓰였는지 검사한다.
    ["auto-fit과 minmax", /auto-fit/.test(css) && /minmax\(/.test(css)], // 반응형 카드 자동 배치 문법이 있는지 검사한다.
    ["768px 태블릿 구간", /@media \(min-width: 48rem\)/.test(css)], // 768픽셀 반응형 구간이 있는지 검사한다.
    ["1024px 데스크톱 구간", /@media \(min-width: 64rem\)/.test(css)], // 1024픽셀 반응형 구간이 있는지 검사한다.
    ["var 사용 금지", !/\bvar\b/.test(js)], // JavaScript에서 var를 쓰지 않았는지 검사한다.
    ["addEventListener 이벤트", /addEventListener/.test(js)], // JavaScript 이벤트 연결 방식을 검사한다.
    ["preventDefault 기본 동작 방지", /preventDefault\(\)/.test(js)], // 링크와 폼의 기본 동작 방지 사용을 검사한다.
    ["classList 클래스 조작", /classList\.(?:add|toggle)/.test(js)], // 클래스 추가 또는 토글 사용을 검사한다.
    ["map 배열 변환", /\.map\(/.test(js)], // map 배열 메서드 사용을 검사한다.
    ["filter 배열 필터", /\.filter\(/.test(js)], // filter 배열 메서드 사용을 검사한다.
    ["forEach 배열 순회", /\.forEach\(/.test(js)], // forEach 배열 메서드 사용을 검사한다.
    ["fetch API 호출", /await fetch\(/.test(js)], // fetch와 await를 함께 사용했는지 검사한다.
    ["GitHub Organization API", /api\.github\.com\/orgs\/\$\{safeOrganization\}\/repos/.test(js) && /githubOrganization:\s*"zerodayparty"/.test(js)], // zerodayparty Organization 공개 저장소 API를 사용하는지 검사한다.
    ["async 비동기 함수", /async \(\)/.test(js)], // async 함수가 있는지 검사한다.
    ["try catch 오류 처리", /try \{/.test(js) && /catch \(/.test(js)], // 비동기 오류를 try와 catch로 처리하는지 검사한다.
    ["로딩 상태", /state\.status = "loading"/.test(js)], // 프로젝트 로딩 상태가 있는지 검사한다.
    ["성공 상태", /"success"/.test(js)], // 프로젝트 성공 상태가 있는지 검사한다.
    ["오류 상태", /state\.status = "error"/.test(js)], // 프로젝트 오류 상태가 있는지 검사한다.
    ["빈 상태", /"empty"/.test(js)], // 프로젝트 빈 상태가 있는지 검사한다.
    ["로컬스토리지 테마 저장", /localStorage\.setItem/.test(js)], // 테마가 로컬스토리지에 저장되는지 검사한다.
    ["Intersection Observer", /IntersectionObserver/.test(js)], // 스크롤 관찰 기능을 사용하는지 검사한다.
    ["관찰 임계값 0.2", /revealThreshold:\s*0\.2/.test(js)], // 스크롤 관찰 기준이 0.2인지 검사한다.
    ["눈에 보이는 스크롤 등장 효과", /\.reveal\s*\{[^}]*translateY\(3rem\)[^}]*850ms/s.test(css)], // 등장 전 이동 거리와 시간을 충분히 주었는지 검사한다.
    ["외부 데이터 HTML 이스케이프", /const escapeHTML/.test(js)], // GitHub 데이터를 HTML에 넣기 전 안전하게 바꾸는지 검사한다.
]; // 요구사항별 자동 검사 목록을 끝낸다.

checks.forEach(([name, passed]) => { // 모든 검사 항목을 하나씩 실행한다.
    assert.equal(passed, true, `실패: ${name}`); // 통과하지 못한 항목이 있으면 이름과 함께 실행을 중단한다.
    console.log(`통과: ${name}`); // 통과한 검사 이름을 터미널에 출력한다.
}); // 모든 검사 실행을 끝낸다.

console.log(`총 ${checks.length}개 정적 검사를 모두 통과했다.`); // 전체 검사 개수와 성공 결과를 출력한다.
