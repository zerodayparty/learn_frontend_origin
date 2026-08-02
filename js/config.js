"use strict";

window.PortfolioConfig = Object.freeze({ // 모든 기능 파일이 함께 사용할 공개 설정을 만든다.
    displayName: "sourcreamsource", // 화면 하단에 표시할 공개 이름이다.
    githubOrganization: "zerodayparty", // 공개 저장소를 가져올 GitHub Organization 이름이다.
    projectLimit: 12, // 최근에 업데이트된 공개 저장소를 최대 여섯 개까지 표시한다.
    navScrollPoint: 60, // 60픽셀부터 상단 메뉴 배경을 표시한다.
    topButtonScrollPoint: 300, // 300픽셀부터 맨 위 버튼을 표시한다.
    revealThreshold: 0.2, // 요소가 20퍼센트 보이면 스크롤 애니메이션을 실행한다.
}); // 공개 설정을 끝내고 실수로 값이 바뀌지 않게 고정한다.
