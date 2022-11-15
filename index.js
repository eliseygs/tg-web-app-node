const TelegramBot = require('node-telegram-bot-api');
const express= require('express');
const cors= require('cors');

// replace the value below with the Telegram token you receive from @BotFather
const token='5729960715:AAFKTA8mkkw5odRQZ37b_bGuCkjWl5T2RKo';
const webAppUrl='https://whimsical-blini-0763b4.netlify.app';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text= msg.text;

  if(text==='/start'){
      await bot.sendMessage(chatId, 'ok',{
          reply_markup:{
              keyboard:[
                  [{text: 'dk', web_app:{url: webAppUrl + '/form'}}]
              ]
          }
      })
  }
  
      await bot.sendMessage(chatId, 'okkk',{
          reply_markup:{
              inline_keyboard:[
                  [{text: 'dk', web_app:{url: webAppUrl}}]
              ]
          }
      })

      if(msg?.web_app_data?.data){
          try{
              const data= JSON.parse(msg?.web_app_data?.data)
          
              await bot.sendMessage(chatId,'thank for reverse connect')
              await bot.sendMessage(chatId,'your country' + data?.country)
              await bot.sendMessage(chatId,'your street' + data?.street)

              setTimeout(async() => {
                  await bot.sendMessage('all info you get in this chat')
              }, 3000)
          }catch(e){
              console.log(e)
          }
      }
  
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

app.post('/web-data',(req, res) =>{
    try{
    const {queryId, products, totalPrice}=req.body;
    bot.answerWebAppQuery(queryId,{
        type: 'article',
        id: queryId,
        title:'succes buy',
        input_message_content:{message_text:'happy for you for buy'+ totalPrice}
    })
        return res.status(200).json({})
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'dont succes',
            input_message_content: {message_text:'dont get item'}
        })
        return res.status(500).json({})
    }

}
)
const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))