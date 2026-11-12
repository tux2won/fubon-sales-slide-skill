(function(){
  'use strict';
  const $=id=>document.getElementById(id),core=window.PromptCore,styles=window.TEAM_STYLES;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const titles=['전하고 싶은 메시지','디자인','각 슬라이드 내용','고급 설정'];
  const shortTitles=['메시지','디자인','페이지 내용','고급 설정'];
  let state=core.defaults(),step=0,autosave=false,allOpen=false,toastTimer;
  try{autosave=localStorage.getItem('sales-prompter-save')==='yes';if(autosave){const saved=localStorage.getItem('sales-prompter-v1');if(saved)state=core.normalize(JSON.parse(saved));}}catch{}
  function field(key,label,placeholder='',opts={}){
    const value=state[key]||'',type=opts.type||'text';
    return `<label class="field ${opts.full?'full':''}" for="${key}"><span>${esc(label)}${opts.required?'<i class="required">*</i>':''}</span>${opts.area?`<textarea id="${key}" data-key="${key}" rows="${opts.rows||3}" maxlength="30000" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`:`<input id="${key}" data-key="${key}" type="${type}" maxlength="${opts.max||1000}" value="${esc(value)}" placeholder="${esc(placeholder)}">`}${opts.help?`<small>${esc(opts.help)}</small>`:''}</label>`;
  }
  function radio(key,options){return `<div class="options-row">${options.map(([value,label])=>`<label class="choice"><input type="radio" name="${key}" data-key="${key}" value="${esc(value)}" ${state[key]===value?'checked':''}>${esc(label)}</label>`).join('')}</div>`;}
  function select(key,label,options,help=''){return `<label class="field" for="${key}"><span>${esc(label)}</span><select id="${key}" data-key="${key}">${options.map(([v,l])=>`<option value="${v}" ${state[key]===v?'selected':''}>${esc(l)}</option>`).join('')}</select>${help?`<small>${esc(help)}</small>`:''}</label>`;}
  function start(n,description){return `<div class="section-title"><span class="section-number">0${n+1}</span><div><h2>${titles[n]}</h2><p>${description}</p></div></div>`;}
  function sectionCopy(n){return `<div class="section-copy"><span>이 단계의 설정도 전체 프롬프트에 자동 반영됩니다.</span><button type="button" class="text-button" data-copy-section="${n}">이 단계만 복사 ↗</button></div>`;}
  function miniature(id){
    if(id==='brand')return '<div class="miniature brand"><span class="mini-label">FUBON · SALES TRAINING</span><h4>신상품, 핵심을<br>정확하게 전달하기</h4><div class="mini-table"><span>주요 항목</span><span>확인 포인트</span><span>상품 구조</span><span>보장과 조건</span><span>설계 기준</span><span>최신 근거</span></div><span class="mini-foot">모집인교육용 · 영업교육팀</span></div>';
    if(id==='info')return '<div class="miniature info"><div class="mini-inner"><span class="mini-label">KEY POINT</span><h4>한눈에 이해하는<br>신상품 포인트</h4><div class="mini-bars"><div>상품의 특징<strong>POINT</strong></div><div>교육의 핵심<strong>CHECK</strong></div></div><span class="mini-foot">출처 · 기준일을 함께</span></div></div>';
    return '<div class="miniature story"><div class="comic-panel"><strong>궁금했던<br>고객의 질문</strong><span>어떤 차이가<br>있을까요?</span></div><div class="comic-panel"><span>사례로 쉽게<br>알아볼까요?</span><strong>대화로 풀어보는<br>상품 이야기</strong></div></div>';
  }
  function panel0(){return start(0,'누구에게 무엇을 전할지 적어주세요. 비어 있는 항목은 AI가 근거 자료를 바탕으로 보완합니다.')+
    field('title','슬라이드 제목','예: [신상품명] 핵심 이해와 상담 활용',{help:'전체 주제를 한 문장으로 적습니다. 표지 제목에도 반영됩니다.'})+
    field('target','대상','예: 신상품 교육을 받는 GA 모집인')+
    field('point','핵심 메시지','예: 상품 구조와 주요 조건을 이해하고 고객 상황에 맞게 설명할 수 있다.',{area:true,help:'이 교안을 보고 교육 대상이 이해해야 할 결론이나 포인트를 적습니다.'})+
    field('impression','남기고 싶은 인상','예: 정확한 설명, 쉽게 이해되는 구조, 현장에서 쓰기 좋은 교안')+
    `<div class="subsection"><h3>메인 언어</h3>${radio('language',[['ko','한국어 중심 + English keywords'],['en','English 중심 + 한국어 보조'],['auto','입력 언어 맞춤']])}</div>`+
    `<div class="subsection"><h3>진행 방식</h3>${radio('workflow',[['direct','바로 슬라이드 생성'],['plan','먼저 구성안 확인']])}<p class="helper">구성안 확인을 선택하면 AI가 전체 내용을 먼저 제안하고, 승인 후 제작합니다.</p></div>`+
    `<details class="subsection" ${state.product||state.basis||state.sourceNotes?'open':''}><summary>상품 근거 정보 추가 <small>영업교육팀 옵션</small></summary><div class="details-body"><div class="form-grid">${field('product','상품명 / 교육 주제','최신 공식 상품명')}${field('basis','기준일 · 채널 · 버전','예: 2026.11 / GA / 개정본')}${field('sourceNotes','근거 자료 · 확인사항','예: 상품요약서 3쪽, 판매기준 5쪽을 함께 첨부. 보증 조건과 인출 조건을 구분해 설명.',{area:true,full:true,help:'이곳에는 자료명과 참고 페이지를 적고, 실제 파일은 사용할 AI에 별도로 첨부하세요.'})}</div></div></details>`+
    sectionCopy(0);}
  function panel1(){const st=styles.find(x=>x.id===state.style);return start(1,'슬라이드 수와 팀의 시각 스타일을 선택하세요. 디자인 규칙이 프롬프트에 함께 저장됩니다.')+
    `<div class="field"><span>슬라이드 수 <i class="required">*</i></span><div class="count-options">${Array.from({length:8},(_,i)=>`<button type="button" data-count="${i+1}" aria-pressed="${state.count===i+1}" class="count-button ${state.count===i+1?'selected':''}">${i+1}</button>`).join('')}<button type="button" data-custom-count class="count-button ${state.count>8?'selected':''}" aria-pressed="${state.count>8}">직접 입력</button></div><div id="custom-count-wrap" ${state.count<=8?'hidden':''}><label class="numeric-field" for="custom-count">슬라이드 수 <input type="number" id="custom-count" min="1" max="60" step="1" value="${state.count}">장</label></div><small>표지와 요약을 포함한 총 장수입니다. 여러 장은 AI 처리 한도에 맞춰 챕터로 나눠주세요.</small></div>`+
    `<div class="field"><span>슬라이드 타입</span>${radio('chapter',[['single','단일 모드'],['first','첫 챕터'],['middle','중간 챕터'],['last','마지막 챕터']])}<small>챕터 모드에서는 페이지의 역할 이름과 앞뒤 문맥이 자동으로 달라집니다.</small></div>`+
    (state.chapter!=='single'?`<div class="form-grid chapter-fields"><label class="field" for="chapterTotal"><span>전체 챕터 수</span><input type="number" data-key="chapterTotal" id="chapterTotal" min="${state.chapter==='middle'?3:2}" max="60" value="${state.chapterTotal}"></label><label class="field" for="chapterNumber"><span>현재 챕터</span><input type="number" data-key="chapterNumber" id="chapterNumber" min="1" max="${state.chapterTotal}" value="${core.chapterIndex(state)}" ${state.chapter==='first'||state.chapter==='last'?'disabled':''}></label></div>${field('previousContext','챕터 연결 문맥','이전 챕터 요약 / 이번 챕터 주제 / 다음 챕터 예고',{area:true,rows:2,help:'앞 챕터의 대표 슬라이드와 디자인 규칙을 AI에 함께 전달하면 스타일을 더 잘 이어갈 수 있습니다.'})}`:'')+
    `<div class="field"><span>시각 스타일 <i class="required">*</i> <small class="inline-label">TEAM PRESETS</small></span><div class="styles-grid">${styles.map(s=>`<button type="button" class="style-card ${state.style===s.id?'selected':''}" data-style="${s.id}" aria-pressed="${state.style===s.id}" aria-label="${s.name} 선택"><span class="style-check" aria-hidden="true">✓</span>${miniature(s.id)}<h3>${s.name}<span>${s.number}</span></h3><p>${s.description}</p><div class="swatches">${s.colors.map(c=>`<i style="background:${c}"></i>`).join('')}</div></button>`).join('')}</div><small>미리보기는 스타일 설명용 예시입니다. 원본 상품 수치와 이미지는 포함하지 않습니다.</small></div>`+
    `<div class="style-detail"><div class="style-detail-head"><h3>${st.name}</h3><button type="button" class="text-button" data-dialog="style-${st.id}">저장된 디자인 규칙 ↗</button></div><p>${st.use}</p><p>${st.sources} 기반 · ${st.formats}</p></div>`+
    (state.style==='info'?`<div class="subsection"><h3>인포그래픽 색상 변형</h3>${radio('infoVariant',[['teal','청록 · 레퍼런스4'],['blue','파랑 · 레퍼런스3']])}</div>`:'')+
    `<div class="form-grid subsection">${select('ratio','화면 비율',[['16:9','16:9 가로 교안'],['1:1','1:1 정사각형 카드뉴스'],['A4','A4 세로 안내장'],['reference','레퍼런스2 원본 비율']])}${select('font','글꼴',[['team','팀 글꼴 · YouandiModern'],['none','별도 지정 없음'],['suit','Gothic · SUIT'],['pretendard','Gothic · Pretendard'],['hand','손글씨 스타일']])}</div>`+
    `<div class="subsection"><h3>텍스트 가독성</h3>${radio('legibility',[['high','높은 가독성'],['standard','표준 가독성'],['editorial','에디토리얼 작은 글자']])}</div>`+
    `<div class="hint-box"><span class="hint-icon">ⓘ</span><p><strong>스타일은 규칙으로 저장됩니다.</strong><br>색상·서체·제목·본문·표·각주 배치를 프롬프트에 넣습니다. 모델을 별도로 학습시키는 기능은 아닙니다.</p></div>`+sectionCopy(1);}
  function panel2(){const names=core.roleNames(state);return start(2,'페이지별 역할과 내용을 정리하세요. 비워두면 AI가 핵심 메시지와 근거 자료에 맞춰 구성합니다.')+
    `<div class="page-list-heading"><span>총 <b>${state.count}장</b> · ${esc({single:'단일 모드',first:'첫 챕터',middle:'중간 챕터',last:'마지막 챕터'}[state.chapter])}</span><button type="button" id="reset-roles" class="text-button">기본 역할로 배치</button></div>`+
    `<div class="slide-list">${state.slides.slice(0,state.count).map((p,i)=>`<article class="slide-editor"><div class="slide-editor-head"><span class="page-index">${String(i+1).padStart(2,'0')}</span><div class="role-options" aria-label="${i+1}쪽 역할">${Object.entries(names).map(([k,v])=>`<button type="button" data-role="${k}" data-index="${i}" aria-label="${i+1}쪽 역할 ${esc(v)}" aria-pressed="${p.role===k}" class="role-button ${p.role===k?'selected':''}">${esc(v)}</button>`).join('')}</div></div><label class="sr-only" for="slide-${i}">${i+1}번 슬라이드 내용</label><textarea id="slide-${i}" data-slide="${i}" rows="3" maxlength="30000" placeholder="${i+1}쪽에 담을 내용을 줄 단위로 적어주세요. 비워두면 근거 자료를 바탕으로 구성합니다.">${esc(p.content)}</textarea></article>`).join('')}</div>`+
    `<div class="hint-box"><span class="hint-icon">ⓘ</span><p>역할에 따라 표지·도입·본론·요약의 레이아웃 규칙이 달라집니다. 표현 방식은 내용에 맞춰 AI가 선택하며, 팀의 디자인 체계는 유지합니다.</p></div>`+sectionCopy(2);}
  function panel3(){return start(3,'색상과 레이아웃, 크레딧을 마무리하세요. 비어 있는 크레딧은 프롬프트에 넣지 않습니다.')+
    field('brandColor','브랜드 컬러','기본: 팀 스타일 색상 / 변경: #007C83 또는 색상명',{help:'입력하면 선택한 스타일의 기본 강조색에 우선 적용합니다.'})+
    `<div class="subsection"><h3>슬라이드 장식</h3><div class="checkbox-list"><label class="check-option"><input type="checkbox" data-key="pageNumbers" ${state.pageNumbers?'checked':''}>페이지 번호 넣기 <span class="helper">현재/전체</span></label><label class="check-option"><input type="checkbox" data-key="repeatTitle" ${state.repeatTitle?'checked':''}>푸터에 슬라이드 제목 반복</label></div></div>`+
    `<div class="subsection"><h3>표지 메시지 위치</h3>${radio('coverSide',[['left','왼쪽 메시지 · 오른쪽 비주얼'],['right','오른쪽 메시지 · 왼쪽 비주얼']])}</div>`+
    `<div class="subsection"><h3>요약 페이지 레이아웃</h3>${radio('closing',[['split','좌우 분할'],['stack','상하 2단']])}</div>`+
    `<div class="subsection"><h3>크레딧 정보</h3><div class="form-grid">${field('creator','작성자','작성자명')}${field('company','소속','팀 또는 회사명')}${field('date','날짜','예: 2026.11.12')}${field('contact','연락처','마지막 장에 표시할 연락처')}${field('cta','마지막 페이지 CTA','예: 주요 조건을 확인하고 상담 사례에 적용해 보세요.',{full:true})}</div></div>`+
    field('additional','추가 지시사항','예: 보증 여부와 적용 조건은 나란히 표시. 복잡한 표는 별도 페이지로 분리.',{area:true})+
    `<details class="subsection" open><summary>출력 방식 <small>영업교육팀 옵션</small></summary><div class="details-body"><div class="form-grid">${select('platform','사용할 AI',[['chatgpt','ChatGPT'],['codex','Codex']])}${select('output','원하는 결과물',[['image','슬라이드 이미지 · 원본 방식'],['pptx','편집 가능한 PPTX'],['html','편집 가능한 HTML 슬라이드']])}</div><p class="helper">이미지 방식은 디자인 재현에 유리하지만 글자·표를 PPT에서 직접 수정하기 어렵습니다. 수정이 많은 교안은 PPTX를 선택하세요. 실제 제작 가능 여부는 사용할 AI 환경에 따라 달라집니다.</p></div></details>`+
    `<div class="subsection"><h3>완성 전 확인</h3><div id="readiness" class="readiness"></div></div>`+
    `<div class="hint-box"><span class="hint-icon">✓</span><p><strong>설정이 끝났다면 오른쪽에서 복사하세요.</strong><br>최신 약관·상품요약서·판매기준을 AI에 함께 첨부하고, 완성본의 사실과 조건을 확인해 주세요.</p></div>`+sectionCopy(3);}
  function render(){
    const focusId=document.activeElement?.id;
    $('steps').innerHTML=titles.map((t,i)=>`<button type="button" class="step ${i===step?'active':''} ${i<step?'completed':''}" data-step="${i}" ${i===step?'aria-current="step"':''} aria-label="${i+1}단계 ${t}"><b>${i<step?'✓':i+1}</b>${shortTitles[i]}</button>`).join('');
    $('panels').innerHTML=[panel0,panel1,panel2,panel3].map((f,i)=>`<section class="panel" id="panel-${i}" aria-label="${i+1}단계 ${titles[i]}" ${i!==step&&!allOpen?'hidden':''}>${f()}</section>`).join('');
    $('prev').disabled=step===0;$('next').textContent=step===3?'프롬프트 복사 ▣':'다음 단계 →';$('step-count').textContent=`0${step+1} / 04`;
    $('autosave').checked=autosave;
    if(focusId&&$(focusId))$(focusId).focus({preventScroll:true});
    update();
  }
  function update(){
    const prompt=core.build(state);$('prompt-output').value=prompt;
    $('char-count').textContent=`${prompt.length.toLocaleString('ko-KR')}자 · 4개 입력 블록`;
    const style=styles.find(x=>x.id===state.style),output={image:'슬라이드 이미지',pptx:'편집 가능한 PPTX',html:'HTML 슬라이드'}[state.output];
    $('preview-tags').innerHTML=[style.name,`${state.count}장`,state.ratio,output].map(t=>`<span>${esc(t)}</span>`).join('');
    const warnings=core.warnings(state);if($('readiness'))$('readiness').innerHTML=warnings.length?warnings.map(x=>`<p>○ ${esc(x)}</p>`).join(''):'<p class="ready">✓ 제목·메시지·근거 메모가 입력되었습니다.</p>';
    if(autosave)try{localStorage.setItem('sales-prompter-v1',JSON.stringify(state));}catch{toast('브라우저 저장 공간을 사용할 수 없습니다. 설정을 파일로 내보내 주세요.');}
  }
  function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3300);}
  async function copy(text){try{await navigator.clipboard.writeText(text);toast('프롬프트를 복사했습니다. 사용할 AI에 붙여넣으세요.');}catch{const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.left='-10000px';document.body.append(el);el.select();let ok=false;try{ok=document.execCommand('copy');}catch{}el.remove();if(ok)toast('프롬프트를 복사했습니다.');else{showModal('프롬프트 직접 복사',`<p>브라우저에서 자동 복사를 허용하지 않았습니다. 아래 내용을 선택해 복사하세요.</p><textarea class="expanded-prompt" readonly>${esc(text)}</textarea>`);$('modal-body').querySelector('textarea').select();}}}
  function download(filename,text,type='text/plain;charset=utf-8'){const blob=new Blob(['\uFEFF'+text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);}
  function setStep(n){step=Math.max(0,Math.min(3,n));render();$('builder').scrollIntoView({behavior:'instant',block:'start'});}
  function adjustChapter(){state.chapterTotal=Math.max(state.chapter==='middle'?3:2,Math.min(60,Math.floor(Number(state.chapterTotal)||3)));state.chapterNumber=state.chapter==='middle'?Math.max(2,Math.min(state.chapterTotal-1,Math.floor(Number(state.chapterNumber)||2))):core.chapterIndex(state);}
  function setKey(el){const key=el.dataset.key;if(!key)return;state[key]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;if(['chapter','chapterTotal','chapterNumber'].includes(key))adjustChapter();}
  function example(){
    state=core.defaults();state.title='[신상품명] 핵심 이해와 상담 활용';state.product='[최신 공식 상품명 입력]';state.point='상품 구조와 주요 조건을 이해하고, 고객 상황에 맞는 설명과 확인 질문을 준비한다.';state.impression='명확한 구조, 검증 가능한 근거, 현장에서 활용하기 쉬운 설명';state.workflow='plan';state.sourceNotes='최신 약관·상품요약서·판매기준을 AI에 별도 첨부. 각 조건의 근거 페이지를 표시하고 충돌은 확인 필요로 남긴다.';state.basis='[기준일] / [판매채널] / [개정 버전]';state.output='pptx';state.pageNumbers=true;state.cta='주요 조건을 확인하고 상담 사례에 적용해 보세요.';
    ['상품명, 교육 목적과 학습 목표. 상품명은 최신 공식 명칭 사용.','고객의 어떤 필요를 설명하는가. 제공된 통계만 사용하고 출처·연도·대상을 표시.','상품 구조와 주요 보장/기능. 보증 여부와 적용 조건을 함께 표시.','주요 조건과 설계 예시. 계산 기준·단위·가정·출처 페이지를 보존.','고객 질문에 답하는 상담 사례. 적합한 상황과 확인할 조건을 구분.','핵심 요약, 학습 확인 질문, 상담 전 확인해야 할 항목.'].forEach((v,i)=>state.slides[i].content=v);step=0;render();toast('가상 신상품 교안 예시를 불러왔습니다. 실제 상품 자료로 바꿔주세요.');
  }
  function showModal(title,html){$('modal-title').textContent=title;$('modal-body').innerHTML=html;if(!$('modal').open)$('modal').showModal();}
  const links=`<a href="https://slide-prompter.tonylee.im/" target="_blank" rel="noopener noreferrer">원본 슬라이드 프롬프터</a> · <a href="https://github.com/humantonylee/future-slide" target="_blank" rel="noopener noreferrer">Future Slide GitHub</a>`;
  function dialog(which){
    if(which.startsWith('style-')){const s=styles.find(x=>x.id===which.slice(6));if(s)showModal(s.name+' · 저장된 디자인 규칙',`<p>${esc(s.sources)}의 레이아웃·서식 분석을 기반으로 정리했습니다. 색상은 공식 CI값이 아닌 관찰 근사값을 포함합니다.</p><pre>${esc(s.rules)}</pre><button type="button" class="button secondary" data-download-style="${s.id}">스타일 규칙 TXT 내려받기 ↓</button>`);return;}
    if(which==='styles'){showModal('팀 디자인 라이브러리',`<p>5개 파일, 총 47쪽을 렌더링해 살펴보고 글꼴·색상·페이지 비율·레이아웃을 분석했습니다. 세 스타일은 프롬프트 규칙으로 저장되어 있습니다.</p>${styles.map(s=>`<h3>${s.number} ${s.name}</h3><p>${s.description}<br><small>${s.sources} · ${s.formats}</small></p><details><summary>전체 규칙 펼치기</summary><pre>${esc(s.rules)}</pre></details>`).join('')}<p>원본의 상품 수치와 심의번호는 새 교안에 자동으로 옮기지 않습니다. 글꼴·로고·캐릭터 원본은 사용할 AI에 필요한 경우 별도로 첨부하세요.</p>`);return;}
    if(which==='guide'){showModal('네 단계로 만드는 팀 프롬프트',`<h3>Codex 스킬과 연결하기</h3><p><a href="https://github.com/tux2won/fubon-sales-slide-skill" target="_blank" rel="noopener noreferrer">공개 GitHub 저장소</a>에서 <code>npx skills add tux2won/fubon-sales-slide-skill --skill fubon-slide</code>로 설치하세요. 4단계에서 Codex를 선택하면 복사되는 영문 지시문 앞에 <code>With $fubon-slide skill,</code>가 붙습니다.</p><p>제작 지시문은 영어이며, 실제 슬라이드 언어는 1단계에서 별도로 선택합니다. 한국어로 입력한 상품명과 문구는 원문으로 보존합니다. 영어 지시문 자체가 결과 품질을 보장하지는 않습니다.</p><ol><li><strong>전하고 싶은 메시지</strong><br>제목, 대상, 핵심 메시지, 인상을 적고 언어와 진행 방식을 고릅니다.</li><li><strong>디자인</strong><br>슬라이드 수·챕터 타입·팀 스타일·화면 비율·글꼴·가독성을 선택합니다.</li><li><strong>각 슬라이드 내용</strong><br>페이지별 역할과 내용을 입력합니다. 내용을 비우면 AI가 근거를 바탕으로 제안합니다.</li><li><strong>고급 설정</strong><br>색상, 페이지 번호, 표지/요약 배치, 크레딧과 출력 방식을 마무리합니다.</li></ol><div class="callout">완성 프롬프트를 복사해 사용할 AI에 붙여넣고, 최신 상품 자료를 함께 첨부하세요. ‘먼저 구성안 확인’을 선택하면 승인 후 실제 제작을 시작합니다.</div><h3>이미지와 편집 가능한 PPTX</h3><p>원본 방식은 슬라이드 이미지를 순서대로 생성하는 방식입니다. 이미지 속 글자와 표는 PPT에서 직접 편집하기 어렵습니다. 교안을 계속 수정할 계획이면 고급 설정에서 ‘편집 가능한 PPTX’를 선택하세요. 실제 파일 생성은 사용할 AI가 지원하는 기능에 따라 달라집니다.</p><h3>긴 교안을 나누는 방법</h3><p>원본은 1~8장과 직접 입력을 구분합니다. 팀 버전도 같은 선택을 제공하며 최대 60장까지 입력할 수 있습니다. AI의 처리량은 환경에 따라 달라집니다. 큰 교안은 첫·중간·마지막 챕터로 나누고 이전 대표 슬라이드를 함께 전달하세요.</p><h3>저장과 자료 처리</h3><p>입력은 이 브라우저에서 프롬프트로 조립하며 서버로 전송하지 않습니다. 자동 저장은 선택한 경우에만 이 기기의 브라우저에 저장합니다. 설정 파일 내보내기/가져오기로 작업을 이어갈 수 있습니다. 이 사이트에서 자료 파일을 분석하거나 AI를 호출하지 않습니다.</p>`);return;}
    if(which==='sop'){showModal('SOP에 담을 AI 활용 아이디어 3가지',`<p>신상품 콘텐츠 개발 SOP의 세 지점에 AI를 적용합니다. 담당자의 사실 확인과 최종 판단을 각 단계에 연결합니다.</p><ol class="idea-list"><li><strong>01 · 상품 근거 정리</strong>약관·상품요약서·판매기준을 대조해 주요 조건, 개정점, 출처 페이지를 정리합니다.<small>입력: 최신 원문 → 결과: 근거 대조표 → 확인: 상품 담당자</small></li><li><strong>02 · 팀 프롬프터로 교안 초안 제작</strong>교육 목적과 대상, 팀 스타일을 선택해 일관된 제작 지시를 만듭니다. 이 웹사이트를 초안 제작 단계의 표준 도구로 사용합니다.<small>입력: 확정 근거와 교육 목표 → 결과: 교안 초안 → 확인: 교육 담당자</small></li><li><strong>03 · 배포 전 검수 보조</strong>완성본을 근거 자료와 대조해 수치·용어·설계조건·출처 누락을 찾고 담당자가 수정합니다.<small>입력: 완성본과 원문 → 결과: 검수 목록 → 확인: 담당자 및 필요한 검토 절차</small></li></ol><h3>시범 운영에서 확인할 지표</h3><p>초안 작성시간, 수정 횟수, 누락 발견 건수를 기록하세요. 측정하지 않은 시간 절감률이나 품질 향상률을 실제 효과처럼 제시하지 않습니다.</p><button type="button" id="copy-sop" class="button primary">SOP 문구 복사</button>`);return;}
    if(which==='about'){showModal('원작자가 공개한 것과 팀 버전의 원리',`<h3>GitHub는 무엇인가요?</h3><p>개발자가 코드·문서·템플릿을 보관하고 변경 이력을 관리하며 다른 사람에게 배포하는 곳입니다. 원작자 Jeongmin Lee는 공개 저장소에서 슬라이드 제작용 스킬과 템플릿을 공유하고, 별도 웹사이트에서 프롬프트를 조립하는 도구를 제공했습니다.</p><h3>스킬과 프롬프터는 어떻게 다른가요?</h3><p><strong>스킬</strong>은 AI에게 작업 순서·디자인 규칙·검증 방법을 알려주는 문서 묶음입니다. <strong>프롬프터</strong>는 사용자가 고른 설정을 하나의 지시문으로 바꾸는 웹 도구입니다. 두 가지 모두 AI 모델 자체를 학습시켜 배포하는 것은 아닙니다.</p><h3>원본과 동일한 1~4 입력 구조</h3><p>① 전하고 싶은 메시지 ② 디자인 ③ 각 슬라이드 내용 ④ 고급 설정. 입력할 때마다 프롬프트를 조립하고, 페이지별 역할과 챕터 문맥을 반영합니다. 원본의 시각 스타일 대신 팀 자료에서 추출한 세 프리셋을 저장했습니다. 팀 버전의 코드와 프롬프트는 목적에 맞게 새로 작성했습니다.</p><h3>tightened-slide와의 관계</h3><p>tightened-slide는 S01~S22 레이아웃을 사용하는 별도의 HTML 슬라이드 제작 스킬입니다. 공개 저장소에는 디자인 추출 → 덱 기획 → 페이지 프롬프트 → 순차 이미지 생성 흐름도 있습니다. 웹사이트의 1~4 입력 블록과 이 제작 흐름은 서로 다른 구분입니다.</p><p>원작자는 Codex에서 설치된 스킬을 호출할 때 <code>With $tightened-slide skill,</code>를 붙이라고 안내하며, ChatGPT에서는 붙이지 말라고 설명합니다. 팀 프리셋은 둥근 패널·웹툰을 포함하므로 미니멀한 원본 스킬의 금지 규칙과 충돌할 수 있습니다. 팀 스킬 <code>$fubon-slide</code>는 회사 스타일에 맞게 이 규칙을 확장했습니다. 공개 저장소에 S01~S22 렌더러·템플릿·검증 도구를 포함하며, 이 웹사이트는 Codex 선택 시 해당 스킬을 호출하는 영문 프롬프트를 만듭니다.</p><p>${links}</p><p><a href="https://www.linkedin.com/posts/jyoung105_codex-%EB%A1%9C-%EB%A7%8C%EB%93%9C%EB%8A%94-%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%93%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EA%B4%80%EB%A0%A8-%EB%91%90-%EA%B0%80%EC%A7%80-%EC%A4%80%EB%B9%84%EB%90%90%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%96%B4%EC%A0%9C-share-7460840113929879552-hUD8/" target="_blank" rel="noopener noreferrer">원작자의 공개 안내 게시글 ↗</a></p><p class="helper">공개 저장소는 Apache-2.0 라이선스를 표시합니다. 별도 프롬프터 웹사이트의 코드가 같은 라이선스로 공개되었다고 단정하지 않습니다. 팀 사이트에 원본 자료 파일과 슬라이드 이미지를 포함하지 않았습니다.</p>`);}
  }
  document.addEventListener('input',e=>{const el=e.target;if(el.id==='custom-count'){if(el.value&&Number(el.value)>=1&&Number(el.value)<=60){core.resize(state,el.value);update();}}else if(el.dataset.slide!==undefined){state.slides[Number(el.dataset.slide)].content=el.value;update();}else if(el.dataset.key && !['radio','checkbox','number','select-one'].includes(el.type)){setKey(el);update();}});
  document.addEventListener('change',e=>{const el=e.target;if(el.dataset.key){setKey(el);if(['chapter','chapterTotal','chapterNumber','style'].includes(el.dataset.key))render();else update();}if(el.id==='custom-count'){core.resize(state,el.value);render();}});
  document.addEventListener('click',async e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.step!==undefined){setStep(Number(b.dataset.step));return;}
    if(b.dataset.style){state.style=b.dataset.style;render();return;}
    if(b.dataset.count){core.resize(state,b.dataset.count);render();return;}
    if(b.hasAttribute('data-custom-count')){$('custom-count-wrap').hidden=false;$('custom-count').focus();$('custom-count').select();return;}
    if(b.dataset.role){const p=state.slides[Number(b.dataset.index)];p.role=b.dataset.role;p.customRole=true;const scroll=window.scrollY;render();window.scrollTo({top:scroll,behavior:'instant'});return;}
    if(b.dataset.copySection!==undefined){copy(core.sections(state)[Number(b.dataset.copySection)]);return;}
    if(b.dataset.dialog){dialog(b.dataset.dialog);return;}
    if(b.dataset.downloadStyle){const s=styles.find(x=>x.id===b.dataset.downloadStyle);if(s)download(`${s.name}_디자인규칙.txt`,s.rules);return;}
    switch(b.id){
      case 'next':step===3?copy(core.build(state)):setStep(step+1);break;
      case 'prev':setStep(step-1);break;
      case 'copy':copy(core.build(state));break;
      case 'download':download('영업교육팀_슬라이드_프롬프트.txt',core.build(state));toast('프롬프트 TXT를 내려받았습니다.');break;
      case 'expand-prompt':showModal('전체 프롬프트',`<textarea class="expanded-prompt" readonly aria-label="전체 프롬프트 크게 보기">${esc(core.build(state))}</textarea><button type="button" id="copy-expanded" class="button primary">전체 복사</button>`);break;
      case 'copy-expanded':copy(core.build(state));break;
      case 'close-modal':$('modal').close();break;
      case 'load-example':showModal('예시 불러오기',`<p>현재 입력을 가상의 신상품 교육 예시로 바꿉니다. 실제 상품 수치는 포함하지 않습니다. 현재 작업을 유지하려면 먼저 설정을 내보내세요.</p><button type="button" id="confirm-example" class="button primary">예시 불러오기</button>`);break;
      case 'confirm-example':$('modal').close();example();break;
      case 'reset':showModal('입력 초기화',`<p>현재 입력을 초기화하고 기본 설정으로 돌아갑니다. 저장된 팀 디자인 3종은 유지됩니다.</p><button type="button" id="confirm-reset" class="button primary">입력 초기화</button>`);break;
      case 'confirm-reset':state=core.defaults();step=0;$('modal').close();render();toast('입력을 초기화했습니다.');break;
      case 'export-project':download('영업교육팀_프롬프터_설정.json',JSON.stringify(state,null,2),'application/json;charset=utf-8');toast('현재 설정을 파일로 내보냈습니다.');break;
      case 'import-project':$('project-file').click();break;
      case 'reset-roles':state.slides.forEach((p,i)=>{p.role=core.defaultRole(i,state.count);p.customRole=false;});render();toast('내용을 유지하고 기본 역할을 배치했습니다.');break;
      case 'copy-sop':copy('SOP AI 활용 아이디어 3가지\n\n1. 상품 근거 정리: 약관·상품요약서·판매기준을 대조해 주요 조건과 개정점, 출처 페이지를 정리하고 담당자가 원문을 확인한다.\n2. 팀 프롬프터로 교안 초안 제작: 대상·메시지·팀 디자인 규칙을 반영한 프롬프트로 교안 초안을 만든 후 담당자가 편집한다.\n3. 배포 전 검수 보조: 완성본의 수치·용어·설계조건·출처를 근거 자료와 대조하고 담당자가 최종 확인한다.');break;
      case 'toggle-all':allOpen=!allOpen;b.textContent=allOpen?'단계별 보기':'전체 펼치기';render();break;
    }
  });
  $('autosave').addEventListener('change',e=>{autosave=e.target.checked;try{localStorage.setItem('sales-prompter-save',autosave?'yes':'no');if(!autosave)localStorage.removeItem('sales-prompter-v1');}catch{}update();toast(autosave?'이 브라우저에만 작업을 저장합니다.':'브라우저 작업 저장을 껐습니다.');});
  $('project-file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>3000000)throw new Error('3MB 이하의 설정 파일을 선택해 주세요.');const text=(await f.text()).replace(/^\uFEFF/,'');const imported=core.normalize(JSON.parse(text));state=imported;step=0;render();toast('저장된 설정을 가져왔습니다.');}catch(err){toast(err instanceof SyntaxError?'올바른 JSON 설정 파일을 선택해 주세요.':err.message||'설정 파일을 읽을 수 없습니다.');}finally{e.target.value='';}});
  $('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
  render();
})();
