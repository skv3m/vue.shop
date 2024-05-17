import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

// Replace with your bot token and the URL to check orders
const botToken = '7026538209:AAFbM-BipTmjC-GoforI8eoJwjD5fcBdOhE';
const url = 'https://49b259f7070f2b79.mokky.dev/order';

// Create a bot instance
const bot = new TelegramBot(botToken, { polling: true });

// List of users who have started the bot
let usersWithBot = [];

// ID check variable
let idChek = 0;

// Function to create order message
const createOrderMessage = (orderData) => {
    let message = `↓\n【З】【А】【К】【А】【З】 №${orderData.id}\n\n`;
    let allPrice = 0;
    orderData.items.forEach((item, index) => {
        const name = item.title;
        const price = item.price;
        message += `Т̲о̲в̲а̲р̲: ${index + 1}\n     •Название товара: ${name}\n     •Цена товара: ${price} ₽\n\n`;
        allPrice += price;
    });
    message += `\nО͟б͟щ͟а͟я͟ ͟с͟т͟о͟и͟м͟о͟с͟т͟ь͟ ͟з͟а͟к͟а͟з͟а͟,͟ ͟с͟о͟с͟т͟а͟в͟л͟я͟е͟т͟: ${allPrice} ₽`;
    return message;
};

// Function to send message to all users
const sendMessageToAllUsers = (message) => {
    usersWithBot.forEach((userId) => {
        bot.sendMessage(userId, message);
    });
};

// Function to check orders
const checkOrders = () => {
    setInterval(async () => {
        try {
            const response = await axios.get(url);
            const items = response.data;
            if (items.length === 0) return;

            const maxItem = items.reduce((prev, curr) => (prev.id > curr.id ? prev : curr));
            if (maxItem.id !== idChek) {
                idChek = maxItem.id;
                const message = createOrderMessage(maxItem);
                sendMessageToAllUsers(message);
            }
        } catch (error) {
            console.error("Не удалось получить данные:", error);
        }
    }, 5000); // Delay between requests
};

// Handler for the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Салам');
    if (!usersWithBot.includes(chatId)) {
        usersWithBot.push(chatId);
    }
    checkOrders();
});

// Start the bot
bot.on('polling_error', console.log);