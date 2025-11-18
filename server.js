const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db'); 
const boardRouter = require('./routes/boardRouter'); 

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = 3000; 


app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));


app.use(express.json()); 

app.use(express.urlencoded({ extended: true })); 


app.use('/post', boardRouter); 
app.use('/board', boardRouter); 


app.get('/', (req, res) => {
    res.redirect('/board/free'); 
});


app.get('/test', (req, res) => {
    res.send('테스트 라우트가 잘 작동 중입니다.');
});



app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중.`);
});