const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const TOKEN = '7249004146:AAE3ykdSUC3QBB5s_j6dO3L7Gn048gi0xy8';
const webAppUrl = 'https://bright-croissant-93794d.netlify.app';
const bot = new TelegramBot(TOKEN, { polling: true });

const app = express();
app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Кнопки доступа', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Заполните форму', web_app: { url: webAppUrl + '/form' } }]
                ]
            }
        });

        await bot.sendMessage(chatId, 'Кнопки доступа', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Пропуск', web_app: { url: webAppUrl } }]
                ]
            }
        });
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);

            await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
            await bot.sendMessage(chatId, 'Страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Улица: ' + data?.street);
        } catch (error) {
            console.log(error);
        }

    }
});


app.post('/web-data', async (req, res) => {
    const { query_id, products, totalPrice } = req.body;
    try {
        await bot.answerWebAppQuery(query_id, {
            type: 'article',
            id: query_id,
            title: 'Успешная покупка',
            input_message_content: { message_text: 'Успешная покупка на сумму ' + totalPrice }
        })
        return res.status(200);
    } catch (error) {
        await bot.answerWebAppQuery(query_id, {
            type: 'article',
            id: query_id,
            title: 'Ошибка',
            input_message_content: { message_text: 'Не удалось приобрести товар' }
        })
        return res.status(500);
    }

})



const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT ' + PORT));