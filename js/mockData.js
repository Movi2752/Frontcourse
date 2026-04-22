// js/mockData.js — Mock data for Tischreservierung

const RESTAURANTS = [
  {
    id: 'r1',
    name: 'Белуга',
    cuisine: 'Русская кухня',
    address: 'ул. Тверская, 8, Москва',
    metro: 'Охотный Ряд',
    phone: '+7 (495) 123-45-67',
    hours: '12:00 – 00:00',
    description: 'Современная интерпретация русской классики. Белуга, осётр, пельмени ручной лепки и авторские настойки в историческом центре Москвы.',
    rating: 4.8,
    tags: ['Рыба', 'Деликатесы', 'Авторская кухня'],
    color: '#8B4513',
    image: 'images/restaurants/beluga.png',          // для карточки
  },
  {
    id: 'r2',
    name: 'Mushrooms',
    cuisine: 'Европейская кухня',
    address: 'Патриаршие пруды, Малый Палашёвский пер., 3',
    metro: 'Маяковская',
    phone: '+7 (495) 234-56-78',
    hours: '11:00 – 01:00',
    description: 'Уютный ресторан на Патриарших с европейским меню, натуральными винами и живой музыкой по выходным.',
    rating: 4.6,
    tags: ['Вино', 'Пасты', 'Веганское меню'],
    color: '#556B2F',
    image: 'images/restaurants/mushrooms.png',        // для карточки
  },
  {
    id: 'r3',
    name: 'Чайхана №1',
    cuisine: 'Узбекская кухня',
    address: 'ул. Арбат, 45, Москва',
    metro: 'Арбатская',
    phone: '+7 (495) 345-67-89',
    hours: '10:00 – 23:00',
    description: 'Настоящий узбекский плов в казане, самса из тандыра, шашлык на углях. Большой зал с живой восточной музыкой.',
    rating: 4.5,
    tags: ['Плов', 'Шашлык', 'Большой зал'],
    color: '#B8860B',
    image: 'images/restaurants/chayhana.png',       // для карточки
  },
  {
    id: 'r4',
    name: 'Sixty',
    cuisine: 'Интернациональная',
    address: 'Пресненская наб., 12, башня Федерация',
    metro: 'Деловой центр',
    phone: '+7 (495) 456-78-90',
    hours: '12:00 – 02:00',
    description: 'Ресторан на 62-м этаже башни Федерация с панорамным видом на Москву. Интернациональное меню, коктейли и незабываемая атмосфера.',
    rating: 4.7,
    tags: ['Панорама', 'Коктейли', 'VIP'],
    color: '#1A237E',
    image: 'images/restaurants/sixty.png',          // для карточки
  },
  {
    id: 'r5',
    name: 'Самобранка',
    cuisine: 'Русская / домашняя',
    address: 'ул. Пятницкая, 25, Москва',
    metro: 'Новокузнецкая',
    phone: '+7 (495) 567-89-01',
    hours: '11:00 – 23:00',
    description: 'Домашние борщи, каши на чугунке, пироги из печи. Атмосфера русской деревенской избы в центре Москвы.',
    rating: 4.4,
    tags: ['Пироги', 'Борщ', 'Завтраки'],
    color: '#7B3B3B',
    image: 'images/restaurants/samobranka.png',     // для карточки
  },
];

// Floor plan tables for each restaurant
// x, y are percentages (0-100) within floor plan container
const TABLES = {
  r1: [
    // Hall zone
    { id: 't1_1', number: 1, capacity: 2, zone: 'Основной зал', x: 12, y: 25 },
    { id: 't1_2', number: 2, capacity: 2, zone: 'Основной зал', x: 12, y: 55 },
    { id: 't1_3', number: 3, capacity: 4, zone: 'Основной зал', x: 30, y: 22 },
    { id: 't1_4', number: 4, capacity: 4, zone: 'Основной зал', x: 30, y: 55 },
    { id: 't1_5', number: 5, capacity: 6, zone: 'Основной зал', x: 50, y: 40 },
    // VIP zone
    { id: 't1_6', number: 6, capacity: 2, zone: 'VIP-зона', x: 80, y: 27 },
    { id: 't1_7', number: 7, capacity: 4, zone: 'VIP-зона', x: 80, y: 56 },
    { id: 't1_8', number: 8, capacity: 2, zone: 'VIP-зона', x: 92, y: 40 },
    // Terrace
    { id: 't1_9',  number: 9,  capacity: 4, zone: 'Терраса', x: 20, y: 87 },
    { id: 't1_10', number: 10, capacity: 4, zone: 'Терраса', x: 50, y: 87 },
    { id: 't1_11', number: 11, capacity: 2, zone: 'Терраса', x: 78, y: 87 },
  ],
  r2: [
    { id: 't2_1', number: 1, capacity: 2, zone: 'У окна',      x: 10, y: 18 },
    { id: 't2_2', number: 2, capacity: 2, zone: 'У окна',      x: 10, y: 45 },
    { id: 't2_3', number: 3, capacity: 2, zone: 'У окна',      x: 10, y: 72 },
    { id: 't2_4', number: 4, capacity: 4, zone: 'Основной зал', x: 35, y: 28 },
    { id: 't2_5', number: 5, capacity: 4, zone: 'Основной зал', x: 35, y: 62 },
    { id: 't2_6', number: 6, capacity: 6, zone: 'Основной зал', x: 58, y: 42 },
    { id: 't2_7', number: 7, capacity: 2, zone: 'Бар',         x: 88, y: 25 },
    { id: 't2_8', number: 8, capacity: 2, zone: 'Бар',         x: 88, y: 51 },
    { id: 't2_9', number: 9, capacity: 4, zone: 'Бар',         x: 88, y: 78 },
  ],
  r3: [
    { id: 't3_1', number: 1,  capacity: 4, zone: 'Основной зал', x: 15, y: 20 },
    { id: 't3_2', number: 2,  capacity: 4, zone: 'Основной зал', x: 35, y: 20 },
    { id: 't3_3', number: 3,  capacity: 4, zone: 'Основной зал', x: 55, y: 20 },
    { id: 't3_4', number: 4,  capacity: 6, zone: 'Основной зал', x: 15, y: 52 },
    { id: 't3_5', number: 5,  capacity: 6, zone: 'Основной зал', x: 40, y: 52 },
    { id: 't3_6', number: 6,  capacity: 8, zone: 'Банкетный зал', x: 83, y: 28 },
    { id: 't3_7', number: 7,  capacity: 8, zone: 'Банкетный зал', x: 83, y: 58 },
    { id: 't3_8', number: 8,  capacity: 4, zone: 'Терраса', x: 10, y: 88 },
    { id: 't3_9', number: 9,  capacity: 4, zone: 'Терраса', x: 33, y: 88 },
    { id: 't3_10', number: 10, capacity: 4, zone: 'Терраса', x: 65, y: 88 },
    { id: 't3_11', number: 11, capacity: 4, zone: 'Терраса', x: 88, y: 88 },
  ],
  r4: [
    { id: 't4_1', number: 1,  capacity: 2, zone: 'Панорама', x: 12, y: 13 },
    { id: 't4_2', number: 2,  capacity: 2, zone: 'Панорама', x: 32, y: 13 },
    { id: 't4_3', number: 3,  capacity: 2, zone: 'Панорама', x: 54, y: 13 },
    { id: 't4_4', number: 4,  capacity: 2, zone: 'Панорама', x: 76, y: 13 },
    { id: 't4_5', number: 5,  capacity: 4, zone: 'Основной зал', x: 15, y: 38 },
    { id: 't4_6', number: 6,  capacity: 4, zone: 'Основной зал', x: 53, y: 38 },
    { id: 't4_9', number: 7,  capacity: 4, zone: 'Основной зал', x: 15, y: 64 },
    { id: 't4_10', number: 8, capacity: 6, zone: 'Основной зал', x: 35, y: 52 },
    { id: 't4_10', number: 9, capacity: 4, zone: 'Основной зал', x: 53, y: 64 },
    { id: 't4_7', number: 10,  capacity: 4, zone: 'VIP-зона', x: 88, y: 36 },
    { id: 't4_8', number: 11,  capacity: 6, zone: 'VIP-зона', x: 88, y: 60 },
  ],
  r5: [
    { id: 't5_1', number: 1, capacity: 4, zone: 'У печи',       x: 15, y: 33 },
    { id: 't5_2', number: 2, capacity: 4, zone: 'У печи',       x: 15, y: 57 },
    { id: 't5_3', number: 3, capacity: 6, zone: 'Основной зал', x: 40, y: 22 },
    { id: 't5_4', number: 4, capacity: 6, zone: 'Основной зал', x: 40, y: 55 },
    { id: 't5_5', number: 5, capacity: 6, zone: 'Основной зал', x: 65, y: 22 },
    { id: 't5_6', number: 6, capacity: 4, zone: 'У окна',       x: 90, y: 22 },
    { id: 't5_7', number: 7, capacity: 4, zone: 'У окна',       x: 90, y: 55 },
    { id: 't5_8', number: 8, capacity: 6, zone: 'Общий стол',   x: 65, y: 55 },
  ],
};

// Seed bookings — pre-existing so some tables appear occupied
const SEED_BOOKINGS = [
  { id: 'b_seed1', userId: 'demo', restaurantId: 'r1', tableId: 't1_3', date: '2026-04-22', time: '19:00', guests: 4, name: 'Иванов Алексей', phone: '+7 (999) 111-22-33', email: 'demo@example.com', comment: '', status: 'confirmed', createdAt: Date.now() - 86400000 },
  { id: 'b_seed2', userId: 'demo', restaurantId: 'r1', tableId: 't1_6', date: '2026-04-22', time: '20:00', guests: 2, name: 'Иванов Алексей', phone: '+7 (999) 111-22-33', email: 'demo@example.com', comment: 'Годовщина', status: 'confirmed', createdAt: Date.now() - 3600000 },
  { id: 'b_seed3', userId: 'other', restaurantId: 'r2', tableId: 't2_6', date: '2026-04-23', time: '18:00', guests: 5, name: 'Петрова Мария', phone: '+7 (999) 555-66-77', email: 'maria@example.com', comment: '', status: 'confirmed', createdAt: Date.now() - 7200000 },
];

const FLOOR_LAYOUTS = {
  r1: {
    W:800, H:500,
    walls:[
      {type:'rect',x:0,y:0,w:800,h:500},
      {type:'line',x1:560,y1:0,x2:560,y2:375,dash:'10,5'},
      {type:'line',x1:0,y1:375,x2:800,y2:375,dash:'8,4'},
    ],
    features:[
      {type:'rect',x:572,y:8,w:218,h:45,fill:'#c8b89a33',stroke:'#a08060',sw:1.5,label:'Барная стойка'},
      {type:'rect',x:0,y:180,w:10,h:70,fill:'#c8b89a33',stroke:'#a08060',sw:1},
      {type:'window',x:70,y:0,w:90},{type:'window',x:240,y:0,w:90},{type:'window',x:410,y:0,w:90},
      {type:'door',x:355,y:496,w:90,label:'Вход'},
      {type:'label',x:260,y:356,text:'ОСНОВНОЙ ЗАЛ'},
      {type:'label',x:675,y:356,text:'VIP-ЗОНА'},
      {type:'label',x:270,y:492,text:'ТЕРРАСА'},
    ]
  },
  r2: {
    W:700, H:480,
    walls:[
      {type:'rect',x:0,y:0,w:700,h:480},
      {type:'line',x1:120,y1:0,x2:120,y2:480,dash:'10,5'},
      {type:'line',x1:540,y1:0,x2:540,y2:480,dash:'10,5'},
    ],
    features:[
      {type:'rect',x:542,y:0,w:158,h:42,fill:'#b8986033',stroke:'#997744',sw:1.5,label:'Барная стойка'},
      {type:'window',x:0,y:20,w:0,h:60,vertical:true},
      {type:'window',x:0,y:160,w:0,h:60,vertical:true},
      {type:'window',x:0,y:300,w:0,h:60,vertical:true},
      {type:'window',x:0,y:400,w:0,h:60,vertical:true},
      {type:'door',x:305,y:476,w:90,label:'Вход'},
      {type:'label',x:60,y:460,text:'У ОКНА'},
      {type:'label',x:351,y:460,text:'ОСНОВНОЙ ЗАЛ'},
      {type:'label',x:620,y:460,text:'БАР'},
    ]
  },
  r3: {
    W:820, H:520,
    walls:[
      {type:'rect',x:0,y:0,w:820,h:520},
      {type:'line',x1:555,y1:0,x2:555,y2:400,dash:'10,5'},
      {type:'line',x1:0,y1:400,x2:820,y2:400,dash:'8,4'},
    ],
    features:[
      {type:'rect',x:10,y:8,w:75,h:65,fill:'#d4a04433',stroke:'#b08030',sw:1.5,label:'Тандыр'},
      {type:'rect',x:640,y:8,w:170,h:40,fill:'#c8b09033',stroke:'#a08060',sw:1.5,label:'Ресепшн'},
      {type:'window',x:150,y:0,w:90},{type:'window',x:320,y:0,w:90},{type:'window',x:430,y:0,w:90},
      {type:'window',x:820,y:50,w:0,h:70,vertical:true},{type:'window',x:820,y:200,w:0,h:70,vertical:true},
      {type:'door',x:370,y:517,w:80,label:'Вход'},
      {type:'label',x:270,y:378,text:'ОСНОВНОЙ ЗАЛ'},
      {type:'label',x:687,y:230,text:'БАНКЕТНЫЙ ЗАЛ'},
      {type:'label',x:410,y:508,text:'ТЕРРАСА'},
    ]
  },
  r4: {
    W:780, H:480,
    walls:[
      {type:'rect',x:0,y:0,w:780,h:480},
      {type:'line',x1:0,y1:115,x2:780,y2:115,dash:'10,5'},
      {type:'line',x1:598,y1:115,x2:598,y2:370,dash:'10,5'},
      {type:'line',x1:0,y1:370,x2:780,y2:370,dash:'8,4'},
    ],
    features:[
      {type:'window',x:20,y:0,w:100},{type:'window',x:200,y:0,w:100},{type:'window',x:380,y:0,w:100},{type:'window',x:560,y:0,w:100},
      {type:'door',x:340,y:477,w:100,label:'Выход'},
      {type:'label',x:185,y:104,text:'ПАНОРАМНЫЙ ЗАЛ'},
      {type:'label',x:290,y:350,text:'ОСНОВНОЙ ЗАЛ'},
      {type:'label',x:688,y:355,text:'VIP-ЗОНА'},
      {type:'label',x:390,y:466,text:'ЛАУНДЖ'},
    ]
  },
  r5: {
    W:720, H:480,
    walls:[
      {type:'rect',x:0,y:0,w:720,h:480},
      {type:'line',x1:200,y1:0,x2:200,y2:380,dash:'10,5'},
      {type:'line',x1:590,y1:0,x2:590,y2:380,dash:'10,5'},
      {type:'line',x1:0,y1:380,x2:720,y2:380,dash:'8,4'},
    ],
    features:[
      {type:'rect',x:8,y:8,w:85,h:85,fill:'#c8805033',stroke:'#a06030',sw:2,label:'Печь'},
      {type:'window',x:720,y:20,w:0,h:70,vertical:true},
      {type:'window',x:720,y:160,w:0,h:70,vertical:true},
      {type:'window',x:720,y:300,w:0,h:70,vertical:true},
      {type:'window',x:220,y:0,w:90},{type:'window',x:400,y:0,w:90},
      {type:'door',x:325,y:477,w:70,label:'Вход'},
      {type:'label',x:100,y:362,text:'У ПЕЧИ'},
      {type:'label',x:395,y:362,text:'ОСНОВНОЙ ЗАЛ'},
      {type:'label',x:655,y:362,text:'У ОКНА'},
      {type:'label',x:360,y:460,text:'ЛАУНДЖ'},
    ]
  },
};

Object.assign(window, { RESTAURANTS, TABLES, FLOOR_LAYOUTS, SEED_BOOKINGS });
