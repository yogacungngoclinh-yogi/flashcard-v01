/* English 365 v1: additive, offline, source-ID-preserving guided practice. */
(function () {
  'use strict';
  const TYPES = ['review_cards','flashcards','choice','match','speaking_manual','order_tokens','offline_project','quick_review','reading','order_sentences','model_language','review_language','dialogue','text_map','picture_support','interactive_challenge'];
  const LABELS = ['Ôn thẻ','Khám phá thẻ','Chọn câu trả lời','Ghép cặp','Cùng nói','Xếp từ','Thử ngoài màn hình','Ôn chương','Đọc truyện','Xếp sự việc','Mẫu câu','Ôn mẫu câu','Đóng vai','Bản đồ chữ','Thẻ hỗ trợ','Thử thách'];
  let storySupport=null;
  let settingsPanel, settingsToggle, settingsReturn, root, body, live, state, profile, storageKey, savedRaw=null, lesson, index = 0, review = null, returnFocus, epoch = 0, blocked = false, storageProblem = '', short = false;
  const WORD_AUDIO = {"dog": "dog", "cat": "cat", "bird": "bird", "fish": "fish", "duck": "duck", "cow": "cow", "pig": "pig", "elephant": "elephant", "monkey": "monkey", "lion": "lion", "tiger": "tiger", "bear": "bear", "rabbit": "rabbit", "horse": "horse", "hen": "hen", "sheep": "sheep", "goat": "goat", "frog": "frog", "giraffe": "giraffe", "zebra": "zebra", "panda": "panda", "mouse": "mouse", "snake": "snake", "turtle": "turtle", "whale": "whale", "shark": "shark", "dolphin": "dolphin", "octopus": "octopus", "crab": "crab", "shrimp": "shrimp", "starfish": "starfish", "jellyfish": "jellyfish", "seal": "seal", "penguin": "penguin", "squid": "squid", "seahorse": "seahorse", "butterfly": "butterfly", "bee": "bee", "ant": "ant", "ladybug": "ladybug", "spider": "spider", "snail": "snail", "worm": "worm", "mosquito": "mosquito", "fly": "fly", "dragonfly": "dragonfly", "cricket": "cricket", "caterpillar": "caterpillar", "red": "red", "blue": "blue", "yellow": "yellow", "green": "green", "orange": "orange", "purple": "purple", "pink": "pink", "black": "black", "white": "white", "brown": "brown", "gray": "gray", "gold": "gold", "silver": "silver", "rainbow": "rainbow", "circle": "circle", "square": "square", "triangle": "triangle", "rectangle": "rectangle", "star-shape": "star", "heart": "heart", "oval": "oval", "diamond": "diamond", "moon-shape": "crescent", "cube": "cube", "one": "one", "two": "two", "three": "three", "four": "four", "five": "five", "six": "six", "seven": "seven", "eight": "eight", "nine": "nine", "ten": "ten", "eleven": "eleven", "twelve": "twelve", "thirteen": "thirteen", "fourteen": "fourteen", "fifteen": "fifteen", "sixteen": "sixteen", "seventeen": "seventeen", "eighteen": "eighteen", "nineteen": "nineteen", "twenty": "twenty", "apple": "apple", "banana": "banana", "orange-fruit": "orange", "grapes": "grapes", "strawberry": "strawberry", "watermelon": "watermelon", "mango": "mango", "pineapple": "pineapple", "lemon": "lemon", "cherry": "cherry", "pear": "pear", "peach": "peach", "coconut": "coconut", "kiwi": "kiwi", "papaya": "papaya", "durian": "durian", "dragon-fruit": "dragon fruit", "avocado": "avocado", "carrot": "carrot", "tomato": "tomato", "potato": "potato", "corn": "corn", "cucumber": "cucumber", "onion": "onion", "broccoli": "broccoli", "cabbage": "cabbage", "pumpkin": "pumpkin", "mushroom": "mushroom", "pepper": "pepper", "eggplant": "eggplant", "garlic": "garlic", "peas": "peas", "rice": "rice", "bread": "bread", "egg": "egg", "milk": "milk", "water": "water", "cake": "cake", "candy": "candy", "ice-cream": "ice cream", "noodles": "noodles", "chicken": "chicken", "soup": "soup", "pizza": "pizza", "cookie": "cookie", "juice": "juice", "cheese": "cheese", "honey": "honey", "sandwich": "sandwich", "meat": "meat", "eye": "eye", "ear": "ear", "nose": "nose", "mouth": "mouth", "hand": "hand", "foot": "foot", "hair": "hair", "teeth": "teeth", "leg": "leg", "head": "head", "arm": "arm", "finger": "finger", "face": "face", "tongue": "tongue", "knee": "knee", "tummy": "tummy", "back": "back", "shoulder": "shoulder", "mom": "mom", "dad": "dad", "baby": "baby", "brother": "brother", "sister": "sister", "grandma": "grandma", "grandpa": "grandpa", "family-word": "family", "friend": "friend", "teacher": "teacher", "uncle": "uncle", "aunt": "aunt", "boy": "boy", "girl": "girl", "happy": "happy", "sad": "sad", "angry": "angry", "scared": "scared", "tired": "tired", "sleepy": "sleepy", "hungry": "hungry", "surprised": "surprised", "sick": "sick", "love": "love", "silly": "silly", "shy": "shy", "run": "run", "jump": "jump", "walk": "walk", "swim": "swim", "eat": "eat", "drink": "drink", "sleep": "sleep", "sing": "sing", "dance": "dance", "read": "read", "write": "write", "draw": "draw", "clap": "clap", "cry": "cry", "laugh": "laugh", "climb": "climb", "kick": "kick", "wash": "wash", "shirt": "shirt", "t-shirt": "T-shirt", "pants": "pants", "shorts": "shorts", "dress": "dress", "skirt": "skirt", "hat": "hat", "cap": "cap", "shoes": "shoes", "socks": "socks", "jacket": "jacket", "scarf": "scarf", "gloves": "gloves", "glasses": "glasses", "bag": "bag", "ball": "ball", "doll": "doll", "teddy-bear": "teddy bear", "kite": "kite", "balloon": "balloon", "blocks": "blocks", "robot": "robot", "puzzle": "puzzle", "yo-yo": "yo-yo", "drum": "drum", "toy-car": "toy car", "slide": "slide", "swing": "swing", "crayon": "crayon", "car": "car", "bus": "bus", "bike": "bike", "motorbike": "motorbike", "truck": "truck", "train": "train", "plane": "plane", "boat": "boat", "ship": "ship", "helicopter": "helicopter", "taxi": "taxi", "police-car": "police car", "fire-truck": "fire truck", "ambulance": "ambulance", "rocket": "rocket", "tractor": "tractor", "house": "house", "door": "door", "window": "window", "bed": "bed", "chair": "chair", "table": "table", "sofa": "sofa", "lamp": "lamp", "tv": "TV", "clock": "clock", "cup": "cup", "bowl": "bowl", "spoon": "spoon", "toothbrush": "toothbrush", "pillow": "pillow", "phone": "phone", "book": "book", "pen": "pen", "pencil": "pencil", "eraser": "eraser", "ruler": "ruler", "scissors": "scissors", "school-bag": "school bag", "desk": "desk", "board": "board", "paper": "paper", "glue": "glue", "notebook": "notebook", "school": "school", "doctor": "doctor", "nurse": "nurse", "police": "police officer", "firefighter": "firefighter", "chef": "chef", "farmer": "farmer", "pilot": "pilot", "singer": "singer", "driver": "driver", "dentist": "dentist", "astronaut": "astronaut", "artist": "artist", "sun": "sun", "moon": "moon", "star": "star", "cloud": "cloud", "rain": "rain", "snow": "snow", "wind": "wind", "tree": "tree", "flower": "flower", "leaf": "leaf", "grass": "grass", "river": "river", "mountain": "mountain", "sea-word": "sea", "sky": "sky", "rock": "rock", "football": "football", "basketball": "basketball", "tennis": "tennis", "badminton": "badminton", "volleyball": "volleyball", "table-tennis": "table tennis", "cycling": "cycling", "skating": "skating", "baseball": "baseball", "karate": "karate", "golf": "golf", "swimming": "swimming", "piano": "piano", "guitar": "guitar", "violin": "violin", "trumpet": "trumpet", "flute": "flute", "saxophone": "saxophone", "microphone": "microphone", "banjo": "banjo", "maracas": "maracas", "headphones": "headphones", "bell": "bell", "accordion": "accordion", "hospital": "hospital", "park": "park", "zoo-place": "zoo", "supermarket": "supermarket", "library": "library", "bank": "bank", "post-office": "post office", "restaurant": "restaurant", "cinema": "cinema", "beach": "beach", "airport": "airport", "bakery": "bakery", "fork": "fork", "knife": "knife", "plate": "plate", "pan": "pan", "pot": "pot", "fridge": "fridge", "teapot": "teapot", "chopsticks": "chopsticks", "bottle": "bottle", "jar": "jar", "salt": "salt", "glass": "glass", "soap": "soap", "towel": "towel", "shampoo": "shampoo", "toilet": "toilet", "bathtub": "bathtub", "shower": "shower", "comb": "comb", "mirror": "mirror", "toothpaste": "toothpaste", "tissue": "tissue", "sponge": "sponge", "sink": "sink", "big": "big", "small": "small", "tall": "tall", "short": "short", "hot": "hot", "cold": "cold", "fast": "fast", "slow": "slow", "heavy": "heavy", "light": "light", "old": "old", "young": "young", "planet": "planet", "earth": "Earth", "comet": "comet", "alien": "alien", "ufo": "UFO", "telescope": "telescope", "satellite": "satellite", "galaxy": "galaxy", "mars": "Mars", "spacesuit": "spacesuit", "rooster": "rooster", "chick": "chick", "duckling": "duckling", "donkey": "donkey", "turkey": "turkey", "buffalo": "buffalo", "goose": "goose", "puppy": "puppy", "kitten": "kitten", "lamb": "lamb", "calf": "calf", "barn": "barn", "tea": "tea", "coffee": "coffee", "lemonade": "lemonade", "smoothie": "smoothie", "bubble-tea": "bubble tea", "cupcake": "cupcake", "donut": "donut", "chocolate": "chocolate", "lollipop": "lollipop", "popcorn": "popcorn", "pancake": "pancake", "pudding": "pudding", "monday": "Monday", "tuesday": "Tuesday", "wednesday": "Wednesday", "thursday": "Thursday", "friday": "Friday", "saturday": "Saturday", "sunday": "Sunday", "spring": "spring", "summer": "summer", "autumn": "autumn", "winter": "winter", "m-headache": "headache", "m-toothache": "toothache", "m-stomach-ache": "stomach ache", "m-earache": "earache", "m-cough": "cough", "m-cold": "cold", "m-fever": "fever", "m-sore-throat": "sore throat", "m-medicine": "medicine", "m-plaster": "plaster", "m-thermometer": "thermometer", "m-rest": "rest", "m-vet": "vet", "m-mechanic": "mechanic", "m-waiter": "waiter", "m-actor": "actor", "m-reporter": "reporter", "m-photographer": "photographer", "m-scientist": "scientist", "m-builder": "builder", "m-hairdresser": "hairdresser", "m-postman": "postman", "m-sailor": "sailor", "m-shop-assistant": "shop assistant", "m-wood": "wood", "m-plastic": "plastic", "m-metal": "metal", "m-glass": "glass", "m-paper": "paper", "m-cotton": "cotton", "m-wool": "wool", "m-leather": "leather", "m-rubber": "rubber", "m-stone": "stone", "m-turn-left": "turn left", "m-turn-right": "turn right", "m-go-straight": "go straight", "m-corner": "corner", "m-bridge": "bridge", "m-street": "street", "m-traffic-lights": "traffic lights", "m-crossroads": "crossroads", "m-museum": "museum", "m-castle": "castle", "m-market": "market", "m-station": "station", "m-island": "island", "m-forest": "forest", "m-desert": "desert", "m-lake": "lake", "m-jungle": "jungle", "m-waterfall": "waterfall", "m-hill": "hill", "m-field": "field", "m-volcano": "volcano", "m-cave": "cave", "m-valley": "valley", "m-ocean": "ocean", "m-take-photos": "take photos", "m-go-camping": "go camping", "m-play-chess": "play chess", "m-go-fishing": "go fishing", "m-ride-a-horse": "ride a horse", "m-collect-stamps": "collect stamps", "m-read-comics": "read comics", "m-play-computer-games": "play computer games", "m-skateboard": "skateboard", "m-paint": "paint", "m-bake": "bake", "m-go-hiking": "go hiking", "m-jan": "January", "m-feb": "February", "m-mar": "March", "m-apr": "April", "m-may": "May", "m-jun": "June", "m-jul": "July", "m-aug": "August", "m-sep": "September", "m-oct": "October", "m-nov": "November", "m-dec": "December", "m-first": "first", "m-second": "second", "m-third": "third", "m-fourth": "fourth", "m-fifth": "fifth", "m-sixth": "sixth", "m-seventh": "seventh", "m-eighth": "eighth", "m-ninth": "ninth", "m-tenth": "tenth", "m-eleventh": "eleventh", "m-twelfth": "twelfth", "m-oclock": "o'clock", "m-half-past": "half past", "m-quarter-past": "quarter past", "m-quarter-to": "quarter to", "m-morning": "morning", "m-afternoon": "afternoon", "m-evening": "evening", "m-night": "night", "m-noon": "noon", "m-midnight": "midnight", "m-early": "early", "m-late": "late", "m-in-front-of": "in front of", "m-behind": "behind", "m-next-to": "next to", "m-between": "between", "m-opposite": "opposite", "m-under": "under", "m-above": "above", "m-near": "near", "m-across": "across", "m-through": "through", "m-inside": "inside", "m-outside": "outside", "m-went": "went", "m-had": "had", "m-saw": "saw", "m-ate": "ate", "m-took": "took", "m-bought": "bought", "m-came": "came", "m-gave": "gave", "m-got": "got", "m-ran": "ran", "m-swam": "swam", "m-made": "made", "m-beautiful": "beautiful", "m-dangerous": "dangerous", "m-delicious": "delicious", "m-difficult": "difficult", "m-easy": "easy", "m-expensive": "expensive", "m-cheap": "cheap", "m-funny": "funny", "m-boring": "boring", "m-noisy": "noisy", "m-quiet": "quiet", "m-dirty": "dirty"};
  const SENTENCE_AUDIO = {"I like apples.": "am-thanh/mc-i-like-1.mp3", "I like bananas.": "am-thanh/mc-i-like-2.mp3", "I like ice cream.": "am-thanh/mc-i-like-5.mp3", "This is my mom.": "am-thanh/gt-gia-dinh-1-a.mp3", "This is my dad.": "am-thanh/mc-this-is-my-2.mp3", "This is my brother.": "am-thanh/mc-this-is-my-4.mp3", "This is my sister.": "am-thanh/mc-this-is-my-3.mp3", "This is my grandma.": "am-thanh/mc-this-is-my-5.mp3", "This is my grandpa.": "am-thanh/mc-this-is-my-6.mp3", "This is my family.": "am-thanh/dd-my-family-1.mp3", "This is my friend.": "am-thanh/mc-this-is-my-8.mp3", "This is my teacher.": "am-thanh/mc-this-is-my-7.mp3", "I have a headache.": "am-thanh/th-doctor-1-a.mp3", "No, thank you.": "am-thanh/gt-lich-su-5-a.mp3", "What does it look like?": "am-thanh/th-lost-bag-2-q.mp3"};
  let wordAudio = null, playbackReset=null, playbackCleanup=null, speechVersion=0, youngPractice=null, adultReview=false;
  // Local-only, optional effects. These never write curriculum assessment or mastery.
  const effectPreferenceKey='english365-effects-v1';
  let effectPrefs={sound:true,motion:true},effectContext=null,effectNodes=[],effectVersion=0,effectTimer=null;
  const effectSeen=new WeakMap();
  try{const saved=JSON.parse(localStorage.getItem(effectPreferenceKey)||'null');if(saved){if(typeof saved.sound==='boolean')effectPrefs.sound=saved.sound;if(typeof saved.motion==='boolean')effectPrefs.motion=saved.motion;}}catch(e){}
  function stopEffects(){effectVersion++;clearTimeout(effectTimer);effectNodes.forEach(({osc,gain})=>{try{osc.stop();osc.disconnect();gain.disconnect();}catch(e){}});effectNodes=[];root?.querySelectorAll('.e365-particles').forEach(n=>n.remove());}
  function effectSound(correct){
    stopEffects();if(!effectPrefs.sound||correct===null||document.hidden||window.speechSynthesis?.speaking||window.speechSynthesis?.pending||(wordAudio&&!wordAudio.paused&&!wordAudio.ended)||(typeof am!=='undefined'&&am&&!am.paused&&!am.ended))return;
    const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;
    const ticket=effectVersion,current=epoch;
    try{effectContext=effectContext||new AudioContext();const play=()=>{if(ticket!==effectVersion||current!==epoch||!root||!effectPrefs.sound||document.hidden||window.speechSynthesis?.speaking||window.speechSynthesis?.pending||(wordAudio&&!wordAudio.paused&&!wordAudio.ended)||(typeof am!=='undefined'&&am&&!am.paused&&!am.ended))return;const now=effectContext.currentTime,notes=correct?[660,880]:[392,349];notes.forEach((frequency,i)=>{const osc=effectContext.createOscillator(),gain=effectContext.createGain(),start=now+i*.105;osc.type='sine';osc.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(correct?.045:.032,start+.018);gain.gain.exponentialRampToValueAtTime(.0001,start+.15);osc.connect(gain);gain.connect(effectContext.destination);const node={osc,gain};effectNodes.push(node);osc.onended=()=>{osc.disconnect();gain.disconnect();effectNodes=effectNodes.filter(n=>n!==node);};osc.start(start);osc.stop(start+.17);});};if(effectContext.state==='suspended')effectContext.resume().then(play).catch(()=>{});else play();}catch(e){}
  }
  function effectsControls(top){
    const group=el('div',null,top,'e365-effect-controls');group.setAttribute('role','group');group.setAttribute('aria-label','Hiệu ứng câu trả lời');
    [['sound','Âm hiệu ứng'],['motion','Chuyển động']].forEach(([key,label])=>{const b=el('button',null,group);b.type='button';b.dataset.effectToggle=key;const paint=()=>{b.textContent=(key==='sound'?'Âm báo':'Hiệu ứng')+': '+(effectPrefs[key]?'Bật':'Tắt');b.setAttribute('aria-label',label+': '+(effectPrefs[key]?'Bật':'Tắt'));b.setAttribute('aria-pressed',String(effectPrefs[key]));};paint();b.title=key==='sound'?'Chỉ bật/tắt âm báo trả lời; không tắt giọng đọc từ và câu.':'Tắt chuyển động trang trí; luôn tôn trọng cài đặt giảm chuyển động của thiết bị.';b.onclick=()=>{effectPrefs[key]=!effectPrefs[key];stopEffects();paint();try{localStorage.setItem(effectPreferenceKey,JSON.stringify(effectPrefs));}catch(e){announce('Đã đổi hiệu ứng cho lần mở này; thiết bị chưa lưu được lựa chọn.');}};});
  }
  function answerEffect(box,correct,text,signature=text,wrongLabel='Thử lại theo mẫu nhé'){
    const outcome=correct===true?'correct':correct===false?'retry':'neutral',stamp=outcome+'|'+signature;
    const repeated=effectSeen.get(box)===stamp;effectSeen.set(box,stamp);
    box.dataset.effect=outcome;box.removeAttribute('role');box.querySelector('.e365-result-symbol')?.remove();
    const symbol=correct===true?'✓':correct===false?'↻':'○',label=correct===true?'Khớp với mẫu!':correct===false?wrongLabel:'Cùng xem mẫu nhé';
    const icon=el('span',symbol,null,'e365-result-symbol');icon.setAttribute('aria-hidden','true');box.prepend(icon);if(repeated)return;
    effectSound(correct);
    if(live){live.replaceChildren();live.className='e365-live e365-answer-live';live.dataset.effect=outcome;el('span',label+'. '+text,live,'e365-sr-only');const visible=el('span',null,live,'e365-effect-label');visible.setAttribute('aria-hidden','true');el('span',symbol,visible,'e365-effect-icon');el('span',label,visible);const helper=el('span',text,live,'e365-effect-helper');helper.setAttribute('aria-hidden','true');
      if(effectPrefs.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches){visible.classList.add('e365-effect-pop');if(correct===true){const burst=el('span',null,live,'e365-particles');burst.setAttribute('aria-hidden','true');for(let i=0;i<9;i++){const particle=el('i',null,burst);particle.style.setProperty('--i',i);particle.style.setProperty('--x',((i-4)*22)+'px');particle.style.setProperty('--y',(-24-Math.abs(i-4)*7)+'px');}effectTimer=setTimeout(()=>burst.remove(),750);}}}
  }
  function stopAudio(){
    stopEffects();speechVersion++;
    const reset=playbackReset,cleanup=playbackCleanup;playbackReset=null;playbackCleanup=null;
    if(cleanup)cleanup();if(reset)reset();
    if(wordAudio){wordAudio.onended=null;wordAudio.onerror=null;wordAudio.pause();wordAudio=null;}
    try{window.speechSynthesis?.cancel();}catch(e){}
  }
  function beginPlayback(button,label){stopAudio();playbackReset=()=>{if(button.isConnected)button.textContent=label;};return speechVersion;}

  const C = () => window.English365Curriculum;
  const K = () => window.EnglishKidsCore;
  const age = () => (typeof tuoi !== 'undefined' && String(tuoi) === '5') ? 'ages_5_7' : 'ages_8_10';
  const observed = () => short || age() === 'ages_5_7';
  const el = (tag, text, parent, cls) => { const n = document.createElement(tag); if (text != null) n.textContent = String(text); if (cls) n.className = cls; if (parent) parent.appendChild(n); return n; };
  function btn(text, fn, parent, cls) { const b = el('button', text, parent, cls);if(/^Kiểm tra/.test(text))b.classList.add('e365-primary');if(b.classList.contains('e365-primary')&&parent?.closest('.e365-panel')&&!parent.closest('details')){b.classList.add('e365-task-dock');if(parent.closest('.e365-feedback'))parent.closest('.e365-panel').querySelectorAll('.e365-task-dock').forEach(previous=>{if(previous!==b&&!previous.classList.contains('e365-dock-suspended')){previous.dataset.beforeFeedbackDisabled=String(previous.disabled);previous.disabled=true;previous.hidden=true;previous.classList.add('e365-dock-suspended');}});} b.type = 'button'; const current = epoch; b.addEventListener('click', () => { if (!b.isConnected || current !== epoch || blocked) return; try { fn(b); } catch(e) { announce('Chưa thực hiện được: ' + e.message); } });if(b.classList.contains('e365-primary')&&parent?.closest('.e365-feedback'))b.focus({preventScroll:true}); return b; }
  function announce(t) { if(live){live.className='e365-live';delete live.dataset.effect;live.textContent=t;} }
  function paragraph(t, p=body) { if(t) el('p', t, p); }
  function list(values, p=body) { (values || []).forEach(v => paragraph(typeof v === 'string' ? v : Array.isArray(v) ? v.join(' · ') : JSON.stringify(v),p)); }
  function details(title, fn, p=body) { const d = el('details',null,p); el('summary',title,d); fn(d); return d; }
  function key() { return typeof khoaHs === 'function' ? khoaHs('english365-v1-state') : 'english365-v1-state'; }
  function empty() { return {version:1, contentVersion:C().content_version, profileId:profile, introduced:[], completed:[], attempts:{}, positions:{}, sessions:{}, currentReview:{}}; }
  function validateState(s) {
    const map=v=>v&&typeof v==='object'&&!Array.isArray(v);
    if(!['attempts','positions','sessions','currentReview'].every(k=>map(s[k])))throw Error('Cấu trúc tiến độ không hợp lệ');
    if(new Set(s.introduced).size!==s.introduced.length)throw Error('Trùng buổi đã giới thiệu');
    for(const [id,pos] of Object.entries(s.positions)){const l=C().lessons.find(l=>l.id===id);if(!l||!Number.isInteger(pos)||pos<0||pos>=l.activities.length)throw Error('Vị trí hoạt động không hợp lệ');}
    for(const [id,attempts] of Object.entries(s.attempts)){const l=C().lessons.find(l=>l.id===id);if(!l||!map(attempts))throw Error('Lượt thực hành không hợp lệ');for(const [aid,a] of Object.entries(attempts)){if(!l.activities.some(v=>v.id===aid)||!map(a)||!['not_scored','adult_observation','authored_key','question_practice_only'].includes(a.assessment)||![null,true,false].includes(a.correct)||typeof a.at!=='string'||!Number.isFinite(Date.parse(a.at)))throw Error('Kết quả hoạt động không hợp lệ');}}
    for(const v of Object.values(s.sessions))if(!map(v)||typeof v.snapshot!=='string'||v.snapshot.length>262144||!Array.isArray(v.outcomes))throw Error('Bản lưu ôn không hợp lệ');
    for(const [uid,sid] of Object.entries(s.currentReview))if(!C().units.some(u=>u.id===uid)||typeof sid!=='string'||!Object.hasOwn(s.sessions,sid))throw Error('Tham chiếu lượt ôn không hợp lệ');
  }
  function load() {
    storageKey = key(); let h1=2166136261,h2=5381; for(const c of storageKey){h1=Math.imul(h1^c.charCodeAt(0),16777619);h2=Math.imul(h2,33)^c.charCodeAt(0);}profile='p-'+(h1>>>0).toString(16)+'-'+(h2>>>0).toString(16);
    // Core IDs allow opaque strings; profile contains no child's name in clear text.
    state = empty(); storageProblem='';
    try { const raw=localStorage.getItem(storageKey); savedRaw=raw;if(raw) { const s=JSON.parse(raw); const ids=new Set(C().lessons.map(l=>l.id)); if(s.version!==1 || s.contentVersion!==C().content_version || s.profileId!==profile || !Array.isArray(s.introduced) || !Array.isArray(s.completed) || [...s.introduced,...s.completed].some(id=>!ids.has(id)) || new Set(s.completed).size!==s.completed.length || !s.attempts || !s.positions || !s.sessions || !s.currentReview) throw Error('Dữ liệu khác phiên bản hoặc không hợp lệ'); state=s; } }
    catch(e) { storageProblem='Không đọc được tiến độ. Dữ liệu cũ được giữ nguyên; không ghi đè. '+e.message; blocked=true; }
    try{validateState(state);}catch(e){state=empty();storageProblem='Tiến độ không hợp lệ; bản gốc được giữ nguyên. '+e.message;blocked=true;}
  }
  function save(change) {
    if(key()!==storageKey) { announce('Hồ sơ đã đổi. Đóng và mở lại lộ trình.'); return false; }
    if(blocked) { announce(storageProblem); return false; }
    const next=JSON.parse(JSON.stringify(state)); change(next);
    try { if(localStorage.getItem(storageKey)!==savedRaw){announce('Tiến độ vừa đổi ở cửa sổ khác. Đóng và mở lại lộ trình trước khi tiếp tục; không ghi đè dữ liệu mới.');return false;}const serialized=JSON.stringify(next);localStorage.setItem(storageKey, serialized);savedRaw=serialized; state=next; return true; }
    catch(e) { announce('Chưa lưu được trên thiết bị. Tiến độ cũ vẫn được giữ; hãy kiểm tra quyền lưu trữ rồi thử lại.'); return false; }
  }
  function init() {
    if(!C() || !K()) throw Error('Chưa tải đủ dữ liệu 365 và bộ chức năng.');
    if(root && key()!==storageKey){close();lesson=null;}
    if(!root) {
      returnFocus=document.activeElement; root=el('section',null,document.body,'e365'); root.id='english365-player'; root.setAttribute('role','dialog'); root.setAttribute('aria-modal','true'); root.setAttribute('aria-label','Lộ trình tiếng Anh 365 buổi'); root.tabIndex=-1;
      root.addEventListener('keydown', e=>{ if(e.key==='Escape') { e.stopPropagation(); if(settingsPanel&&!settingsPanel.hidden)settingsReturn.click();else if(storySupport)closeStorySupport();else close(); } if(e.key==='Tab') { const f=Array.from(root.querySelectorAll('button:not(:disabled),input,select,summary,[tabindex="0"]')).filter(n=>n.getClientRects().length&&!n.closest('[inert]')); if(!f.length)return; if(e.shiftKey && (document.activeElement===f[0] || document.activeElement===root)){e.preventDefault();f[f.length-1].focus();} else if(!e.shiftKey && document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus();} } });
      document.body.classList.add('e365-open'); blocked=false; load(); root.focus();
    }
  }
  function shell(title, subtitle) {
    init(); closeStorySupport(false); stopAudio(); epoch++; root.classList.remove('e365-settings-open'); root.replaceChildren(); const top=el('header',null,root,'e365-top');
    // Escape/close remain available even if stored data is blocked.
    const back=el('button','← Đóng',top);back.type='button';back.onclick=close;
    el('span','LINORA · ENGLISH 365',top,'e365-brand');
    settingsToggle=el('button','Cài đặt',top);settingsToggle.type='button';settingsToggle.dataset.settingsToggle='true';settingsToggle.setAttribute('aria-expanded','false');settingsToggle.setAttribute('aria-controls','e365-settings');
    settingsPanel=el('section',null,root,'e365-settings-panel');settingsPanel.id='e365-settings';settingsPanel.hidden=true;settingsPanel.setAttribute('aria-label','Cài đặt và hỗ trợ');el('h2','Cài đặt',settingsPanel);effectsControls(settingsPanel);
    settingsReturn=el('button','Trở lại bài học',settingsPanel,'e365-primary');settingsReturn.type='button';settingsReturn.dataset.settingsReturn='true';
    let speakingScroll=null;const toggleSettings=open=>{const speaking=body.querySelector('.e365-speaking-cues');if(open)speakingScroll=speaking?root.scrollTop:null;settingsPanel.hidden=!open;settingsToggle.setAttribute('aria-expanded',String(open));body.inert=open||!!storySupport;live.inert=open||!!storySupport;if(storySupport)storySupport.region.inert=open;root.classList.toggle('e365-settings-open',open);if(open){stopAudio();settingsReturn.focus();}else {if(speaking&&speakingScroll!==null)root.scrollTop=speakingScroll;const cue=speaking?.speakingReturnFocus;(cue?.isConnected?cue:settingsToggle).focus({preventScroll:true});speakingScroll=null;}};settingsToggle.onclick=()=>toggleSettings(settingsPanel.hidden);settingsReturn.onclick=()=>toggleSettings(false);
    if(lesson&&!review){const label=el('label',null,settingsPanel,'e365-toggle'),check=el('input',null,label);check.type='checkbox';check.checked=short;el('span','Luyện có hỗ trợ · không chấm tự động',label);check.onchange=()=>{short=check.checked;if(!body.querySelector('.e365-speaking-cues'))renderLesson();};} 
    body=el('main',null,root,'e365-body'); el('h1',title,body); paragraph(subtitle);
    live=el('p',storageProblem,root,'e365-live');live.setAttribute('role','status');live.setAttribute('aria-live','polite');
    if(blocked)paragraph(storageProblem);
    root.scrollTop=0;root.focus({preventScroll:true});
  }
  function close() { closeStorySupport(false); stopAudio(); if(!root)return; root.remove();root=null;review=null;epoch++;document.body.classList.remove('e365-open');window.dispatchEvent(new CustomEvent('english365:change'));if(returnFocus?.isConnected)returnFocus.focus(); }
  function home() {
    lesson=null;review=null; shell('Mỗi buổi một khám phá','365 buổi có thể học lại · 60 chương · Cùng người lớn, theo nhịp của con.');
    paragraph('Đây là tiến độ luyện tập riêng, không chuyển số bài cũ thành kết quả mới. Hoàn thành không đồng nghĩa đã thành thạo.');
    const next=C().lessons.find(l=>!state.completed.includes(l.id)) || C().lessons[0];
    btn('Bắt đầu / tiếp tục buổi '+next.day,()=>openLesson(next.day),body,'e365-primary');
    paragraph(state.completed.length+' / 365 buổi đã thực hành. Đọc mẫu cùng người lớn; không thu âm, không chấm phát âm.');
    const grid=el('div',null,body,'e365-units');
    C().units.forEach((u,i)=>{const box=el('details',null,grid,'e365-unit');el('summary',(i+1)+'. '+u.title_vi+' · '+u.first_day+'–'+u.last_day,box);const days=el('div',null,box,'e365-days'); C().lessons.filter(l=>l.unit_id===u.id).forEach(l=>btn((state.completed.includes(l.id)?'✓ ':'')+'Buổi '+l.day+' · '+l.title_vi,()=>openLesson(l.day),days));btn('Ôn 3 câu của chương',()=>openReview(u.id),box);});
  }
  function openLesson(day) {
    init();const found=C().lessons.find(l=>l.day===Number(day) || l.id===day);if(!found)throw Error('Không tìm thấy buổi học.');review=null;lesson=found;short=false;
    if(!save(s=>{if(!s.introduced.includes(found.id))s.introduced.push(found.id);} )){shell('Chưa thể lưu buổi học',storageProblem||'Không lưu được trên thiết bị. Hãy kiểm tra quyền lưu trữ rồi mở lại.');return;}
    index=state.completed.includes(lesson.id)?firstLearningIndex():Math.max(0,Math.min(lesson.activities.length-1,Number(state.positions[lesson.id])||0));if(emptyWarmup(lesson.activities[index]))index=firstLearningIndex();renderLesson();
  }
  function mark(a,result) { return save(s=>{if(!s.attempts[lesson.id])s.attempts[lesson.id]={};s.attempts[lesson.id][a.id]={...result,at:new Date().toISOString()};}); }
  function activityDone(a) { const attempt=state.attempts[lesson.id]?.[a.id];return !!attempt && attempt.observation!=='defer'; }
  function emptyWarmup(a){return a.type==='review_cards' && !(a.vocabulary_ids||[]).length && !(a.cards||[]).length;}
  function firstLearningIndex(){const first=lesson.activities.findIndex(a=>!emptyWarmup(a));return first<0?0:first;}
  function renderLesson() {
    const a=lesson.activities[index],steps=lesson.activities.filter(v=>!emptyWarmup(v)),stepNumber=steps.indexOf(a)+1;shell('Buổi '+lesson.day+' · '+lesson.title_vi,(stepNumber?'Bước '+stepNumber+' / '+steps.length:'Tham khảo · không tính bước học')+' · '+(LABELS[TYPES.indexOf(a.type)]||a.type));
    const progress=el('progress',null,body,'e365-progress');progress.max=steps.length;progress.value=Math.max(0,stepNumber-1);progress.setAttribute('aria-label','Vị trí trong buổi học');
    const panel=el('article',null,body,'e365-panel');panel.dataset.activityId=a.id;
    const childTitles={flashcards:'Nghe và tìm hình',review_cards:'Con còn nhớ không?',picture_support:'Tìm thẻ theo mẫu',model_language:'Đọc và nhớ câu',review_language:'Nhớ lại câu mẫu',reading:'Đọc từng đoạn nhỏ',dialogue:'Cùng đóng vai',match:'Nối hai thẻ cùng nghĩa',order_tokens:'Ghép thành câu',order_sentences:'Xếp câu chuyện',speaking_manual:'Đến lượt con nói!',offline_project:'Thử làm ngoài màn hình',text_map:'Đi theo bản đồ',choice:'Chọn câu trả lời',interactive_challenge:'Giải thử thách',quick_review:'Thử nhớ 3 câu'};el('h2',emptyWarmup(a)?'Thẻ ôn tham khảo':childTitles[a.type]||a.title_vi||a.type,panel);
    if(!emptyWarmup(a) && ['choice','match','order_tokens','order_sentences','interactive_challenge','speaking_manual','offline_project','text_map'].includes(a.type))paragraph(a.prompt_vi||a.instructions_vi||a.description_vi||a.prompt||a.prompt_en,panel);
    if(a.prompt_en && a.prompt_vi)paragraph(a.prompt_en,panel);
    if(renderContext(a,panel)!==false)renderActivity(a,panel);

  }
  function move(step) {let nextIndex=index+step;while(nextIndex>=0 && nextIndex<lesson.activities.length && emptyWarmup(lesson.activities[nextIndex]))nextIndex+=step;if(nextIndex>=lesson.activities.length){finish();return;}nextIndex=Math.max(firstLearningIndex(),nextIndex);if(save(s=>{s.positions[lesson.id]=nextIndex;})){index=nextIndex;renderLesson();}}
  function finish() {
    const pending=lesson.activities.filter(a=>!a.optional&&!emptyWarmup(a)&&!activityDone(a));
    if(pending.length){shell('Còn '+pending.length+' bước để thử','Buổi '+lesson.day+' · '+lesson.title_vi);paragraph('Những bước này chưa được thực hành. Con có thể thử tiếp hoặc để lần sau.');pending.forEach(a=>btn(LABELS[TYPES.indexOf(a.type)],()=>{const nextIndex=lesson.activities.indexOf(a);if(save(s=>{s.positions[lesson.id]=nextIndex;})){index=nextIndex;renderLesson();}},body));btn('Về trang chính',close,body);return;}
    if(!save(s=>{if(!s.completed.includes(lesson.id))s.completed.push(lesson.id);})){shell('Chưa lưu được buổi học','Chưa ghi nhận hoàn thành trên thiết bị.');paragraph('Tiến độ cũ vẫn được giữ. Kiểm tra quyền lưu trữ; nếu có cửa sổ khác đang học, đóng và mở lại buổi này.');btn('Thử lưu lại',finish,body,'e365-primary');btn('Về trang chính',close,body);return;}
    shell('Con đã luyện tập xong!','Buổi '+lesson.day+' · '+lesson.title_vi);
    const end=el('section',null,body,'e365-finish');el('div','✓',end,'e365-finish-icon');el('h2',lesson.title_vi,end);
    paragraph('Đã lưu buổi học trên thiết bị.',end);
    const next=C().lessons.find(l=>l.day>lesson.day);if(next)btn('Học buổi tiếp theo →',()=>openLesson(next.day),end,'e365-primary');else paragraph('Đây là buổi cuối của lộ trình 365. Con có thể chọn buổi bất kỳ để luyện lại.',end);
    btn('Về trang chính',close,end,next?null:'e365-primary');
    const retry=lesson.activities.filter(a=>state.attempts[lesson.id]?.[a.id]?.correct===false);if(retry.length)details('Thử lại những câu còn nhầm',d=>retry.forEach(a=>btn(a.prompt_vi||a.title_vi||LABELS[TYPES.indexOf(a.type)],()=>{const nextIndex=lesson.activities.indexOf(a);if(save(s=>{s.positions[lesson.id]=nextIndex;})){index=nextIndex;renderLesson();}},d)),end);
    
  }
  function sourceImage(ref,p,fallback) {if(!ref || !/^hinh\/[a-zA-Z0-9._-]+\.(jpg|png|webp)$/i.test(ref.src))return;const img=el('img',null,p,'e365-image');img.alt=ref.alt_en||fallback||'Minh họa hỗ trợ';img.loading='lazy';img.onerror=()=>{img.remove();paragraph('Ảnh chưa có trên thiết bị. Cùng dùng thẻ chữ bên dưới.',p);};img.src=ref.src;}
  function card(id,p) {
    const c=[...C().vocabulary,...C().language_targets,...C().supplementary_cards].find(c=>c.id===id);
    if(!c){paragraph('Thiếu thẻ nguồn: '+id,p);return;}
    const box=el('div',null,p,'e365-card');sourceImage(window.English365Assets?.images?.[c.image_id],box,c.en||c.title_vi);
    el('h3',c.en||c.model_en||c.title_vi,box);paragraph(c.vi||c.model_vi,box);
    if(!soundButton(c,box))paragraph('Cùng nghe người lớn đọc mẫu.',box);
    if(c.example_en||c.model_en&&c.en){paragraph(c.example_en||c.model_en,box);}
    details('Nghĩa câu và gợi ý',d=>{paragraph(c.example_vi,d);paragraph(c.explanation_vi,d);paragraph(c.display_note_vi,d);},box);
  }
  function story(s,p,full=false) {if(!s){paragraph('Không tìm thấy truyện nguồn. Không chấm hoạt động thiếu ngữ cảnh.',p);return false;}el('h3',s.title_en||s.title_vi,p);sourceImage(window.English365Assets?.stories?.[s.id]||window.English365Assets?.images?.[s.image_id],p,s.title_en);const simple=!full && age()==='ages_5_7';paragraph(simple?s.simple_en||s.text_en:s.text_en,p);details('Xem nghĩa tiếng Việt',d=>{paragraph(simple?s.simple_vi||s.text_vi:s.text_vi,d);list(s.glossary,d);},p);return true;}
  // Context preserves the task nodes and closures; reading is never assessment.
  function closeStorySupport(restore=true){
    if(!storySupport)return;
    const previous=storySupport;storySupport=null;stopAudio();previous.region.remove();
    body.hidden=false;body.inert=!!settingsPanel&&!settingsPanel.hidden;
    live.hidden=previous.liveHidden;live.inert=body.inert;
    if(restore&&previous.returnTo?.isConnected){root.scrollTop=previous.scrollTop;previous.returnTo.focus({preventScroll:true});}
  }
  function openStorySupport(source,trigger){
    if(storySupport)return;
    const text=typeof source?.text_en==='string'?source.text_en:'';
    // Keep every authored character; never select excerpts or invent alignment.
    const chunks=text.match(/[^.!?]+(?:[.!?]+(?:["”’']*)\s*|$)|[.!?]+\s*/g)||[];
    if(!text.trim()||chunks.join('')!==text){announce('Chưa mở được bản đầy đủ. Cùng người lớn thử lại sau nhé.');return;}
    stopAudio();
    const region=el('section',null,root,'e365-body e365-story-support');
    region.setAttribute('aria-labelledby','e365-story-heading');
    storySupport={region,returnTo:trigger,scrollTop:root.scrollTop,liveHidden:live.hidden};
    body.hidden=true;body.inert=true;live.hidden=true;live.inert=true;
    const heading=el('h1','Cùng đọc bản đầy đủ',region);heading.id='e365-story-heading';heading.tabIndex=-1;
    if(source.title_en||source.title_vi)el('h2',source.title_en||source.title_vi,region);
    const counter=el('p',null,region,'e365-card-count'),stage=el('div',null,region);
    const nav=el('div',null,region,'e365-row');nav.setAttribute('aria-label','Chuyển câu');
    let position=0;
    const previous=btn('Câu trước',()=>{if(position>0){position--;draw();}},nav);
    previous.dataset.storyPrevious='true';
    const next=btn('Câu tiếp',()=>{if(position+1<chunks.length){position++;draw();}},nav);
    next.dataset.storyNext='true';
    const back=btn('Trở lại câu hỏi',()=>closeStorySupport(),region,'e365-primary');back.dataset.storyReturn='true';
    function draw(){
      stopAudio();stage.replaceChildren();counter.textContent='Câu '+(position+1)+' / '+chunks.length;
      const sentence=el('p',chunks[position],stage,'e365-reading-chunk');sentence.lang='en';sentence.tabIndex=-1;sentence.dataset.storySentence='true';
      listenText(chunks[position].trim(),stage);
      previous.disabled=position===0;next.disabled=position===chunks.length-1;
      sentence.focus({preventScroll:true});
    }
    draw();root.scrollTop=0;heading.focus({preventScroll:true});
  }
  function renderContext(a,p) {
    const sid=a.story_id||lesson.story_id||lesson.activities.find(v=>v.type==='reading')?.story_id;
    if(age()==='ages_5_7'&&a.type!=='reading'&&a.text_variant_required==='text_en'){
      paragraph('Cùng người lớn đọc và thử.',p);
      const source=C().stories.find(s=>s.id===sid);
      if(typeof source?.text_en!=='string'||!source.text_en.trim()){paragraph('Chưa có bản đầy đủ. Cùng người lớn thử lại sau nhé.',p);return false;}
      const open=btn('Đọc bản đầy đủ',()=>openStorySupport(source,open),p);open.dataset.storySupport='true';
      return;
    }
    if(a.type!=='reading' && (a.story_id||a.text_variant_required)){const s=C().stories.find(s=>s.id===sid);details('Đọc lại truyện để tìm câu trả lời',d=>story(s,d,true),p);} else if(a.type==='choice' && lesson.activities.some(v=>v.type==='dialogue'))details('Đọc lại hội thoại',d=>list(lesson.activities.find(v=>v.type==='dialogue').turns.map(t=>t.speaker+': '+t.text),d),p);
  }
  function clearFeedback(scope){const restoreFocus=scope.querySelector('.e365-feedback')?.contains(document.activeElement);stopEffects();if(live?.classList.contains('e365-answer-live'))announce('');scope.querySelector('.e365-feedback')?.remove();scope.querySelectorAll('.e365-dock-suspended').forEach(b=>{b.disabled=b.dataset.beforeFeedbackDisabled==='true';b.hidden=false;b.classList.remove('e365-dock-suspended');delete b.dataset.beforeFeedbackDisabled;});if(restoreFocus)(scope.querySelector('.e365-task-dock:not(:disabled):not([hidden])')||scope.querySelector('button:not(:disabled)')||root)?.focus({preventScroll:true});}
  function feedback(a,p,correct,extra) {
    const ungraded=observed()||correct===null;
    if(!ungraded && !mark(a,{assessment:'authored_key',correct}))return;
    const text=ungraded?'Cùng xem đáp án mẫu nhé.':correct?'Đúng rồi!':'Chưa khớp. Thử lại nhé!';
    let box=p.querySelector('.e365-feedback');if(!box)box=el('div',null,p,'e365-feedback');box.replaceChildren();box.dataset.correct=ungraded?'null':String(correct);paragraph(text,box);paragraph(extra,box);answerEffect(box,correct,text+' '+(extra||''));
    if(ungraded){btn('Thử chọn lại',()=>{clearFeedback(p);},box,correct===false?'e365-primary':null);acknowledge(a,box,'Tiếp tục →',correct===false?null:'e365-primary');}
    else if(correct===true){p.querySelectorAll('button,select').forEach(b=>{if(!box.contains(b)&&!b.classList.contains('e365-listen'))b.disabled=true;});btn('Tiếp tục →',()=>move(1),box,'e365-primary').focus({preventScroll:true});}
  }
  function adult(a,p) {
    const d=details('Người lớn ghi nhận',()=>{},settingsPanel);d.classList.add('e365-observe');paragraph('Ghi nhận quan sát, không chấm tự động.',d);
    [['Con tự thử · tiếp tục →','independent'],['Con thử với hỗ trợ · tiếp tục →','supported'],['Để luyện lại sau →','defer']].forEach(([t,v])=>btn(t,()=>{if(mark(a,{assessment:'adult_observation',observation:v,correct:null}))move(1);},d));
  }
  function acknowledge(a,p,label='Con đã thử · tiếp tục →',cls='e365-primary') {btn(label,()=>{if(mark(a,{assessment:'not_scored',correct:null}))move(1);},p,cls);}
  function deviceVoiceButton(text,p){
    let message=p.querySelector(':scope > .e365-audio-status');const say=t=>{if(!message){message=el('p',null,p,'e365-audio-status');message.setAttribute('role','status');message.setAttribute('aria-live','polite');}message.textContent=t;};
    const b=btn('🔊 Nghe giọng thiết bị',()=>{
      const ticket=beginPlayback(b,'🔊 Nghe lại · giọng thiết bị'),synth=window.speechSynthesis;
      // Only installed English voices: never send authored text to a remote voice service.
      const findVoice=()=>{try{return synth?.getVoices().find(v=>/^en(?:[-_]|$)/i.test(v.lang)&&v.localService===true);}catch(e){return null;}};
      const voice=findVoice();
      if(!synth||!window.SpeechSynthesisUtterance){say('Thiết bị chưa có giọng tiếng Anh. Cùng đọc câu mẫu nhé.');return;}
      if(!voice){
        say('Đang tìm giọng tiếng Anh trên thiết bị…');b.textContent='🔊 Tìm giọng thiết bị…';
        let timer;const cleanup=()=>{clearTimeout(timer);synth.removeEventListener?.('voiceschanged',ready);if(message)message.textContent='';};
        const ready=()=>{if(ticket!==speechVersion)return;if(findVoice()){stopAudio();say('Giọng đã sẵn sàng. Chạm nghe lại nhé.');}};
        playbackCleanup=cleanup;synth.addEventListener?.('voiceschanged',ready);
        timer=setTimeout(()=>{if(ticket!==speechVersion)return;stopAudio();say('Chưa có giọng tiếng Anh trên thiết bị. Cùng đọc câu mẫu nhé.');},2000);ready();return;
      }
      if(message)message.textContent='';
      const utterance=new SpeechSynthesisUtterance(text);utterance.lang=voice.lang;utterance.voice=voice;utterance.rate=.85;
      b.textContent='🔊 Đang đọc bằng giọng thiết bị…';
      playbackCleanup=()=>{utterance.onend=null;utterance.onerror=null;};
      utterance.onend=()=>{if(ticket===speechVersion)stopAudio();};
      utterance.onerror=()=>{if(ticket!==speechVersion)return;stopAudio();say('Giọng thiết bị chưa đọc được. Cùng đọc câu mẫu nhé.');};
      try{synth.speak(utterance);}catch(e){if(ticket!==speechVersion)return;stopAudio();say('Giọng thiết bị chưa đọc được. Cùng đọc câu mẫu nhé.');}
    },p,'e365-listen');b.dataset.deviceVoice='true';b.title='Giọng trên thiết bị, không phải bản thu sẵn. Không thu âm.';return b;
  }
  function soundButton(c,p){
    if(!c)return false;const src=typeof c.en==='string'&&WORD_AUDIO[c.id]===c.en?'am-thanh/'+c.id+'.mp3':SENTENCE_AUDIO[c.en];if(!src)return false;
    const label=c.id?c.en:'câu mẫu';let fallback=null;
    const listen=btn('🔊 Nghe '+label,()=>{
      const ticket=beginPlayback(listen,'🔊 Nghe lại '+label);listen.textContent='🔊 Đang nghe…';
      const failed=()=>{if(ticket!==speechVersion)return;stopAudio();if(!fallback){fallback=el('div',null,p,'e365-audio-fallback');const notice=el('p','Bản thu chưa mở được.',fallback,'e365-audio-status');notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');deviceVoiceButton(c.en,fallback);}};
      try{const sound=new Audio(src);wordAudio=sound;sound.onended=()=>{if(ticket===speechVersion)stopAudio();};sound.onerror=failed;const playing=sound.play();if(playing?.then)playing.then(()=>{if(ticket!==speechVersion)return;if(fallback){fallback.remove();fallback=null;}},failed);}catch(e){failed();}
    },p,'e365-listen');return true;
  }
  function listenText(text,p){if(!text)return;if(SENTENCE_AUDIO[text]){soundButton({en:text},p);return;}const exact=Object.entries(WORD_AUDIO).find(([,t])=>t===text);if(exact){soundButton({id:exact[0],en:text},p);return;}deviceVoiceButton(text,p);}
  function cardSource(id){return [...C().vocabulary,...C().language_targets,...C().supplementary_cards].find(c=>c.id===id);}
  function practiceResult(stage,text,done,correct=null,effectCorrect=correct){let box=stage.querySelector('.e365-feedback');if(!box)box=el('div',null,stage,'e365-feedback');box.replaceChildren();box.dataset.correct=correct===null?'null':String(correct);paragraph(text,box);if(done){if(effectCorrect===false)btn('Thử chọn lại',()=>clearFeedback(stage),box,'e365-primary');btn('Tiếp tục →',done,box,effectCorrect===false?null:'e365-primary');}answerEffect(box,effectCorrect,text);return box;}
  // Optional pre-reader support. It owns the same audio slot as word playback.
  function pictureGuidance(a,target,stage,hero,grid,check){
    const src=typeof target.en==='string'&&WORD_AUDIO[target.id]===target.en?'am-thanh/'+target.id+'.mp3':SENTENCE_AUDIO[target.en];
    if(age()!=='ages_5_7'||!['flashcards','picture_support'].includes(a.type)||!src)return;
    const options=[...grid.children],images=options.map(n=>n.querySelector('img'));
    if(images.some(n=>!n))return;
    const help=btn('🔊 Cách chơi',start,hero,'e365-picture-guide');help.dataset.pictureGuide='true';help.hidden=true;
    help.setAttribute('aria-label','Nghe cách chơi, rồi nghe từ cần tìm');
    const status=el('span',null,hero,'e365-guide-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    let guiding=false;
    const loaded=()=>images.every(n=>n.isConnected&&n.complete&&n.naturalWidth>0);
    const clear=()=>{guiding=false;hero.classList.remove('e365-guide-cue');grid.classList.remove('e365-guide-cue');check.classList.remove('e365-guide-cue');status.textContent='';status.classList.remove('e365-guide-error');};
    const refresh=()=>{if(!stage.isConnected)return;help.hidden=!loaded();if(!loaded()&&guiding)stopAudio();};
    images.forEach(img=>{img.addEventListener('load',refresh);img.addEventListener('error',refresh);});refresh();
    function start(){
      if(!loaded()||document.hidden||body.inert)return;
      const ticket=beginPlayback(help,'🔊 Cách chơi'),current=epoch;guiding=true;playbackCleanup=clear;
      const valid=()=>ticket===speechVersion&&current===epoch&&stage.isConnected&&!document.hidden&&!body.inert&&loaded();
      const fail=()=>{if(!valid())return;stopAudio();playbackCleanup=clear;status.classList.add('e365-guide-error');status.textContent='Chưa nghe được. Chạm nút nghe từ để thử lại.';};
      // Cancel any legacy teaching clip as well; no device-voice fallback is automatic.
      try{if(typeof am!=='undefined'&&am)am.pause();}catch(e){}
      function play(url,done){
        if(!valid())return;
        hero.classList.add('e365-guide-cue');help.textContent='🔊 Đang nghe';
        try{const sound=new Audio(url);wordAudio=sound;
          sound.onended=()=>{if(!valid()||wordAudio!==sound)return;sound.onended=null;sound.onerror=null;wordAudio=null;done();};
          const failed=()=>{if(wordAudio===sound)fail();};sound.onerror=failed;const promise=sound.play();if(promise?.catch)promise.catch(failed);
        }catch(e){fail();}
      }
      play('am-thanh/_hd-chon-hinh.mp3',()=>play(src,()=>{
        if(!valid())return;hero.classList.remove('e365-guide-cue');(check.disabled?grid:check).classList.add('e365-guide-cue');help.textContent='🔊 Cách chơi';status.textContent=check.disabled?'Chọn hình, rồi kiểm tra.':'Chạm kiểm tra lựa chọn.';
      }));
    }
    // Capture stops narration before a learner action can trigger feedback effects.
    stage.addEventListener('click',e=>{if(check.contains(e.target)&&check.classList.contains('e365-guide-cue'))stopAudio();if(!guiding||help.contains(e.target))return;if(e.target.closest('[data-recall-id]:not(:disabled)')?.parentElement===grid){stopAudio();check.classList.add('e365-guide-cue');playbackCleanup=clear;}else if(check.contains(e.target))stopAudio();},true);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&root)stopAudio();});
  window.addEventListener('pagehide',()=>{if(root)stopAudio();});
  function cardsActivity(a,p){
    const ids=a.vocabulary_ids||a.language_target_ids||a.supplementary_card_ids||[];
    if(emptyWarmup(a)){paragraph('Bước này chưa có thẻ cũ cần ôn.',p);btn('Khám phá từ mới →',()=>move(1),p,'e365-primary');return;}
    const cards=ids.map(cardSource).filter(Boolean);
    if(!cards.length){chunksActivity(a,p,(a.cards||[]).map(c=>[c.cue_vi,c.sample_en].filter(Boolean).join(' · ')));return;}
    let position=0;const stage=el('div',null,p,'e365-card-stage');
    function next(){if(position+1<cards.length){position++;draw();stage.tabIndex=-1;stage.focus({preventScroll:true});}else if(mark(a,{assessment:'not_scored',correct:null}))move(1);}
    function draw(){stopAudio();announce('');stage.replaceChildren();const target=cards[position],word=target.en||target.model_en||target.title_vi;
      el('p','Lượt '+(position+1)+' / '+cards.length,stage,'e365-card-count');const hero=el('div',null,stage,'e365-listening-hero');el('h3',target.en?word:target.model_vi||target.vi||target.title_vi,hero,'e365-target-word');if(!soundButton(target,hero))listenText(word,hero);
      paragraph(target.en?'Nghe rồi chọn hình / thẻ.':'Nghe mẫu. Chọn câu đúng với ý này.',stage);
      details('Mở nghĩa và câu mẫu',d=>{paragraph(target.vi||target.model_vi,d);if(!target.en)paragraph(word,d);const example=target.example_en||(target.en&&target.model_en);paragraph(example,d);if(example)listenText(example,d);paragraph(target.example_vi||target.model_vi,d);paragraph(target.explanation_vi,d);paragraph(target.display_note_vi,d);},stage);
      const extra=target.en?C().vocabulary.filter(c=>c.unit_id===target.unit_id):C().language_targets;
      const choices=[target,...cards.filter(c=>c.id!==target.id),...extra.filter(c=>c.id!==target.id)].filter((c,i,all)=>all.findIndex(x=>x.id===c.id)===i).slice(0,4);
      if(choices.length<2){card(target.id,stage);acknowledge(a,stage,'Đã đọc và thử nói →');return;}
      // A source-keyed recall exercise, not a new curriculum assessment or mastery record.
      const shift=(position+1)%choices.length,ordered=choices.slice(shift).concat(choices.slice(0,shift));let selected=null;
      const grid=el('div',null,stage,'e365-picture-options');
      ordered.forEach(c=>{const b=btn('',()=>{selected=c;grid.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));check.disabled=false;clearFeedback(stage);},grid,'e365-picture-option');b.dataset.recallId=c.id;b.setAttribute('aria-pressed','false');const ref=window.English365Assets?.images?.[c.image_id];if(ref){sourceImage(ref,b,c.en||c.model_en);el('span',c.vi||c.en,b);}else el('span',c.en||c.model_en||c.title_vi,b);});
      const check=btn('Kiểm tra lựa chọn',()=>{if(!selected)return;const same=selected.id===target.id;
        if(observed()){const box=practiceResult(stage,'Con đã chọn: '+(selected.en||selected.model_en||selected.title_vi)+'. Mẫu cần tìm: '+word+' · '+(target.vi||target.model_vi||''),null,null,same);btn('Thử chọn lại',()=>{clearFeedback(stage);selected=null;check.disabled=true;grid.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));grid.querySelector('button')?.focus({preventScroll:true});},box,same?null:'e365-primary');btn('Tiếp tục →',next,box,same?'e365-primary':null);return;}
        if(!same){practiceResult(stage,'Đó là '+(selected.en||selected.model_en||selected.title_vi)+' · '+(selected.vi||selected.model_vi||'')+'. Con tìm '+word+' nhé.',null,false);return;}
        grid.querySelectorAll('button').forEach(b=>b.disabled=true);check.disabled=true;practiceResult(stage,word+' · '+(target.vi||target.model_vi||'')+' — Đã tìm đúng mẫu!',next,true);
      },stage,'e365-primary');check.disabled=true;pictureGuidance(a,target,stage,hero,grid,check);const meaning=stage.querySelector(':scope>details');if(meaning)stage.appendChild(meaning);
    }draw();
    if(a.memory_tip||a.support_glossary)details('Gợi ý thêm',d=>{if(a.memory_tip)list(Object.values(a.memory_tip),d);list(a.support_glossary,d);},p);
  }
  function chunksActivity(a,p,chunks){
    const text=chunks.filter(Boolean);if(!text.length){paragraph(a.prompt_vi||a.instructions_vi||a.description_vi||'Cùng người lớn thử hoạt động này.',p);acknowledge(a,p);return;}
    let n=0;const stage=el('div',null,p,'e365-chunk-stage');
    function draw(){stopAudio();stage.replaceChildren();el('p','Đoạn '+(n+1)+' / '+text.length,stage,'e365-card-count');el('div',text[n],stage,'e365-reading-chunk');listenText(a.type==='dialogue'?text[n].replace(/^[^:]+:\s*/, ''):text[n],stage);btn(n+1<text.length?'Đọc đoạn tiếp →':'Đã đọc · tiếp tục →',advance,stage,'e365-primary');}
    function advance(){if(n+1<text.length){n++;draw();}else if(mark(a,{assessment:'not_scored',correct:null}))move(1);}draw();
  }
  // Only these authored adaptations allow a two-option younger practice.
  const TWO_OPTION_ADAPTATIONS = new Set([
    'Người lớn đọc và cho chọn giữa đáp án đúng với một lựa chọn khác. Không bắt đọc câu dài.',
    'Người lớn đọc và rút còn hai lựa chọn; trẻ có thể chỉ hoặc nói một từ.',
    'Người lớn đọc; nếu rút còn hai lựa chọn, giữ đáp án đúng và một phương án nhiễu. Trẻ có thể chỉ hoặc nói một từ; lượt rút gọn được người lớn quan sát.'
  ]);
  function choiceView(a) {
    const source=Array.isArray(a.options)?a.options:[],options=source.filter(o=>o&&typeof o.id==='string'&&o.id&&typeof o.text==='string'&&o.text.trim());
    const answer=options.find(o=>o.id===a.answer_option_id);
    const valid=source.length===3&&options.length===source.length&&new Set(options.map(o=>o.id)).size===options.length&&!!answer;
    // Malformed future content stays visible without grading or progress writes.
    if(!valid)return {options,answer,valid:false};
    if(age()!=='ages_5_7'||!TWO_OPTION_ADAPTATIONS.has(a.younger_adaptation_vi))return {options,answer,valid:true};
    const distractors=options.filter(o=>o.id!==answer.id),pair=[answer,distractors[Math.floor(Math.random()*distractors.length)]];
    if(Math.random()<.5)pair.reverse();
    return {options:pair,answer,valid:true};
  }
  function choiceActivity(a,p){
    // This local view survives selection, retry and Settings toggles, never a new entry.
    const view=choiceView(a);let selected=null;const options=el('div',null,p,'e365-answer-options');
    view.options.forEach(o=>{const b=btn(o.text,()=>{if(!view.valid)return;selected=o;options.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));check.disabled=false;clearFeedback(p);},options);b.dataset.choiceOption=o.id;b.setAttribute('aria-pressed','false');b.disabled=!view.valid;});
    if(!view.valid){paragraph('Câu này cần kiểm tra lại dữ liệu. Chưa chấm hoặc lưu kết quả.',p);return;}
    const check=btn('Kiểm tra',()=>{if(!selected)return;const answer=view.answer;feedback(a,p,selected.id===a.answer_option_id,observed()?'Con đã chọn: '+selected.text+'. Đáp án mẫu: '+answer.text:a.feedback_vi||a.feedback_en||'Đáp án: '+answer.text);},p,'e365-primary');check.disabled=true;if(observed())adult(a,p);
  }
  function matchActivity(a,p){let left=null;const paired=new Map(),stage=el('div',null,p,'e365-tap-match');const leftCol=el('div',null,stage),rightCol=el('div',null,stage),status=el('p',null,p,'e365-match-status');
    // Shuffle a copy once per attempt; keep authored IDs and keyed pairs unchanged.
    const rightOptions=[...a.right];
    for(let i=rightOptions.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rightOptions[i],rightOptions[j]]=[rightOptions[j],rightOptions[i]];}
    const leftButtons=new Map(),rightButtons=new Map();
    a.left.forEach(l=>{const b=btn(l.text,()=>{left=l.id;leftButtons.forEach((b,id)=>b.setAttribute('aria-pressed',String(id===left)));},leftCol);b.dataset.matchLeft=l.id;b.setAttribute('aria-pressed','false');leftButtons.set(l.id,b);});
    rightOptions.forEach(r=>{const b=btn(r.text,()=>{if(!left){announce('Chọn một thẻ bên trái trước nhé.');return;}const expected=a.answer_pairs.find(pair=>pair[0]===left)?.[1];if(expected!==r.id&&!observed()){status.textContent='Chưa khớp. Thử một thẻ khác nhé.';answerEffect(status,false,status.textContent,left+'|'+r.id);return;}
      if(observed()){status.textContent='Mẫu ghép: '+a.left.find(l=>l.id===left).text+' ↔ '+a.right.find(r=>r.id===expected).text;if(expected!==r.id){answerEffect(status,false,status.textContent,left+'|'+r.id);return;}}
      paired.set(left,r.id);leftButtons.get(left).disabled=true;b.disabled=true;leftButtons.get(left).classList.add('e365-paired');b.classList.add('e365-paired');left=null;leftButtons.forEach(b=>b.setAttribute('aria-pressed','false'));status.textContent='Đã ghép '+paired.size+' / '+a.left.length+' cặp';if(paired.size<a.left.length)answerEffect(status,true,status.textContent,'pair-'+paired.size);if(paired.size===a.left.length)feedback(a,p,true,observed()?'Đây là các cặp theo mẫu.':'Con đã nối đủ các cặp.');},rightCol);b.dataset.matchRight=r.id;rightButtons.set(r.id,b);});paragraph('Chạm một thẻ bên trái, rồi chạm thẻ tương ứng bên phải.',p);if(observed())adult(a,p);
  }
  function mapActivity(a,p){const m=a.map_spec,nodes=m.nodes;const xs=nodes.map(n=>n.x),ys=nodes.map(n=>n.y),minX=Math.min(...xs),minY=Math.min(...ys),cols=Math.max(...xs)-minX+1,rows=Math.max(...ys)-minY+1;const map=el('div',null,p,'e365-map');map.style.gridTemplateColumns='repeat('+cols+',minmax(0,1fr))';map.style.gridTemplateRows='repeat('+rows+',minmax(70px,1fr))';const route=Object.entries(m).find(([k,v])=>k.startsWith('route_')&&Array.isArray(v))?.[1];let cursor=0;
    paragraph(route?'Bắt đầu ở '+nodes.find(n=>n.id===route[0])?.label+'. Chạm các điểm theo đường tới '+nodes.find(n=>n.id===route.at(-1))?.label+'.':'Chạm từng địa điểm để khám phá bản đồ.',p);
    const status=el('p',null,p,'e365-map-status');const visited=new Set();nodes.forEach(n=>{const b=btn(n.label,()=>{visited.add(n.id);if(route){const expected=route[cursor];if(n.id!==expected){status.textContent='Thử theo đường mẫu: '+route.map(id=>nodes.find(n=>n.id===id)?.label).join(' → ');answerEffect(status,false,status.textContent,cursor+'|'+n.id);return;}cursor++;b.classList.add('e365-paired');status.textContent=route.slice(0,cursor).map(id=>nodes.find(n=>n.id===id)?.label).join(' → ');answerEffect(status,true,status.textContent,cursor+'|'+n.id);if(cursor===route.length){b.disabled=true;acknowledge(a,p,'Đã đi hết đường · tiếp tục →');map.querySelectorAll('button').forEach(b=>b.disabled=true);}}else {status.textContent=n.label+' nối với '+m.edges.filter(e=>e.includes(n.id)).flatMap(e=>e.filter(id=>id!==n.id)).map(id=>nodes.find(n=>n.id===id)?.label).join(', ');if(visited.size===nodes.length){map.querySelectorAll('button').forEach(b=>b.disabled=true);acknowledge(a,p,'Đã khám phá bản đồ →');}}},map);b.dataset.mapNode=n.id;b.style.gridColumn=String(n.x-minX+1);b.style.gridRow=String(n.y-minY+1);});details('Đường nối và hướng',d=>{list(m.edges.map(e=>e.map(id=>nodes.find(n=>n.id===id)?.label).join(' ↔ ')),d);paragraph('Hướng ban đầu: '+m.initial_heading,d);},p);
  }
  function ordered(items,p,submit) {let selected=[];const output=el('div',null,p,'e365-order-output'),pool=el('div',null,p,'e365-row');function draw(){clearFeedback(p);const hadFocus=output.contains(document.activeElement)||pool.contains(document.activeElement);output.replaceChildren();pool.replaceChildren();if(!selected.length)el('span','Chạm các thẻ để ghép vào đây',output,'e365-tray-hint');selected.forEach((id,i)=>btn((i+1)+'. '+itemText(items.find(x=>x.id===id))+' ×',()=>{selected=selected.filter(x=>x!==id);draw();},output));items.filter(x=>!selected.includes(x.id)).forEach(x=>btn(itemText(x),()=>{selected.push(x.id);draw();},pool));if(hadFocus)(pool.querySelector('button')||output.querySelector('button')||root).focus({preventScroll:true});}draw();btn('Kiểm tra thứ tự',()=>{if(selected.length!==items.length){announce('Hãy chọn đủ các thẻ, mỗi thẻ một lần.');return;}submit([...selected]);},p);paragraph('Chạm theo thứ tự. Chạm thẻ đã chọn để bỏ và xếp lại; dùng Tab/Enter trên bàn phím.',p);}
  function itemText(x){return x.text||[x.text_en,x.text_vi].filter(Boolean).join(' · ');}
  // Only the audited early card-speaking pattern may borrow its preceding source cards.
  function speakingCardSources(a){
    if(a.type!=='speaking_manual'||a.prompt_vi!=='Chọn một thẻ và nói câu mẫu của thẻ đó. Có thể nói một từ trước.'||a.requires_microphone!==false||a.scoring!=='adult_observation')return null;
    if(!lesson||!Number.isInteger(lesson.day)||lesson.day<1||lesson.day>78||!Array.isArray(lesson.activities)||typeof a.id!=='string'||!a.id)return null;
    const at=lesson.activities.indexOf(a);
    if(at<0||lesson.activities.filter(v=>v?.id===a.id).length!==1)return null;
    const validIds=ids=>Array.isArray(ids)&&ids.length>0&&ids.every(id=>typeof id==='string'&&id.trim())&&new Set(ids).size===ids.length;
    const same=(x,y)=>Array.isArray(x)&&Array.isArray(y)&&x.length===y.length&&x.every((v,i)=>v===y[i]);
    const focus=lesson.focus_vocabulary_ids,young=lesson.age_adaptations?.ages_5_7?.core_vocabulary_ids,older=lesson.age_adaptations?.ages_8_10?.core_vocabulary_ids;
    if(!validIds(focus)||![3,4].includes(focus.length)||!validIds(young)||young.length!==2||!validIds(older)||!same(older,focus)||!young.every(id=>focus.includes(id)))return null;
    const preceding=lesson.activities.slice(0,at).filter(v=>v?.type==='flashcards');
    if(preceding.length!==1||!same(preceding[0].vocabulary_ids,focus)||!Array.isArray(C().vocabulary))return null;
    const cards=focus.map(id=>{const found=C().vocabulary.filter(c=>c?.id===id);return found.length===1?found[0]:null;});
    if(cards.some(c=>!c||typeof c.en!=='string'||!c.en.trim()||typeof c.example_en!=='string'||!c.example_en.trim()||c.example_is_literal_image_description!==false||!Object.hasOwn(WORD_AUDIO,c.id)||WORD_AUDIO[c.id]!==c.en||typeof c.image_id!=='string'||!/^hinh\/[a-zA-Z0-9._-]+\.(jpg|png|webp)$/i.test(window.English365Assets?.images?.[c.image_id]?.src||'')))return null;
    if(!same(a.sample_answers_en,young.map(id=>cards.find(c=>c.id===id).example_en)))return null;
    return (age()==='ages_5_7'?young:older).map(id=>cards.find(c=>c.id===id));
  }
  function speakingCards(a,p){
    const cards=speakingCardSources(a);if(!cards)return false;
    const stage=el('section',null,p,'e365-speaking-cues');stage.setAttribute('aria-label','Chọn thẻ để thử nói');
    const grid=el('div',null,stage,'e365-speaking-options');grid.setAttribute('role','group');grid.setAttribute('aria-label','Thẻ từ trong buổi học');
    const support=el('div',null,stage,'e365-speaking-support');support.hidden=true;
    // Selection and optional models are ephemeral. They never record an attempt.
    stage.addEventListener('focusin',()=>{stage.speakingReturnFocus=document.activeElement;});
    cards.forEach(c=>{
      const b=btn('',()=>{
        stopAudio();announce('');
        grid.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));
        support.replaceChildren();support.hidden=false;support.dataset.speakingSelected=c.id;
        const word=el('div',null,support);word.dataset.speakingWord=c.id;soundButton(c,word);
        const reveal=btn('Xem câu mẫu',()=>{
          stopAudio();const opening=sample.hidden;sample.replaceChildren();sample.hidden=!opening;reveal.setAttribute('aria-expanded',String(opening));reveal.textContent=opening?'Ẩn câu mẫu':'Xem câu mẫu';
          if(opening){el('p','Câu mẫu với từ này',sample,'e365-speaking-label');const example=el('p',c.example_en,sample,'e365-speaking-example');example.lang='en';
            // An isolated word image is not a scene, and a word clip is never a sentence clip.
            if(Object.hasOwn(SENTENCE_AUDIO,c.example_en))soundButton({en:c.example_en},sample);else deviceVoiceButton(c.example_en,sample);sample.scrollIntoView({block:'nearest',behavior:'instant'});
          }
        },support);reveal.dataset.speakingSampleToggle='true';reveal.setAttribute('aria-expanded','false');reveal.setAttribute('aria-controls','e365-speaking-sample');
        const sample=el('div',null,support,'e365-speaking-sample');sample.id='e365-speaking-sample';sample.dataset.speakingSample=c.id;sample.hidden=true;
      },grid,'e365-speaking-card');
      b.dataset.speakingCard=c.id;b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Chọn thẻ '+c.en);
      sourceImage(window.English365Assets.images[c.image_id],b,c.en);const image=b.querySelector('img');if(image)image.alt='';
      const label=el('span',c.en,b);label.lang='en';
    });
    return true;
  }
  function renderActivity(a,p) {
    switch(a.type){
      case 'review_cards': case 'flashcards': case 'model_language': case 'picture_support': {
        cardsActivity(a,p);break;}
      case 'review_language':{if(a.cards?.length){let n=0;const stage=el('div',null,p);const draw=()=>{stopAudio();stage.replaceChildren();const c=a.cards[n];el('p','Gợi ý '+(n+1)+' / '+a.cards.length,stage,'e365-card-count');el('h3',c.cue_vi,stage);paragraph('Con thử nói trước, rồi mở câu gợi ý.',stage);btn('Mở câu gợi ý',()=>{stopAudio();stage.replaceChildren();paragraph(c.cue_vi,stage);el('div',c.sample_en,stage,'e365-reading-chunk');listenText(c.sample_en,stage);btn(n+1<a.cards.length?'Thử gợi ý tiếp →':'Con đã thử · tiếp tục →',()=>{if(n+1<a.cards.length){n++;draw();}else if(mark(a,{assessment:'not_scored',correct:null}))move(1);},stage,'e365-primary');},stage,'e365-primary');};draw();adult(a,p);}else cardsActivity(a,p);break;}
      case 'reading':{const source=C().stories.find(s=>s.id===a.story_id);if(!source){paragraph('Chưa tìm thấy truyện nguồn.',p);break;}const text=age()==='ages_5_7'?source.simple_en||source.text_en:source.text_en;chunksActivity(a,p,text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean));details('Truyện đang đọc và nghĩa',d=>story(source,d,false),p);if(age()==='ages_5_7')details('Bản đầy đủ để đọc thêm',d=>story(source,d,true),p);break;}
      case 'dialogue':chunksActivity(a,p,a.turns.map(t=>t.speaker+': '+t.text));details('Xem toàn bộ hội thoại',d=>list(a.turns.map(t=>t.speaker+': '+t.text),d),p);break;
      case 'speaking_manual':case 'offline_project':{const hasCards=speakingCards(a,p),examples=a.sample_answers_en||[a.sample_answer_en].filter(Boolean);if(!hasCards&&examples.length)details('Con muốn xem mẫu',d=>{list(examples,d);examples.forEach(t=>listenText(t,d));},p);if(a.dialogue_en)details('Hội thoại mẫu',d=>list(Array.isArray(a.dialogue_en)?a.dialogue_en:[a.dialogue_en],d),p);if(a.type==='offline_project')list((a.rubric_vi||a.success_criteria_vi||[]).filter(t=>/an toàn|không |người lớn|trong nhà/i.test(t)),p);if(!hasCards)paragraph(a.type==='speaking_manual'?'Nói thành tiếng, chỉ hình hoặc thử diễn tả theo cách của con.':'Rời màn hình một chút và thử làm theo hướng dẫn nhé.',p);acknowledge(a,p,a.type==='speaking_manual'?'Con đã thử nói →':'Con đã thử làm →');adult(a,p);break;}
      case 'choice':choiceActivity(a,p);break;
      case 'match':matchActivity(a,p);break;
      case 'order_tokens':case 'order_sentences':ordered(a.tokens||a.items,p,ids=>{let correct;if(a.type==='order_tokens'){const normal=t=>t.normalize('NFC').trim().replace(/\s+/g,' ').toLowerCase().replace(/[.!?]+$/,'');correct=a.scoring==='exact_order'?JSON.stringify(ids)===JSON.stringify(a.answer_token_ids):normal(ids.map(id=>a.tokens.find(t=>t.id===id).text).join(' '))===normal(a.answer_text||a.answer_token_ids.map(id=>a.tokens.find(t=>t.id===id).text).join(' '));}else correct=JSON.stringify(ids)===JSON.stringify(a.answer_item_ids);feedback(a,p,correct,a.answer_text||'Mẫu: '+(a.answer_item_ids||a.answer_token_ids||[]).map(id=>itemText((a.items||a.tokens).find(x=>x.id===id))).join(' '));});if(observed())adult(a,p);break;
      case 'text_map':mapActivity(a,p);break;
      case 'quick_review':if(activityDone(a)){paragraph('Đã lưu lượt ôn 3 câu của bước này.',p);btn('Tiếp tục sau lượt ôn →',()=>move(1),p,'e365-primary');btn('Ôn lại 3 câu',()=>openReview(lesson.unit_id),p);}else openReview(lesson.unit_id);break;
      case 'interactive_challenge':challenge(a,p);break;
      default:paragraph('Loại hoạt động chưa được hỗ trợ: '+a.type+'. Không đánh dấu hoàn thành tự động.',p);
    }
  }
  function challenge(a,p) {
    const v=K().interactiveChallengeView(a,{ageBand:age(),shortened:short});const items=v.items;
    const submit=response=>{try{const r=K().gradeInteractiveChallenge(a,response,{ageBand:age(),shortened:short});feedback(a,p,r.autoGraded?r.correct:null,r.feedbackVi);}catch(e){announce('Hãy dùng mỗi thẻ đúng một lần trong cấu trúc yêu cầu. '+e.message);}};
    if(v.answerMode==='ordered_ids')ordered(items,p,ids=>submit({ordered_ids:ids}));
    if(v.answerMode==='selected_ids'){const selected=new Set();items.forEach(i=>{const b=btn(itemText(i),()=>{clearFeedback(p);if(selected.has(i.id))selected.delete(i.id);else{if(a.answer.selected_ids?.length===1)selected.clear();selected.add(i.id);}p.querySelectorAll('[data-challenge-select]').forEach(node=>node.setAttribute('aria-pressed',String(selected.has(node.dataset.challengeSelect))));},p);b.dataset.challengeSelect=i.id;b.setAttribute('aria-pressed','false');});btn('Kiểm tra các thẻ đã chọn',()=>submit({selected_ids:[...selected]}),p);}
    if(v.answerMode==='groups'){const controls=[];items.forEach(i=>{const row=el('label',null,p,'e365-match');el('span',itemText(i),row);const s=el('select',null,row);el('option','Chọn nhóm',s).value='';Object.entries(v.groupLabels||{}).forEach(([id,label])=>el('option',label,s).value=id);s.addEventListener('change',()=>clearFeedback(p));controls.push([i.id,s]);});btn('Kiểm tra nhóm',()=>{const groups=Object.fromEntries(Object.keys(v.groupLabels||{}).map(k=>[k,[]]));if(controls.some(([,s])=>!s.value)){announce('Chọn nhóm cho mỗi thẻ.');return;}controls.forEach(([id,s])=>groups[s.value].push(id));submit({groups});},p);}
    if(v.answerMode==='pairs'){let pairs=[],pending=null;const out=el('div',null,p),pool=el('div',null,p);function draw(){clearFeedback(p);const hadFocus=out.contains(document.activeElement)||pool.contains(document.activeElement);out.replaceChildren();pool.replaceChildren();pairs.forEach((pair,i)=>btn(pair.map(id=>itemText(items.find(x=>x.id===id))).join(' ↔ ')+' ×',()=>{pairs.splice(i,1);draw();},out));items.filter(x=>!pairs.flat().includes(x.id)).forEach(x=>{const b=btn(itemText(x),()=>{if(pending===x.id)pending=null;else if(pending){pairs.push([pending,x.id]);pending=null;}else pending=x.id;draw();},pool);b.setAttribute('aria-pressed',String(pending===x.id));});if(hadFocus)(pool.querySelector('button')||out.querySelector('button')||root).focus({preventScroll:true});}draw();paragraph('Chọn hai thẻ để nối thành cặp. Chạm cặp đã nối để làm lại.',p);btn('Kiểm tra các cặp',()=>submit({pairs}),p);}
    if(observed()){details('Gợi ý hỗ trợ',d=>paragraph(a.adult_fallback_vi,d),p);adult(a,p);}
  }
  function openReview(unitId, fresh=false) {
    adultReview=false;youngPractice=null;init(); const u=C().units.find(u=>u.id===unitId);if(!u)throw Error('Không tìm thấy chương');
    const returnLesson=lesson;const savedId=state.currentReview[unitId];
    review=null;
    if(!fresh && savedId && state.sessions[savedId]) {try{review=K().restoreCurriculumReviewSnapshot(state.sessions[savedId].snapshot,C(),profile);if(review.status==='completed' || review.plan.recipe.ageBand!==age() || review.plan.recipe.shortened!==short)review=null;}catch(e){shell('Chưa thể tiếp tục lượt ôn','Bản lưu cũ được giữ nguyên.');paragraph(e.message);btn('Về lộ trình',home,body);return;}}
    if(!review || review.plan.chapterId!==unitId){const built=K().buildCurriculumQuickReview(C(),unitId,{completedLessonIds:state.completed,introducedLessonIds:state.introduced,ageBand:age(),shortened:short});if(!built.plan){shell('Mình học trước, ôn sau',u.title_vi);paragraph('Hãy mở và học buổi '+u.last_day+' trước khi bắt đầu ba câu ôn đã biên soạn.');btn('Mở buổi '+u.last_day,()=>openLesson(u.last_day),body);return;}review=K().createChapterReviewSession(built.plan,{sessionId:'r-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10),profileId:profile,mode:built.plan.readiness.ready?'chapter-end':'practice'});if(!persistReview(review)){shell('Chưa thể lưu lượt ôn',storageProblem||'Không lưu được trên thiết bị. Hãy kiểm tra quyền lưu trữ rồi mở lại.');return;}}
    lesson=returnLesson;if(!observed()&&K().chapterQuestionView(review).phase==='focus'){const next=K().transitionChapterReview(review,{type:'begin'});if(!persistReview(next))return;review=next;}renderReview();
  }
  function persistReview(next) {const snap=K().exportChapterReviewSnapshot(next),outcomes=K().curriculumQuestionOutcomes(next);return save(s=>{s.sessions[next.sessionId]={snapshot:snap,outcomes};s.currentReview[next.plan.chapterId]=next.sessionId;if(next.status==='completed' && outcomes.some(o=>!o.skipped && o.observation!=='defer')){const lid=next.plan.source.lessonId,aid=next.plan.source.activityId;if(!s.attempts[lid])s.attempts[lid]={};s.attempts[lid][aid]={assessment:'question_practice_only',correct:null,at:new Date().toISOString()};}});}
  function reviewAction(type,extra={}) {const next=K().transitionChapterReview(review,{type,...extra});if(persistReview(next)){review=next;renderReview();if(type==='answer'||type==='observe'){const v=K().chapterQuestionView(review),box=body.querySelector('.e365-review-feedback');if(box)answerEffect(box,type==='answer'?v.feedback?.correct??null:null,box.textContent,box.textContent,v.feedback?.retryScheduled?'Cùng xem mẫu trước lượt thử lại':'Cùng xem mẫu nhé');}}}
  function renderYoungReview(){
    const sourceLesson=C().lessons.find(l=>l.id===review.plan.source.lessonId),source=sourceLesson?.activities.find(a=>a.id===review.plan.source.activityId),questions=source?.questions||[];
    if(!youngPractice||youngPractice.sessionId!==review.sessionId)youngPractice={sessionId:review.sessionId,index:0,done:false};
    shell('Cùng nhớ lại 3 câu',review.plan.title);
    if(questions.length!==3){paragraph('Chưa đủ câu nguồn cho lượt luyện này. Không ghi nhận đã thực hành.');btn('Về trang chính',close,body);return;}
    const returnToLesson=()=>{review=null;if(lesson){if(lesson.id===sourceLesson.id&&lesson.activities[index]?.id===source.id)move(1);else renderLesson();}else close();};
    if(youngPractice.done){const end=el('section',null,body,'e365-finish');el('h2','Con đã thử cả 3 câu!',end);paragraph('Đã lưu lượt thực hành. Mình có thể thử lại bất cứ lúc nào.',end);btn(lesson?'Tiếp tục buổi học →':'Về trang chính',returnToLesson,end,'e365-primary');btn('Luyện lại 3 câu',()=>openReview(review.plan.chapterId,true),end);return;}
    const q=questions[youngPractice.index],panel=el('article',null,body,'e365-panel');panel.dataset.practiceQuestion=q.id;paragraph('Câu '+(youngPractice.index+1)+' / 3',panel);el('h2',q.prompt||q.prompt_vi,panel);
    const refs=q.source_references;if(refs?.evidence_en)details('Xem gợi ý',d=>{paragraph(refs.evidence_en,d);listenText(refs.evidence_en,d);},panel);if(refs?.source_story_ids?.length)details('Đọc lại truyện',d=>refs.source_story_ids.forEach(id=>story(C().stories.find(t=>t.id===id),d,true)),panel);
    let selected=null;const options=el('div',null,panel,'e365-answer-options');q.options.forEach(o=>{const b=btn(o.text,()=>{selected=o;options.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));check.disabled=false;clearFeedback(panel);},options);b.dataset.recapOption=o.id;b.setAttribute('aria-pressed','false');});
    const check=btn('Xem câu mẫu',()=>{if(!selected)return;const answer=q.options.find(o=>o.id===q.answer_option_id);const box=practiceResult(panel,'Con đã chọn: '+selected.text+'. Đây là mẫu: '+answer.text+'. '+(q.feedback_vi||''),null,null,selected.id===q.answer_option_id);btn('Thử chọn lại',()=>{clearFeedback(panel);},box,selected.id===q.answer_option_id?null:'e365-primary');btn('Tiếp tục →',()=>{if(youngPractice.index<2){youngPractice.index++;renderYoungReview();return;}if(save(s=>{if(!s.attempts[sourceLesson.id])s.attempts[sourceLesson.id]={};s.attempts[sourceLesson.id][source.id]={assessment:'not_scored',correct:null,at:new Date().toISOString()};})){youngPractice.done=true;renderYoungReview();}},box,selected.id===q.answer_option_id?'e365-primary':null);},panel,'e365-primary');check.disabled=true;
    details('Người lớn ghi nhận',d=>{paragraph('Luyện 3 câu không chấm điểm. Đóng giữa lượt sẽ thử lại từ câu đầu.',d);btn('Ôn cùng người lớn',()=>{adultReview=true;if(K().chapterQuestionView(review).phase==='focus')reviewAction('begin');else renderReview();},d);},settingsPanel);

  }
  function renderReview() {
    if(observed()&&!adultReview){renderYoungReview();return;}
    const v=K().chapterQuestionView(review);shell('Cùng nhớ lại 3 câu',review.plan.title);

    if(v.phase==='focus'){paragraph('Ba câu chọn lọc, không chứng minh thành thạo cả chương. Câu cần thử lại có thể xuất hiện thêm một lần.');(v.focusCards||[]).forEach(c=>{paragraph(c.en);paragraph(c.vi);});if(v.memoryTip)list(Object.values(v.memoryTip));list(v.supportGlossary);btn('Bắt đầu 3 câu',()=>reviewAction('begin'),body,'e365-primary');return;}
    if(v.phase==='summary'){paragraph('Đã lưu lượt ôn.');const r=v.result;if(!K().curriculumQuestionOutcomes(review).some(o=>!o.skipped&&o.observation!=='defer'))paragraph('Cả ba câu được để lại. Bước ôn vẫn chưa ghi nhận thực hành.');paragraph('Câu để luyện thêm: '+(r.practiceAgainQuestionIds?.length||0)+' · Để sau: '+(r.deferredQuestionIds?.length||0));if(lesson?.id===review.plan.source.lessonId && lesson.activities[index]?.id===review.plan.source.activityId)btn('Tiếp tục buổi học →',()=>{review=null;move(1);},body,'e365-primary');else if(lesson)btn('Tiếp tục buổi đang học →',()=>{review=null;renderLesson();},body,'e365-primary');else btn('Về trang chính',close,body,'e365-primary');btn('Luyện lại 3 câu',()=>openReview(review.plan.chapterId,true),body);return;}
    const panel=el('article',null,body,'e365-panel');paragraph('Câu '+(review.cursor+1)+' / '+v.queued,panel);el('h2',v.prompt,panel);paragraph(v.instructionVi,panel);
    const sourceLesson=C().lessons.find(l=>l.id===review.plan.source.lessonId),source=sourceLesson?.activities.find(a=>a.id===review.plan.source.activityId),sourceQuestion=source?.questions?.find(q=>q.id===v.questionId),refs=sourceQuestion?.source_references;
    if(refs?.source_story_ids?.length)details('Đọc lại truyện',d=>refs.source_story_ids.forEach(id=>story(C().stories.find(t=>t.id===id),d,true)),panel);
    if(review.plan.focusCards?.length)details('Xem lại mẫu',d=>review.plan.focusCards.forEach(c=>{paragraph(c.en,d);paragraph(c.vi,d);}),panel);
    if(v.phase==='feedback'){const box=el('div',null,panel,'e365-feedback e365-review-feedback');box.dataset.correct=String(v.feedback?.correct??null);paragraph(v.feedback?.correct===true?'Đúng với đáp án của câu.':v.feedback?.correct===false?(v.feedback.retryScheduled?'Mình xem mẫu. Câu này sẽ trở lại một lần nữa.':'Mình xem mẫu nhé. Có thể luyện thêm sau lượt này.'):'Đã ghi nhận lượt này.',box);paragraph(v.feedback?.explanationVi,box);paragraph(v.feedback?.answer,box);btn('Tiếp tục',()=>reviewAction('next'),box,'e365-primary');return;}
    if(v.hint)paragraph(v.hint);
    const qid=v.questionId;
    if(v.assessment==='adult_observation')(v.options||[]).forEach(o=>paragraph(o.label,panel));
    else{let selected=null;const options=el('div',null,panel,'e365-answer-options');(v.options||[]).forEach(o=>{const b=btn(o.label,()=>{selected=o.id;options.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));check.disabled=false;},options);b.dataset.reviewOption=o.id;b.setAttribute('aria-pressed','false');});const check=btn('Kiểm tra',()=>{if(selected!==null)reviewAction('answer',{questionId:qid,response:selected,at:new Date().toISOString(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC',durationMs:0,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,soundEnabled:false,soundAvailable:false});},panel,'e365-primary');check.disabled=true;}
    if(v.assessment==='adult_observation'){const d=el('section',null,settingsPanel,'e365-observe');el('h3','Người lớn ghi nhận (không chấm tự động)',d);[['Con tự thử','independent'],['Có hỗ trợ','supported'],['Để luyện lại','defer']].forEach(([t,observation])=>btn(t,()=>reviewAction('observe',{questionId:qid,observation}),d));}
    btn('Gợi ý',()=>reviewAction('hint',{questionId:qid}),panel);btn('Để câu này lần sau',()=>reviewAction('skip',{questionId:qid}),settingsPanel);
  }
  window.English365Player={openHome:home,openLesson,openUnitReview:openReview,close,clearProfile(options={}){if(key()!==storageKey&&root)close();if(!root){blocked=false;load();}if(options.confirm!==false && !confirm('Xóa tiến độ lộ trình 365 của hồ sơ hiện tại? Bài cũ không bị xóa.'))return false;try{localStorage.removeItem(storageKey);savedRaw=null;blocked=false;storageProblem='';state=empty();if(root){if(options.confirm===false)close();else home();}return true;}catch(e){announce('Không xóa được tiến độ.');return false;}},getStatus(){if(key()!==storageKey&&root)close();if(!root){blocked=false;load();}const next=C().lessons.find(l=>!state.completed.includes(l.id));const resume=C().lessons.find(l=>state.introduced.includes(l.id)&&!state.completed.includes(l.id));return{completed:state.completed.length,introduced:state.introduced.length,completedLessonIds:[...state.completed],introducedLessonIds:[...state.introduced],nextDay:next?.day||365,resumeDay:resume?.day||null,readyUnitIds:C().units.filter(u=>C().lessons.filter(l=>l.unit_id===u.id).every(l=>state.completed.includes(l.id))).map(u=>u.id),profileId:profile,storageBlocked:blocked,contentVersion:C().content_version};},testHooks:{supportedTypes:[...TYPES],audit(){return{lessons:C().lessons.length,units:C().units.length,unsupported:[...new Set(C().lessons.flatMap(l=>l.activities.map(a=>a.type)))].filter(t=>!TYPES.includes(t)),challengeModes:[...new Set(C().lessons.flatMap(l=>l.activities.filter(a=>a.type==='interactive_challenge').map(a=>Object.keys(a.answer)[0])))]};}}};
})();
