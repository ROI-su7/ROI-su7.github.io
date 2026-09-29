// 教材词表逐条附有校订的音标和适合小学生的短例句。
const primaryState = {grade: 0, unit: 0, query: '', limit: 60};
const primaryItems = PRIMARY_CURRICULUM.flatMap((volume, gi) => volume.units.flatMap((unit, ui) =>
  unit.words.map(([word, meaning, ipa, sentence], wi) => ({id:`${gi}-${ui}-${wi}`,word,meaning,ipa,sentence,gi,ui,wi,grade:volume.grade,unitTitle:unit.title,unitNumber:unit.number}))
));
const primaryCount = primaryItems.length;
const primaryById = new Map(primaryItems.map(item=>[item.id,item]));

function primaryCard(item, showContext=false) {
  const learned=progress.curriculumLearned.includes(item.id);
  return `<article class="curriculum-word ${learned?'is-learned':''}">
    <div class="curriculum-word-head"><span class="curriculum-number">${String(item.wi+1).padStart(2,'0')}</span><span class="curriculum-word-title">${esc(item.word)}</span><button class="curriculum-sound" data-action="primary-speak" data-id="${item.id}" aria-label="朗读 ${esc(item.word)}" title="朗读单词">◖))</button></div>
    <div class="curriculum-meaning">${esc(item.meaning)}</div>
    <div class="curriculum-ipa">${esc(item.ipa)}</div>
    <div class="curriculum-sentence"><span><b>例句</b> ${esc(item.sentence)}</span><button data-action="primary-example" data-id="${item.id}" aria-label="播放例句 ${esc(item.sentence)}" title="播放例句">🔊</button></div>
    ${showContext?`<div class="curriculum-location">${esc(item.grade)} · Unit ${item.unitNumber}</div>`:''}
    <div class="curriculum-word-footer"><button data-action="primary-toggle" data-id="${item.id}" class="curriculum-check ${learned?'checked':''}">${learned?'✓ 已掌握':'○ 标记掌握'}</button><button data-action="primary-speak" data-id="${item.id}" data-slow="true" class="curriculum-example-link">🐢 慢速读词</button></div>
  </article>`;
}

function primaryPage() {
  const volume=PRIMARY_CURRICULUM[primaryState.grade];
  const unit=volume.units[primaryState.unit];
  const gradeButtons=PRIMARY_CURRICULUM.map((v,i)=>{
    const total=v.units.reduce((n,u)=>n+u.words.length,0);
    return `<button class="volume-tab ${primaryState.grade===i?'active':''}" data-action="primary-grade" data-index="${i}"><span>${esc(v.grade)}</span><small>${total} 词</small></button>`;
  }).join('');
  const searching=!!primaryState.query.trim();
  const q=primaryState.query.trim().toLowerCase();
  const matches=searching?primaryItems.filter(item=>item.word.toLowerCase().includes(q)||item.meaning.includes(q)||item.grade.includes(q)||item.unitTitle.toLowerCase().includes(q)):[];
  const activeItems=searching?matches.slice(0,primaryState.limit):primaryItems.filter(item=>item.gi===primaryState.grade&&item.ui===primaryState.unit);
  const learned=unit.words.reduce((n,_,wi)=>n+(progress.curriculumLearned.includes(`${primaryState.grade}-${primaryState.unit}-${wi}`)?1:0),0);
  const units=volume.units.map((u,i)=>{
    const done=u.words.reduce((n,_,wi)=>n+(progress.curriculumLearned.includes(`${primaryState.grade}-${i}-${wi}`)?1:0),0);
    return `<button class="curriculum-unit ${primaryState.unit===i?'active':''}" data-action="primary-unit" data-index="${i}"><span>UNIT ${u.number}</span><strong>${esc(u.title)}</strong><small>${done}/${u.words.length} 已掌握</small></button>`;
  }).join('');
  return `<div class="page-title primary-title"><span class="eyebrow">PRIMARY SCHOOL ENGLISH</span><h1>小学英语 📚</h1><p>按年级、册次和单元学习，跟着课本一步一步进步。</p></div>
    <section class="curriculum-overview"><div><span>📖 教材词汇</span><strong>${primaryCount} <small>词 / 词组</small></strong></div><div><span>🧩 学习单元</span><strong>42 <small>个单元</small></strong></div><div><span>🌱 我的进度</span><strong>${progress.curriculumLearned.length} <small>条已掌握</small></strong></div></section>
    <div class="curriculum-search-wrap"><span>⌕</span><input id="curriculumSearch" type="search" placeholder="搜索全部 7 册单词或中文意思" value="${esc(primaryState.query)}" autocomplete="off" aria-label="搜索小学英语词汇"></div>
    <div class="curriculum-section-label"><h2>选择年级和册次</h2><small>资料范围：三年级上册至六年级上册</small></div>
    <div class="volume-tabs">${gradeButtons}</div>
    ${searching?`<div class="curriculum-section-label"><h2>搜索结果 <em>${matches.length}</em></h2><small>跨全部 7 册搜索</small></div>`:`<div class="curriculum-section-label"><h2>${esc(volume.grade)} · 选择单元</h2><small>每个单元都可以逐词点读</small></div><div class="curriculum-units">${units}</div><div class="curriculum-unit-head"><div><span class="eyebrow">UNIT ${unit.number}</span><h2>${esc(unit.title)}</h2><p>${esc(volume.grade)} · 本单元 ${unit.words.length} 词 · 已掌握 ${learned} 词</p></div><div class="curriculum-unit-progress"><span>${Math.round(learned/unit.words.length*100)}%</span><div class="progress-line"><div class="progress-fill" style="width:${Math.round(learned/unit.words.length*100)}%"></div></div></div></div>`}
    ${activeItems.length?`<div class="curriculum-words">${activeItems.map(item=>primaryCard(item,searching)).join('')}</div>`:`<div class="empty-state"><span>🔎</span><strong>没有找到相关单词</strong><p>换个英文或中文关键词试试看。</p></div>`}
    ${searching&&matches.length>activeItems.length?`<button class="curriculum-more" data-action="primary-more">继续显示（还剩 ${matches.length-activeItems.length} 条）</button>`:''}
    ${!searching?`<div class="curriculum-bottom"><button class="secondary-btn" data-action="primary-next">下一个单元 →</button><span>${primaryCount} 条教材词语均有音标、例句和点击朗读。</span></div>`:''}`;
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action^="primary-"]');
  if(!button)return;
  const action=button.dataset.action;
  if(action==='primary-grade'){primaryState.grade=Number(button.dataset.index);primaryState.unit=0;primaryState.query='';primaryState.limit=60;render()}
  else if(action==='primary-unit'){primaryState.unit=Number(button.dataset.index);render()}
  else if(action==='primary-speak'){const item=primaryById.get(button.dataset.id);if(item)speak(item.word.replace(/\s*\([^)]*\)/g,''),button.dataset.slow==='true')}
  else if(action==='primary-example'){const item=primaryById.get(button.dataset.id);if(item)speak(item.sentence)}
  else if(action==='primary-toggle'){
    const id=button.dataset.id;
    const index=progress.curriculumLearned.indexOf(id);
    if(index>=0)progress.curriculumLearned.splice(index,1);else{progress.curriculumLearned.push(id);markDay()}
    save();render();
  }
  else if(action==='primary-next'){if(primaryState.unit<5)primaryState.unit++;else{primaryState.unit=0;primaryState.grade=(primaryState.grade+1)%PRIMARY_CURRICULUM.length}render();main.scrollIntoView({behavior:'smooth'})}
  else if(action==='primary-more'){primaryState.limit+=60;render()}
});

document.addEventListener('input',event=>{
  if(event.target.id!=='curriculumSearch')return;
  const pos=event.target.selectionStart;
  primaryState.query=event.target.value;
  primaryState.limit=60;
  render();
  const input=document.querySelector('#curriculumSearch');
  input.focus();
  input.setSelectionRange(pos,pos);
});
