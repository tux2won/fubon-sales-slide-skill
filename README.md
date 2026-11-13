# Fubon Slide · 영업교육팀 슬라이드 스킬

**Codex에 설치하는 스킬 + 영문 프롬프트를 만드는 웹사이트**를 함께 제공합니다.

신상품 교육자료를 만들 때 팀 디자인을 매번 설명하지 않아도 되도록, 세 가지 스타일과 S01–S22 레이아웃, 제작 순서와 검증 도구를 묶었습니다. [Future Slide](https://github.com/humantonylee/future-slide)의 공개된 레이아웃 잠금 방식을 회사 교육팀 용도로 확장했습니다. 원작자의 코드와 이 프로젝트의 차이는 [NOTICE](NOTICE)에 명시했습니다.

> 이 패키지는 독립 제작한 팀용 도구입니다. 공식 회사 배포본이나 CI 매뉴얼이 아니며, 모델을 파인튜닝한 결과물도 아닙니다. 원본 교안·상품 수치·로고·캐릭터·폰트 파일은 포함하지 않습니다.

## 1. Codex 스킬 설치

원작자 안내와 같은 `skills` CLI 방식:

```sh
npx skills add tux2won/fubon-sales-slide-skill --skill fubon-slide
```

설치 대상에서 Codex를 선택하세요. 이 명령은 [오픈소스 skills CLI](https://github.com/vercel-labs/skills)를 사용합니다. 별도의 프로젝트 npm 의존성은 필요하지 않습니다.

직접 설치하려면 이 저장소의 `skills/fubon-slide` 폴더를 사용자 스킬 폴더에 복사하세요. Codex는 프로젝트의 `.agents/skills`도 읽습니다. [공식 스킬 문서](https://developers.openai.com/codex/skills/)를 참고하세요.

- 사용자 범위: `~/.codex/skills/fubon-slide` 또는 호스트가 사용하는 사용자 스킬 디렉터리.
- 프로젝트 범위: `<project>/.agents/skills/fubon-slide`.
- 설치 후 다음 대화에서 `$fubon-slide`로 호출하세요. 목록이 갱신되지 않으면 Codex를 재시작하세요.

## 사용 예시

```text
With $fubon-slide skill,
Create a 6-slide Korean new-product training deck for insurance sales staff.
Use the saved Brand classroom style and the latest source files I attach.
Keep all product conditions and source pages. Mark unknowns as [확인 필요].
First show the proposed structure, then wait for my approval.
Output: editable HTML, 16:9.
```

PPT가 필요하면 마지막 줄을 `Output: an editable PPTX with native text, tables, and charts.`로 바꾸세요. 실제 PPTX 제작에는 사용하는 Codex 환경의 프레젠테이션 제작 기능이 필요합니다. 슬라이드 이미지를 원하면 `Output: slide images, generated sequentially.`로 바꾸세요. 이미지 생성 도구가 실제로 있어야 생성할 수 있습니다.

## 2. 영문 프롬프터

[영업교육팀 프롬프터 열기](https://fubon-sales-slide-prompter.muddymangrove4.chatgpt.site/)

입력 화면은 한국어이고, 복사되는 제작 지시문은 영어입니다. 슬라이드에 표시할 언어는 별도로 선택하며 기본은 한국어입니다. 입력한 한국어 상품명과 본문은 원문 데이터로 유지합니다. Codex를 선택하면 `With $fubon-slide skill,`가 붙고, ChatGPT에서는 스킬 호출문 없이 상세 규칙을 포함합니다. 영어 지시문 자체가 품질 우위를 보장하지는 않습니다.

원본과 같은 네 입력 블록을 유지합니다.

1. 전하고 싶은 메시지: 제목, 대상, 결론, 인상, 언어와 진행 방식.
2. 디자인: 장수, 챕터, 팀 스타일, 글꼴, 가독성과 비율.
3. 각 슬라이드 내용: 역할과 페이지별 내용.
4. 고급 설정: 색상, 페이지 번호, 배치, 크레딧과 출력 방식.

## 저장된 팀 스타일

| ID | 스타일 | 용도 | 주요 시각 규칙 |
|---|---|---|---|
| `brand` | 브랜드 교안형 | 상품 교안·비교표·안내장 | 흰색, 파랑, 청록, 구조화된 표와 고정 각주 |
| `info` | 인포그래픽 카드형 | 핵심 요약·니즈 환기 | 큰 제목/숫자, 파랑 또는 청록, 둥근 흰 패널 |
| `story` | 스토리 웹툰형 | 상담 사례·개념 설명 | 민트, 브라운, 핑크, 만화 칸과 말풍선 |

색상과 배치는 제공된 팀 작업물을 분석한 근사 규칙입니다. 공식 CI값이나 글꼴 재배포 권리를 의미하지 않습니다. 실제 자산이 필요하면 사용 가능한 원본을 작업 시 별도로 첨부하세요.

## 제작 순서

실제 번들 템플릿으로 만든 가상 교육 예시:

![브랜드 교안 템플릿](docs/previews/brand.jpg)

![인포그래픽 카드 템플릿](docs/previews/info.jpg)

![스토리 대화 템플릿](docs/previews/story.jpg)

`DESIGN.md` → `slide_plan.json` → `slide_prompts.json` → 실제 결과물 → 구조·화면·사실 검수.

프롬프터가 웹에서 지시문을 조립하고, 설치된 스킬은 Codex에서 규칙과 도구를 실행합니다. HTML 경로는 실제 템플릿/렌더러를 포함합니다. 다른 출력은 호스트의 실제 이미지/프레젠테이션 제작 도구를 사용합니다. 웹사이트 안에서 AI API를 호출하거나 업로드된 교안을 자동 학습하는 기능은 없습니다.

## 바로 실행하는 HTML 템플릿

Node.js 20 이상으로 실행할 수 있으며 `npm install`이 필요하지 않습니다.

```sh
node skills/fubon-slide/scripts/build-deck.mjs examples/classroom/slide_plan.json --out output/my-deck
node skills/fubon-slide/scripts/validate-deck.mjs output/my-deck/index.html
```

생성된 `index.html`을 브라우저로 여세요. 방향키·스와이프 이동, Esc 목차, B 정적 모드, 인쇄를 지원합니다. `DESIGN.md`, 계획, 영문 페이지 프롬프트도 함께 저장합니다.

예시 세 덱은 **실제 상품을 설명하지 않는 가상 교육 예시**입니다.

- [브랜드 교안 HTML](examples/classroom/index.html)
- [인포그래픽 HTML](examples/infographic/index.html)
- [스토리 HTML](examples/story/index.html)

GitHub의 파일 화면에서는 HTML이 실행되지 않으므로 저장소를 내려받아 열거나 위 명령으로 실행하세요.

## 검증과 유지보수

```sh
npm test
npm run examples
npm run sync
```

테스트는 레이아웃 구조, 내용 수, 출처 ID, 수치 비교의 단위/기준, 실제 파일 생성과 영문 프롬프트를 확인합니다. 사실의 진위나 시각 품질을 자동으로 보증하지는 않습니다. 스타일 변경은 `skills/fubon-slide/references/styles.json`에서 한 번 수정한 뒤 `npm run sync`로 웹 프롬프터에 반영합니다.

공개 저장소에 실제 상품 문서나 내부 교육자료를 넣지 마세요. 프로젝트별 근거는 로컬 작업 폴더에서 관리하고 담당자가 최신성·조건·배포 범위를 확인합니다.

## 라이선스와 출처

소프트웨어와 작성된 제작 규칙은 [Apache-2.0](LICENSE)으로 제공합니다. Future Slide에서 가져온 개념·레이아웃 이름·구성 대응은 [NOTICE](NOTICE)에 기록했습니다. 회사 명칭·상표, 별도 첨부 자산, 폰트 등의 권리는 이 라이선스에 포함되지 않습니다.
