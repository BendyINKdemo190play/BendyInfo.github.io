document.addEventListener('DOMContentLoaded', () => {
    let messages = [];
    let buttons = [];
    let presetName = 'my_bot_preset';

    // Хранение токена
    let botToken = localStorage.getItem('botToken') || 'YOUR_BOT_TOKEN';

    // Загрузка токена при старте
    document.getElementById('bot-token').value = botToken !== 'YOUR_BOT_TOKEN' ? botToken : '';

    // Сохранение токена
    document.getElementById('save-token').addEventListener('click', () => {
        botToken = document.getElementById('bot-token').value.trim();
        localStorage.setItem('botToken', botToken);
        alert('Токен сохранен!');
    });

    // Инициализация выпадающего списка сообщений
    function updateMessageSelect() {
        const select = document.getElementById('message-id-select');
        select.innerHTML = messages.map(msg => 
            `<option value="${msg.id}">${msg.id} (/${msg.command})</option>`
        ).join('');
    }

    // Добавление сообщения
    document.getElementById('add-message-button').addEventListener('click', () => {
        const messageId = document.getElementById('message-id').value;
        const command = document.getElementById('command').value;
        const text = document.getElementById('text').value;
        const photoInput = document.getElementById('photo');
        const showTyping = document.getElementById('show-typing').checked; // Получаем значение чекбокса

        if (messages.some(msg => msg.id === messageId)) {
            alert('Сообщение с таким ID уже существует!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newMessage = {
                id: messageId,
                command: command,
                text: text.replace(/\n/g, '\\n'),
                photo: e.target.result || '',
                showTyping: showTyping // Добавляем значение чекбокса в объект сообщения
            };

            messages.push(newMessage);
            updateMessageSelect();
            
            // Добавляем в список сообщений
            const messageList = document.getElementById('message-list');
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>ID:</strong> ${messageId} 
                <strong>Команда:</strong> /${command}
                <button class="delete-btn" data-id="${messageId}">×</button>
            `;
            messageList.appendChild(li);

            // Очистка формы
            document.getElementById('add-message-form').reset();
        };

        if (photoInput.files[0]) {
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            reader.onload({ target: { result: '' } });
        }
    });

    // Добавление кнопки
    document.getElementById('add-button-button').addEventListener('click', () => {
        const buttonId = document.getElementById('button-id').value;
        const messageId = document.getElementById('message-id-select').value;
        const buttonText = document.getElementById('button-text').value;
        const url = document.getElementById('url').value;
        const callback = document.getElementById('callback').value;
        const responseText = document.getElementById('response-text').value;

        if (buttons.some(btn => btn.id === buttonId)) {
            alert('Кнопка с таким ID уже существует!');
            return;
        }

        const newButton = {
            id: buttonId,
            messageId: messageId,
            buttonText: buttonText,
            url: url,
            callback: callback,
            responseText: responseText
        };

        buttons.push(newButton);
        
        // Добавляем в список кнопок
        const buttonList = document.getElementById('button-list');
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>ID:</strong> ${buttonId} 
            <strong>К сообщению:</strong> ${messageId}
            <strong>Текст:</strong> ${buttonText}
            <button class="delete-btn" data-id="${buttonId}">×</button>
        `;
        buttonList.appendChild(li);

        // Очистка формы
        document.getElementById('add-button-form').reset();
    });

    // Удаление элементов
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            messages = messages.filter(msg => msg.id !== id);
            buttons = buttons.filter(btn => btn.id !== id);
            e.target.parentElement.remove();
            updateMessageSelect();
        }
    });

    // Генерация кода
    document.getElementById('generate-button').addEventListener('click', () => {
        const code = generatePythonBotCode(messages, buttons, botToken);
        document.getElementById('code-preview').textContent = code;
    });

    // Скачивание кода
    document.getElementById('download-button').addEventListener('click', () => {
        const code = document.getElementById('code-preview').textContent;
        const blob = new Blob([code], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'telegram_bot.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Сохранение пресета
    document.getElementById('save-preset-button').addEventListener('click', () => {
        const data = JSON.stringify({ messages, buttons }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${presetName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    document.getElementById('load-preset-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) {
        console.warn('Файл не выбран');
        return;
    }
	
document.getElementById('load-preset-button').addEventListener('click', () => {
    document.getElementById('load-preset-input').click(); // Имитируем клик по скрытому input
});

document.getElementById('load-preset-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            messages = data.messages || [];
            buttons = data.buttons || [];
            updateMessageSelect();
            updateUIElements();
            alert('Пресет успешно загружен!');
        } catch (err) {
            alert('Ошибка: Неверный формат файла!');
        }
    };
    reader.readAsText(file);
});

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            messages = data.messages || [];
            buttons = data.buttons || [];
            updateMessageSelect();
            updateUIElements();
            console.log('Пресет загружен:', { messages, buttons });
        } catch (err) {
            console.error('Ошибка при разборе JSON:', err);
            alert('Ошибка при загрузке файла: Некорректный JSON!');
        }
    };
    reader.onerror = function(error) {
        console.error('Ошибка при чтении файла:', error);
        alert('Ошибка при загрузке файла: Не удалось прочитать файл!');
    };
    reader.readAsText(file);
});


    // Обновление UI элементов
    function updateUIElements() {
        const messageList = document.getElementById('message-list');
        const buttonList = document.getElementById('button-list');
        
        messageList.innerHTML = messages.map(msg => `
            <li>
                <strong>ID:</strong> ${msg.id} 
                <strong>Команда:</strong> /${msg.command}
                <button class="delete-btn" data-id="${msg.id}">×</button>
            </li>
        `).join('');

        buttonList.innerHTML = buttons.map(btn => `
            <li>
                <strong>ID:</strong> ${btn.id} 
                <strong>К сообщению:</strong> ${btn.messageId}
                <strong>Текст:</strong> ${btn.buttonText}
                <button class="delete-btn" data-id="${btn.id}">×</button>
            </li>
        `).join('');
    }

    // Инициализация
    updateMessageSelect();
});

// Ваша функция генерации кода (из предыдущего ответа)
function generatePythonBotCode(messages, buttons) {
    let code = `
import telebot
from telebot import types
import base64

BOT_TOKEN = '${botToken}'  # Используем сохраненный токен
bot = telebot.TeleBot(BOT_TOKEN)\n\n`;

    messages.forEach(message => {
        code += `
@bot.message_handler(commands=['${message.command}'])
def ${message.command}_handler(message):\n`;

        // Добавляем статус "печатает", если отмечено
        if(message.showTyping) {
            code += `    bot.send_chat_action(message.chat.id, 'typing')\n`;
        }

        code += `    keyboard = None
    buttons = [button for button in buttons_data if button['messageId'] == '${message.id}']
    if buttons:
        keyboard = types.InlineKeyboardMarkup()
        for button in buttons:
            if button['url']:
                url_button = types.InlineKeyboardButton(text=button['buttonText'], url=button['url'])
                keyboard.add(url_button)
            else:
                callback_button = types.InlineKeyboardButton(text=button['buttonText'], callback_data=button['callback'])
                keyboard.add(callback_button)

    if '${message.photo}':
        try:
            photo = base64.b64decode('${message.photo}'.split(',')[1])
            bot.send_photo(message.chat.id, photo, caption='${message.text}', reply_markup=keyboard)
        except Exception as e:
            print(f"Ошибка при отправке фото: {e}")
            bot.send_message(message.chat.id, '${message.text}', reply_markup=keyboard)
    else:
        bot.send_message(message.chat.id, '${message.text}', reply_markup=keyboard)
`;
    });

    code += `
@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    btn = next((b for b in buttons_data if b['callback'] == call.data], None)
    if btn and btn['responseText']:
        bot.send_message(call.message.chat.id, "${btn.responseText.replace(/"/g, '\\"')}")
    bot.answer_callback_query(call.id)\n\n`;

    code += `
buttons_data = ${JSON.stringify(buttons)}\n\n`;

    code += `
if __name__ == '__main__':
    bot.infinity_polling()
`;

    return code;
}
