function generatePythonBotCode(messages, buttons, botToken) {
  let code = `
import telebot
from telebot import types
import base64

# Замените 'YOUR_BOT_TOKEN' на токен вашего бота
BOT_TOKEN = '${botToken}'
bot = telebot.TeleBot(BOT_TOKEN)

# Обработчики команд
`;

  messages.forEach(message => {
    code += `
@bot.message_handler(commands=['${message.command}'])
def ${message.command}_handler(message):
    # Создаем клавиатуру, если есть кнопки для этого сообщения
    keyboard = None
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

    # Отправляем сообщение с учетом фотографии (если есть) и клавиатуры
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
# Обработчик callback-запросов
@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    # Обрабатываем callback-запросы от кнопок
    bot.answer_callback_query(call.id, "Вы нажали кнопку!")  # Просто пример
    # Здесь можно добавить логику обработки различных callback-запросов

# Список кнопок (пример)
buttons_data = ${JSON.stringify(buttons)}

# Запуск бота
if __name__ == '__main__':
    bot.infinity_polling()
`;

  return code;
}
