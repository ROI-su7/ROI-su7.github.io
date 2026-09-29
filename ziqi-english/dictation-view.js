const curriculumDictationState={volume:0,unit:0,mode:'zh-en',index:0,result:null,answered:0,correct:0};

function curriculumDictationItems(){
  const volume=PRIMARY_CURRICULUM[curriculumDictationState.volume];
  return volume.units[curriculumDictationState.unit].words.map(([word,meaning,ipa,sentence],wi)=>({
    id:`${curriculumDictationState.volume}-${curriculumDictationState.unit}-${wi}`,word,meaning,ipa,sentence,wi
  }));
}

function currentDictationItem(){
  const items=curriculumDictationItems();
  return items[curriculumDictationState.index%items.length];
}

function cleanEnglish(value){return value.toLowerCase().replace(/[’]/g,"'").replace(/[^a-z0-9' -]/g,'').replace(/\s+/g,' ').trim()}
function englishAnswers(word){
  const answers=[cleanEnglish(word)];
  const base=cleanEnglish(word.replace(/\s*\([^)]*\)/g,''));
  if(base)answers.push(base);
  const inside=word.match(/\(([^)]+)\)/);
  if(inside)answers.push(cleanEnglish(inside[1]));
  return [...new Set(answers)];
}
function cleanChinese(value){return value.replace(/[\s，,。.!！?？、；;：:（）()…·]/g,'').trim()}
function chineseAnswers(meaning){
  const expanded=meaning.replace(/（[^）]*）/g,'').replace(/\([^)]*\)/g,'');
  const pieces=expanded.split(/[；;，,、/]/).map(cleanChinese).filter(Boolean);
  return [...new Set([cleanChinese(expanded),...pieces])];
}
function checkCurriculumDictation(answer,item){
  if(curriculumDictationState.mode==='zh-en')return englishAnswers(item.word).includes(cleanEnglish(answer));
  const value=cleanChinese(answer);
  if(!value)return false;
  return chineseAnswers(item.meaning).some(candidate=>candidate===value||(value.length>=2&&(candidate.includes(value)||value.includes(candidate))));
}

function curriculumDictationPage(){
  const volume=PRIMARY_CURRICULUM[curriculumDictationState.volume];
  const unit=volume.units[curriculumDictationState.unit];
  const item=currentDictationItem();
  const result=curriculumDictationState.result;
  const volumeTabs=PRIMARY_CURRICULUM.map((entry,index)=>`<button class="dictation-volume ${index===curriculumDictationState.volume?'active':''}" data-action="cd-volume" data-index="${index}">${esc(entry.grade)}</button>`).join('');
  const unitTabs=volume.units.map((entry,index)=>`<button class="dictation-unit ${index===curriculumDictationState.unit?'active':''}" data-action="cd-unit" data-index="${index}"><b>Unit ${entry.number}</b><span>${esc(entry.title)}</span></button>`).join('');
  const prompt=curriculumDictationState.mode==='zh-en'
    ? `<span class="dictation-direction">看中文，写英语</span><strong>${esc(item.meaning)}</strong><small>提示：${item.word.replace(/\s*\([^)]*\)/g,'').replace(/[^A-Za-z]/g,'').length} 个英文字母</small>`
    : `<span class="dictation-direction">看英语，写中文</span><strong class="english-prompt">${esc(item.word)}</strong><small>${esc(item.ipa)}</small>`;
  const placeholder=curriculumDictationState.mode==='zh-en'?'输入英文单词或词组':'输入中文意思';
  const rate=curriculumDictationState.answered?Math.round(curriculumDictationState.correct/curriculumDictationState.answered*100):0;
  return `<div class="page-title"><span class="eyebrow">TEXTBOOK DICTATION</span><h1>教材单词默写 ✏️</h1><p>覆盖三年级上册至六年级上册，按册次和单元练习两种互译方向。</p></div>
    <section class="dictation-dashboard"><div><span>本轮完成</span><strong>${curriculumDictationState.answered}</strong></div><div><span>答对</span><strong>${curriculumDictationState.correct}</strong></div><div><span>正确率</span><strong>${rate}%</strong></div><div><span>已收录</span><strong>${PRIMARY_CURRICULUM.reduce((n,v)=>n+v.units.reduce((m,u)=>m+u.words.length,0),0)}</strong></div></section>
    <div class="dictation-select-label"><h2>1. 选择册次</h2><small>${esc(volume.grade)} · ${unit.words.length} 词</small></div><div class="dictation-volumes">${volumeTabs}</div>
    <div class="dictation-select-label"><h2>2. 选择单元</h2><small>按教材原顺序练习</small></div><div class="dictation-units">${unitTabs}</div>
    <div class="dictation-mode-switch"><button class="${curriculumDictationState.mode==='zh-en'?'active':''}" data-action="cd-mode" data-mode="zh-en">中 → 英<small>看中文写英语</small></button><button class="${curriculumDictationState.mode==='en-zh'?'active':''}" data-action="cd-mode" data-mode="en-zh">英 → 中<small>看英语写中文</small></button></div>
    <div class="dictation-main-grid"><section class="training-card curriculum-dictation-card"><div class="dictation-question-meta"><span>第 ${curriculumDictationState.index+1} 题</span><span>Unit ${unit.number} · ${esc(unit.title)}</span></div><div class="dictation-prompt textbook-prompt">${prompt}</div>
      <div class="dictation-audio-actions"><button class="ghost-btn" data-action="cd-speak">🔊 听单词</button><button class="ghost-btn" data-action="cd-sentence">🎧 听例句</button></div>
      <form id="curriculumDictationForm"><label for="curriculumDictationAnswer">写下你的答案：</label><input class="answer-input" id="curriculumDictationAnswer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${placeholder}" ${result?'disabled':''}/><div class="training-footer"><button class="primary-btn" type="submit" ${result?'disabled':''}>检查答案 ✓</button><button class="ghost-btn" type="button" data-action="cd-answer">查看答案</button><button class="secondary-btn" type="button" data-action="cd-next">下一题 →</button></div></form>
      ${result?`<div class="feedback ${result.correct?'good':'bad'}">${esc(result.message)}</div>`:''}
    </section><aside class="side-tip dictation-tip"><div class="tip-emoji">📚</div><h3>${esc(volume.grade)} · Unit ${unit.number}</h3><p>${esc(unit.title)}</p><div class="progress-line"><div class="progress-fill" style="width:${Math.round((curriculumDictationState.index%unit.words.length+1)/unit.words.length*100)}%"></div></div><p>当前单元共 ${unit.words.length} 词。可随时切换互译方向，答案支持教材里的常见同义释义。</p></aside></div>`;
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action^="cd-"]');
  if(!button)return;
  const action=button.dataset.action;
  if(action==='cd-volume'){curriculumDictationState.volume=Number(button.dataset.index);curriculumDictationState.unit=0;curriculumDictationState.index=0;curriculumDictationState.result=null;render()}
  else if(action==='cd-unit'){curriculumDictationState.unit=Number(button.dataset.index);curriculumDictationState.index=0;curriculumDictationState.result=null;render()}
  else if(action==='cd-mode'){curriculumDictationState.mode=button.dataset.mode;curriculumDictationState.result=null;render()}
  else if(action==='cd-speak'){speak(currentDictationItem().word.replace(/\s*\([^)]*\)/g,''),true)}
  else if(action==='cd-sentence'){speak(currentDictationItem().sentence)}
  else if(action==='cd-answer'){const item=currentDictationItem();curriculumDictationState.result={correct:false,message:`答案：${item.word} = ${item.meaning}`};render()}
  else if(action==='cd-next'){const items=curriculumDictationItems();curriculumDictationState.index=(curriculumDictationState.index+1)%items.length;curriculumDictationState.result=null;render();document.querySelector('#curriculumDictationAnswer')?.focus()}
});

document.addEventListener('submit',event=>{
  if(event.target.id!=='curriculumDictationForm')return;
  event.preventDefault();
  if(curriculumDictationState.result)return;
  const input=document.querySelector('#curriculumDictationAnswer');
  const answer=input.value.trim();
  if(!answer){toast('先写下答案吧');return}
  const item=currentDictationItem();
  const correct=checkCurriculumDictation(answer,item);
  curriculumDictationState.answered++;
  if(correct){curriculumDictationState.correct++;addUnique(progress.dictationCorrect,`${item.id}:${curriculumDictationState.mode}`)}
  curriculumDictationState.result={correct,message:correct?`答对啦！${item.word} = ${item.meaning} 🎉`:`再试一试。正确答案是：${item.word} = ${item.meaning}`};
  render();
});
