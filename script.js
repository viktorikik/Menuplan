// ============================================================
// 1. УТИЛИТЫ
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
    if (lower.includes('суп') || lower.includes('борщ') || lower.includes('пюре') || lower.includes('бульон')) return 'soup';
    if (lower.includes('салат') || lower.includes('винегрет') || lower.includes('овощ') || lower.includes('зелень')) return 'salad';
    if (lower.includes('котлет') || lower.includes('запекан') || lower.includes('тушен') ||
        lower.includes('колбас') || lower.includes('жарен') || lower.includes('печень') ||
        lower.includes('мясо') || lower.includes('курин') || lower.includes('индей') ||
        lower.includes('рыб') || lower.includes('бифштекс') || lower.includes('стейк') ||
        lower.includes('паста') || lower.includes('макарон') || lower.includes('греч') ||
        lower.includes('рис') || lower.includes('плов') || lower.includes('картош') ||
        lower.includes('каш')) return 'main';
    return 'other';
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
  }
};

// ============================================================
// 2. ХРАНИЛИЩЕ ДАННЫХ
// ============================================================
const DishStore = (function() {
  const STORAGE_KEY = 'smartMenuDishes_v5';
  let dishes = [];
  let cacheUnique = null;
  let cacheRecs = null;
  let cacheAllWithDone = null;

  const DEFAULT_DISHES = [
    { name: 'Гороховый суп', status: 'done', date: '2026-08-24', category: 'soup', note: '' },
    { name: 'Запеканка из фарша и овощей', status: 'done', date: '2026-08-25', category: 'main', note: 'можно добавить сыр' },
    { name: 'Колбаски и запеченая картошка', status: 'done', date: '2026-08-26', category: 'main', note: '' },
    { name: 'Плов', status: 'planned', date: '2026-08-28', category: 'main', note: 'использовать баранину' },
    { name: 'Салат с крабовыми палочками', status: 'planned', date: '2026-08-28', category: 'salad', note: '' },
    { name: 'Суп борщ?', status: 'planned', date: '2026-08-31', category: 'soup', note: '' },
    { name: 'Котлеты с картофельным пюре', status: 'planned', date: '2026-09-01', category: 'main', note: '' },
    { name: 'Салат морковь по-корейски', status: 'planned', date: '2026-09-01', category: 'salad', note: '' },
    { name: 'Печень и перловка', status: 'planned', date: '2026-09-02', category: 'main', note: '' },
    { name: 'Мясо по-французски', status: 'planned', date: '2026-09-03', category: 'main', note: '' },
    { name: 'Морская капуста с крабовыми палочками', status: 'planned', date: '2026-09-04', category: 'salad', note: '' },
    { name: 'Суп с сайрой', status: 'planned', date: '2026-09-07', category: 'soup', note: '' },
    { name: 'Тушеная капуста', status: 'planned', date: '2026-09-08', category: 'main', note: '' },
    { name: 'Запеченные куриные ножки', status: 'planned', date: '2026-09-09', category: 'main', note: '' },
    { name: 'Фунчоза', status: 'planned', date: '2026-09-09', category: 'main', note: '' },
    { name: 'Удон', status: 'planned', date: '2026-09-10', category: 'main', note: '' },
    { name: 'Паста Болоньезе', status: 'planned', date: '2026-09-12', category: 'main', note: 'сделать с фаршем индейки' },
  ];

  const TASTE_DISHES = {
    soup: ['Борщ', 'Солянка', 'Уха', 'Щи', 'Сырный суп', 'Гороховый суп', 'Рассольник', 'Окрошка'],
    main: ['Картофельное пюре с котлетой', 'Пельмени', 'Манты', 'Гречка с мясом', 'Голубцы', 'Жаркое', 'Макароны по-флотски', 'Плов'],
    salad: ['Селедка под шубой', 'Оливье', 'Крабовый', 'Цезарь с курицей', 'Мимоза', 'Винегрет', 'Греческий салат', 'Салат из свежих овощей']
  };

  function generateId() { return Date.now() + Math.random() * 10000; }

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          dishes = parsed;
          let needSave = false;
          dishes.forEach(d => {
            if (!d.category) { d.category = Utils.guessCategory(d.name); needSave = true; }
            if (!d.note) { d.note = ''; needSave = true; }
          });
          if (needSave) save();
          return true;
        }
      }
    } catch (e) { console.warn('Ошибка загрузки данных:', e); }
    return false;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
      cacheUnique = null; cacheRecs = null; cacheAllWithDone = null;
    } catch (e) { console.error('Ошибка сохранения данных:', e); }
  }

  function init() {
    if (!load()) {
      const result = DEFAULT_DISHES.map((d, i) => ({ ...d, id: generateId() + i, liked: false }));
      const noDate = [
        { name: 'Салат с морской капустой и крабовым мясом', category: 'salad', note: '' },
        { name: 'Гречка и салат из свежей капусты как в столовой', category: 'main', note: '' },
        { name: 'Суп-пюре из кабачков', category: 'soup', note: 'можно добавить сливки' }
      ];
      const today = new Date();
      noDate.forEach((item, idx) => {
        const d = new Date(today);
        d.setDate(d.getDate() + 7 + idx);
        result.push({
          id: generateId() + 1000 + idx,
          name: item.name,
          status: 'planned',
          date: Utils.formatDateLocal(d),
          category: item.category,
          liked: false,
          note: item.note || ''
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

  function addDish(name, status, date, category, liked = false, note = '') {
    if (!name || !status || !date || !category) return false;
    const id = generateId();
    dishes.push({ id, name, status, date, category, liked, note });
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
    dish.status = dish.status === 'done' ? 'planned' : 'done';
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
      const doneEntries = dishes.filter(d => d.name === name && d.status === 'done');
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
    const doneDishes = dishes.filter(d => d.status === 'done');
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
  function replaceAll(newDishes) { dishes = newDishes; save(); invalidateCache(); }
  function getRandomDishFromTaste() {
    const categories = ['soup', 'main', 'salad'];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const list = TASTE_DISHES[cat];
    const name = list[Math.floor(Math.random() * list.length)];
    const categoryNames = { soup: '🍲 Суп', main: '🍖 Основное', salad: '🥗 Салат' };
    return { name, category: cat, categoryLabel: categoryNames[cat] };
  }

  return {
    init, editDishName, updateNote, getAll, getForDate, addDish, removeDish,
    toggleStatus, toggleLike, getAllUniqueWithLastDone,
    getRecommendations, getFavorites, invalidateCache, replaceAll,
    getRandomDishFromTaste
  };
})();

// ============================================================
// 3. РЕНДЕРЕР
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
  const modalDate = document.getElementById('modalDate');
  const modalContent = document.getElementById('modalContent');
  const recOverlay = document.getElementById('recOverlay');
  const recTitle = document.getElementById('recTitle');
  const recContent = document.getElementById('recContent');

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
      const hasDone = dayDishes.some(d => d.status === 'done');
      const hasPlanned = dayDishes.some(d => d.status === 'planned');
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
          chip.draggable = true;
          chip.dataset.id = dish.id;
          chip.dataset.date = dateStr;
          chip.addEventListener('click', (e) => {
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
        if (dish.category === 'soup') categoryClass = 'category-soup';
        else if (dish.category === 'salad') categoryClass = 'category-salad';
        else if (dish.category === 'main') categoryClass = 'category-main';
        const item = document.createElement('div');
        item.className = `menu-item ${dish.status} ${categoryClass}`;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = dish.name;
        item.appendChild(nameSpan);
        const badge = document.createElement('span');
        badge.className = 'status-badge';
        badge.textContent = dish.status === 'done' ? '✅' : '📅';
        item.appendChild(badge);
        group.appendChild(item);
      });
      menuContent.appendChild(group);
    });
  }

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
        const dishDiv = document.createElement('div');
        dishDiv.className = `modal-dish ${dish.status}`;
        if (dish.liked) dishDiv.classList.add('liked');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'dish-name';
        nameSpan.textContent = dish.name;
        dishDiv.appendChild(nameSpan);
        const actions = document.createElement('div');
        actions.className = 'dish-actions';
        const statusSpan = document.createElement('span');
        statusSpan.className = 'dish-status';
        statusSpan.textContent = dish.status === 'done' ? '✅ Готовила' : '📅 Планирую';
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
        section.appendChild(dishDiv);
      });
    }
    modalContent.appendChild(section);

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
    ['planned','done'].forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val === 'planned' ? '📅 Планирую' : '✅ Готовила';
      statusSelect.appendChild(opt);
    });
    addForm.appendChild(statusSelect);

    const categorySelect = document.createElement('select');
    categorySelect.id = 'modalNewDishCategory';
    categorySelect.className = 'modal-field-select field-half';
    [
      { val: 'soup', label: '🍲 Суп' },
      { val: 'salad', label: '🥗 Салат' },
      { val: 'main', label: '🍖 Основное' },
      { val: 'other', label: '🍽️ Другое' }
    ].forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.val;
      opt.textContent = cat.label;
      categorySelect.appendChild(opt);
    });
    addForm.appendChild(categorySelect);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Добавить';
    addBtn.className = 'field-btn';
    addForm.appendChild(addBtn);

    addSection.appendChild(addForm);

    const suggestTitle = document.createElement('h4');
    suggestTitle.textContent = '📖 Выбрать из меню';
    suggestTitle.style.marginTop = '12px';
    addSection.appendChild(suggestTitle);

    const suggestList = document.createElement('div');
    suggestList.className = 'modal-suggest-list';
    const allUnique = DishStore.getAllUniqueWithLastDone();
    const existingNames = dayDishes.map(d => d.name);
    const available = allUnique.filter(item => !existingNames.includes(item.name));
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
          DishStore.addDish(name, 'planned', dateStr, category, false, '');
          openModal(dateStr);
          renderCalendar(currentView, currentDate);
        });
        suggestList.appendChild(suggestItem);
      });
    }
    addSection.appendChild(suggestList);
    modalContent.appendChild(addSection);

    addBtn.addEventListener('click', function() {
      const name = nameInput.value.trim();
      if (!name) { alert('Введи название блюда'); return; }
      const status = statusSelect.value;
      const category = categorySelect.value;
      const note = document.getElementById('modalNewDishNote').value.trim();
      DishStore.addDish(name, status, dateStr, category, false, note);
      openModal(dateStr);
      renderCalendar(currentView, currentDate);
      nameInput.value = '';
      document.getElementById('modalNewDishNote').value = '';
    });

    modalOverlay.classList.add('active');
  }

  function closeModal() { modalOverlay.classList.remove('active'); }

  function openRecommendations() {
    recTitle.textContent = '🍽️ Рекомендации';
    const { liked, others } = DishStore.getRecommendations();
    recContent.innerHTML = '';
    if (liked.length === 0 && others.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'modal-empty';
      empty.textContent = '😌 Нет блюд в истории. Добавьте несколько блюд, и я буду предлагать!';
      recContent.appendChild(empty);
    } else {
      if (liked.length > 0) {
        const section = document.createElement('div');
        section.className = 'rec-section';
        const title = document.createElement('h4');
        title.textContent = '❤️ Давно не готовили любимое блюдо';
        section.appendChild(title);
        liked.forEach(item => {
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
            DishStore.addDish(name, 'planned', dateStr, category, false, '');
            recOverlay.classList.remove('active');
            alert(`✅ Блюдо "${name}" добавлено в план на завтра (${Utils.formatDate(tomorrow)})`);
            renderCalendar(currentView, currentDate);
          });
          section.appendChild(row);
        });
        recContent.appendChild(section);
      }
      if (others.length > 0) {
        const section = document.createElement('div');
        section.className = 'rec-section';
        const title = document.createElement('h4');
        title.textContent = '🍽️ Другие давние блюда';
        section.appendChild(title);
        others.forEach(item => {
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
            DishStore.addDish(name, 'planned', dateStr, category, false, '');
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
    recOverlay.classList.add('active');
  }

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
          DishStore.addDish(name, 'planned', dateStr, category, false, '');
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
  }

  function closeRecModal() { recOverlay.classList.remove('active'); }

  function openAddModal() {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    document.getElementById('newDishDate').value = Utils.formatDateLocal(defaultDate);
    document.getElementById('newDishName').value = '';
    document.getElementById('newDishNote').value = '';
    document.getElementById('newDishStatus').value = 'planned';
    document.getElementById('newDishCategory').value = 'main';
    document.getElementById('addModalOverlay').classList.add('active');
  }
  function closeAddModal() { document.getElementById('addModalOverlay').classList.remove('active'); }

  function setSearchQuery(q) { searchQuery = q; renderMenu(); }
  function setStatusFilter(f) { statusFilter = f; renderMenu(); }
  function setCategoryFilter(f) { categoryFilter = f; renderMenu(); }

  return {
    renderCalendar, renderMenu, openModal, closeModal, openRecommendations,
    openFavorites, closeRecModal, openAddModal, closeAddModal,
    setSearchQuery, setStatusFilter, setCategoryFilter,
    getCurrentDate: () => currentDate,
    getCurrentView: () => currentView,
    setCurrentDate: (d) => { currentDate = d; },
    setCurrentView: (v) => { currentView = v; }
  };
})();

// ============================================================
// 4. ЭКСПОРТ / ИМПОРТ
// ============================================================
function exportData(format) {
  const data = DishStore.getAll();
  if (!data.length) { alert('Нет данных для экспорта.'); return; }

  if (format === 'json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } else if (format === 'csv') {
    const headers = ['Название', 'Статус', 'Дата', 'Категория', 'Заметка', 'Любимое'];
    const rows = data.map(d => [
      d.name,
      d.status === 'done' ? 'Готовила' : 'Планирую',
      d.date,
      d.category,
      d.note || '',
      d.liked ? 'Да' : 'Нет'
    ]);
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
      if (!Array.isArray(parsed)) { alert('Некорректный файл. Ожидается массив блюд.'); return; }
      if (parsed.length && (!parsed[0].name || !parsed[0].date)) {
        alert('Файл не соответствует формату данных меню.');
        return;
      }
      if (confirm(`Будет импортировано ${parsed.length} блюд. Текущие данные будут заменены. Продолжить?`)) {
        parsed.forEach(d => {
          if (!d.category) d.category = Utils.guessCategory(d.name);
          if (!d.note) d.note = '';
          if (d.liked === undefined) d.liked = false;
          if (!d.id) d.id = Date.now() + Math.random() * 10000 + Math.floor(Math.random() * 1000);
        });
        DishStore.replaceAll(parsed);
        const view = Renderer.getCurrentView();
        const curDate = Renderer.getCurrentDate();
        Renderer.renderCalendar(view, curDate);
        alert('✅ Данные успешно импортированы!');
      }
    } catch (err) {
      alert('Ошибка при чтении файла: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ============================================================
// 5. ИМПОРТ ПО ССЫЛКЕ
// ============================================================
function openUrlImport() {
  document.getElementById('urlImportOverlay').classList.add('active');
  document.getElementById('recipeUrlInput').value = '';
  document.getElementById('urlImportStatus').innerHTML = '';
  document.getElementById('parsedRecipeContainer').innerHTML = '';
}

function closeUrlImport() {
  document.getElementById('urlImportOverlay').classList.remove('active');
}

async function fetchRecipeFromUrl(url) {
  const statusDiv = document.getElementById('urlImportStatus');
  const container = document.getElementById('parsedRecipeContainer');
  const fetchBtn = document.getElementById('fetchRecipeBtn');

  statusDiv.innerHTML = '';
  container.innerHTML = '';
  fetchBtn.disabled = true;
  fetchBtn.textContent = '⏳ Загрузка...';

  try {
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isVK = url.includes('vk.com') || url.includes('vk.ru');
    const isTelegram = url.includes('t.me') || url.includes('telegram.org');
    const isInstagram = url.includes('instagram.com') || url.includes('instagr.am');
    const isPinterest = url.includes('pinterest.com') || url.includes('pinterest.ru') || url.includes('pin.it');
    const isZen = url.includes('zen.yandex.ru') || url.includes('dzen.ru');
    const isIamCook = url.includes('iamcook.ru') || url.includes('m.iamcook.ru');
    const isVKVideo = isVK && (url.includes('/video') || url.includes('/clip') || url.includes('video-'));

    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error('Не удалось загрузить страницу. Проверьте ссылку.');
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let title = '';
    let ingredients = [];
    let sourceType = '';
    let content = '';

    // ===== IAMCOOK =====
    if (isIamCook) {
      sourceType = '🍳 iamcook.ru';
      const titleEl = doc.querySelector('h1.recipe-title, h1.title, .recipe-header h1, h1');
      if (titleEl) title = titleEl.textContent.trim();
      if (!title) {
        const ogTitle = doc.querySelector('meta[property="og:title"]');
        if (ogTitle) title = ogTitle.getAttribute('content') || '';
      }

      const ingredientSelectors = [
        '.ingredients-list li', '.ingredients li', '.recipe-ingredients li',
        '.ingredient-item', '.ingredient', 'ul.ingredients li',
        '.ingredients-list__item', '.recipe__ingredients li', '[class*="ingredient"] li'
      ];

      for (const selector of ingredientSelectors) {
        const items = doc.querySelectorAll(selector);
        if (items.length > 0) {
          items.forEach(el => {
            const text = el.textContent.trim();
            if (text && text.length > 1) {
              const clean = text.replace(/[×х]/g, '').trim();
              if (clean.length > 1) ingredients.push(clean);
            }
          });
          if (ingredients.length > 2) break;
        }
      }

      if (ingredients.length === 0) {
        const sections = doc.querySelectorAll('.recipe-content, .recipe-text, .content, .recipe, .post-content, article');
        for (const section of sections) {
          const text = section.textContent;
          const match = text.match(/ингредиенты\s*[:;]\s*([^]+?)(?:приготовление|способ|пошагово|шаг|процесс|рецепт|спос)/i);
          if (match && match[1]) {
            const ingredientText = match[1];
            const lines = ingredientText.split(/[\n,;]/).map(l => l.trim()).filter(l => l.length > 2);
            const filtered = lines.filter(l => /\d/.test(l) || /гр|г|мл|л|кг|шт|ст\.|ч\.|зуб|пуч|ветк|головк|лук|морк|картоф|масл|соль|перец|сахар|мук|яйц|молок|сливк|сметан|майонез|кетчуп|соус|уксус|лимон|чеснок|зелень|петрушк|укроп|базилик|тимьян|розмарин|орегано|кориц|ванил|какао|шоколад|орех|миндал|фисташк|кешью|изюм|кураг|чернослив|инжир|мед|сироп|варенье|джем|конфитюр|пастил|мармелад|зефир|безе|меренг|суфле|мусс|крем|глазурь|помадк|карамел|ирис|тянучк|грильяж|пралине|нуга|халв|козинак|печенье|пряник|коврижк|корж|бисквит|рулет|пирожн|торт|кекс|маффин|капкейк|пончик|оладь|блин|сырник|ватрушк|шарлотк|пахлав|наполеон|медовик|сметанник|морковник|ореховик|шоколадник|клубничн|малин|чернич|ежевич|смородин|крыжовник|вишн|черешн|слив|абрикос|персик|нектарин|банан|яблок|груш|айв|хурм|гранат|цитрус|лимон|лайм|грейпфрут|мандарин|апельсин|помело|свити|кумкват|бергамот|памела|унаби|зизифус|джуджуба|финик|кокос|манго|папай|маракуй|питахай|дуриан|джекфрут|личе|рамбутан|лангуст|мангостин|саподилл|чику|канистел|лукум|хала|баге|бриош|круассан|булочк|пирожк|расстегай|кулебяк|курник|каравай|калач|баранк|сушк|сухар|гренк|панцер|шницель|отбивн|эскалоп|медальон|рагу|жульен|фондю|раклет|тост|канапе|тарталетк|волован|корзиночк|павлов|тирамису|паннакот|крем-брюле|флан|пудинг|запеканк|суфле|мусс|парфе|сорбет|шербет|гранит|фраппе|коктейль|смузи|компот|кисель|узвар|морс|квас|лимонад|швепс|тоник|кола|пепси|спрайт|фанта|миринда|газировк|минералк|вод|сок|нектар|напитк|чай|кофе|какао|горячий|шоколад|глинтвейн|сбитень|медовух|квас|сидр|пиво/i.test(l));
            ingredients = filtered.slice(0, 20);
            break;
          }
        }
      }

      ingredients = ingredients
        .map(i => i.replace(/^[•\-*\d.]+\s*/, '').trim())
        .filter((v, i, a) => a.indexOf(v) === i && v.length > 2)
        .slice(0, 20);

      if (ingredients.length === 0) {
        ingredients = ['Ингредиенты не найдены. Попробуйте добавить их в заметку вручную.'];
      }

      if (title && title.length > 60) title = title.substring(0, 57) + '...';
    }

    // ===== VK КЛИПЫ =====
    else if (isVK && isVKVideo) {
      sourceType = '🎬 ВК Клип';
      const pageTitle = doc.querySelector('title');
      if (pageTitle) {
        let rawTitle = pageTitle.textContent.trim();
        rawTitle = rawTitle.replace(/\s*[|]\s*ВКонтакте\s*$/i, '');
        rawTitle = rawTitle.replace(/\s*[|]\s*VK\s*$/i, '');
        title = rawTitle;
      }

      const descSelectors = [
        '.video_description', '.clip_description', '.video-desc', '.clip-desc',
        '[class*="video_description"]', '[class*="clip_description"]',
        '.video-description', '.clip-description'
      ];

      for (const selector of descSelectors) {
        const el = doc.querySelector(selector);
        if (el && el.textContent.trim().length > 5) {
          content = el.textContent.trim();
          break;
        }
      }

      if (!content) {
        const metaDesc = doc.querySelector('meta[name="description"]');
        if (metaDesc) content = metaDesc.getAttribute('content') || '';
      }
      if (!content) {
        const ogDesc = doc.querySelector('meta[property="og:description"]');
        if (ogDesc) content = ogDesc.getAttribute('content') || '';
      }

      if (content && content.length > 10) {
        const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const productKeywords = [
          'грамм', 'гр', 'мл', 'литр', 'кг', 'ст.', 'ч.', 'шт', 'зуб', 'пуч',
          'лук', 'морковь', 'картофель', 'масло', 'соль', 'перец', 'сахар', 'мука',
          'яйцо', 'молоко', 'сливки', 'сметана', 'майонез', 'кетчуп', 'соус',
          'уксус', 'лимон', 'чеснок', 'зелень', 'петрушка', 'укроп', 'базилик'
        ];

        let found = false;
        for (const line of lines) {
          const hasNumber = /\d+/.test(line);
          const hasUnit = /(грамм|гр|мл|литр|кг|ст\.|ч\.|шт|зуб|пуч)/i.test(line);
          const hasProduct = productKeywords.some(word => line.toLowerCase().includes(word));
          const hasMarker = /^[•\-*]\s*/.test(line);

          if ((hasNumber && (hasUnit || hasProduct)) || (hasMarker && hasProduct)) {
            if (line.length > 3 && line.length < 80) {
              ingredients.push(line);
              found = true;
            }
          }
        }

        if (!found) {
          const numLines = lines.filter(l => /\d/.test(l) && l.length < 80 && l.length > 3);
          if (numLines.length > 0) {
            ingredients = numLines.slice(0, 15);
            found = true;
          }
        }

        if (!found) {
          ingredients = ['Ингредиенты не найдены в описании клипа. Добавьте их в заметку вручную.'];
        }
      } else {
        ingredients = ['Для клипов ВК ингредиенты обычно указываются в описании. Попробуйте открыть клип в приложении и скопировать описание.'];
      }

      ingredients = ingredients.filter((v, i, a) => a.indexOf(v) === i).slice(0, 20);
      if (title && title.length > 60) title = title.substring(0, 57) + '...';
    }

    // ===== ОСТАЛЬНЫЕ ПЛАТФОРМЫ =====
    else {
      if (isYouTube) {
        sourceType = '🎬 YouTube';
        const pageTitle = doc.querySelector('title');
        if (pageTitle) {
          let rawTitle = pageTitle.textContent.trim();
          rawTitle = rawTitle.replace(/\s*[-–]\s*YouTube\s*$/i, '');
          rawTitle = rawTitle.replace(/^YouTube\s*[-–]\s*/, '');
          title = rawTitle;
        }
        let description = '';
        const metaDesc = doc.querySelector('meta[name="description"]');
        if (metaDesc) description = metaDesc.getAttribute('content') || '';
        if (description) {
          const lines = description.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          const numLines = lines.filter(l => /\d/.test(l) && l.length < 100 && l.length > 3);
          if (numLines.length > 0) ingredients = numLines.slice(0, 15);
        }
        if (ingredients.length === 0) {
          ingredients = ['Ингредиенты не найдены в описании видео. Добавьте их в заметку вручную.'];
        }
      } else if (isTelegram) {
        sourceType = '📱 Telegram';
        const pageTitle = doc.querySelector('title');
        if (pageTitle) {
          let rawTitle = pageTitle.textContent.trim();
          rawTitle = rawTitle.replace(/\s*[|]\s*Telegram\s*$/i, '');
          title = rawTitle;
        }
        const contentSelectors = ['.tgme_widget_message_text', '.tgme_msg_text', '.tgme_message_text', '.tgme_widget_message_content .text'];
        for (const selector of contentSelectors) {
          const el = doc.querySelector(selector);
          if (el && el.textContent.trim().length > 20) {
            content = el.textContent.trim();
            break;
          }
        }
        if (content) {
          const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          const numLines = lines.filter(l => /\d/.test(l) && l.length < 80 && l.length > 3);
          if (numLines.length > 0) ingredients = numLines.slice(0, 15);
        }
        if (ingredients.length === 0) {
          ingredients = ['Ингредиенты не найдены в тексте поста. Добавьте их в заметку вручную.'];
        }
      } else if (isInstagram) {
        sourceType = '📸 Instagram';
        const pageTitle = doc.querySelector('title');
        if (pageTitle) {
          let rawTitle = pageTitle.textContent.trim();
          rawTitle = rawTitle.replace(/\s*[|]\s*Instagram\s*$/i, '');
          title = rawTitle;
        }
        let description = '';
        const metaDesc = doc.querySelector('meta[name="description"]');
        if (metaDesc) description = metaDesc.getAttribute('content') || '';
        if (description) {
          const lines = description.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          const numLines = lines.filter(l => /\d/.test(l) && l.length < 80 && l.length > 3);
          if (numLines.length > 0) ingredients = numLines.slice(0, 15);
        }
        if (ingredients.length === 0) {
          ingredients = ['Ингредиенты не найдены в описании. Добавьте их в заметку вручную.'];
        }
      } else if (isPinterest) {
        sourceType = '📌 Pinterest';
        const pageTitle = doc.querySelector('title');
        if (pageTitle) {
          let rawTitle = pageTitle.textContent.trim();
          rawTitle = rawTitle.replace(/\s*[|]\s*Pinterest\s*$/i, '');
          title = rawTitle;
        }
        let description = '';
        const metaDesc = doc.querySelector('meta[name="description"]');
        if (metaDesc) description = metaDesc.getAttribute('content') || '';
        if (description) {
          const lines = description.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          const numLines = lines.filter(l => /\d/.test(l) && l.length < 80 && l.length > 3);
          if (numLines.length > 0) ingredients = numLines.slice(0, 15);
        }
        if (ingredients.length === 0) {
          ingredients = ['Ингредиенты не найдены в описании. Добавьте их в заметку вручную.'];
        }
      } else if (isZen) {
        sourceType = '📝 Яндекс.Дзен';
        const pageTitle = doc.querySelector('title');
        if (pageTitle) {
          let rawTitle = pageTitle.textContent.trim();
          rawTitle = rawTitle.replace(/\s*[|]\s*Дзен\s*$/i, '');
          rawTitle = rawTitle.replace(/\s*[|]\s*Яндекс\s*Дзен\s*$/i, '');
          title = rawTitle;
        }
        const contentSelectors = ['.article-body', '.article-content', '.text-block', '.content-block', 'article .text'];
        for (const selector of contentSelectors) {
          const el = doc.querySelector(selector);
          if (el && el.textContent.trim().length > 50) {
            content = el.textContent.trim();
            break;
          }
        }
        if (content) {
          const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          const numLines = lines.filter(l => /\d/.test(l) && l.length < 80 && l.length > 3);
          if (numLines.length > 0) ingredients = numLines.slice(0, 15);
        }
        if (ingredients.length === 0) {
          ingredients = ['Ингредиенты не найдены в статье. Добавьте их в заметку вручную.'];
        }
      } else {
        // Обычный сайт
        sourceType = '🌐 Сайт';
        const titleSelectors = [
          'h1[itemprop="name"]', '.recipe-title', '.recipe-header h1',
          'h1.recipe__title', '.recipe-name', '.title', 'article h1',
          '.recipe h1', '.post-title', 'h1.entry-title', 'h1'
        ];
        for (const selector of titleSelectors) {
          const el = doc.querySelector(selector);
          if (el && el.textContent.trim()) {
            title = el.textContent.trim();
            break;
          }
        }
        if (!title) {
          const ogTitle = doc.querySelector('meta[property="og:title"]');
          if (ogTitle) title = ogTitle.getAttribute('content') || '';
        }
        if (title) {
          title = title.split('|')[0].trim();
          title = title.split('–')[0].trim();
          title = title.split('—')[0].trim();
        }
        const ingredientSelectors = [
          '.ingredients-list li', '.recipe-ingredients li', '.ingredients li',
          '.ingredient-item', '.recipe__ingredients li', '.ingredient',
          '.ingredients-list .item', 'ul.ingredients li', '.ingredients-list__item'
        ];
        for (const selector of ingredientSelectors) {
          const items = doc.querySelectorAll(selector);
          if (items.length > 0) {
            items.forEach(el => {
              const text = el.textContent.trim();
              if (text && text.length > 1 && !text.includes('Продукты')) {
                ingredients.push(text);
              }
            });
            if (ingredients.length > 0) break;
          }
        }
        if (ingredients.length === 0) {
          const lists = doc.querySelectorAll('ul, ol');
          for (const list of lists) {
            const items = list.querySelectorAll('li');
            let hasIngredients = false;
            const temp = [];
            items.forEach(el => {
              const text = el.textContent.trim();
              if (text && text.length > 1 && text.length < 100) {
                if (/\d/.test(text) || /г|мл|кг|л|шт|ст\.|ч\.|зуб/.test(text)) {
                  hasIngredients = true;
                  temp.push(text);
                }
              }
            });
            if (hasIngredients && temp.length > 2) {
              ingredients = temp;
              break;
            }
          }
        }
        ingredients = ingredients.filter((v, i, a) => a.indexOf(v) === i && v.length > 2);
        if (ingredients.length === 0) {
          ingredients = ['Ингредиенты не найдены. Добавьте их в заметку вручную.'];
        }
      }
    }

    // Определяем категорию
    let category = Utils.guessCategory(title || '');
    ingredients = ingredients.filter(i => i && !i.includes('не найдены')).slice(0, 20);

    const icon = sourceType.split(' ')[0] || '🍽️';
    container.innerHTML = `
      <div class="parsed-recipe">
        <div class="recipe-name">${icon} ${Utils.escapeHtml(title || 'Название не определено')}</div>
        <div class="platform-badge">${sourceType}</div>
        ${ingredients.length > 0 ? `
          <div class="recipe-ingredients">
            <strong>📋 Ингредиенты:</strong>
            <ul>
              ${ingredients.map(i => `<li>${Utils.escapeHtml(i)}</li>`).join('')}
            </ul>
          </div>
        ` : `
          <div class="recipe-ingredients" style="color: var(--text-muted);">
            <em>Ингредиенты не найдены автоматически. Вы можете добавить их в заметку вручную.</em>
          </div>
        `}
        <div style="margin-top: 8px; font-size: 13px; color: var(--text-muted); background: var(--badge-bg); padding: 8px 12px; border-radius: var(--radius-sm);">
          <strong>ℹ️</strong> Ингредиенты извлечены автоматически. 
          ${isIamCook ? 'Для iamcook.ru проверьте и при необходимости дополните заметку.' : ''}
          ${isVK && isVKVideo ? 'Для клипов ВК проверьте описание и дополните заметку.' : ''}
        </div>
        <div class="recipe-actions">
          <button class="btn-add" data-name="${Utils.escapeHtml(title || 'Рецепт')}" data-note="${Utils.escapeHtml(ingredients.join('; '))}" data-category="${category}">
            ✅ Добавить в меню
          </button>
          <button class="btn-cancel" id="cancelParsedRecipe">Отмена</button>
        </div>
      </div>
    `;

    container.querySelector('.btn-add').addEventListener('click', function() {
      const name = this.dataset.name;
      const note = this.dataset.note;
      const category = this.dataset.category;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = Utils.formatDateLocal(tomorrow);

      let finalName = name;
      if (finalName.length > 60) finalName = finalName.substring(0, 57) + '...';

      let finalNote = note || `Импортированный рецепт (${sourceType})`;
      if (!note || note.length < 5) {
        finalNote = `Импортированный рецепт (${sourceType}). Проверьте ингредиенты.`;
      }

      DishStore.addDish(finalName, 'planned', dateStr, category, false, finalNote);
      closeUrlImport();
      const view = Renderer.getCurrentView();
      const curDate = Renderer.getCurrentDate();
      Renderer.renderCalendar(view, curDate);
      alert(`✅ Рецепт "${finalName}" добавлен в план на завтра (${Utils.formatDate(tomorrow)})`);
    });

    container.querySelector('#cancelParsedRecipe').addEventListener('click', function() {
      container.innerHTML = '';
      statusDiv.innerHTML = '';
    });

    statusDiv.innerHTML = `
      <div class="status-message success">
        ✅ Рецепт найден! Найдено ${ingredients.length} ингредиентов. Источник: ${sourceType}
      </div>
    `;

  } catch (error) {
    statusDiv.innerHTML = `<div class="status-message error">❌ Ошибка: ${error.message}</div>`;
    console.error('Ошибка при импорте рецепта:', error);
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = '🔍 Найти рецепт';
  }
}

// ============================================================
// 6. ПРИВЕТСТВЕННАЯ МОДАЛКА
// ============================================================
function showWelcome() {
  const overlay = document.getElementById('welcomeOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideWelcome() {
  const overlay = document.getElementById('welcomeOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
// 7. ИНИЦИАЛИЗАЦИЯ
// ============================================================
(function init() {
  setTimeout(showWelcome, 300);

  document.getElementById('welcomeStartBtn').addEventListener('click', hideWelcome);

  DishStore.init();

  const savedTheme = localStorage.getItem('mealPlannerTheme');
  if (savedTheme === 'dark') document.body.classList.add('dark-theme');
  document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('mealPlannerTheme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  });

  document.getElementById('searchInput').addEventListener('input', function() {
    Renderer.setSearchQuery(this.value);
  });
  document.getElementById('statusFilter').addEventListener('change', function() {
    Renderer.setStatusFilter(this.value);
  });
  document.getElementById('categoryFilter').addEventListener('change', function() {
    Renderer.setCategoryFilter(this.value);
  });

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
      document.querySelectorAll('#viewToggle button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const view = this.dataset.view;
      Renderer.setCurrentView(view);
      const curDate = Renderer.getCurrentDate();
      Renderer.renderCalendar(view, curDate);
    });
  });

  document.getElementById('modalClose').addEventListener('click', Renderer.closeModal);
  document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) Renderer.closeModal();
  });

  document.getElementById('recClose').addEventListener('click', Renderer.closeRecModal);
  document.getElementById('recOverlay').addEventListener('click', function(e) {
    if (e.target === this) Renderer.closeRecModal();
  });

  document.getElementById('suggestBtn').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.add('active');
  });
  document.getElementById('choiceClose').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.remove('active');
  });
  document.getElementById('choiceOverlay').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });

  document.getElementById('choiceFromMenu').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.remove('active');
    Renderer.openRecommendations();
  });

  document.getElementById('choiceFromTaste').addEventListener('click', function() {
    document.getElementById('choiceOverlay').classList.remove('active');
    const random = DishStore.getRandomDishFromTaste();
    const answer = `🍽️ ${random.categoryLabel}\n\n${random.name}\n\nХотите добавить его в план на завтра?`;
    if (confirm(answer)) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = Utils.formatDateLocal(tomorrow);
      DishStore.addDish(random.name, 'planned', dateStr, random.category, false, '');
      const view = Renderer.getCurrentView();
      const curDate = Renderer.getCurrentDate();
      Renderer.renderCalendar(view, curDate);
      alert(`✅ Блюдо "${random.name}" добавлено в план на завтра (${Utils.formatDate(tomorrow)})`);
    }
  });

  document.getElementById('favoritesBtn').addEventListener('click', Renderer.openFavorites);

  document.getElementById('addDishBtn').addEventListener('click', Renderer.openAddModal);
  document.getElementById('addModalClose').addEventListener('click', Renderer.closeAddModal);
  document.getElementById('addModalCancel').addEventListener('click', Renderer.closeAddModal);
  document.getElementById('addModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) Renderer.closeAddModal();
  });

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

  document.getElementById('importUrlBtn').addEventListener('click', openUrlImport);
  document.getElementById('urlImportClose').addEventListener('click', closeUrlImport);
  document.getElementById('urlImportOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeUrlImport();
  });

  document.getElementById('fetchRecipeBtn').addEventListener('click', function() {
    const url = document.getElementById('recipeUrlInput').value.trim();
    if (!url) {
      document.getElementById('urlImportStatus').innerHTML = `<div class="status-message error">❌ Введите ссылку на рецепт</div>`;
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      document.getElementById('urlImportStatus').innerHTML = `<div class="status-message error">❌ Ссылка должна начинаться с http:// или https://</div>`;
      return;
    }
    fetchRecipeFromUrl(url);
  });

  document.getElementById('recipeUrlInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('fetchRecipeBtn').click();
    }
  });

  document.getElementById('exportBtn').addEventListener('click', function() {
    document.getElementById('exportModalOverlay').classList.add('active');
  });
  document.getElementById('exportModalClose').addEventListener('click', function() {
    document.getElementById('exportModalOverlay').classList.remove('active');
  });
  document.getElementById('exportModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });
  document.querySelectorAll('.export-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const format = this.dataset.format;
      document.getElementById('exportModalOverlay').classList.remove('active');
      exportData(format);
    });
  });

  document.getElementById('importBtn').addEventListener('click', function() {
    document.getElementById('importFileInput').click();
  });
  document.getElementById('importFileInput').addEventListener('change', function(e) {
    if (this.files && this.files.length > 0) {
      importData(this.files[0]);
      this.value = '';
    }
  });

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
  console.log('📱 Поддерживаются: YouTube, VK, Telegram, Instagram, Pinterest, Яндекс.Дзен, iamcook.ru, Сайты');
})();
