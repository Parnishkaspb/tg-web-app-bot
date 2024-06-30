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
        // await bot.sendMessage(chatId, 'Здравствуйте! Управляющий на связи🤝', {
        //     reply_markup: {
        //         keyboard: [
        //             [{ text: 'Обратная связь', web_app: { url: webAppUrl + '/form' } }]
        //         ]
        //     }
        // });
        await bot.sendMessage(chatId, `Здравствуйте! Управляющий на связи🤝\n${msg.from.username}, в этом боте вы можете:`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Заказать услугу', web_app: { url: webAppUrl } }],
                    [{ text: 'Мои пропуска', web_app: { url: webAppUrl + '/all_number_template' } }],
                    [{ text: 'Заказать документы', web_app: { url: webAppUrl + '/all_number_template' } }]
                ]
            }
        });
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);

            await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
            // await bot.sendMessage(chatId, 'Страна: ' + data?.country);
            // await bot.sendMessage(chatId, 'Улица: ' + data?.street);
        } catch (error) {
            console.log(error);
        }

    }
});


app.post('/web-data', async (req, res) => {
    const fs = require('fs');

    // Указываем путь и имя файла
    const filePath = './example.txt';

    // Указываем содержимое файла
    const fileContent = 'Hello, this is a test file created using Node.js';

    // Записываем содержимое в файл
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('File has been created successfully');
        }
    });
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


app.post('/data', async (req, res) => {
    const data = req.body;
    return res.status(200).json({ data });
    // const { query_id, number, timeToEnd, subject, what } = req.body;
    // try {
    //     await bot.answerWebAppQuery(query_id, {
    //         type: 'article',
    //         id: query_id,
    //         title: 'Успешное добавление',
    //         input_message_content: { message_text: `РГЗ ${number} успешно добавлен в систему. Срок действия: ${dateTime}` }
    //     })

    //     // INSERT INTO NumberPlate() VALUES();

    //     return res.status(200).json({});
    // } catch (error) {
    //     await bot.answerWebAppQuery(query_id, {
    //         type: 'article',
    //         id: query_id,
    //         title: 'Ошибка',
    //         input_message_content: { message_text: 'По техническим причинам не удалось добавить номер в систему.' }
    //     })
    //     return res.status(500).json({});
    // }
})



const PORT = 8000;
app.listen(PORT, () => console.log('server started on PORT ' + PORT));