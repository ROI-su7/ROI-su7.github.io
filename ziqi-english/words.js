// 每条记录：单词 | 音标 | 中文 | 英文例句 | 例句中文。按主题分组，适合初学者循序渐进。
const WORD_GROUPS = [
  {name:'动物朋友', emoji:'🐻', level:'小学', color:'peach', rows:`lion|/ˈlaɪən/|狮子|The lion lives in the grasslands.|狮子生活在草原上。
cat|/kæt/|猫|The cat is sleeping on the sofa.|小猫正睡在沙发上。
dog|/dɔːɡ/|狗|My dog likes to run in the park.|我的狗喜欢在公园跑步。
bird|/bɜːrd/|鸟|A little bird is singing in the tree.|一只小鸟在树上唱歌。
fish|/fɪʃ/|鱼|The fish swims in the water.|鱼在水里游泳。
rabbit|/ˈræbɪt/|兔子|The white rabbit has long ears.|这只白兔有长耳朵。
bear|/ber/|熊|A bear lives in the forest.|熊住在森林里。
duck|/dʌk/|鸭子|The duck is swimming in the pond.|鸭子正在池塘里游泳。
horse|/hɔːrs/|马|The horse runs very fast.|马跑得很快。
monkey|/ˈmʌŋki/|猴子|The monkey can climb trees.|猴子会爬树。
tiger|/ˈtaɪɡər/|老虎|The tiger is a big animal.|老虎是一种大型动物。
elephant|/ˈelɪfənt/|大象|The elephant has a long nose.|大象有长鼻子。`},
  {name:'我的家人', emoji:'🏠', level:'小学', color:'purple', rows:`family|/ˈfæməli/|家庭；家人|I love my family very much.|我非常爱我的家人。
mother|/ˈmʌðər/|妈妈|My mother makes breakfast for me.|妈妈为我做早餐。
father|/ˈfɑːðər/|爸爸|My father reads with me at night.|爸爸晚上陪我读书。
sister|/ˈsɪstər/|姐妹|My sister is ten years old.|我的姐姐十岁了。
brother|/ˈbrʌðər/|兄弟|My brother plays football with me.|我的哥哥和我踢足球。
grandmother|/ˈɡrænmʌðər/|奶奶；外婆|My grandmother tells me stories.|奶奶给我讲故事。
grandfather|/ˈɡrænfɑːðər/|爷爷；外公|My grandfather likes tea.|爷爷喜欢喝茶。
friend|/frend/|朋友|Lily is my best friend.|莉莉是我最好的朋友。
teacher|/ˈtiːtʃər/|老师|Our teacher is very kind.|我们的老师很亲切。
child|/tʃaɪld/|孩子|Every child loves to play.|每个孩子都爱玩。
people|/ˈpiːpəl/|人们|Many people are in the park.|公园里有很多人。
name|/neɪm/|名字|What is your name?|你叫什么名字？`},
  {name:'校园生活', emoji:'🎒', level:'小学', color:'blue', rows:`school|/skuːl/|学校|I go to school by bus.|我坐公交车去学校。
book|/bʊk/|书|This book is very interesting.|这本书很有趣。
pen|/pen/|钢笔|I write with a blue pen.|我用蓝色的钢笔写字。
pencil|/ˈpensəl/|铅笔|Please give me a pencil.|请给我一支铅笔。
desk|/desk/|书桌|My books are on the desk.|我的书在书桌上。
chair|/tʃer/|椅子|The chair is next to the table.|椅子在桌子旁边。
classroom|/ˈklæsruːm/|教室|Our classroom is bright and clean.|我们的教室明亮又干净。
lesson|/ˈlesən/|课|The English lesson starts at nine.|英语课九点开始。
homework|/ˈhoʊmwɜːrk/|家庭作业|I finish my homework after dinner.|我晚饭后完成作业。
question|/ˈkwestʃən/|问题|I have a question for you.|我有一个问题要问你。
answer|/ˈænsər/|回答；答案|She knows the answer.|她知道答案。
learn|/lɜːrn/|学习|We learn new words every day.|我们每天学习新单词。`},
  {name:'好吃的食物', emoji:'🍓', level:'小学', color:'yellow', rows:`apple|/ˈæpəl/|苹果|I eat an apple every day.|我每天吃一个苹果。
banana|/bəˈnænə/|香蕉|The banana is sweet and yellow.|香蕉又甜又黄。
orange|/ˈɔːrɪndʒ/|橙子|Would you like an orange?|你想要一个橙子吗？
strawberry|/ˈstrɔːberi/|草莓|I put strawberries in my yogurt.|我把草莓放进酸奶里。
bread|/bred/|面包|I have bread for breakfast.|我早餐吃面包。
milk|/mɪlk/|牛奶|I drink a glass of milk.|我喝一杯牛奶。
water|/ˈwɔːtər/|水|Please drink some water.|请喝点水。
rice|/raɪs/|米饭|We eat rice for lunch.|我们午餐吃米饭。
egg|/eɡ/|鸡蛋|I have an egg every morning.|我每天早上吃一个鸡蛋。
cake|/keɪk/|蛋糕|The birthday cake looks delicious.|生日蛋糕看起来很好吃。
noodle|/ˈnuːdəl/|面条|I like noodles with vegetables.|我喜欢蔬菜面条。
vegetable|/ˈvedʒtəbəl/|蔬菜|Vegetables help us stay healthy.|蔬菜帮助我们保持健康。
breakfast|/ˈbrekfəst/|早餐|Breakfast gives me energy.|早餐给我能量。`},
  {name:'缤纷世界', emoji:'🌈', level:'小学', color:'green', rows:`red|/red/|红色的|The apple is red.|这个苹果是红色的。
blue|/bluː/|蓝色的|The sky is blue today.|今天天空是蓝色的。
green|/ɡriːn/|绿色的|The leaves are green in spring.|春天树叶是绿色的。
yellow|/ˈjeloʊ/|黄色的|I have a yellow raincoat.|我有一件黄色雨衣。
purple|/ˈpɜːrpəl/|紫色的|She draws a purple flower.|她画了一朵紫色的花。
white|/waɪt/|白色的|The snow is white.|雪是白色的。
black|/blæk/|黑色的|The cat has black fur.|那只猫有黑色的毛。
pink|/pɪŋk/|粉色的|My sister likes pink balloons.|我妹妹喜欢粉色气球。
sun|/sʌn/|太阳|The sun is shining brightly.|太阳照得很亮。
moon|/muːn/|月亮|The moon is round tonight.|今晚的月亮很圆。
star|/stɑːr/|星星|I can see a bright star.|我能看见一颗明亮的星星。
rainbow|/ˈreɪnboʊ/|彩虹|A rainbow appears after the rain.|雨后出现了一道彩虹。`},
  {name:'快乐行动', emoji:'⚽', level:'小学', color:'peach', rows:`run|/rʌn/|跑|I run with my friends after school.|放学后我和朋友一起跑步。
walk|/wɔːk/|走路|We walk to the library.|我们走路去图书馆。
jump|/dʒʌmp/|跳|The little frog can jump high.|小青蛙能跳得很高。
swim|/swɪm/|游泳|I can swim in the pool.|我会在游泳池里游泳。
sing|/sɪŋ/|唱歌|We sing a song together.|我们一起唱一首歌。
dance|/dæns/|跳舞|She likes to dance to music.|她喜欢跟着音乐跳舞。
read|/riːd/|阅读|I read a story before bed.|我睡前读一个故事。
write|/raɪt/|写|Please write your name here.|请在这里写下你的名字。
draw|/drɔː/|画画|I draw a picture of my house.|我画了一幅我家的画。
play|/pleɪ/|玩；运动|We play football on Sundays.|我们星期天踢足球。
listen|/ˈlɪsən/|听|Listen to the teacher carefully.|认真听老师讲课。
speak|/spiːk/|说|I can speak a little English.|我会说一点英语。`},
  {name:'时间天气', emoji:'☀️', level:'小学', color:'blue', rows:`today|/təˈdeɪ/|今天|Today is a sunny day.|今天是晴天。
tomorrow|/təˈmɑːroʊ/|明天|We will visit the zoo tomorrow.|我们明天去动物园。
yesterday|/ˈjestərdeɪ/|昨天|I played with my dog yesterday.|昨天我和我的狗玩了。
morning|/ˈmɔːrnɪŋ/|早上|I get up early in the morning.|我早上起得很早。
afternoon|/ˌæftərˈnuːn/|下午|We have art class this afternoon.|今天下午我们上美术课。
evening|/ˈiːvnɪŋ/|傍晚；晚上|I read with Dad in the evening.|晚上我和爸爸一起读书。
sunny|/ˈsʌni/|晴朗的|It is sunny outside.|外面天气晴朗。
rainy|/ˈreɪni/|下雨的|It is rainy today, so take an umbrella.|今天下雨，带上雨伞吧。
cloudy|/ˈklaʊdi/|多云的|The sky is cloudy this morning.|今天早上天空多云。
summer|/ˈsʌmər/|夏天|We go swimming in summer.|我们夏天去游泳。
winter|/ˈwɪntər/|冬天|I wear a coat in winter.|冬天我穿外套。
season|/ˈsiːzən/|季节|Spring is my favorite season.|春天是我最喜欢的季节。`},
  {name:'成长词汇', emoji:'🚀', level:'初中', color:'purple', rows:`adventure|/ədˈventʃər/|冒险|Our trip was a great adventure.|我们的旅行是一次精彩的冒险。
amazing|/əˈmeɪzɪŋ/|令人惊奇的|The view from the hill is amazing.|山上的景色令人惊叹。
believe|/bɪˈliːv/|相信|Believe in yourself and keep trying.|相信自己，继续努力。
brave|/breɪv/|勇敢的|It was brave of her to try again.|她勇敢地再次尝试。
chance|/tʃæns/|机会|This is a chance to make new friends.|这是一个结交新朋友的机会。
choice|/tʃɔɪs/|选择|You can make your own choice.|你可以自己做选择。
create|/kriˈeɪt/|创造|We can create a story together.|我们可以一起创作一个故事。
dream|/driːm/|梦想|My dream is to become a scientist.|我的梦想是成为科学家。
effort|/ˈefərt/|努力|Your effort will help you improve.|你的努力会帮助你进步。
encourage|/ɪnˈkɜːrɪdʒ/|鼓励|My friends encourage me to speak English.|朋友们鼓励我说英语。
explore|/ɪkˈsplɔːr/|探索|We explore the forest together.|我们一起探索森林。
future|/ˈfjuːtʃər/|未来|I want to help people in the future.|将来我想帮助别人。`},
  {name:'日常交流', emoji:'💬', level:'初中', color:'green', rows:`agree|/əˈɡriː/|同意|I agree with your idea.|我同意你的想法。
arrive|/əˈraɪv/|到达|We will arrive at school at eight.|我们将在八点到学校。
borrow|/ˈbɑːroʊ/|借入|May I borrow your dictionary?|我可以借你的字典吗？
compare|/kəmˈper/|比较|Let's compare our answers.|我们来比较一下答案。
describe|/dɪˈskraɪb/|描述|Can you describe your hometown?|你能描述一下你的家乡吗？
discuss|/dɪˈskʌs/|讨论|We discuss the story in class.|我们在课堂上讨论这个故事。
explain|/ɪkˈspleɪn/|解释|Please explain the question to me.|请给我解释这个问题。
invite|/ɪnˈvaɪt/|邀请|I will invite Amy to my party.|我会邀请艾米参加我的聚会。
introduce|/ˌɪntrəˈduːs/|介绍|Let me introduce my new friend.|让我介绍我的新朋友。
message|/ˈmesɪdʒ/|消息|She sent me a kind message.|她给我发了一条暖心消息。
prepare|/prɪˈper/|准备|We prepare for the English test.|我们为英语考试做准备。
share|/ʃer/|分享|Please share your ideas with us.|请和我们分享你的想法。`},
  {name:'科学自然', emoji:'🌍', level:'初中', color:'yellow', rows:`animal|/ˈænɪməl/|动物|The panda is a special animal.|熊猫是一种特别的动物。
climate|/ˈklaɪmət/|气候|The climate here is warm.|这里的气候温暖。
discover|/dɪˈskʌvər/|发现|Scientists discover new things every day.|科学家每天都有新发现。
energy|/ˈenərdʒi/|能量|The sun gives us energy.|太阳给我们能量。
environment|/ɪnˈvaɪrənmənt/|环境|We should protect our environment.|我们应该保护环境。
experiment|/ɪkˈsperɪmənt/|实验|We did an experiment in science class.|我们在科学课上做了一个实验。
forest|/ˈfɔːrɪst/|森林|Many birds live in the forest.|许多鸟生活在森林里。
nature|/ˈneɪtʃər/|自然|I love spending time in nature.|我喜欢在大自然中度过时光。
planet|/ˈplænɪt/|行星|Earth is the planet we live on.|地球是我们居住的行星。
protect|/prəˈtekt/|保护|We must protect wild animals.|我们必须保护野生动物。
recycle|/ˌriːˈsaɪkəl/|回收利用|We recycle paper at school.|我们在学校回收纸张。
temperature|/ˈtemprətʃər/|温度|The temperature is high today.|今天温度很高。`},
  {name:'表达想法', emoji:'💡', level:'初中', color:'peach', rows:`although|/ɔːlˈðoʊ/|虽然|Although it rained, we had fun.|虽然下雨了，但我们玩得很开心。
because|/bɪˈkɔːz/|因为|I smile because I am happy.|我微笑，因为我很开心。
careful|/ˈkerfəl/|仔细的|Be careful when you cross the road.|过马路时要小心。
confident|/ˈkɑːnfɪdənt/|自信的|Practice makes me more confident.|练习让我更自信。
different|/ˈdɪfrənt/|不同的|We have different favorite colors.|我们喜欢的颜色不同。
important|/ɪmˈpɔːrtənt/|重要的|Sleep is important for your health.|睡眠对健康很重要。
interesting|/ˈɪntrəstɪŋ/|有趣的|This science book is interesting.|这本科普书很有趣。
possible|/ˈpɑːsəbəl/|可能的|Anything is possible if you try.|只要尝试，一切皆有可能。
probably|/ˈprɑːbəbli/|很可能|It will probably rain later.|一会儿很可能下雨。
reason|/ˈriːzən/|原因|What is the reason for your choice?|你做这个选择的原因是什么？
result|/rɪˈzʌlt/|结果|We are happy with the result.|我们对结果很满意。
understand|/ˌʌndərˈstænd/|理解|I understand the story now.|我现在理解这个故事了。`},
  {name:'身边的世界', emoji:'🧭', level:'初中', color:'blue', rows:`community|/kəˈmjuːnəti/|社区|Our community has a small library.|我们的社区有一座小图书馆。
culture|/ˈkʌltʃər/|文化|We learn about different cultures.|我们了解不同的文化。
direction|/dəˈrekʃən/|方向|Can you tell me the direction?|你能告诉我方向吗？
history|/ˈhɪstəri/|历史|I enjoy learning about history.|我喜欢学习历史。
journey|/ˈdʒɜːrni/|旅程|The train journey took two hours.|火车旅程花了两个小时。
language|/ˈlæŋɡwɪdʒ/|语言|English is an international language.|英语是一门国际语言。
library|/ˈlaɪbreri/|图书馆|I borrowed a book from the library.|我从图书馆借了一本书。
museum|/mjuˈziːəm/|博物馆|We saw old paintings in the museum.|我们在博物馆看到了古画。
neighbor|/ˈneɪbər/|邻居|Our neighbor is very friendly.|我们的邻居很友好。
tradition|/trəˈdɪʃən/|传统|Making dumplings is a family tradition.|包饺子是我们家的传统。
travel|/ˈtrævəl/|旅行|I want to travel around China.|我想游遍中国。
volunteer|/ˌvɑːlənˈtɪr/|志愿者|My sister is a library volunteer.|我姐姐是图书馆的志愿者。`}
];

const WORDS = WORD_GROUPS.flatMap((group, groupIndex) => group.rows.split('\n').map((row, index) => {
  const [word, ipa, meaning, sentence, translation] = row.split('|');
  return {word, ipa, meaning, sentence, translation, group:group.name, emoji:group.emoji, level:group.level, color:group.color, groupIndex, index};
}));
