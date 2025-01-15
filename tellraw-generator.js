let characterBlockCount = 0;
let currentLang = localStorage.getItem('lang') || 'ru';

const translations = {
    ru: {
        title: 'Генератор команд tellraw 1.21.1',
        themeSwitcher: 'Сменить тему',
        langSwitcher: 'English',
        character: 'Персонаж',
        addCharacter: 'Добавить персонажа',
        deleteCharacter: 'Удалить',
        messageText: 'Текст сообщения',
        generateCommand: 'Сгенерировать команду',
        addNewline: 'Добавить перенос в начало',
        textColor: 'Цвет текста',
        helpTitle: 'Помощь и инструкция',
        presets: {
            title: 'Пресеты',
            save: 'Сохранить пресет',
            announcement: 'Объявление',
            warning: 'Предупреждение',
            dialog: 'Диалог'
        },
        colors: {
            white: 'Белый',
            yellow: 'Желтый',
            red: 'Красный',
            green: 'Зеленый',
            aqua: 'Голубой',
            light_purple: 'Розовый',
            gold: 'Золотой',
            gray: 'Серый',
            dark_red: 'Темно-красный',
            dark_green: 'Темно-зеленый',
            dark_aqua: 'Темно-голубой',
            dark_purple: 'Фиолетовый',
            dark_gray: 'Темно-серый',
            black: 'Черный',
            blue: 'Синий',
            dark_blue: 'Темно-синий'
        },
        formatting: {
            title: 'Форматирование',
            bold: 'Жирный',
            italic: 'Курсив',
            underlined: 'Подчёркнутый',
            strikethrough: 'Зачёркнутый',
            obfuscated: 'Искажённый'
        },
        noContent: 'Добавьте хотя бы одного персонажа и введите текст'
    },
    en: {
        title: 'Tellraw Command Generator 1.21.1',
        themeSwitcher: 'Toggle Theme',
        langSwitcher: 'Русский',
        character: 'Character',
        addCharacter: 'Add Character',
        deleteCharacter: 'Delete',
        messageText: 'Message Text',
        generateCommand: 'Generate Command',
        addNewline: 'Add Newline at Start',
        textColor: 'Text Color',
        helpTitle: 'Help & Instructions',
        presets: {
            title: 'Presets',
            save: 'Save Preset',
            announcement: 'Announcement',
            warning: 'Warning',
            dialog: 'Dialog'
        },
        colors: {
            white: 'White',
            yellow: 'Yellow',
            red: 'Red',
            green: 'Green',
            aqua: 'Aqua',
            light_purple: 'Pink',
            gold: 'Gold',
            gray: 'Gray',
            dark_red: 'Dark Red',
            dark_green: 'Dark Green',
            dark_aqua: 'Dark Aqua',
            dark_purple: 'Purple',
            dark_gray: 'Dark Gray',
            black: 'Black',
            blue: 'Blue',
            dark_blue: 'Dark Blue'
        },
        formatting: {
            title: 'Formatting',
            bold: 'Bold',
            italic: 'Italic',
            underlined: 'Underlined',
            strikethrough: 'Strikethrough',
            obfuscated: 'Obfuscated'
        },
        noContent: 'Add at least one character and enter text'
    }
};

// Стандартные пресеты
const defaultPresets = {
    announcement: {
        text: "\\n[Объявление] Важное сообщение",
        textColor: "yellow",
        formatting: {
            bold: true
        }
    },
    warning: {
        text: "\\n[!] Предупреждающее сообщение",
        textColor: "red",
        formatting: {
            bold: true
        }
    },
    dialog: {
        text: "<Steve> Привет!\\n<Alex> Здравствуй!",
        textColor: "white",
        formatting: {}
    }
};

// Функции темы и языка
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleLang() {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', currentLang);
    updateInterface();
}

// Функции обновления интерфейса
function updateInterface() {
    const t = translations[currentLang];
    document.title = t.title;
    document.querySelector('.theme-switch').textContent = t.themeSwitcher;
    document.querySelector('.lang-switch').textContent = t.langSwitcher;
    
    // Обновляем все блоки персонажей
    document.querySelectorAll('.character-block').forEach((block, index) => {
        block.querySelector('h3').textContent = `${t.character} ${index + 1}`;
        block.querySelector('.remove-button').textContent = t.deleteCharacter;
        block.querySelector('label[for^="messageText"]').textContent = t.messageText;
        block.querySelector('.newline-button').textContent = t.addNewline;
        block.querySelector('label[for^="textColor"]').textContent = t.textColor;
    });
    
    // Обновляем кнопки
    document.querySelector('button[onclick="addCharacterBlock()"]').textContent = t.addCharacter;
    document.querySelector('button[onclick="generateTellraw()"]').textContent = t.generateCommand;
    
    // Обновляем заголовки
    document.querySelector('.help-title').textContent = t.helpTitle;
    document.querySelector('.presets-section h3').textContent = t.presets.title;
    
    updatePresetsList();
}

function removeCharacterBlock(id) {
    const block = document.getElementById(`character-${id}`);
    if (block) {
        block.remove();
        updatePreview();
        generateTellraw();
    }
}

// Функции форматирования
function applyFormatting(blockId, format) {
    const button = document.querySelector(`#character-${blockId} [data-format="${format}"]`);
    button.classList.toggle('active');
    updatePreview();
    generateTellraw();
}

function getFormatting(blockId) {
    const block = document.getElementById(`character-${blockId}`);
    const formatting = {};
    
    block.querySelectorAll('.format-btn').forEach(btn => {
        const format = btn.dataset.format;
        formatting[format] = btn.classList.contains('active');
    });
    
    return formatting;
}

// Функция вставки переноса строки
function insertNewline(blockId) {
    const textarea = document.getElementById(`messageText-${blockId}`);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + "\\n" + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 2;
    
    updatePreview();
    generateTellraw();
}

// Функции генерации команды и предпросмотра
function generateTellraw() {
    const result = document.getElementById('result');
    let textParts = [];
    
    for (let i = 0; i < characterBlockCount; i++) {
        const block = document.getElementById(`character-${i}`);
        if (!block) continue;

        const messageText = document.getElementById(`messageText-${i}`)?.value || '';
        const textColor = document.getElementById(`textColor-${i}`)?.value || 'white';
        const formatting = getFormatting(i);
        
        if (messageText) {
            // Разбиваем текст на части (имя и сообщение)
            const match = messageText.match(/^<([^>]+)>\s*(.*)$/);
            
            if (match) {
                // Если есть имя в формате <Имя>
                const [, name, text] = match;
                const namePart = {
                    text: `<${name}> `,
                    color: textColor,
                    ...formatting
                };
                textParts.push(namePart);
                
                if (text) {
                    const textPart = {
                        text: text,
                        color: textColor,
                        ...formatting
                    };
                    textParts.push(textPart);
                }
            } else {
                // Если нет имени, просто добавляем текст
                const textPart = {
                    text: messageText,
                    color: textColor,
                    ...formatting
                };
                textParts.push(textPart);
            }
        }
    }
    
    if (textParts.length > 0) {
        const command = '/tellraw @a ' + JSON.stringify(textParts);
        result.innerText = command;
    } else {
        result.innerText = translations[currentLang].noContent;
    }
}

function updatePreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    
    document.querySelectorAll('.character-block').forEach(block => {
        const id = block.id.split('-')[1];
        const messageText = document.getElementById(`messageText-${id}`).value;
        const textColor = document.getElementById(`textColor-${id}`).value;
        const formatting = getFormatting(id);
        
        if (messageText) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'preview-message';
            
            const match = messageText.match(/^<([^>]+)>\s*(.*)$/);
            if (match) {
                const [, name, text] = match;
                
                const nameSpan = document.createElement('span');
                nameSpan.style.color = textColor;
                nameSpan.textContent = `<${name}> `;
                applyPreviewFormatting(nameSpan, formatting);
                messageDiv.appendChild(nameSpan);
                
                if (text) {
                    const textSpan = document.createElement('span');
                    textSpan.style.color = textColor;
                    textSpan.textContent = text;
                    applyPreviewFormatting(textSpan, formatting);
                    messageDiv.appendChild(textSpan);
                }
            } else {
                const textSpan = document.createElement('span');
                textSpan.style.color = textColor;
                textSpan.textContent = messageText;
                applyPreviewFormatting(textSpan, formatting);
                messageDiv.appendChild(textSpan);
            }
            
            preview.appendChild(messageDiv);
        }
    });
    
    generateTellraw();
}

function applyPreviewFormatting(element, formatting) {
    if (formatting.bold) element.style.fontWeight = 'bold';
    if (formatting.italic) element.style.fontStyle = 'italic';
    if (formatting.underlined) element.style.textDecoration = 'underline';
    if (formatting.strikethrough) element.style.textDecoration = 'line-through';
    if (formatting.obfuscated) element.style.textShadow = '0 0 5px var(--text-color)';
}

// Функции для работы с пресетами
function loadPreset(presetName) {
    const preset = defaultPresets[presetName];
    if (!preset) return;

    document.getElementById('charactersContainer').innerHTML = '';
    characterBlockCount = 0;

    addCharacterBlock();
    const block = document.getElementById(`character-${characterBlockCount - 1}`);
    
    block.querySelector('textarea[id^="messageText"]').value = preset.text;
    block.querySelector('select[id^="textColor"]').value = preset.textColor;

    if (preset.formatting) {
        Object.entries(preset.formatting).forEach(([format, active]) => {
            if (active) {
                const button = block.querySelector(`[data-format="${format}"]`);
                button.classList.add('active');
            }
        });
    }

    updatePreview();
    generateTellraw();
}

function updatePresetsList() {
    const container = document.getElementById('presetsContainer');
    const t = translations[currentLang].presets;
    
    container.innerHTML = Object.entries(defaultPresets).map(([name, preset]) => `
        <button class="preset-button" onclick="loadPreset('${name}')">
            ${t[name]}
        </button>
    `).join('');
}

// Функция переключения вкладок
function showTab(tabId) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Показываем выбранную вкладку
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Делаем кнопку активной
    const selectedButton = document.querySelector(`button[onclick="showTab('${tabId}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Добавим вызов функции при загрузке страницы
window.onload = function() {
    setInitialTheme();
    addCharacterBlock();
    updatePresetsList();
    updateInterface();
    
    // Показываем вкладку инструкций по умолчанию
    showTab('instructions');
};

// Функции авторизации
function showLoginForm() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function closeAuthForms() {
    document.getElementById('authForms').style.display = 'none';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    
    if (user && user.password === hashPassword(password)) {
        handleAuthSuccess(user);
        closeAuthForms();
    } else {
        alert('Неверное имя пользователя или пароль');
    }
}

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regPasswordConfirm').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
        alert('Пользователь с таким именем уже существует');
        return;
    }
    
    users[username] = {
        username,
        password: hashPassword(password),
        presets: {}
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    handleAuthSuccess(users[username]);
    closeAuthForms();
}

function signOut() {
    localStorage.removeItem('currentUser');
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('authButtons').style.display = 'flex';
}

function handleAuthSuccess(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('userName').textContent = user.username;
}

function hashPassword(password) {
    return btoa(password); // Простое кодирование, в реальном приложении используйте более безопасный метод
}

// Функция для добавления цветного текста
function insertColoredText(blockId) {
    const textarea = document.getElementById(`messageText-${blockId}`);
    const color = document.getElementById(`textColor-${blockId}`).value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
        const coloredText = `§${getColorCode(color)}${selectedText}§r`;
        textarea.value = textarea.value.substring(0, start) + coloredText + textarea.value.substring(end);
        updatePreview();
        generateTellraw();
    }
}

// Функция для добавления ссылки
function insertLink(blockId) {
    const url = prompt('Введите URL:');
    if (!url) return;
    
    const textarea = document.getElementById(`messageText-${blockId}`);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || 'ссылка';
    
    const linkText = `{"text":"${selectedText}","clickEvent":{"action":"open_url","value":"${url}"}}`;
    textarea.value = textarea.value.substring(0, start) + linkText + textarea.value.substring(end);
    
    updatePreview();
    generateTellraw();
}

// Добавим кнопки в HTML блок персонажа
function addCharacterBlock() {
    const t = translations[currentLang];
const container = document.getElementById('charactersContainer');
const blockDiv = document.createElement('div');
blockDiv.className = 'character-block';
blockDiv.id = `character-${characterBlockCount}`;
    blockDiv.innerHTML = `
            <div class="character-header">
        <h3>${t.character} ${characterBlockCount + 1}</h3>
        <button class="remove-button" onclick="removeCharacterBlock(${characterBlockCount})">${t.deleteCharacter}</button>
    </div>
    <div class="input-group">
        <label for="messageText-${characterBlockCount}">${t.messageText}:</label>
        <p class="input-hint">Для добавления имени персонажа используйте формат: &lt;Имя&gt; Текст</p>
        <textarea id="messageText-${characterBlockCount}" 
                  placeholder="<Steve> Привет!" 
                  onchange="updatePreview()"></textarea>
        <button class="newline-button" onclick="insertNewline(${characterBlockCount})">${t.addNewline}</button>
        <label for="textColor-${characterBlockCount}">${t.textColor}:</label>
        <select id="textColor-${characterBlockCount}" onchange="updatePreview()">
            ${Object.entries(t.colors).map(([value, name]) => 
                `<option value="${value}">${name}</option>`
            ).join('')}
        </select>
    </div>
    <div class="format-controls">
        <label>${t.formatting.title}:</label>
        <div class="format-buttons">
            <button type="button" class="format-btn" data-format="bold" onclick="applyFormatting(${characterBlockCount}, 'bold')" title="${t.formatting.bold}">B</button>
            <button type="button" class="format-btn" data-format="italic" onclick="applyFormatting(${characterBlockCount}, 'italic')" title="${t.formatting.italic}">I</button>
            <button type="button" class="format-btn" data-format="underlined" onclick="applyFormatting(${characterBlockCount}, 'underlined')" title="${t.formatting.underlined}">U</button>
            <button type="button" class="format-btn" data-format="strikethrough" onclick="applyFormatting(${characterBlockCount}, 'strikethrough')" title="${t.formatting.strikethrough}">S</button>
            <button type="button" class="format-btn" data-format="obfuscated" onclick="applyFormatting(${characterBlockCount}, 'obfuscated')" title="${t.formatting.obfuscated}">O</button>
            <button type="button" class="format-btn" onclick="insertColoredText(${characterBlockCount})" title="Цветной текст">C</button>
            <button type="button" class="format-btn" onclick="insertLink(${characterBlockCount})" title="Добавить ссылку">L</button>
        </div>
    `;
    
    container.appendChild(blockDiv);
    characterBlockCount++;
    updatePreview();
}

function updatePreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    
    document.querySelectorAll('.character-block').forEach(block => {
        const id = block.id.split('-')[1];
        const messageText = document.getElementById(`messageText-${id}`).value;
        const textColor = document.getElementById(`textColor-${id}`).value;
        const formatting = getFormatting(id);
        
        if (messageText) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'preview-message';
            
            // Разбиваем текст по \n и создаем элементы для каждой строки
            const lines = messageText.split('\\n');
            lines.forEach((line, index) => {
                if (index > 0) {
                    messageDiv.appendChild(document.createElement('br'));
                }
                
                const match = line.match(/^<([^>]+)>\s*(.*)$/);
                if (match) {
                    const [, name, text] = match;
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.style.color = textColor;
                    nameSpan.textContent = `<${name}> `;
                    applyPreviewFormatting(nameSpan, formatting);
                    messageDiv.appendChild(nameSpan);
                    
                    if (text) {
                        const textSpan = document.createElement('span');
                        textSpan.style.color = textColor;
                        textSpan.textContent = text;
                        applyPreviewFormatting(textSpan, formatting);
                        messageDiv.appendChild(textSpan);
                    }
                } else {
                    const textSpan = document.createElement('span');
                    textSpan.style.color = textColor;
                    textSpan.textContent = line;
                    applyPreviewFormatting(textSpan, formatting);
                    messageDiv.appendChild(textSpan);
                }
            });
            
            preview.appendChild(messageDiv);
        }
    });
    
    generateTellraw();
}

// Функции для работы с пользовательскими пресетами
function saveCustomPreset() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Войдите в систему, чтобы сохранять пресеты');
        return;
    }

    const presetName = prompt('Введите название пресета:');
    if (!presetName) return;

    const preset = {
        name: presetName,
        characters: []
    };

    // Сохраняем все блоки персонажей
    document.querySelectorAll('.character-block').forEach(block => {
        const id = block.id.split('-')[1];
        preset.characters.push({
            text: document.getElementById(`messageText-${id}`).value,
            textColor: document.getElementById(`textColor-${id}`).value,
            formatting: getFormatting(id)
        });
    });

    // Сохраняем пресет в локальное хранилище
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[currentUser.username].presets[presetName] = preset;
    localStorage.setItem('users', JSON.stringify(users));

    // Обновляем список пресетов
    updatePresetsList();
}

// Функции для работы с сообществом
function shareCurrentPreset() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Войдите в систему, чтобы делиться пресетами');
        return;
    }

    const presetName = prompt('Введите название пресета:');
    if (!presetName) return;

    const preset = {
        id: Date.now().toString(),
        name: presetName,
        author: currentUser.username,
        date: new Date().toISOString(),
        likes: 0,
        characters: []
    };

    // Сохраняем все блоки персонажей
    document.querySelectorAll('.character-block').forEach(block => {
        const id = block.id.split('-')[1];
        preset.characters.push({
            text: document.getElementById(`messageText-${id}`).value,
            textColor: document.getElementById(`textColor-${id}`).value,
            formatting: getFormatting(id)
        });
    });

    // Сохраняем пресет в сообщество
    const communityPresets = JSON.parse(localStorage.getItem('communityPresets') || '[]');
    communityPresets.push(preset);
    localStorage.setItem('communityPresets', JSON.stringify(communityPresets));

    // Обновляем отображение пресетов сообщества
    updateCommunityPresets();
}

function updateCommunityPresets() {
    const container = document.getElementById('communityPresets');
    const presets = JSON.parse(localStorage.getItem('communityPresets') || '[]');
    
    if (presets.length === 0) {
        container.innerHTML = '<p>Нет доступных пресетов</p>';
        return;
    }

    container.innerHTML = presets.map(preset => `
        <div class="community-preset">
            <div class="preset-header">
                <h4>${preset.name}</h4>
                <span>Автор: ${preset.author}</span>
            </div>
            <div class="preset-footer">
                <span>${new Date(preset.date).toLocaleDateString()}</span>
                <button onclick="likePreset('${preset.id}')" class="like-button">
                    ❤️ ${preset.likes}
                </button>
                <button onclick="loadCommunityPreset('${preset.id}')">
                    Использовать
                </button>
            </div>
        </div>
    `).join('');
}

function likePreset(presetId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Войдите в систему, чтобы оценивать пресеты');
        return;
    }

    const presets = JSON.parse(localStorage.getItem('communityPresets') || '[]');
    const preset = presets.find(p => p.id === presetId);
    
    if (preset) {
        preset.likes++;
        localStorage.setItem('communityPresets', JSON.stringify(presets));
        updateCommunityPresets();
    }
}

function loadCommunityPreset(presetId) {
    const presets = JSON.parse(localStorage.getItem('communityPresets') || '[]');
    const preset = presets.find(p => p.id === presetId);
    
    if (preset) {
        // Очищаем текущие блоки
        document.getElementById('charactersContainer').innerHTML = '';
        characterBlockCount = 0;

        // Создаем новые блоки из пресета
        preset.characters.forEach(char => {
            addCharacterBlock();
            const block = document.getElementById(`character-${characterBlockCount - 1}`);
            
            block.querySelector('textarea[id^="messageText"]').value = char.text;
            block.querySelector('select[id^="textColor"]').value = char.textColor;

            if (char.formatting) {
                Object.entries(char.formatting).forEach(([format, active]) => {
                    if (active) {
                        const button = block.querySelector(`[data-format="${format}"]`);
                        button.classList.add('active');
                    }
                });
            }
        });

        updatePreview();
        generateTellraw();
    }
}

// Функции для работы с пресетами
function updatePresetsList() {
    // Обновляем стандартные пресеты
    const defaultContainer = document.getElementById('defaultPresetsContainer');
    const t = translations[currentLang].presets;
    
    defaultContainer.innerHTML = Object.entries(defaultPresets).map(([name, preset]) => `
        <button class="preset-button" onclick="loadPreset('${name}')">
            ${t[name]}
        </button>
    `).join('');

    // Обновляем пользовательские пресеты
    const userContainer = document.getElementById('userPresetsContainer');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.presets) {
        userContainer.innerHTML = Object.entries(currentUser.presets).map(([name, preset]) => `
            <button class="preset-button" onclick="loadUserPreset('${name}')">
                ${name}
                <button class="delete-preset" onclick="deletePreset('${name}')">×</button>
            </button>
        `).join('');
    } else {
        userContainer.innerHTML = '<p>Нет сохраненных пресетов</p>';
    }
}

function loadUserPreset(presetName) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.presets[presetName]) return;

    const preset = currentUser.presets[presetName];
    loadPresetData(preset);
}

function loadPresetData(preset) {
    // Очищаем текущие блоки
    document.getElementById('charactersContainer').innerHTML = '';
    characterBlockCount = 0;

    // Создаем новые блоки из пресета
    preset.characters.forEach(char => {
        addCharacterBlock();
        const block = document.getElementById(`character-${characterBlockCount - 1}`);
        
        block.querySelector('textarea[id^="messageText"]').value = char.text;
        block.querySelector('select[id^="textColor"]').value = char.textColor;

        if (char.formatting) {
            Object.entries(char.formatting).forEach(([format, active]) => {
                if (active) {
                    const button = block.querySelector(`[data-format="${format}"]`);
                    button.classList.add('active');
                }
            });
        }
    });

    updatePreview();
    generateTellraw();
}

function filterPresets() {
    const searchText = document.getElementById('presetSearch').value.toLowerCase();
    const presetButtons = document.querySelectorAll('.preset-button');
    
    presetButtons.forEach(button => {
        const presetName = button.textContent.toLowerCase();
        button.style.display = presetName.includes(searchText) ? '' : 'none';
    });
}

function deletePreset(presetName) {
    if (!confirm(`Удалить пресет "${presetName}"?`)) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    delete currentUser.presets[presetName];
    
    const users = JSON.parse(localStorage.getItem('users'));
    users[currentUser.username] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updatePresetsList();
}

// Функции для работы с пресетами
function saveCustomPreset() {
    const presetName = prompt('Введите название пресета:');
    if (!presetName) return;

    const preset = {
        name: presetName,
        characters: []
    };

    // Сохраняем все блоки персонажей
    document.querySelectorAll('.character-block').forEach(block => {
        const id = block.id.split('-')[1];
        preset.characters.push({
            text: document.getElementById(`messageText-${id}`).value,
            textColor: document.getElementById(`textColor-${id}`).value,
            formatting: getFormatting(id)
        });
    });

    // Сохраняем пресет
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Если пользователь авторизован, сохраняем в его пресеты
        if (!currentUser.presets) currentUser.presets = {};
        currentUser.presets[presetName] = preset;
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        users[currentUser.username] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        // Если пользователь не авторизован, сохраняем в локальные пресеты
        const localPresets = JSON.parse(localStorage.getItem('localPresets') || '{}');
        localPresets[presetName] = preset;
        localStorage.setItem('localPresets', JSON.stringify(localPresets));
    }

    updatePresetsList();
}

// Обновляем функцию updatePresetsList для отображения локальных пресетов
function updatePresetsList() {
    // Обновляем стандартные пресеты
    const defaultContainer = document.getElementById('defaultPresetsContainer');
    const t = translations[currentLang].presets;
    
    defaultContainer.innerHTML = Object.entries(defaultPresets).map(([name, preset]) => `
        <button class="preset-button" onclick="loadPreset('${name}')">
            ${t[name]}
        </button>
    `).join('');

    // Обновляем пользовательские пресеты
    const userContainer = document.getElementById('userPresetsContainer');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const localPresets = JSON.parse(localStorage.getItem('localPresets') || '{}');
    
    let presetsHtml = '';

    // Добавляем локальные пресеты
    Object.entries(localPresets).forEach(([name, preset]) => {
        presetsHtml += `
            <button class="preset-button" onclick="loadUserPreset('${name}')">
                ${name}
                <button class="delete-preset" onclick="deletePreset('${name}', false)">×</button>
                <button class="share-preset" onclick="sharePreset('${name}')" title="Поделиться">↗</button>
            </button>
        `;
    });

    // Добавляем пресеты пользователя, если он авторизован
    if (currentUser && currentUser.presets) {
        Object.entries(currentUser.presets).forEach(([name, preset]) => {
            presetsHtml += `
                <button class="preset-button" onclick="loadUserPreset('${name}')">
                    ${name}
                    <button class="delete-preset" onclick="deletePreset('${name}', true)">×</button>
                    <button class="share-preset" onclick="sharePreset('${name}')" title="Поделиться">↗</button>
                </button>
            `;
        });
    }

    userContainer.innerHTML = presetsHtml || '<p>Нет сохраненных пресетов</p>';
}

// Обновляем функцию удаления пресета
function deletePreset(presetName, isUserPreset) {
    if (!confirm(`Удалить пресет "${presetName}"?`)) return;
    
    if (isUserPreset) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        delete currentUser.presets[presetName];
        
        const users = JSON.parse(localStorage.getItem('users'));
        users[currentUser.username] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        const localPresets = JSON.parse(localStorage.getItem('localPresets') || '{}');
        delete localPresets[presetName];
        localStorage.setItem('localPresets', JSON.stringify(localPresets));
    }
    
    updatePresetsList();
}

// Добавляем функцию для публикации существующего пресета
function sharePreset(presetName) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Войдите в систему, чтобы делиться пресетами');
        return;
    }

    const localPresets = JSON.parse(localStorage.getItem('localPresets') || '{}');
    const userPresets = currentUser.presets || {};
    const preset = localPresets[presetName] || userPresets[presetName];

    if (!preset) return;

    const communityPreset = {
        id: Date.now().toString(),
        name: presetName,
        author: currentUser.username,
        date: new Date().toISOString(),
        likes: 0,
        characters: preset.characters
    };

    const communityPresets = JSON.parse(localStorage.getItem('communityPresets') || '[]');
    communityPresets.push(communityPreset);
    localStorage.setItem('communityPresets', JSON.stringify(communityPresets));

    updateCommunityPresets();
    alert('Пресет опубликован в сообществе!');
}

function updateCommunityPresets() {
    const container = document.getElementById('communityPresets');
    const presets = JSON.parse(localStorage.getItem('communityPresets') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (presets.length === 0) {
        container.innerHTML = '<p>Нет доступных пресетов</p>';
        return;
    }

    container.innerHTML = presets.map(preset => `
        <div class="community-preset">
            <div class="preset-header">
                <h4>${preset.name}</h4>
                <span>Автор: ${preset.author}</span>
                ${currentUser && (currentUser.username === preset.author || currentUser.isAdmin) ? 
                    `<button onclick="deleteCommunityPreset('${preset.id}')" class="delete-preset" title="Удалить">×</button>` 
                    : ''}
            </div>
            <div class="preset-footer">
                <span>${new Date(preset.date).toLocaleDateString()}</span>
                <div class="preset-actions">
                    <button onclick="likePreset('${preset.id}')" class="like-button">
                        ❤️ ${preset.likes}
                    </button>
                    <button onclick="loadCommunityPreset('${preset.id}')" class="use-preset">
                        Использовать
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Добавим функцию удаления пресета из сообщества
function deleteCommunityPreset(presetId) {
    if (!confirm('Вы уверены, что хотите удалить этот пресет из сообщества?')) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const presets = JSON.parse(localStorage.getItem('communityPresets') || '[]');
    const presetIndex = presets.findIndex(p => p.id === presetId);
    
    if (presetIndex === -1) return;
    
    // Проверяем, является ли пользователь автором или администратором
    if (currentUser.username === presets[presetIndex].author || currentUser.isAdmin) {
        presets.splice(presetIndex, 1);
        localStorage.setItem('communityPresets', JSON.stringify(presets));
        updateCommunityPresets();
    } else {
        alert('У вас нет прав для удаления этого пресета');
    }
}

// Инициализация при загрузке
window.onload = function() {
    setInitialTheme();
    addCharacterBlock();
    updatePresetsList();
    updateInterface();
    updateCommunityPresets(); // Добавляем эту строку
    showTab('instructions');
};