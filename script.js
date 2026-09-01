// ============================================================
// 1. КОНСТАНТЫ
// ============================================================
const STATUSES = {
  DONE: 'done',
  PLANNED: 'planned'
};

const CATEGORIES = {
  SOUP: 'soup',
  SALAD: 'salad',
  MAIN: 'main',
  OTHER: 'other'
};

const CATEGORY_LABELS = {
  [CATEGORIES.SOUP]: '🍲 Суп',
  [CATEGORIES.SALAD]: '🥗 Салат',
  [CATEGORIES.MAIN]: '🍖 Основное',
  [CATEGORIES.OTHER]: '🍽️ Другое'
};

const PRODUCT_WORDS = [
  'лук', 'морковь', 'картофель', 'капуста', 'свекла', 'редис', 'репа',
  'огурец', 'помидор', 'перец', 'баклажан', 'кабачок', 'тыква',
  'чеснок', 'зелень', 'петрушка', 'укроп', 'базилик', 'кинза',
  'салат', 'шпинат', 'щавель', 'ревень', 'сельдерей',
  'рис', 'гречка', 'овсянка', 'перловка', 'пшено', 'кускус', 'булгур',
  'макароны', 'паста', 'лапша', 'вермишель', 'спагетти',
  'говядина', 'свинина', 'баранина', 'телятина', 'курица', 'индейка',
  'утка', 'гусь', 'кролик', 'фарш', 'печень', 'сердце', 'почки',
  'тунец', 'горбуша', 'лосось', 'форель', 'сёмга', 'кета', 'кижуч',
  'треска', 'пикша', 'окунь', 'судак', 'щука', 'сом', 'налим',
  'осётр', 'пангасиус', 'тилапия', 'дорада', 'сибас', 'ставрида',
  'скумбрия', 'макрель', 'сельдь', 'шпроты', 'килька',
  'креветки', 'мидии', 'кальмары', 'краб',
  'молоко', 'сливки', 'сметана', 'йогурт', 'кефир', 'ряженка',
  'творог', 'сыр', 'масло', 'маргарин', 'майонез', 'кетчуп',
  'яйцо',
  'соль', 'перец', 'сахар', 'мука', 'крахмал',
  'корица', 'ваниль', 'какао', 'шоколад',
  'орегано', 'тимьян', 'розмарин', 'кориандр', 'тмин', 'кумин',
  'паприка', 'куркума', 'имбирь', 'шафран', 'гвоздика', 'кардамон',
  'яблоко', 'груша', 'айва', 'хурма', 'гранат',
  'лимон', 'лайм', 'грейпфрут', 'мандарин', 'апельсин',
  'клубника', 'малина', 'черника', 'ежевика', 'смородина', 'крыжовник',
  'вишня', 'черешня', 'слива', 'абрикос', 'персик', 'нектарин',
  'банан', 'киви', 'манго', 'ананас', 'гранат',
  'арбуз', 'дыня',
  'финик', 'инжир', 'курага', 'чернослив', 'изюм',
  'орех', 'миндаль', 'фисташка', 'кешью', 'грецкий орех', 'фундук',
  'гриб', 'шампиньон', 'белый гриб', 'подберёзовик', 'лисичка',
  'вода', 'бульон', 'вино', 'коньяк', 'ром', 'пиво',
  'чай', 'кофе', 'какао', 'компот', 'кисель', 'морс', 'квас',
  'лимонад', 'сок', 'нектар',
  'оливковое масло', 'подсолнечное масло', 'сливочное масло',
  'варенье', 'джем', 'конфитюр', 'мёд', 'сироп', 'пастила', 'мармелад',
  'дрожжи', 'разрыхлитель', 'сода', 'уксус', 'лимонная кислота'
];

// ============================================================
// 2. УТИЛИТЫ
// ============================================================
const Utils = {
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  formatDate(date) {
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  },

  formatDateLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  daysAgo(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'сегодня';
    if (diff === 1) return 'вчера';
    if (diff < 7) return `${diff} дня назад`;
    if (diff < 14) return 'неделю назад';
    if (diff < 30) return `${Math.floor(diff / 7)} недели назад`;
    return `${diff} дней назад`;
  },

  guessCategory(name) {
    const lower = name.toLowerCase();
    if (lower.includes('суп') || lower.includes('борщ') || lower.includes('пюре') || lower.includes('бульон')) return CATEGORIES.SOUP;
    if (lower.includes('салат') || lower.includes('винегрет') || lower.includes('овощ') || lower.includes('зелень')) return CATEGORIES.SALAD;
    if (lower.includes('котлет') || lower.includes('запекан') || lower.includes('тушен') ||
        lower.includes('колбас') || lower.includes('жарен') || lower.includes('печень') ||
        lower.includes('мясо') || lower.includes('курин') || lower.includes('индей') ||
        lower.includes('рыб') || lower.includes('бифштекс') || lower.includes('стейк') ||
        lower.includes('паста') || lower.includes('макарон') || lower.includes('греч') ||
        lower.includes('рис') || lower.includes('плов') || lower.includes('картош') ||
        lower.includes('каш')) return CATEGORIES.MAIN;
    return CATEGORIES.OTHER;
  },

  getWeekDays(baseDate) {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d);
    }
    return week;
  },

  isIngredientLine(line) {
    if (!line || line.length < 3) return false;
    const lower = line.toLowerCase();
    const hasNumber = /\d+/.test(line);
    const hasUnit = /(грамм|гр|мл|литр|кг|ст\.|ч\.|шт|зуб|пуч|ветк|головк|щепотк|кус|ломтик|пласт|лист|горст|капл|столов|чайн|десертн|стакан|банк|пакет|упаковк|коробк|баночк|бутылк|капля|щепотка|головка|пучок|веточка|лист|горсть|столовая ложка|чайная ложка|десертная ложка)/i.test(line);
    const hasProduct = PRODUCT_WORDS.some(word => lower.includes(word));
    const hasMarker = /^[•\-*]\s*/.test(line);
    let score = 0;
    if (hasNumber) score++;
    if (hasUnit) score++;
    if (hasProduct) score++;
    if (hasMarker) score++;
    return score >= 2;
  },

  parseRecipeText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let title = '';
    let ingredients = [];
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      if (line.length > 2 && line.length < 80 && !/\d/.test(line) && !this.isIngredientLine(line)) {
        title = line;
        break;
      }
    }
    if (!title && lines.length > 0) title = lines[0];
    for (const line of lines) {
      if (this.isIngredientLine(line) && line.length < 100) {
        ingredients.push(line);
      }
    }
    if (ingredients.length === 0) {
      for (const line of lines) {
        if (/\d/.test(line) && line.length < 100 && line.length > 3) {
          ingredients.push(line);
        }
      }
    }
    return { title, ingredients: ingredients.join('\n') };
  }
};

// ============================================================
// 3. ХРАНИЛИЩЕ РЕЦЕПТОВ
// ============================================================
const RecipeStore = (function() {
  const STORAGE_KEY = 'smartMenuRecipes_v1';
  let recipes = [];

  function generateId() { return Date.now() + Math.random() * 10000; }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          recipes = parsed;
          return true;
        }
      }
    } catch(e) { console.warn('Ошибка загрузки рецептов:', e); }
    return false;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch(e) { console.error('Ошибка сохранения рецептов:', e); }
  }

  function init() {
    if (!load()) {
      recipes = [];
      save();
    }
  }

  function getAll() { return recipes.slice(); }
  function getById(id) { return recipes.find(r => r.id === id); }
  function add(name, ingredients, instructions) {
    const id = generateId();
    const recipe = { id, name, ingredients: ingredients.split('\n').filter(s => s.trim()), instructions: instructions || '', createdAt: new Date().toISOString() };
    recipes.push(recipe);
    save();
    return recipe;
  }
  function update(id, name, ingredients, instructions) {
    const recipe = getById(id);
    if (!recipe) return false;
    recipe.name = name;
    recipe.ingredients = ingredients.split('\n').filter(s => s.trim());
    recipe.instructions = instructions || '';
    save();
    return true;
  }
  function remove(id) {
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return false;
    recipes.splice(index, 1);
    save();
    return true;
  }

  return { init, getAll, getById, add, update, remove };
})();

// ============================================================
// 4. ХРАНИЛИЩЕ ДАННЫХ (блюда)
// ============================================================
const DishStore = (function() {
  const STORAGE_KEY = 'smartMenuDishes_v5';
  let dishes = [];
  let cacheUnique = null;
  let cacheRecs = null;
  let cacheAllWithDone = null;

  const DEFAULT_DISHES = [
    { name: 'Гороховый суп', status: STATUSES.DONE, date: '2026-08-24', category: CATEGORIES.SOUP, note: '' },
    { name: 'Запеканка из фарша и овощей', status: STATUSES.DONE, date: '2026-08-25', category: CATEGORIES.MAIN, note: 'можно добавить сыр' },
    { name: 'Колбаски и запеченая картошка', status: STATUSES.DONE, date: '2026-08-26', category: CATEGORIES.MAIN, note: '' },
    { name: 'Плов', status: STATUSES.PLANNED, date: '2026-08-28', category: CATEGORIES.MAIN, note: 'использовать баранину' },
    { name: 'Салат с крабовыми палочками', status: STATUSES.PLANNED, date: '2026-08-28', category: CATEGORIES.SALAD, note: '' },
    { name: 'Суп борщ?', status: STATUSES.PLANNED, date: '2026-08-31', category: CATEGORIES.SOUP, note: '' },
    { name: 'Котлеты с картофельным пюре', status: STATUSES.PLANNED, date: '2026-09-01', category: CATEGORIES.MAIN, note: '' },
    { name: 'Салат морковь по-корейски', status: STATUSES.PLANNED, date: '2026-09-01', category: CATEGORIES.SALAD, note: '' },
    { name: 'Печень и перловка', status: STATUSES.PLANNED, date: '2026-09-02', category: CATEGORIES.MAIN, note: '' },
    { name: 'Мясо по-французски', status: STATUSES.PLANNED, date: '2026-09-03', category: CATEGORIES.MAIN, note: '' },
    { name: 'Морская капуста с крабовыми палочками', status: STATUSES.PLANNED, date: '2026-09-04', category: CATEGORIES.SALAD, note: '' },
    { name: 'Суп с сайрой', status: STATUSES.PLANNED, date: '2026-09-07', category: CATEGORIES.SOUP, note: '' },
    { name: 'Тушеная капуста', status: STATUSES.PLANNED, date: '2026-09-08', category: CATEGORIES.MAIN, note: '' },
    { name: 'Запеченные куриные ножки', status: STATUSES.PLANNED, date: '2026-09-09', category: CATEGORIES.MAIN, note: '' },
    { name: 'Фунчоза', status: STATUSES.PLANNED, date: '2026-09-09', category: CATEGORIES.MAIN, note: '' },
    { name: 'Удон', status: STATUSES.PLANNED, date: '2026-09-10', category: CATEGORIES.MAIN, note: '' },
    { name: 'Паста Болоньезе', status: STATUSES.PLANNED, date: '2026-09-12', category: CATEGORIES.MAIN, note: 'сделать с фаршем индейки' },
  ];

  const TASTE_DISHES = {
    [CATEGORIES.SOUP]: ['Борщ', 'Солянка', 'Уха', 'Щи', 'Сырный суп', 'Гороховый суп', 'Рассольник', 'Окрошка'],
    [CATEGORIES.MAIN]: ['Картофельное пюре с котлетой', 'Пельмени', 'Манты', 'Гречка с мясом', 'Голубцы', 'Жаркое', 'Макароны по-флотски', 'Плов'],
    [CATEGORIES.SALAD]: ['Селедка под шубой', 'Оливье', 'Крабовый', 'Цезарь с курицей', 'Мимоза', 'Винегрет', 'Греческий салат', 'Салат из свежих овощей']
  };

  function generateId() {
    return Date.now() + Math.random() * 10000;
  }

  function normalizeDish(dish) {
    if (!dish.category) dish.category = Utils.guessCategory(dish.name);
    if (!dish.note) dish.note = '';
    if (dish.liked === undefined) dish.liked = false;
    if (!dish.id) dish.id = generateId();
    if (dish.recipeId === undefined) dish.recipeId = null;
    return dish;
  }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          dishes = parsed.map(normalizeDish);
          return true;
        }
      }
    } catch (e) {
      console.warn('Ошибка загрузки данных:', e);
    }
    return false;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
      cacheUnique = null;
      cacheRecs = null;
      cacheAllWithDone = null;
    } catch (e) {
      console.error('Ошибка сохранения данных:', e);
    }
  }

  function init() {
    if (!load()) {
      const result = DEFAULT_DISHES.map((d, i) => ({ ...d, id: generateId() + i, liked: false, recipeId: null }));
      const noDate = [
        { name: 'Салат с морской капустой и крабовым мясом', category: CATEGORIES.SALAD, note: '' },
        { name: 'Гречка и салат из свежей капусты как в столовой', category: CATEGORIES.MAIN, note: '' },
        { name: 'Суп-пюре из кабачков', category: CATEGORIES.SOUP, note: 'можно добавить сливки' }
      ];
      const today = new Date();
      noDate.forEach((item, idx) => {
        const d = new Date(today);
        d.setDate(d.getDate() + 7 + idx);
        result.push({
          id: generateId() + 1000 + idx,
          name: item.name,
          status: STATUSES.PLANNED,
          date: Utils.formatDateLocal(d),
          category: item.category,
          liked: false,
          note: item.note || '',
          recipeId: null
        });
      });
      dishes = result;
      save();
    }
  }

  function editDishName(id, newName) {
    const dish = dishes.find(d => d.id === id);
    if (!dish) return false;
    dish.name = newName.trim();
    save();
    return true;
  }

  function updateNote(id, note) {
    const dish = dishes.find(d => d.id === id);
    if (!dish) return false;
    dish.note = note.trim();
    save();
    return true;
  }

  function getAll() { return dishes.slice(); }
  function getForDate(dateStr) { return dishes.filter(d => d.date === dateStr); }

  function addDish(name, status, date, category, liked = false, note = '', recipeId = null) {
    if (!name || !status || !date || !category) return false;
    const id = generateId();
    dishes.push({ id, name, status, date, category, liked, note, recipeId });
    save();
    return true;
  }

  function removeDish(id) {
    const index = dishes.findIndex(d => d.id === id);
    if (index === -1) return false;
    dishes.splice(index, 1);
    save();
    return true;
  }

  function toggleStatus(id) {
    const dish = dishes.find(d => d.id === id);
    if (!dish) return false;
    dish.status = dish.status === STATUSES.DONE ? STATUSES.PLANNED : STATUSES.DONE;
    save();
    return true;
  }

  function toggleLike(id) {
    const dish = dishes.find(d => d.id === id);
    if (!dish) return false;
    dish.liked = !dish.liked;
    save();
    return true;
  }

  function getAllUniqueWithLastDone() {
    if (cacheAllWithDone) return cacheAllWithDone;
    const names = new Set(dishes.map(d => d.name));
    const result = [];
    names.forEach(name => {
      const doneEntries = dishes.filter(d => d.name === name && d.status === STATUSES.DONE);
      let lastDoneDate = null;
      if (doneEntries.length > 0) {
        lastDoneDate = doneEntries.reduce((max, d) => d.date > max ? d.date : max, doneEntries[0].date);
      }
      result.push({ name, lastDoneDate });
    });
    result.sort((a, b) => {
      if (a.lastDoneDate && b.lastDoneDate) return a.lastDoneDate.localeCompare(b.lastDoneDate);
      if (a.lastDoneDate && !b.lastDoneDate) return -1;
      if (!a.lastDoneDate && b.lastDoneDate) return 1;
      return a.name.localeCompare(b.name);
    });
    cacheAllWithDone = result;
    return result;
  }

  function getRecommendations() {
    if (cacheRecs) return cacheRecs;
    const doneDishes = dishes.filter(d => d.status === STATUSES.DONE);
    const map = {};
    doneDishes.forEach(d => {
      if (!map[d.name] || d.date > map[d.name]) {
        map[d.name] = { name: d.name, lastDate: d.date, liked: d.liked };
      }
    });
    const unique = Object.values(map);
    const likedItems = unique.filter(item => item.liked);
    const otherItems = unique.filter(item => !item.liked);
    likedItems.sort((a, b) => a.lastDate.localeCompare(b.lastDate));
    otherItems.sort((a, b) => a.lastDate.localeCompare(b.lastDate));
    const likedResult = likedItems.slice(0, 1);
    const othersResult = otherItems.slice(0, 3);
    const result = { liked: likedResult, others: othersResult };
    cacheRecs = result;
    return result;
  }

  function getFavorites() { return dishes.filter(d => d.liked); }
  function invalidateCache() { cacheUnique = null; cacheRecs = null; cacheAllWithDone = null; }
  function replaceAll(newDishes) { dishes = newDishes.map(normalizeDish); save(); invalidateCache(); }
  function getRandomDishFromTaste() {
    const categories = [CATEGORIES.SOUP, CATEGORIES.MAIN, CATEGORIES.SALAD];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const list = TASTE_DISHES[cat];
    const name = list[Math.floor(Math.random() * list.length)];
    return { name, category: cat, categoryLabel: CATEGORY_LABELS[cat] };
  }

  function setRecipeId(dishId, recipeId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return false;
    dish.recipeId = recipeId;
    save();
    return true;
  }

  return {
    init, editDishName, updateNote, getAll, getForDate, addDish, removeDish,
    toggleStatus, toggleLike, getAllUniqueWithLastDone,
    getRecommendations, getFavorites, invalidateCache, replaceAll,
    getRandomDishFromTaste, setRecipeId
  };
})();

// ============================================================
// 5. РЕНДЕРЕР (основной)
// ============================================================
const Renderer = (function() {
  let currentView = 'month';
  let currentDate = new Date();
  let searchQuery = '', statusFilter = 'all', categoryFilter = 'all';

  const monthTitle = document.getElementById('monthTitle');
  const calendarContent = document.getElementById('calendarContent');
  const menuContent = document.getElementById('menuContent');
  const menuPeriod = document.getElementById('menuPeriod');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalDate = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  const recOverlay = document.getElementById('recOverlay');
  const recTitle = document.getElementById('recTitle');
  const recContent = document.getElementById('recContent');

  // --- Вспомогательные функции ---
  function buildDishElement(dish, dateStr) {
    const dishDiv = document.createElement('div');
    dishDiv.className = `modal-dish ${dish.status}`;
    if (dish.liked) dishDiv.classList.add('liked');

    const nameSpan = document.createElement('span');
    nameSpan.className = 'dish-name';
    nameSpan.textContent = dish.name;
    dishDiv.appendChild(nameSpan);

    if (dish.recipeId) {
      const recipeLink = document.createElement('span');
      recipeLink.className = 'recipe-link';
      recipeLink.textContent = '📖';
      recipeLink.title = 'Открыть рецепт';
      recipeLink.addEventListener('click', function(e) {
        e.stopPropagation();
        const recipe = RecipeStore.getById(dish.recipeId);
        if (recipe) {
          showRecipeCard(recipe);
        } else {
          alert('Рецепт не найден');
        }
      });
      nameSpan.appendChild(recipeLink);
    }

    const actions = document.createElement('div');
    actions.className = 'dish-actions';

    const statusSpan = document.createElement('span');
    statusSpan.className = 'dish-status';
    statusSpan.textContent = dish.status === STATUSES.DONE ? '✅ Готовила' : '📅 Планирую';
    actions.appendChild(statusSpan);

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.textContent = '✎';
    editBtn.title = 'Редактировать';
    editBtn.dataset.id = dish.id;
    editBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = Number(this.dataset.id);
      const parentDish = this.closest('.modal-dish');
      const nameSpanEl = parentDish.querySelector('.dish-name');
      const currentName = nameSpanEl.textContent;
      const noteDiv = parentDish.querySelector('.dish-note');
      const currentNote = noteDiv ? noteDiv.textContent : '';

      const editContainer = document.createElement('div');
      editContainer.className = 'edit-container';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = currentName;
      nameInput.className = 'edit-input';
      nameInput.placeholder = 'Название';
      const noteInput = document.createElement('input');
      noteInput.type = 'text';
      noteInput.value = currentNote;
      noteInput.className = 'edit-input note-edit';
      noteInput.placeholder = 'Заметка';
      editContainer.appendChild(nameInput);
      editContainer.appendChild(noteInput);
      nameSpanEl.replaceWith(editContainer);
      if (noteDiv) noteDiv.remove();

      const saveEdit = () => {
        const newName = nameInput.value.trim();
        const newNote = noteInput.value.trim();
        if (newName && newName !== currentName) DishStore.editDishName(id, newName);
        if (newNote !== currentNote) DishStore.updateNote(id, newNote);
        openModal(dateStr);
        renderCalendar(currentView, currentDate);
      };
      nameInput.addEventListener('blur', saveEdit);
      noteInput.addEventListener('blur', saveEdit);
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); nameInput.blur(); }
        if (e.key === 'Escape') { nameInput.value = currentName; noteInput.value = currentNote; nameInput.blur(); }
      });
      noteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); noteInput.blur(); }
        if (e.key === 'Escape') { nameInput.value = currentName; noteInput.value = currentNote; noteInput.blur(); }
      });
      nameInput.focus();
      nameInput.select();
    });
    actions.appendChild(editBtn);

    const likeBtn = document.createElement('button');
    likeBtn.className = `action-btn like-btn ${dish.liked ? 'liked' : ''}`;
    likeBtn.textContent = dish.liked ? '❤️' : '🤍';
    likeBtn.title = 'Лайк';
    likeBtn.dataset.id = dish.id;
    likeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      DishStore.toggleLike(Number(this.dataset.id));
      openModal(dateStr);
      renderCalendar(currentView, currentDate);
    });
    actions.appendChild(likeBtn);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'action-btn toggle-status-btn';
    toggleBtn.textContent = '🔄';
    toggleBtn.title = 'Переключить статус';
    toggleBtn.dataset.id = dish.id;
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      DishStore.toggleStatus(Number(this.dataset.id));
      openModal(dateStr);
      renderCalendar(currentView, currentDate);
    });
    actions.appendChild(toggleBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.textContent = '🗑️';
    deleteBtn.title = 'Удалить';
    deleteBtn.dataset.id = dish.id;
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('Удалить это блюдо?')) {
        DishStore.removeDish(Number(this.dataset.id));
        openModal(dateStr);
        renderCalendar(currentView, currentDate);
      }
    });
    actions.appendChild(deleteBtn);

    dishDiv.appendChild(actions);

    if (dish.note) {
      const noteSpan = document.createElement('div');
      noteSpan.className = 'dish-note';
      noteSpan.textContent = dish.note;
      dishDiv.appendChild(noteSpan);
    }

    return dishDiv;
  }

  function buildAddForm(dateStr) {
    const addSection = document.createElement('div');
    addSection.className = 'modal-add-section';

    const addTitle = document.createElement('h4');
    addTitle.textContent = '➕ Добавить блюдо';
    addSection.appendChild(addTitle);

    const addForm = document.createElement('div');
    addForm.className = 'modal-add-new';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Название';
    nameInput.id = 'modalNewDishName';
    nameInput.className = 'modal-field-input field-full';
    addForm.appendChild(nameInput);

    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.placeholder = '📝 Заметка (рецепт, продукты…)';
    noteInput.id = 'modalNewDishNote';
    noteInput.className = 'modal-field-input field-full';
    addForm.appendChild(noteInput);

    const statusSelect = document.createElement('select');
    statusSelect.id = 'modalNewDishStatus';
    statusSelect.className = 'modal-field-select field-half';
    [STATUSES.PLANNED, STATUSES.DONE].forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val === STATUSES.PLANNED ? '📅 Планирую' : '✅ Готовила';
      statusSelect.appendChild(opt);
    });
    addForm.appendChild(statusSelect);

    const categorySelect = document.createElement('select');
    categorySelect.id = 'modalNewDishCategory';
    categorySelect.className = 'modal-field-select field-half';
    [
      { val: CATEGORIES.SOUP, label: '🍲 Суп' },
      { val: CATEGORIES.SALAD, label: '🥗 Салат' },
      { val: CATEGORIES.MAIN, label: '🍖 Основное' },
      { val: CATEGORIES.OTHER, label: '🍽️ Другое' }
    ].forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.val;
      opt.textContent = cat.label;
      categorySelect.appendChild(opt);
    });
    addForm.appendChild(categorySelect);

    const recipeSelect = document.createElement('select');
    recipeSelect.id = 'modalNewDishRecipe';
    recipeSelect.className = 'modal-field-select field-half';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Без рецепта';
    recipeSelect.appendChild(defaultOpt);
    const allRecipes = RecipeStore.getAll();
    allRecipes.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.name;
      recipeSelect.appendChild(opt);
    });
    addForm.appendChild(recipeSelect);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Добавить';
    addBtn.className = 'field-btn';
    addForm.appendChild(addBtn);

    addSection.appendChild(addForm);

    // ---- Блок поиска и фильтров для предложений ----
    const suggestControls = document.createElement('div');
    suggestControls.className = 'suggest-controls';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Поиск по названию';
    searchInput.id = 'suggestSearch';
    searchInput.className = 'modal-field-input';
    suggestControls.appendChild(searchInput);

    const filterSelect = document.createElement('select');
    filterSelect.id = 'suggestCategoryFilter';
    filterSelect.className = 'modal-field-select';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'Все категории';
    filterSelect.appendChild(allOpt);
    [
      { val: CATEGORIES.SOUP, label: '🍲 Суп' },
      { val: CATEGORIES.SALAD, label: '🥗 Салат' },
      { val: CATEGORIES.MAIN, label: '🍖 Основное' },
      { val: CATEGORIES.OTHER, label: '🍽️ Другое' }
    ].forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.val;
      opt.textContent = cat.label;
      filterSelect.appendChild(opt);
    });
    suggestControls.appendChild(filterSelect);
    addSection.appendChild(suggestControls);

    const suggestTitle = document.createElement('h4');
    suggestTitle.textContent = '📖 Выбрать из меню';
    suggestTitle.style.marginTop = '12px';
    addSection.appendChild(suggestTitle);

    const suggestList = document.createElement('div');
    suggestList.className = 'modal-suggest-list';
    addSection.appendChild(suggestList);

    // Функция фильтрации предложений
    function filterSuggestions() {
      const query = searchInput.value.trim().toLowerCase();
      const cat = filterSelect.value;
      const items = suggestList.querySelectorAll('.modal-suggest-item');
      items.forEach(item => {
        const name = item.dataset.name.toLowerCase();
        const itemCat = item.dataset.category || '';
        const matchName = name.includes(query);
        const matchCat = cat === 'all' || itemCat === cat;
        item.style.display = (matchName && matchCat) ? '' : 'none';
      });
    }

    searchInput.addEventListener('input', filterSuggestions);
    filterSelect.addEventListener('change', filterSuggestions);

    // Заполнение списка предложений
    function renderSuggestions() {
      const allUnique = DishStore.getAllUniqueWithLastDone();
      const dayDishes = DishStore.getForDate(dateStr);
      const existingNames = dayDishes.map(d => d.name);
      const available = allUnique.filter(item => !existingNames.includes(item.name));
      suggestList.innerHTML = '';
      if (available.length === 0) {
        const noSuggest = document.createElement('div');
        noSuggest.className = 'modal-no-suggest';
        noSuggest.textContent = 'Все блюда уже добавлены на этот день';
        suggestList.appendChild(noSuggest);
      } else {
        available.forEach(item => {
          const suggestItem = document.createElement('div');
          suggestItem.className = 'modal-suggest-item';
          suggestItem.dataset.name = item.name;
          const existingDish = DishStore.getAll().find(d => d.name === item.name);
          const category = existingDish ? existingDish.category : Utils.guessCategory(item.name);
          suggestItem.dataset.category = category;

          const nameSpan = document.createElement('span');
          nameSpan.className = 'suggest-name';
          nameSpan.textContent = item.name;
          suggestItem.appendChild(nameSpan);
          const lastSpan = document.createElement('span');
          lastSpan.className = 'suggest-last';
          if (item.lastDoneDate) {
            lastSpan.textContent = `Последний раз: ${Utils.daysAgo(item.lastDoneDate)}`;
          } else {
            lastSpan.textContent = 'ещё не готовили';
          }
          suggestItem.appendChild(lastSpan);
          suggestItem.addEventListener('click', function() {
            const name = this.dataset.name;
            const existing = DishStore.getAll().find(d => d.name === name);
            const category = existing ? existing.category : Utils.guessCategory(name);
            const recipeId = existing ? existing.recipeId : null;
            DishStore.addDish(name, STATUSES.PLANNED, dateStr, category, false, '', recipeId);
            openModal(dateStr);
            renderCalendar(currentView, currentDate);
          });
          suggestList.appendChild(suggestItem);
        });
        filterSuggestions();
      }
    }
    renderSuggestions();

    // ---- Автоподстановка названия из рецепта ----
    recipeSelect.addEventListener('change', function() {
      const recipeId = this.value;
      if (recipeId) {
        const recipe = RecipeStore.getById(Number(recipeId));
        if (recipe) {
          nameInput.value = recipe.name;
        }
      }
    });

    // Кнопка "Добавить"
    addBtn.addEventListener('click', function() {
      const name = nameInput.value.trim();
      if (!name) { alert('Введи название блюда'); return; }
      const status = statusSelect.value;
      const category = categorySelect.value;
      const note = document.getElementById('modalNewDishNote').value.trim();
      const recipeId = recipeSelect.value ? Number(recipeSelect.value) : null;
      DishStore.addDish(name, status, dateStr, category, false, note, recipeId);
      openModal(dateStr);
      renderCalendar(currentView, currentDate);
      nameInput.value = '';
      document.getElementById('modalNewDishNote').value = '';
      recipeSelect.value = '';
    });

    return addSection;
  }

  // --- Основные функции рендерера ---
  function renderCalendar(view, date) {
    currentView = view;
    currentDate = date;
    const year = date.getFullYear();
    const month = date.getMonth();
    monthTitle.textContent = `${['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][month]} ${year}`;
    calendarContent.innerHTML = '';
    if (view === 'month') renderMonthView(year, month);
    else renderWeekView(date);
    renderMenu();
    updateViewButtons();
  }

  function updateViewButtons() {
    const btns = document.querySelectorAll('#viewToggle button');
    btns.forEach(btn => {
      const isActive = btn.dataset.view === currentView;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  }

  function renderMonthView(year, month) {
    const grid = document.createElement('div');
    grid.className = 'days-grid';
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const totalDays = last.getDate();
    let startDay = first.getDay() - 1;
    if (startDay < 0) startDay = 6;
    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'day-cell empty';
      grid.appendChild(empty);
    }
    const today = new Date();
    const todayStr = Utils.formatDateLocal(today);
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day);
      const dateStr = Utils.formatDateLocal(d);
      const cell = document.createElement('div');
      cell.className = 'day-cell';
      const dayDishes = DishStore.getForDate(dateStr);
      const hasDone = dayDishes.some(d => d.status === STATUSES.DONE);
      const hasPlanned = dayDishes.some(d => d.status === STATUSES.PLANNED);
      if (hasDone) cell.classList.add('has-done');
      if (hasPlanned) cell.classList.add('has-planned');
      if (hasDone && hasPlanned) cell.classList.add('has-both');
      if (dateStr === todayStr) cell.classList.add('today');
      const numDiv = document.createElement('div');
      numDiv.className = 'day-number';
      numDiv.textContent = d.getDate();
      cell.appendChild(numDiv);
      cell.addEventListener('click', () => openModal(dateStr));
      grid.appendChild(cell);
    }
    calendarContent.appendChild(grid);
  }

  function renderWeekView(baseDate) {
    const week = Utils.getWeekDays(baseDate);
    const list = document.createElement('div');
    list.className = 'week-list';

    const hint = document.createElement('div');
    hint.className = 'week-drag-hint';
    hint.textContent = '🔄 Перетащите блюдо на другой день';
    list.appendChild(hint);

    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    week.forEach((day, idx) => {
      const dateStr = Utils.formatDateLocal(day);
      const dayDishes = DishStore.getForDate(dateStr);
      const row = document.createElement('div');
      row.className = 'week-row';
      row.dataset.date = dateStr;
      const dateCol = document.createElement('div');
      dateCol.className = 'date-col';
      dateCol.textContent = day.getDate();
      row.appendChild(dateCol);
      const dayCol = document.createElement('div');
      dayCol.className = 'day-col';
      dayCol.textContent = dayNames[idx];
      row.appendChild(dayCol);
      const mealsCol = document.createElement('div');
      mealsCol.className = 'meals-col';
      if (dayDishes.length === 0) {
        const empty = document.createElement('span');
        empty.className = 'empty-meals';
        empty.textContent = '—';
        mealsCol.appendChild(empty);
      } else {
        dayDishes.forEach(dish => {
          const chip = document.createElement('span');
          chip.className = `meal-chip ${dish.status}`;
          if (dish.liked) chip.classList.add('liked');
          chip.textContent = dish.name;
          if (dish.recipeId) {
            const badge = document.createElement('span');
            badge.className = 'recipe-badge';
            badge.textContent = '📖';
            badge.title = 'Открыть рецепт';
            badge.addEventListener('click', function(e) {
              e.stopPropagation();
              const recipe = RecipeStore.getById(dish.recipeId);
              if (recipe) showRecipeCard(recipe);
            });
            chip.appendChild(badge);
          }
          chip.draggable = true;
          chip.dataset.id = dish.id;
          chip.dataset.date = dateStr;
          chip.addEventListener('click', (e) => {
            if (e.target.closest('.recipe-badge')) return;
            if (e.detail > 0) openModal(dateStr);
          });
          mealsCol.appendChild(chip);
        });
      }
      row.appendChild(mealsCol);
      row.addEventListener('click', (e) => {
        if (e.target.closest('.meal-chip')) return;
        openModal(dateStr);
      });
      list.appendChild(row);
    });
    calendarContent.appendChild(list);
  }

  function renderMenu() {
    menuPeriod.textContent = currentView === 'month' ? 'месяц' : 'неделю';
    let days = [];
    if (currentView === 'month') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const last = new Date(year, month + 1, 0);
      for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    } else {
      days = Utils.getWeekDays(currentDate);
    }
    let allDishes = [];
    days.forEach(day => {
      const dateStr = Utils.formatDateLocal(day);
      const dayDishes = DishStore.getForDate(dateStr);
      dayDishes.forEach(dish => {
        allDishes.push({ ...dish, displayDate: Utils.formatDate(day) });
      });
    });
    let filtered = allDishes;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(d => d.name.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') filtered = filtered.filter(d => d.status === statusFilter);
    if (categoryFilter !== 'all') filtered = filtered.filter(d => d.category === categoryFilter);

    const grouped = {};
    filtered.forEach(dish => {
      if (!grouped[dish.date]) grouped[dish.date] = [];
      grouped[dish.date].push(dish);
    });
    const sortedDates = Object.keys(grouped).sort();
    menuContent.innerHTML = '';
    if (sortedDates.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'menu-empty';
      empty.textContent = '😌 Нет блюд, соответствующих фильтрам';
      menuContent.appendChild(empty);
      return;
    }
    sortedDates.forEach(dateStr => {
      const dayDishes = grouped[dateStr];
      const displayDate = dayDishes[0].displayDate || Utils.formatDate(new Date(dateStr));
      const group = document.createElement('div');
      group.className = 'menu-group';
      const dateEl = document.createElement('div');
      dateEl.className = 'menu-date';
      dateEl.textContent = displayDate;
      group.appendChild(dateEl);
      dayDishes.forEach(dish => {
        let categoryClass = '';
        if (dish.category === CATEGORIES.SOUP) categoryClass = 'category-soup';
        else if (dish.category === CATEGORIES.SALAD) categoryClass = 'category-salad';
        else if (dish.category === CATEGORIES.MAIN) categoryClass = 'category-main';
        const item = document.createElement('div');
        item.className = `menu-item ${dish.status} ${categoryClass}`;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = dish.name;
        item.appendChild(nameSpan);
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        badge.textContent = dish.status === STATUSES.DONE ? '✅' : '📅';
        item.appendChild(badge);
        group.appendChild(item);
      });
      menuContent.appendChild(group);
    });
  }

  // --- Модалки ---
  function openModal(dateStr) {
    const d = new Date(dateStr);
    modalDate.textContent = Utils.formatDate(d);
    const dayDishes = DishStore.getForDate(dateStr);
    modalContent.innerHTML = '';

    const section = document.createElement('div');
    section.className = 'day-meals-section';
    const title = document.createElement('h4');
    title.textContent = '📋 Меню на день';
    section.appendChild(title);
    if (dayDishes.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'modal-empty';
      empty.textContent = '😌 На этот день пока ничего нет';
      section.appendChild(empty);
    } else {
      dayDishes.forEach(dish => {
        section.appendChild(buildDishElement(dish, dateStr));
      });
    }
    modalContent.appendChild(section);

    modalContent.appendChild(buildAddForm(dateStr));

    modalOverlay.classList.add('active');
    modalOverlay.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  // --- Рекомендации с выбором категории ---
  function showCategorySelection() {
    recTitle.textContent = '🍽️ Выберите категорию';
    recContent.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'rec-category-selection';

    const desc = document.createElement('p');
    desc.textContent = 'Выберите категорию блюд, которые хотите приготовить:';
    desc.style.marginBottom = '16px';
    desc.style.color = 'var(--text-secondary)';
    container.appendChild(desc);

    const categories = [
      { key: CATEGORIES.SOUP, label: '🍲 Супы' },
      { key: CATEGORIES.SALAD, label: '🥗 Салаты' },
      { key: CATEGORIES.MAIN, label: '🍖 Основные блюда' },
      { key: CATEGORIES.OTHER, label: '🍽️ Другое' }
    ];

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'category-choice-btn';
      btn.textContent = cat.label;
      btn.style.display = 'block';
      btn.style.width = '100%';
      btn.style.padding = '12px';
      btn.style.marginBottom = '8px';
      btn.style.borderRadius = 'var(--radius-lg)';
      btn.style.border = '1px solid var(--cell-border)';
      btn.style.background = 'var(--card-bg)';
      btn.style.fontSize = '16px';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'var(--transition-fast)';
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'var(--card-hover-bg)';
        btn.style.transform = 'translateX(4px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'var(--card-bg)';
        btn.style.transform = 'none';
      });
      btn.addEventListener('click', () => {
        showRecommendationsForCategory(cat.key);
      });
      container.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'rec-back-btn';
    backBtn.textContent = '← Назад';
    backBtn.style.marginTop = '12px';
    backBtn.style.background = 'transparent';
    backBtn.style.border = 'none';
    backBtn.style.color = 'var(--text-muted)';
    backBtn.style.cursor = 'pointer';
    backBtn.style.fontSize = '14px';
    backBtn.addEventListener('click', () => {
      recOverlay.classList.remove('active');
    });
    container.appendChild(backBtn);

    recContent.appendChild(container);
    recOverlay.classList.add('active');
    recOverlay.focus();
  }

  function showRecommendationsForCategory(category) {
    recTitle.textContent = `🍽️ Рекомендации: ${CATEGORY_LABELS[category] || category}`;

    const allUnique = DishStore.getAllUniqueWithLastDone();
    const filtered = [];
    allUnique.forEach(item => {
      const dish = DishStore.getAll().find(d => d.name === item.name);
      if (dish && dish.category === category && item.lastDoneDate) {
        const liked = DishStore.getAll().some(d => d.name === item.name && d.liked);
        filtered.push({ name: item.name, lastDate: item.lastDoneDate, liked });
      }
    });

    filtered.sort((a, b) => a.lastDate.localeCompare(b.lastDate));

    const likedItems = filtered.filter(item => item.liked);
    const otherItems = filtered.filter(item => !item.liked);

    const likedResult = likedItems.slice(0, 1);
    const othersResult = otherItems.slice(0, 3);

    recContent.innerHTML = '';

    if (likedResult.length === 0 && othersResult.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'modal-empty';
      empty.textContent = `😌 В категории "${CATEGORY_LABELS[category]}" нет блюд, которые вы уже готовили. Добавьте несколько!`;
      recContent.appendChild(empty);
    } else {
      if (likedResult.length > 0) {
        const section = document.createElement('div');
        section.className = 'rec-section';
        const title = document.createElement('h4');
        title.textContent = '❤️ Давно не готовили любимое блюдо';
        section.appendChild(title);
        likedResult.forEach(item => {
          const row = document.createElement('div');
          row.className = 'rec-item';
          row.dataset.name = item.name;
          const nameSpan = document.createElement('span');
          nameSpan.className = 'rec-name';
          nameSpan.textContent = item.name;
          row.appendChild(nameSpan);
          const daysSpan = document.createElement('span');
          daysSpan.className = 'rec-days';
          daysSpan.textContent = `последний раз ${Utils.daysAgo(item.lastDate)}`;
          row.appendChild(daysSpan);
          row.addEventListener('click', function() {
            const name = this.dataset.name;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = Utils.formatDateLocal(tomorrow);
            const existing = DishStore.getAll().find(d => d.name === name);
            const category = existing ? existing.category : Utils.guessCategory(name);
            const recipeId = existing ? existing.recipeId : null;
            DishStore.addDish(name, STATUSES.PLANNED, dateStr, category, false, '', recipeId);
            recOverlay.classList.remove('active');
            alert(`✅ Блюдо "${name}" добавлено в план на завтра (${Utils.formatDate(tomorrow)})`);
            renderCalendar(currentView, currentDate);
          });
          section.appendChild(row);
        });
        recContent.appendChild(section);
      }
      if (othersResult.length > 0) {
        const section = document.createElement('div');
        section.className = 'rec-section';
        const title = document.createElement('h4');
        title.textContent = '🍽️ Другие давние блюда';
        section.appendChild(title);
        othersResult.forEach(item => {
          const row = document.createElement('div');
          row.className = 'rec-item';
          row.dataset.name = item.name;
          const nameSpan = document.createElement('span');
          nameSpan.className = 'rec-name';
          nameSpan.textContent = item.name;
          row.appendChild(nameSpan);
          const daysSpan = document.createElement('span');
          daysSpan.className = 'rec-days';
          daysSpan.textContent = `последний раз ${Utils.daysAgo(item.lastDate)}`;
          row.appendChild(daysSpan);
          row.addEventListener('click', function() {
            const name = this.dataset.name;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const dateStr = Utils.formatDateLocal(tomorrow);
            const existing = DishStore.getAll().find(d => d.name === name);
            const category = existing ? existing.category : Utils.guessCategory(name);
            const recipeId = existing ? existing.recipeId : null;
            DishStore.addDish(name, STATUSES.PLANNED, dateStr, category, false, '', recipeId);
            recOverlay.classList.remove('active');
            alert(`✅ Блюдо "${name}" добавлено в план на завтра (${Utils.formatDate(tomorrow)})`);
            renderCalendar(currentView, currentDate);
          });
          section.appendChild(row);
        });
        recContent.appendChild(section);
      }
      const hint = document.createElement('div');
      hint.className = 'rec-hint';
      hint.textContent = '👆 Кликните по блюду, чтобы добавить его в план на завтра';
      recContent.appendChild(hint);
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'rec-back-btn';
    backBtn.textContent = '← Назад к категориям';
    backBtn.style.marginTop = '16px';
    backBtn.style.background = 'transparent';
    backBtn.style.border = 'none';
    backBtn.style.color = 'var(--text-muted)';
    backBtn.style.cursor = 'pointer';
    backBtn.style.fontSize = '14px';
    backBtn.addEventListener('click', () => {
      showCategorySelection();
    });
    recContent.appendChild(backBtn);

    recOverlay.classList.add('active');
    recOverlay.focus();
  }

  // --- Любимые ---
  function openFavorites() {
    recTitle.textContent = '❤️ Любимые блюда';
    const favs = DishStore.getFavorites();
    recContent.innerHTML = '';
    if (favs.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'modal-empty';
      empty.textContent = '😌 У вас пока нет любимых блюд. Отмечайте блюда сердечком ❤️ в модалке дня.';
      recContent.appendChild(empty);
    } else {
      const map = {};
      favs.forEach(d => {
        if (!map[d.name] || d.date > map[d.name]) map[d.name] = { name: d.name, lastDate: d.date, id: d.id };
      });
      const list = Object.values(map);
      list.sort((a, b) => a.lastDate.localeCompare(b.lastDate));
      const section = document.createElement('div');
      section.className = 'rec-section';
      const title = document.createElement('h4');
      title.textContent = 'Все любимые блюда';
      section.appendChild(title);
      list.forEach(item => {
        const row = document.createElement('div');
        row.className = 'rec-item';
        row.dataset.id = item.id;
        row.dataset.name = item.name;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'rec-name';
        nameSpan.textContent = '❤️ ' + item.name;
        row.appendChild(nameSpan);
        const daysSpan = document.createElement('span');
        daysSpan.className = 'rec-days';
        daysSpan.textContent = `последний раз ${Utils.daysAgo(item.lastDate)}`;
        row.appendChild(daysSpan);
        const removeBtn = document.createElement('button');
        removeBtn.className = 'rec-remove';
        removeBtn.textContent = '✕';
        removeBtn.title = 'Убрать из любимых';
        row.appendChild(removeBtn);
        row.addEventListener('click', function(e) {
          if (e.target === removeBtn) return;
          const name = this.dataset.name;
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = Utils.formatDateLocal(tomorrow);
          const existing = DishStore.getAll().find(d => d.name === name);
          const category = existing ? existing.category : Utils.guessCategory(name);
          const recipeId = existing ? existing.recipeId : null;
          DishStore.addDish(name, STATUSES.PLANNED, dateStr, category, false, '', recipeId);
          recOverlay.classList.remove('active');
          alert(`✅ Блюдо "${name}" добавлено в план на завтра (${Utils.formatDate(tomorrow)})`);
          renderCalendar(currentView, currentDate);
        });
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const id = Number(this.closest('.rec-item').dataset.id);
          const dish = DishStore.getAll().find(d => d.id === id);
          if (dish) {
            DishStore.toggleLike(id);
            openFavorites();
            renderCalendar(currentView, currentDate);
          }
        });
        section.appendChild(row);
      });
      recContent.appendChild(section);
      const hint = document.createElement('div');
      hint.className = 'rec-hint';
      hint.textContent = '👆 Кликните по блюду (кроме крестика), чтобы добавить его в план на завтра. Нажмите ✕, чтобы убрать из любимых.';
      recContent.appendChild(hint);
    }
    recOverlay.classList.add('active');
    recOverlay.focus();
  }

  function closeRecModal() {
    recOverlay.classList.remove('active');
  }

  function openAddModal() {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    document.getElementById('newDishDate').value = Utils.formatDateLocal(defaultDate);
    document.getElementById('newDishName').value = '';
    document.getElementById('newDishNote').value = '';
    document.getElementById('newDishStatus').value = STATUSES.PLANNED;
    document.getElementById('newDishCategory').value = CATEGORIES.MAIN;
    document.getElementById('addModalOverlay').classList.add('active');
    document.getElementById('addModalOverlay').focus();
  }

  function closeAddModal() {
    document.getElementById('addModalOverlay').classList.remove('active');
  }

  function setSearchQuery(q) { searchQuery = q; renderMenu(); }
  function setStatusFilter(f) { statusFilter = f; renderMenu(); }
  function setCategoryFilter(f) { categoryFilter = f; renderMenu(); }

  // --- Показ карточки рецепта ---
  function showRecipeCard(recipe) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.style.display = 'flex';
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.maxWidth = '500px';
    modal.innerHTML = `
      <div class="modal-header">
        <h3>📖 ${Utils.escapeHtml(recipe.name)}</h3>
        <button class="modal-close" id="recipeCardClose">✕</button>
      </div>
      <div style="margin-bottom:12px;">
        <strong>Ингредиенты:</strong>
        <ul style="list-style:none; padding-left:0; margin:4px 0;">
          ${recipe.ingredients.map(i => `<li style="padding:2px 0; border-bottom:1px solid var(--cell-border);">${Utils.escapeHtml(i)}</li>`).join('')}
        </ul>
      </div>
      ${recipe.instructions ? `<div><strong>Инструкция:</strong><pre style="white-space:pre-wrap; font-family:inherit; margin:4px 0;">${Utils.escapeHtml(recipe.instructions)}</pre></div>` : ''}
      <div style="display:flex; gap:8px; margin-top:12px;">
        <button class="btn-primary" id="addRecipeToCalendar" style="flex:1;">Добавить в календарь</button>
        <button class="btn-secondary" id="recipeCardCloseBtn" style="flex:1;">Закрыть</button>
      </div>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#recipeCardClose').addEventListener('click', close);
    overlay.querySelector('#recipeCardCloseBtn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    overlay.querySelector('#addRecipeToCalendar').addEventListener('click', function() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = Utils.formatDateLocal(tomorrow);
      const category = Utils.guessCategory(recipe.name);
      DishStore.addDish(recipe.name, STATUSES.PLANNED, dateStr, category, false, '', recipe.id);
      close();
      alert(`✅ Блюдо "${recipe.name}" добавлено в план на завтра (${Utils.formatDate(tomorrow)})`);
      renderCalendar(currentView, currentDate);
    });
  }

  return {
    renderCalendar, renderMenu, openModal, closeModal, openFavorites,
    closeRecModal, openAddModal, closeAddModal,
    setSearchQuery, setStatusFilter, setCategoryFilter,
    getCurrentDate: () => currentDate,
    getCurrentView: () => currentView,
    setCurrentDate: (d) => { currentDate = d; },
    setCurrentView: (v) => { currentView = v; },
    showRecipeCard,
    showCategorySelection,
    showRecommendationsForCategory
  };
})();

// ============================================================
// 6. ФУНКЦИИ ЭКСПОРТА / ИМПОРТА
// ============================================================
function exportData(format) {
  const data = DishStore.getAll();
  if (!data.length) { alert('Нет данных для экспорта.'); return; }

  if (format === 'json') {
    const json = JSON.stringify({ dishes: data, recipes: RecipeStore.getAll() }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } else if (format === 'csv') {
    const headers = ['Название', 'Статус', 'Дата', 'Категория', 'Заметка', 'Любимое', 'Рецепт'];
    const rows = data.map(d => {
      const recipe = d.recipeId ? RecipeStore.getById(d.recipeId) : null;
      return [
        d.name,
        d.status === STATUSES.DONE ? 'Готовила' : 'Планирую',
        d.date,
        d.category,
        d.note || '',
        d.liked ? 'Да' : 'Нет',
        recipe ? recipe.name : ''
      ];
    });
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.dishes && Array.isArray(parsed.dishes)) {
        if (confirm(`Будет импортировано ${parsed.dishes.length} блюд и ${parsed.recipes ? parsed.recipes.length : 0} рецептов. Текущие данные будут заменены. Продолжить?`)) {
          if (parsed.recipes) {
            localStorage.setItem('smartMenuRecipes_v1', JSON.stringify(parsed.recipes));
            RecipeStore.init();
          }
          DishStore.replaceAll(parsed.dishes);
          const view = Renderer.getCurrentView();
          const curDate = Renderer.getCurrentDate();
          Renderer.renderCalendar(view, curDate);
          alert('✅ Данные успешно импортированы!');
        }
      } else {
        alert('Некорректный файл. Ожидается объект с полями dishes и recipes.');
      }
    } catch (err) {
      alert('Ошибка при чтении файла: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ============================================================
// 7. ФУНКЦИИ ДЛЯ РЕЦЕПТОВ И СПИСКА ПОКУПОК
// ============================================================

// --- Отделы магазина ---
const DEPARTMENTS = {
  'Овощи': ['лук', 'морковь', 'картофель', 'капуста', 'свекла', 'редис', 'репа', 'огурец', 'помидор', 'перец', 'баклажан', 'кабачок', 'тыква', 'чеснок', 'зелень', 'петрушка', 'укроп', 'базилик', 'кинза', 'салат', 'шпинат', 'щавель', 'ревень', 'сельдерей'],
  'Фрукты, ягоды': ['яблоко', 'груша', 'айва', 'хурма', 'гранат', 'лимон', 'лайм', 'грейпфрут', 'мандарин', 'апельсин', 'клубника', 'малина', 'черника', 'ежевика', 'смородина', 'крыжовник', 'вишня', 'черешня', 'слива', 'абрикос', 'персик', 'нектарин', 'банан', 'киви', 'манго', 'ананас', 'арбуз', 'дыня', 'финик', 'инжир', 'курага', 'чернослив', 'изюм'],
  'Мясо, птица': ['говядина', 'свинина', 'баранина', 'телятина', 'курица', 'индейка', 'утка', 'гусь', 'кролик', 'фарш', 'печень', 'сердце', 'почки'],
  'Рыба, морепродукты': ['тунец', 'горбуша', 'лосось', 'форель', 'сёмга', 'кета', 'кижуч', 'треска', 'пикша', 'окунь', 'судак', 'щука', 'сом', 'налим', 'осётр', 'пангасиус', 'тилапия', 'дорада', 'сибас', 'ставрида', 'скумбрия', 'макрель', 'сельдь', 'шпроты', 'килька', 'креветки', 'мидии', 'кальмары', 'краб'],
  'Молочные продукты, яйца': ['молоко', 'сливки', 'сметана', 'йогурт', 'кефир', 'ряженка', 'творог', 'сыр', 'масло', 'маргарин', 'майонез', 'кетчуп', 'яйцо'],
  'Бакалея, крупы, макароны': ['рис', 'гречка', 'овсянка', 'перловка', 'пшено', 'кускус', 'булгур', 'макароны', 'паста', 'лапша', 'вермишель', 'спагетти', 'мука', 'сахар', 'дрожжи', 'разрыхлитель', 'сода'],
  'Специи, приправы': ['соль', 'перец', 'корица', 'ваниль', 'какао', 'шоколад', 'орегано', 'тимьян', 'розмарин', 'кориандр', 'тмин', 'кумин', 'паприка', 'куркума', 'имбирь', 'шафран', 'гвоздика', 'кардамон'],
  'Жиры, масла': ['оливковое масло', 'подсолнечное масло', 'сливочное масло'],
  'Напитки, жидкости': ['вода', 'бульон', 'вино', 'коньяк', 'ром', 'пиво', 'чай', 'кофе', 'компот', 'кисель', 'морс', 'квас', 'лимонад', 'сок', 'нектар'],
  'Грибы': ['гриб', 'шампиньон', 'белый гриб', 'подберёзовик', 'лисичка'],
  'Заготовки, сладости': ['варенье', 'джем', 'конфитюр', 'мёд', 'сироп', 'пастила', 'мармелад'],
  'Орехи, сухофрукты': ['орех', 'миндаль', 'фисташка', 'кешью', 'грецкий орех', 'фундук']
};

function classifyIngredient(ingredient) {
  const lower = ingredient.toLowerCase();
  for (const [department, keywords] of Object.entries(DEPARTMENTS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return department;
    }
  }
  return 'Прочее';
}

// --- Рецепты ---
function openRecipesModal() {
  document.getElementById('recipesOverlay').classList.add('active');
  renderRecipesList();
}

function closeRecipesModal() {
  document.getElementById('recipesOverlay').classList.remove('active');
}

function renderRecipesList() {
  const list = document.getElementById('recipesList');
  const recipes = RecipeStore.getAll();
  list.innerHTML = '';
  if (recipes.length === 0) {
    list.innerHTML = '<div class="modal-empty">😌 У вас пока нет рецептов. Нажмите «Добавить рецепт».</div>';
    return;
  }
  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';
  ul.style.margin = '0';
  recipes.forEach(recipe => {
    const li = document.createElement('li');
    li.style.padding = '10px 14px';
    li.style.borderBottom = '1px solid var(--cell-border)';
    li.style.cursor = 'pointer';
    li.style.transition = 'var(--transition-fast)';
    li.style.borderRadius = 'var(--radius-sm)';
    li.textContent = recipe.name;
    li.addEventListener('mouseenter', () => {
      li.style.background = 'var(--day-hover)';
    });
    li.addEventListener('mouseleave', () => {
      li.style.background = 'transparent';
    });
    li.addEventListener('click', () => {
      Renderer.showRecipeCard(recipe);
    });
    ul.appendChild(li);
  });
  list.appendChild(ul);
}

function openRecipeForm(recipeId = null) {
  const overlay = document.getElementById('recipeFormOverlay');
  const formId = document.getElementById('recipeFormId');
  const nameInput = document.getElementById('recipeName');
  const ingrInput = document.getElementById('recipeIngredients');
  const instrInput = document.getElementById('recipeInstructions');

  if (recipeId) {
    const recipe = RecipeStore.getById(recipeId);
    if (!recipe) return;
    formId.value = recipeId;
    nameInput.value = recipe.name;
    ingrInput.value = recipe.ingredients.join('\n');
    instrInput.value = recipe.instructions || '';
    document.getElementById('recipeFormTitle').textContent = '✎ Редактировать рецепт';
  } else {
    formId.value = '';
    nameInput.value = '';
    ingrInput.value = '';
    instrInput.value = '';
    document.getElementById('recipeFormTitle').textContent = '📝 Новый рецепт';
  }
  overlay.classList.add('active');
}

function closeRecipeForm() {
  document.getElementById('recipeFormOverlay').classList.remove('active');
}

function saveRecipeForm() {
  const id = document.getElementById('recipeFormId').value;
  const name = document.getElementById('recipeName').value.trim();
  const ingredients = document.getElementById('recipeIngredients').value.trim();
  const instructions = document.getElementById('recipeInstructions').value.trim();
  if (!name) { alert('Введите название рецепта'); return; }
  if (!ingredients) { alert('Введите ингредиенты'); return; }
  if (id) {
    RecipeStore.update(Number(id), name, ingredients, instructions);
  } else {
    RecipeStore.add(name, ingredients, instructions);
  }
  closeRecipeForm();
  renderRecipesList();
}

function parseRecipeTextFromForm() {
  const ingrText = document.getElementById('recipeIngredients').value;
  const result = Utils.parseRecipeText(ingrText);
  if (result.title) {
    document.getElementById('recipeName').value = result.title;
  }
  if (result.ingredients) {
    document.getElementById('recipeIngredients').value = result.ingredients;
  } else {
    alert('Не удалось распознать ингредиенты. Попробуйте вручную.');
  }
}

// --- Список покупок ---
function getSavedShoppingListKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('shoppingList_')) {
      keys.push(key);
    }
  }
  return keys.sort();
}

function openShoppingList() {
  document.getElementById('shoppingListOverlay').classList.add('active');
  document.getElementById('shoppingListDisplay').style.display = 'none';
  document.getElementById('savedListsContainer').style.display = 'block';
  renderSavedLists();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('shoppingDateFrom').value = Utils.formatDateLocal(today);
  document.getElementById('shoppingDateTo').value = Utils.formatDateLocal(tomorrow);
}

function closeShoppingList() {
  document.getElementById('shoppingListOverlay').classList.remove('active');
}

function renderSavedLists() {
  const container = document.getElementById('savedListsList');
  const keys = getSavedShoppingListKeys();
  container.innerHTML = '';
  if (keys.length === 0) {
    container.innerHTML = '<div class="modal-empty">😌 Нет сохранённых списков.</div>';
    return;
  }
  keys.forEach(key => {
    let label = '';
    if (key.startsWith('shoppingList_range_')) {
      const parts = key.replace('shoppingList_range_', '').split('_to_');
      if (parts.length === 2) {
        const from = new Date(parts[0]);
        const to = new Date(parts[1]);
        if (parts[0] === parts[1]) {
          label = Utils.formatDate(from);
        } else {
          label = `период ${Utils.formatDate(from)} — ${Utils.formatDate(to)}`;
        }
      }
    } else {
      const dateStr = key.replace('shoppingList_', '');
      label = Utils.formatDate(new Date(dateStr));
    }

    const item = document.createElement('div');
    item.className = 'saved-list-item';
    const dateSpan = document.createElement('span');
    dateSpan.className = 'list-date';
    dateSpan.textContent = label;
    item.appendChild(dateSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'list-delete';
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Удалить список';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm(`Удалить список "${label}"?`)) {
        localStorage.removeItem(key);
        renderSavedLists();
        document.getElementById('shoppingListDisplay').style.display = 'none';
        document.getElementById('savedListsContainer').style.display = 'block';
      }
    });
    item.appendChild(deleteBtn);

    item.addEventListener('click', function() {
      loadShoppingList(key);
    });

    container.appendChild(item);
  });
}

function loadShoppingList(key) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    alert('Список не найден');
    return;
  }
  let text = saved;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.groups) {
      let txt = '';
      const sorted = Object.keys(parsed.groups).sort();
      for (const dept of sorted) {
        txt += dept + ':\n';
        parsed.groups[dept].forEach(ing => {
          txt += '• ' + ing + '\n';
        });
        txt += '\n';
      }
      text = txt;
    }
  } catch(e) {}

  document.getElementById('savedListsContainer').style.display = 'none';
  const displayDiv = document.getElementById('shoppingListDisplay');
  displayDiv.style.display = 'block';

  const resultTextarea = document.getElementById('shoppingListResult');
  resultTextarea.value = text;

  let periodLabel = '';
  if (key.startsWith('shoppingList_range_')) {
    const parts = key.replace('shoppingList_range_', '').split('_to_');
    if (parts.length === 2) {
      const from = new Date(parts[0]);
      const to = new Date(parts[1]);
      if (parts[0] === parts[1]) {
        periodLabel = Utils.formatDate(from);
      } else {
        periodLabel = `${Utils.formatDate(from)} — ${Utils.formatDate(to)}`;
      }
    }
  } else {
    const dateStr = key.replace('shoppingList_', '');
    periodLabel = Utils.formatDate(new Date(dateStr));
  }

  const container = displayDiv;
  const textarea = document.getElementById('shoppingListResult');
  const oldHeader = container.querySelector('.list-header');
  if (oldHeader) oldHeader.remove();
  const newHeader = document.createElement('div');
  newHeader.className = 'list-header';
  newHeader.textContent = `📋 Список на ${periodLabel}`;
  newHeader.style.cssText = 'margin-bottom:8px;font-size:14px;color:var(--text-secondary);';
  container.insertBefore(newHeader, textarea);

  displayDiv.dataset.currentKey = key;
  document.getElementById('saveCurrentListBtn').style.display = 'none';
  document.getElementById('deleteCurrentListBtn').style.display = 'inline-block';
}

function generateShoppingList() {
  const fromDate = document.getElementById('shoppingDateFrom').value;
  const toDate = document.getElementById('shoppingDateTo').value;
  if (!fromDate || !toDate) {
    alert('Выберите обе даты периода');
    return;
  }
  if (fromDate > toDate) {
    alert('Дата "От" не может быть позже даты "До"');
    return;
  }

  let allDishes = [];
  let current = new Date(fromDate);
  const end = new Date(toDate);
  while (current <= end) {
    const dateStr = Utils.formatDateLocal(current);
    const dayDishes = DishStore.getForDate(dateStr);
    allDishes = allDishes.concat(dayDishes);
    current.setDate(current.getDate() + 1);
  }

  const items = [];
  allDishes.forEach(dish => {
    if (dish.recipeId) {
      const recipe = RecipeStore.getById(dish.recipeId);
      if (recipe) {
        recipe.ingredients.forEach(ing => {
          items.push(ing);
        });
      }
    }
  });

  if (items.length === 0) {
    alert('😌 За выбранный период нет блюд с рецептами.');
    return;
  }

  const grouped = {};
  items.forEach(ing => {
    const dept = classifyIngredient(ing);
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(ing);
  });

  let text = '';
  const sortedDepartments = Object.keys(grouped).sort();
  for (const dept of sortedDepartments) {
    text += dept + ':\n';
    grouped[dept].forEach(ing => {
      text += '• ' + ing + '\n';
    });
    text += '\n';
  }

  document.getElementById('savedListsContainer').style.display = 'none';
  const displayDiv = document.getElementById('shoppingListDisplay');
  displayDiv.style.display = 'block';

  const resultTextarea = document.getElementById('shoppingListResult');
  const periodLabel = fromDate === toDate ? Utils.formatDate(new Date(fromDate)) : `${Utils.formatDate(new Date(fromDate))} — ${Utils.formatDate(new Date(toDate))}`;
  const container = displayDiv;
  const oldHeader = container.querySelector('.list-header');
  if (oldHeader) oldHeader.remove();
  const newHeader = document.createElement('div');
  newHeader.className = 'list-header';
  newHeader.textContent = `📋 Предварительный список за ${periodLabel}`;
  newHeader.style.cssText = 'margin-bottom:8px;font-size:14px;color:var(--text-secondary);';
  container.insertBefore(newHeader, resultTextarea);

  resultTextarea.value = text;

  displayDiv.dataset.fromDate = fromDate;
  displayDiv.dataset.toDate = toDate;
  displayDiv.dataset.generatedGroups = JSON.stringify(grouped);

  document.getElementById('saveCurrentListBtn').style.display = 'inline-block';
  document.getElementById('deleteCurrentListBtn').style.display = 'none';
}

function saveCurrentList() {
  const displayDiv = document.getElementById('shoppingListDisplay');
  const fromDate = displayDiv.dataset.fromDate;
  const toDate = displayDiv.dataset.toDate;
  if (!fromDate || !toDate) {
    alert('Нет данных для сохранения. Сначала сгенерируйте список.');
    return;
  }

  const text = document.getElementById('shoppingListResult').value;
  if (!text.trim()) {
    alert('Список пуст, нечего сохранять.');
    return;
  }

  let key;
  if (fromDate === toDate) {
    key = `shoppingList_${fromDate}`;
  } else {
    key = `shoppingList_range_${fromDate}_to_${toDate}`;
  }

  localStorage.setItem(key, text);

  alert('✅ Список сохранён!');
  document.getElementById('shoppingListDisplay').style.display = 'none';
  document.getElementById('savedListsContainer').style.display = 'block';
  renderSavedLists();
  delete displayDiv.dataset.generatedGroups;
  delete displayDiv.dataset.fromDate;
  delete displayDiv.dataset.toDate;
  const header = displayDiv.querySelector('.list-header');
  if (header) header.remove();
}

function deleteCurrentList() {
  const displayDiv = document.getElementById('shoppingListDisplay');
  const key = displayDiv.dataset.currentKey;
  if (!key) return;
  if (!confirm(`Удалить этот список?`)) return;
  localStorage.removeItem(key);
  document.getElementById('shoppingListDisplay').style.display = 'none';
  document.getElementById('savedListsContainer').style.display = 'block';
  renderSavedLists();
}

function backToSavedLists() {
  document.getElementById('shoppingListDisplay').style.display = 'none';
  document.getElementById('savedListsContainer').style.display = 'block';
  renderSavedLists();
}

function exportShoppingListTxt() {
  const text = document.getElementById('shoppingListResult').value;
  if (!text.trim()) {
    alert('Нет текста для экспорта.');
    return;
  }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const now = new Date();
  a.download = `shopping_list_${Utils.formatDateLocal(now)}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function initShoppingListHandlers() {
  document.getElementById('generateShoppingListBtn').addEventListener('click', generateShoppingList);
  document.getElementById('saveCurrentListBtn').addEventListener('click', saveCurrentList);
  document.getElementById('deleteCurrentListBtn').addEventListener('click', deleteCurrentList);
  document.getElementById('backToSavedListsBtn').addEventListener('click', backToSavedLists);
  document.getElementById('exportShoppingListTxtBtn').addEventListener('click', exportShoppingListTxt);
}

// ============================================================
// 8. ИНИЦИАЛИЗАЦИЯ
// ============================================================
(function init() {
  RecipeStore.init();
  DishStore.init();

  // Приветствие
  function showWelcome() {
    const overlay = document.getElementById('welcomeOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlay.focus();
  }
  function hideWelcome() {
    const overlay = document.getElementById('welcomeOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  setTimeout(showWelcome, 300);
  document.getElementById('welcomeStartBtn').addEventListener('click', hideWelcome);

  // Тема: автоопределение по системе, если нет сохранённой
  let theme = localStorage.getItem('mealPlannerTheme');
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (theme === 'dark') document.body.classList.add('dark-theme');

  // Кнопка переключения темы
  document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('mealPlannerTheme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });

  // Поиск и фильтры
  document.getElementById('searchInput').addEventListener('input', function() {
    Renderer.setSearchQuery(this.value);
  });
  document.getElementById('statusFilter').addEventListener('change', function() {
    Renderer.setStatusFilter(this.value);
  });
  document.getElementById('categoryFilter').addEventListener('change', function() {
    Renderer.setCategoryFilter(this.value);
  });

  // Drag & Drop
  let draggedDishId = null, draggedFromDate = null;
  document.addEventListener('dragstart', function(e) {
    const target = e.target.closest('.meal-chip');
    if (!target) return;
    draggedDishId = Number(target.dataset.id);
    draggedFromDate = target.dataset.date;
    target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(draggedDishId));
  });
  document.addEventListener('dragend', function(e) {
    const target = e.target.closest('.meal-chip');
    if (target) target.classList.remove('dragging');
    document.querySelectorAll('.week-row.drag-over').forEach(row => row.classList.remove('drag-over'));
  });
  document.addEventListener('dragover', function(e) {
    const row = e.target.closest('.week-row');
    if (!row) return;
    e.preventDefault();
    row.classList.add('drag-over');
  });
  document.addEventListener('dragleave', function(e) {
    const row = e.target.closest('.week-row');
    if (row) row.classList.remove('drag-over');
  });
  document.addEventListener('drop', function(e) {
    const row = e.target.closest('.week-row');
    if (!row) return;
    e.preventDefault();
    row.classList.remove('drag-over');
    const targetDate = row.dataset.date;
    if (!targetDate || !draggedDishId || draggedFromDate === targetDate) {
      draggedDishId = null; draggedFromDate = null;
      return;
    }
    const dish = DishStore.getAll().find(d => d.id === draggedDishId);
    if (dish) {
      dish.date = targetDate;
      DishStore.invalidateCache();
      localStorage.setItem('smartMenuDishes_v5', JSON.stringify(DishStore.getAll()));
      const view = Renderer.getCurrentView();
      const curDate = Renderer.getCurrentDate();
      Renderer.renderCalendar(view, curDate);
    }
    draggedDishId = null; draggedFromDate = null;
  });

  // Навигация календаря
  const now = new Date();
  Renderer.setCurrentDate(now);
  Renderer.setCurrentView('month');
  Renderer.renderCalendar('month', now);

  document.getElementById('prevMonth').addEventListener('click', function() {
    const curDate = Renderer.getCurrentDate();
    const view = Renderer.getCurrentView();
    const newDate = new Date(curDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setDate(newDate.getDate() - 7);
    Renderer.setCurrentDate(newDate);
    Renderer.renderCalendar(view, newDate);
  });

  document.getElementById('nextMonth').addEventListener('click', function() {
    const curDate = Renderer.getCurrentDate();
    const view = Renderer.getCurrentView();
    const newDate = new Date(curDate);
    if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
    else newDate.setDate(newDate.getDate() + 7);
    Renderer.setCurrentDate(newDate);
    Renderer.renderCalendar(view, newDate);
  });

  document.getElementById('todayBtn').addEventListener('click', function() {
    const now = new Date();
    const view = Renderer.getCurrentView();
    Renderer.setCurrentDate(now);
    Renderer.renderCalendar(view, now);
  });

  document.querySelectorAll('#viewToggle button').forEach(btn => {
    btn.addEventListener('click', function() {
      const view = this.dataset.view;
      Renderer.setCurrentView(view);
      const curDate = Renderer.getCurrentDate();
      Renderer.renderCalendar(view, curDate);
    });
  });

  // Закрытие модалок по клику на оверлей и Escape
  const modals = [
    { overlay: document.getElementById('modalOverlay'), close: Renderer.closeModal },
    { overlay: document.getElementById('recOverlay'), close: Renderer.closeRecModal },
    { overlay: document.getElementById('addModalOverlay'), close: Renderer.closeAddModal },
    { overlay: document.getElementById('exportModalOverlay'), close: () => document.getElementById('exportModalOverlay').classList.remove('active') },
    { overlay: document.getElementById('choiceOverlay'), close: () => document.getElementById('choiceOverlay').classList.remove('active') },
    { overlay: document.getElementById('welcomeOverlay'), close: hideWelcome },
    { overlay: document.getElementById('recipesOverlay'), close: closeRecipesModal },
    { overlay: document.getElementById('recipeFormOverlay'), close: closeRecipeForm },
    { overlay: document.getElementById('shoppingListOverlay'), close: closeShoppingList }
  ];

  modals.forEach(({ overlay, close }) => {
    if (!overlay) return;
    overlay.addEventListener('click', function(e) {
      if (e.target === this) close();
    });
    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') close();
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active, .choice-overlay.active, .welcome-overlay.active');
      if (activeModal) {
        const id = activeModal.id;
        if (id === 'modalOverlay') Renderer.closeModal();
        else if (id === 'recOverlay') Renderer.closeRecModal();
        else if (id === 'addModalOverlay') Renderer.closeAddModal();
        else if (id === 'exportModalOverlay') document.getElementById('exportModalOverlay').classList.remove('active');
        else if (id === 'choiceOverlay') document.getElementById('choiceOverlay').classList.remove('active');
        else if (id === 'welcomeOverlay') hideWelcome();
        else if (id === 'recipesOverlay') closeRecipesModal();
        else if (id === 'recipeFormOverlay') closeRecipeForm();
        else if (id === 'shoppingListOverlay') closeShoppingList();
      }
    }
  });

  // Кнопки закрытия
  document.getElementById('modalClose').addEventListener('click', Renderer.closeModal);
  document.getElementById('recClose').addEventListener('click', Renderer.closeRecModal);
  document.getElementById('addModalClose').addEventListener('click', Renderer.closeAddModal);
  document.getElementById('addModalCancel').addEventListener('click', Renderer.closeAddModal);
  document.getElementById('exportModalClose').addEventListener('click', () => document.getElementById('exportModalOverlay').classList.remove('active'));
  document.getElementById('recipesClose').addEventListener('click', closeRecipesModal);
  document.getElementById('recipeFormClose').addEventListener('click', closeRecipeForm);
  document.getElementById('shoppingListClose').addEventListener('click', closeShoppingList);

  // "Что приготовить?"
  document.getElementById('suggestBtn').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.add('active');
  });
  document.getElementById('choiceClose').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.remove('active');
  });
  document.getElementById('choiceFromMenu').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.remove('active');
    Renderer.showCategorySelection();
  });
  document.getElementById('choiceFromTaste').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.remove('active');
    const random = DishStore.getRandomDishFromTaste();
    const answer = `🍽️ ${random.categoryLabel}\n\n${random.name}\n\nХотите добавить его в план на завтра?`;
    if (confirm(answer)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = Utils.formatDateLocal(tomorrow);
      DishStore.addDish(random.name, STATUSES.PLANNED, dateStr, random.category, false, '');
      const view = Renderer.getCurrentView();
      const curDate = Renderer.getCurrentDate();
      Renderer.renderCalendar(view, curDate);
      alert(`✅ Блюдо "${random.name}" добавлено в план на завтра (${Utils.formatDate(tomorrow)})`);
    }
  });
  document.getElementById('choiceFromRecipes').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.remove('active');
    openRecipesModal();
  });

  document.getElementById('favoritesBtn').addEventListener('click', Renderer.openFavorites);
  document.getElementById('recipesBtn').addEventListener('click', openRecipesModal);
  document.getElementById('shoppingListBtn').addEventListener('click', openShoppingList);

  // Добавление блюда
  document.getElementById('addDishBtn').addEventListener('click', Renderer.openAddModal);
  document.getElementById('addModalSave').addEventListener('click', function() {
    const nameInput = document.getElementById('newDishName');
    const noteInput = document.getElementById('newDishNote');
    const dateInput = document.getElementById('newDishDate');
    const statusSelect = document.getElementById('newDishStatus');
    const categorySelect = document.getElementById('newDishCategory');
    const name = nameInput.value.trim();
    if (!name) { alert('Введи название блюда'); return; }
    let date = dateInput.value;
    if (!date) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      date = Utils.formatDateLocal(d);
    }
    const note = noteInput.value.trim();
    DishStore.addDish(name, statusSelect.value, date, categorySelect.value, false, note);
    Renderer.closeAddModal();
    const view = Renderer.getCurrentView();
    const curDate = Renderer.getCurrentDate();
    Renderer.renderCalendar(view, curDate);
    nameInput.value = '';
    noteInput.value = '';
  });

  // Экспорт
  document.getElementById('exportBtn').addEventListener('click', function() {
    document.getElementById('exportModalOverlay').classList.add('active');
  });
  document.querySelectorAll('.export-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const format = this.dataset.format;
      document.getElementById('exportModalOverlay').classList.remove('active');
      exportData(format);
    });
  });

  // Импорт
  document.getElementById('importBtn').addEventListener('click', function() {
    document.getElementById('importFileInput').click();
  });
  document.getElementById('importFileInput').addEventListener('change', function(e) {
    if (this.files && this.files.length > 0) {
      importData(this.files[0]);
      this.value = '';
    }
  });

  // Рецепты
  document.getElementById('addRecipeBtn').addEventListener('click', function() {
    openRecipeForm(null);
  });
  document.getElementById('recipeFormCancel').addEventListener('click', closeRecipeForm);
  document.getElementById('recipeFormSave').addEventListener('click', saveRecipeForm);
  document.getElementById('recipeParseBtn').addEventListener('click', parseRecipeTextFromForm);

  // Список покупок
  initShoppingListHandlers();

  // Свайпы
  let touchStartX = 0, touchEndX = 0;
  const wrap = document.getElementById('calendarWrap');
  wrap.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      const curDate = Renderer.getCurrentDate();
      const view = Renderer.getCurrentView();
      const newDate = new Date(curDate);
      if (view === 'month') newDate.setMonth(newDate.getMonth() + (diff > 0 ? 1 : -1));
      else newDate.setDate(newDate.getDate() + (diff > 0 ? 7 : -7));
      Renderer.setCurrentDate(newDate);
      Renderer.renderCalendar(view, newDate);
    }
  }, { passive: true });

  let mouseDown = false, mouseStartX = 0;
  wrap.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseStartX = e.screenX;
  });
  window.addEventListener('mouseup', (e) => {
    if (mouseDown) {
      const diff = mouseStartX - e.screenX;
      if (Math.abs(diff) > 50) {
        const curDate = Renderer.getCurrentDate();
        const view = Renderer.getCurrentView();
        const newDate = new Date(curDate);
        if (view === 'month') newDate.setMonth(newDate.getMonth() + (diff > 0 ? 1 : -1));
        else newDate.setDate(newDate.getDate() + (diff > 0 ? 7 : -7));
        Renderer.setCurrentDate(newDate);
        Renderer.renderCalendar(view, newDate);
      }
      mouseDown = false;
    }
  });

  console.log('✅ Планировщик меню готов!');
  console.log('📖 Рецепты отображаются списком, клик по названию открывает карточку.');
  console.log('🔄 В недельном виде есть подсказка о перетаскивании блюд.');
  console.log('🌓 Тема определяется автоматически по настройкам системы.');
})();
