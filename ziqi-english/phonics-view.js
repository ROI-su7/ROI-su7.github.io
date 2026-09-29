// 每个音标通过一个常见例词示范。按短元音、长元音、滑动元音、辅音、组合循序学习。
const PHONICS_LEVELS = [
  {title:'短元音',subtitle:'先听短短的元音',emoji:'🌱',tip:'把声音读短、读清楚，先从熟悉的单词听起。',sounds:[
    ['æ','cat','张大嘴巴，短促发音。'],['ɛ','pen','嘴巴微张，短促发音。'],['ɪ','fish','嘴角稍开，声音很短。'],['ɑ','hot','张大嘴巴，声音放松。'],['ʌ','sun','嘴巴放松，短促发音。'],['ʊ','book','双唇微圆，声音很短。'],['ə','about','轻轻带过，常在非重读处。']
  ]},
  {title:'长元音与卷舌音',subtitle:'把音拉长一点',emoji:'🌼',tip:'和短元音对比着听，注意嘴形与声音长短。',sounds:[
    ['iː','see','嘴角向两边拉，声音较长。'],['uː','blue','双唇收圆，声音较长。'],['ɔ','ball','嘴巴圆一点，声音饱满。'],['ɝ','bird','舌头微卷，发重读音。'],['ɚ','teacher','舌头微卷，轻轻带过。'],['ɑr','car','先张口，再带出 r 音。'],['ɔr','four','先发圆唇音，再带出 r 音。']
  ]},
  {title:'滑动元音',subtitle:'声音会轻轻滑动',emoji:'🌈',tip:'从前一个声音自然滑向后一个声音。',sounds:[
    ['eɪ','name','从 e 滑向 ɪ。'],['aɪ','bike','从 a 滑向 ɪ。'],['ɔɪ','boy','从 ɔ 滑向 ɪ。'],['aʊ','mouth','从 a 滑向 ʊ。'],['oʊ','go','从 o 滑向 ʊ。'],['juː','cute','先发 j，再接长 u 音。']
  ]},
  {title:'基础辅音',subtitle:'听清开头和结尾',emoji:'🧩',tip:'听例词时，注意目标音在单词的哪个位置。',sounds:[
    ['p','pen','双唇闭合后送气。'],['b','book','双唇闭合，声带振动。'],['t','tiger','舌尖碰上齿龈后送气。'],['d','dog','舌尖轻碰上齿龈。'],['k','cat','舌后部抬起后送气。'],['ɡ','go','舌后部抬起，声带振动。'],['f','fish','上齿轻碰下唇。'],['v','very','像 f 一样，声带要振动。'],['s','sun','气流从齿间送出。'],['z','zoo','像 s 一样，声带要振动。'],['m','mum','双唇闭合，从鼻腔出声。'],['n','name','舌尖上抬，从鼻腔出声。'],['h','hand','轻轻呼出一口气。'],['l','leaf','舌尖碰上齿龈。'],['r','red','舌头微卷，不碰上颚。'],['w','water','双唇先收圆。'],['j','yellow','像 yes 开头的音。']
  ]},
  {title:'进阶辅音',subtitle:'挑战更特别的声音',emoji:'🚀',tip:'先听一遍，再看嘴形提示，试着跟读例词。',sounds:[
    ['θ','three','舌尖轻放在上下牙之间。'],['ð','mother','像 θ 一样，声带要振动。'],['ʃ','sheep','双唇稍圆，发 sh 音。'],['ʒ','usually','像 sh 一样，声带要振动。'],['tʃ','chair','先堵住气流，再发 ch。'],['dʒ','juice','像 ch 一样，声带要振动。'],['ŋ','sing','舌后部抬起，从鼻腔出声。']
  ]},
  {title:'辅音组合',subtitle:'两个声音连起来',emoji:'⭐',tip:'保持两个音连贯，不要在中间多加一个元音。',sounds:[
    ['tr','tree','t 和 r 连起来。'],['dr','draw','d 和 r 连起来。'],['sp','sport','s 和 p 连起来。'],['st','star','s 和 t 连起来。'],['sk','skate','s 和 k 连起来。'],['bl','blue','b 和 l 连起来。'],['ɡr','green','g 和 r 连起来。'],['fl','flower','f 和 l 连起来。']
  ]}
];

const phonicsState={level:0};
const phonicsItems=PHONICS_LEVELS.flatMap((level,li)=>level.sounds.map(([sound,word,cue],si)=>{
  const example=primaryItems.find(item=>item.word.toLowerCase()===word.toLowerCase());
  return {id:`${li}-${si}`,sound,word,cue,li,example};
}));
const phonicsById=new Map(phonicsItems.map(item=>[item.id,item]));

function phonicsPage(){
  const level=PHONICS_LEVELS[phonicsState.level];
  const items=phonicsItems.filter(item=>item.li===phonicsState.level);
  const done=items.filter(item=>progress.phonicsLearned.includes(item.id)).length;
  const totalDone=progress.phonicsLearned.length;
  const tabs=PHONICS_LEVELS.map((entry,i)=>`<button class="phonics-tab ${i===phonicsState.level?'active':''}" data-action="phonics-level" data-index="${i}"><span>${entry.emoji}</span><b>第 ${i+1} 关</b><small>${esc(entry.title)}</small></button>`).join('');
  const cards=items.map(item=>{
    const learned=progress.phonicsLearned.includes(item.id);
    return `<article class="phonics-card ${learned?'is-learned':''}"><div class="phonics-card-top"><span>音标</span><button data-action="phonics-play" data-id="${item.id}" aria-label="播放 ${esc(item.sound)} 的例词 ${esc(item.word)}">🔊</button></div><div class="phonics-symbol">/${esc(item.sound)}/</div><div class="phonics-word"><strong>${esc(item.word)}</strong><span>${esc(item.example?.meaning||'例词')}</span></div><div class="phonics-word-ipa">${esc(item.example?.ipa||'')}</div><p>${esc(item.cue)}</p><div class="phonics-card-actions"><button data-action="phonics-play" data-id="${item.id}">▶ 听例词</button><button data-action="phonics-mark" data-id="${item.id}" class="${learned?'done':''}">${learned?'✓ 已学会':'○ 学会了'}</button></div></article>`;
  }).join('');
  return `<div class="page-title"><span class="eyebrow">LEARN ENGLISH SOUNDS</span><h1>学习音标 🔤</h1><p>从简单的短元音开始，通过例词听辨每个声音，再一步步挑战辅音组合。</p></div>
    <section class="phonics-hero"><div><span class="phonics-hero-tag">循序渐进 · 6 个关卡</span><h2>听一听，读一读，<br>发音越来越清楚！</h2><p>点击每张卡片的 🔊，听例词里对应的音。</p></div><div class="phonics-hero-art">/${esc(items[0].sound)}/ ✦</div></section>
    <div class="phonics-overview"><span>已学会 <strong>${totalDone}</strong> / ${phonicsItems.length} 个音</span><span>当前关卡 <strong>${done}</strong> / ${items.length}</span></div>
    <div class="phonics-tabs">${tabs}</div>
    <div class="phonics-heading"><div><span>第 ${phonicsState.level+1} 关</span><h2>${level.emoji} ${esc(level.title)}</h2><p>${esc(level.subtitle)}</p></div><button class="secondary-btn" data-action="phonics-next">下一关 →</button></div>
    <div class="phonics-tip">💡 ${esc(level.tip)}</div><div class="phonics-grid">${cards}</div>
    <div class="phonics-footnote">音标以美式英语的常见发音为参考。朗读按钮播放例词，帮助你在单词中辨认目标音。</div>`;
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action^="phonics-"]');
  if(!button)return;
  const action=button.dataset.action;
  if(action==='phonics-level'){phonicsState.level=Number(button.dataset.index);render()}
  else if(action==='phonics-next'){phonicsState.level=(phonicsState.level+1)%PHONICS_LEVELS.length;render();main.scrollIntoView({behavior:'smooth'})}
  else if(action==='phonics-play'){const item=phonicsById.get(button.dataset.id);if(item)speak(item.word)}
  else if(action==='phonics-mark'){
    const id=button.dataset.id;
    const index=progress.phonicsLearned.indexOf(id);
    if(index>=0)progress.phonicsLearned.splice(index,1);else{progress.phonicsLearned.push(id);markDay()}
    save();render();
  }
});
