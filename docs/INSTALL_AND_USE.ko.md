# 설치하고 사용하는 방법

## 설치

터미널에서 다음 명령을 실행합니다.

```sh
npx skills add tux2won/fubon-sales-slide-skill --skill fubon-slide
```

대상 에이전트로 Codex를 선택합니다. 조직의 설치 정책 때문에 npx를 사용할 수 없다면 GitHub의 Code → Download ZIP으로 내려받고, 압축 안의 `skills/fubon-slide` 폴더 전체를 프로젝트의 `.agents/skills/`에 복사하세요. `SKILL.md`, `references`, `assets`, `scripts`가 함께 있어야 합니다.

Codex 사용자 스킬 경로는 호스트에 따라 달라질 수 있습니다. 이 작업 환경에서는 `~/.codex/skills`를 사용합니다. 프로젝트 범위의 `.agents/skills`는 저장소 안에서 팀이 같은 규칙을 사용할 때 적합합니다. 공식 문서: https://developers.openai.com/codex/skills/

## 호출

새 대화에서 `$fubon-slide`를 선택하거나 아래처럼 시작합니다.

```text
With $fubon-slide skill,
Create an 8-slide Korean new-product training deck using the Brand classroom style.
Use only the latest product sources I attach. Preserve conditions and source pages.
Output: editable HTML, 16:9. First show the structure for my review.
```

## 프롬프터와 연결

웹사이트 4단계의 '사용할 AI'에서 **Codex**를 고르면 스킬 호출문이 자동으로 붙습니다. 기본 제작 지시문은 영어이고, 슬라이드 표시 언어는 1단계에서 선택합니다. 한국어로 입력한 상품명과 페이지 내용은 인용된 원문 데이터로 유지합니다.

ChatGPT를 고르면 스킬 호출문을 붙이지 않고, 상세 디자인 규칙이 들어 있는 영문 프롬프트를 만듭니다. 그 환경의 실제 이미지 또는 파일 제작 기능을 사용해야 결과물이 생성됩니다.

## 무엇이 저장되는가

모델 가중치를 학습시키지 않습니다. 스킬이 호출될 때 `SKILL.md`와 필요한 디자인 규칙·레이아웃·템플릿·검증 도구를 읽어 같은 작업 방식을 재사용합니다. 팀 스타일을 바꾸려면 `references/styles.json`을 수정한 뒤 배포본을 업데이트합니다. 상품 사실은 스킬에 넣지 않고 매 작업의 최신 문서에서 가져옵니다.

## 회사 자료 관리

공개 저장소에는 재사용할 제작 규칙과 코드, 가상 예시만 둡니다. 실제 상품 문서, 상담 정보, 심의자료, 원본 교안, 폰트와 캐릭터 파일은 따로 보관합니다. 스킬을 설치했다고 이러한 자료의 공개 업로드가 허용되는 것은 아닙니다.
