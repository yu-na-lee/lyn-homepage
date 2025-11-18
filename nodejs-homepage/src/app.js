
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.get('/', (req, res) => {
  res.render('index', { title: 'SweetFactory' });
});

app.get('/products', (req, res) => {
  res.render('products', { title: 'Products' });
});

app.get('/marketing', (req, res) => {
  res.render('marketing', { title: 'Marketing' });
});

app.get('/quality', (req, res) => {
  res.render('quality', { title: 'Quality' });
});

app.get('/vision', (req, res) => {
  res.render('vision', { title: 'Vision' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.post('/submit-multiple', (req, res) => {
  console.log(req.body);
  res.render('login', { title: 'Login' });
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
