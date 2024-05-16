from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext
import requests
import time
import threading

url = "https://49b259f7070f2b79.mokky.dev/order"

# Функция-обработчик для команды /start
def start(update: Update, context: CallbackContext) -> None:
    update.message.reply_text(f"Салам")
id_chek = 0
def check_orders(update: Update) -> None:
    
    while True:
        global id_chek
        response = requests.get(url)
        if response.status_code == 200:
            items = response.json()
            if not items:
                continue
            max_item = max(items, key=lambda x: x['id'])
            if max_item !=id_chek:
                id_chek = max_item
                #update.message.reply_text(f"↓\n↓\n↓\n↓\n↓")
                #update.message.reply_text(f"↓\n↓\n↓\n↓\n↓\n【З】【А】【К】【А】【З】 №{max_item['id']}")
                i = 0
                all_price = 0
                otv =f"↓\n【З】【А】【К】【А】【З】 №{max_item['id']}\n\n"
                for item in max_item["items"]:
                    i += 1
                    name = item['title']
                    price = item['price']
                    otv = otv + f"Т̲о̲в̲а̲р̲: {i}\n     •Название товара: {name}\n     •Цена товара: {price} ₽\n\n"
                    all_price += price
                update.message.reply_text(f"{otv}\nО͟б͟щ͟а͟я͟ ͟с͟т͟о͟и͟м͟о͟с͟т͟ь͟ ͟з͟а͟к͟а͟з͟а͟,͟ ͟с͟о͟с͟т͟а͟в͟л͟я͟е͟т͟: {all_price} ₽")
        else:
            print("Не удалось получить данные.")
        
        # Задержка между запросами
        time.sleep(5)

def GET(update: Update, context: CallbackContext) -> None:
    # Запуск функции check_orders в отдельном потоке
    thread = threading.Thread(target=check_orders, args=(update,))
    thread.start()

def main() -> None:
    # Инициализация бота с токеном
    updater = Updater("7026538209:AAFbM-BipTmjC-GoforI8eoJwjD5fcBdOhE")
    dispatcher = updater.dispatcher

    # Регистрация обработчиков команд
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("GET", GET))

    # Старт работы бота
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()