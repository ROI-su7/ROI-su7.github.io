const doubaoState={scene:0,question:'',heard:'',status:'可以打字，也可以点击麦克风说出问题。'};
const DOUBAO_SCENES=[
  {emoji:'👋',title:'初次见面',prompt:'和我进行适合小学生的初次见面英语对话。每次只问一个简短问题，并在我回答后用中文指出一处可以改进的地方。'},
  {emoji:'🏫',title:'校园生活',prompt:'请扮演我的英语同学，和我聊学校生活。使用简单短句，每次只说一到两句。'},
  {emoji:'🍎',title:'食物点餐',prompt:'请扮演餐厅服务员，和我练习用英语点餐。词汇难度适合小学阶段。'},
  {emoji:'🧭',title:'旅行问路',prompt:'请和我练习旅行问路英语。先给一个简单场景，再等我回答。'},
  {emoji:'🐼',title:'动物朋友',prompt:'请和我用简单英语聊喜欢的动物，并纠正我的语法和用词。'},
  {emoji:'❓',title:'英语答疑',prompt:'你是耐心的小学英语老师。请用简单中文回答我的英语问题，并给一个很短的英文例句。'}
];

function doubaoFullPrompt(){
  const scene=DOUBAO_SCENES[doubaoState.scene];
  const question=doubaoState.question.trim();
  return `你是“梓旗英语”的英语口语陪练老师。${scene.prompt}${question?`\n\n我的问题或想说的话：${question}`:''}`;
}
function copyText(text){
  if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
  const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();return Promise.resolve();
}

function doubaoPage(){
  const scene=DOUBAO_SCENES[doubaoState.scene];
  const cards=DOUBAO_SCENES.map((item,index)=>`<button class="doubao-scene ${index===doubaoState.scene?'active':''}" data-action="doubao-scene" data-index="${index}"><span>${item.emoji}</span><b>${esc(item.title)}</b><small>${index===5?'问语法、词义或作业':'进入情景对话'}</small></button>`).join('');
  return `<div class="page-title"><span class="eyebrow">SPEAK WITH DOUBAO</span><h1>豆包口语陪练 💬</h1><p>选择场景，把练习要求和问题带到豆包官方网页，进行英语对话或答疑。</p></div>
    <section class="doubao-hero"><div><span>AI ENGLISH PARTNER</span><h2>准备好开口说英语了吗？</h2><p>先在这里选场景、说问题，再打开豆包继续练习。</p></div><div class="doubao-bubble"><b>Hi!</b><span>Let's talk.</span></div></section>
    <div class="doubao-section-head"><h2>1. 选择陪练场景</h2><small>适合小学英语初学者</small></div><div class="doubao-scenes">${cards}</div>
    <div class="doubao-workspace"><section class="doubao-question-panel"><div class="doubao-section-head"><h2>2. 说出或写下问题</h2><span>${scene.emoji} ${esc(scene.title)}</span></div><textarea id="doubaoQuestion" maxlength="500" placeholder="例如：请和我练习自我介绍；apple 和 apples 有什么区别？">${esc(doubaoState.question)}</textarea><div class="doubao-input-actions"><button class="ghost-btn" data-action="doubao-mic">🎙️ 语音输入</button><button class="ghost-btn" data-action="doubao-clear">清空</button><span>${esc(doubaoState.status)}</span></div><div class="doubao-preview"><b>将发送给豆包的练习要求</b><p>${esc(doubaoFullPrompt())}</p></div><div class="doubao-launch-actions"><button class="ghost-btn" data-action="doubao-copy">📋 复制练习要求</button><button class="primary-btn" data-action="doubao-open">打开豆包开始陪练 →</button></div></section>
      <aside class="side-tip doubao-tip"><div class="tip-emoji">💬</div><h3>使用方法</h3><ol><li>选择一个英语场景。</li><li>输入问题，或允许麦克风后直接说。</li><li>点击“打开豆包”，练习要求会先复制。</li><li>在豆包输入框长按粘贴并发送。</li></ol><p>对话在豆包官方网页中完成。本站不会收集或保存你的问题。</p></aside></div>
    <div class="doubao-safe-note">🔒 官方入口：doubao.com。打开后请核对浏览器地址，避免在仿冒网站输入账号信息。</div>`;
}

function startDoubaoVoiceInput(){
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){doubaoState.status='当前浏览器不支持语音输入，请直接打字。';render();return}
  const recognition=new Recognition();recognition.lang='zh-CN';recognition.interimResults=false;
  doubaoState.status='🎙️ 正在听，请说出你的问题…';render();
  recognition.onresult=event=>{doubaoState.question=event.results[0][0].transcript.trim();doubaoState.status=`已听到：${doubaoState.question}`;render()};
  recognition.onerror=event=>{doubaoState.status=event.error==='not-allowed'?'请允许浏览器使用麦克风。':'没有听清，请再试一次。';render()};
  try{recognition.start()}catch{doubaoState.status='麦克风暂时无法启动，请刷新后重试。';render()}
}

document.addEventListener('input',event=>{if(event.target.id==='doubaoQuestion')doubaoState.question=event.target.value});
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action^="doubao-"]');if(!button)return;
  const action=button.dataset.action;
  if(action==='doubao-scene'){doubaoState.scene=Number(button.dataset.index);render()}
  else if(action==='doubao-mic')startDoubaoVoiceInput();
  else if(action==='doubao-clear'){doubaoState.question='';doubaoState.status='可以打字，也可以点击麦克风说出问题。';render()}
  else if(action==='doubao-copy'){copyText(doubaoFullPrompt()).then(()=>toast('练习要求已复制，去豆包粘贴即可'))}
  else if(action==='doubao-open'){
    copyText(doubaoFullPrompt()).then(()=>{toast('已复制练习要求，正在打开豆包');window.open('https://www.doubao.com/chat/','_blank','noopener,noreferrer')}).catch(()=>window.open('https://www.doubao.com/chat/','_blank','noopener,noreferrer'));
  }
});
