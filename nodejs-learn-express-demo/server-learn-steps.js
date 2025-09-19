// package.json에 다음 종속성을 추가하세요:
// {
//   "dependencies": {
//     "express": "^4.18.2",
//     "ejs": "^3.1.9",
//     "multer": "^1.4.5-lts.1"
//   }
// }

const express = require('express');
const app = express();
const port = 3000;

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', './views');

// ---
// Level 1: 가장 기본적인 GET 요청 처리
// HTML: <form action="/submit-get" method="GET">
//   <input type="text" name="username">
//   <button type="submit">제출</button>
// </form>
// ---

app.get('/', (req, res) => {
    res.render('form-level-01'); 
});
// GET 요청으로 받은 폼 데이터는 req.query에 담깁니다.
app.get('/submit-get', (req, res) => {
    // URL: /submit-get?username=nodejs
    const username = req.query.username;
    res.send(`<h1>Level 1: GET 요청 성공!</h1>
              <p>환영합니다, ${username}님!</p>`);
});

// ---
// Level 2: POST 요청 처리 (urlencoded 미들웨어 사용)
// HTML: <form action="/submit-post" method="POST">
//   <input type="text" name="username">
//   <button type="submit">제출</button>
// </form>
// ---

// POST 요청의 본문을 파싱하기 위해 이 미들웨어가 필수입니다.
// extended: false는 쿼리스트링 라이브러리(qs) 대신 내장 라이브러리(querystring)를 사용합니다.
app.use(express.urlencoded({ extended: true }));

app.get('/level2', (req, res) => {
    res.render('form-level-02'); 
});
app.post('/submit-post', (req, res) => {
    // POST 요청으로 받은 폼 데이터는 req.body에 담깁니다.
    const username = req.body.username;
    res.send(`<h1>Level 2: POST 요청 성공!</h1>
              <p>환영합니다, ${username}님!</p>`);
});

// ---
// Level 3: 여러 개의 폼 필드 처리
// HTML: <form action="/submit-multiple" method="POST">
//   <input type="text" name="name" placeholder="이름">
//   <input type="email" name="email" placeholder="이메일">
//   <input type="number" name="age" placeholder="나이">
//   <button type="submit">제출</button>
// </form>
// ---

app.get('/level3', (req, res) => {
    res.render('form-level-03'); 
});
app.post('/submit-multiple', (req, res) => {
    const { name, email, age } = req.body;
    res.send(`<h1>Level 3: 여러 필드 처리 성공!</h1>
              <p>이름: ${name}, 이메일: ${email}, 나이: ${age}</p>`);
});

// ---
// Level 4: 간단한 서버 측 폼 유효성 검사
// HTML: <form action="/submit-validate" method="POST">
//   <input type="text" name="title" placeholder="제목 (필수)">
//   <input type="text" name="content" placeholder="내용 (필수)">
//   <button type="submit">제출</button>
// </form>
// ---

app.get('/level4', (req, res) => {
    res.render('form-level-04'); 
});
app.post('/submit-validate', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send('<h1>Level 4: 유효성 검사 실패!</h1><p>제목과 내용을 모두 입력해주세요.</p>');
    }
    res.send(`<h1>Level 4: 유효성 검사 성공!</h1><p>제목: ${title}, 내용: ${content}</p>`);
});

// ---
// Level 5: 폼 제출 후 새로운 페이지로 리디렉션
// HTML: <form action="/process-redirect" method="POST">
//   <input type="text" name="message" placeholder="메시지">
//   <button type="submit">제출</button>
// </form>
// ---

app.get('/level5', (req, res) => {
    res.render('form-level-05'); 
});
app.post('/process-redirect', (req, res) => {
    const message = req.body.message;
    // 제출된 데이터를 쿼리스트링에 담아 리디렉션
    res.redirect(`/result?message=${message}`);
});

app.get('/result', (req, res) => {
    const message = req.query.message;
    res.send(`<h1>Level 5: 제출 결과 페이지</h1><p>입력하신 메시지: ${message}</p>`);
});

// ---
// Level 6: EJS 템플릿 엔진을 사용해 폼 데이터 렌더링
// views/form.ejs 파일 생성:
// <h1>게시글 작성</h1>
// <form action="/post-article" method="POST">
//   제목: <input type="text" name="title"><br>
//   내용: <textarea name="content"></textarea><br>
//   <button type="submit">작성</button>
// </form>
//
// views/article.ejs 파일 생성:
// <h1>게시글 보기</h1>
// <h3>제목: <%= title %></h3>
// <p>내용: <%= content %></p>
// ---
app.get('/level6', (req, res) => {
    res.render('form-level-06'); 
});

app.post('/post-article', (req, res) => {
    const { title, content } = req.body;
    // article.ejs 파일을 렌더링하면서 데이터 전달
    res.render('article', { title, content });
});

// ---
// Level 7: 단일 파일 업로드 처리
// HTML: <form action="/upload-single" method="POST" enctype="multipart/form-data">
//   <input type="file" name="singleFile">
//   <button type="submit">업로드</button>
// </form>
//
// 주의: "multer" 라이브러리가 필요합니다.
// ---
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // 파일이 저장될 경로

app.get('/level7', (req, res) => {
    res.render('form-level-07'); 
});
app.post('/upload-single', upload.single('singleFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('<h1>Level 7: 파일 업로드 실패!</h1><p>파일을 선택해주세요.</p>');
    }
    const file = req.file;
    res.send(`<h1>Level 7: 단일 파일 업로드 성공!</h1>
              <p>파일 이름: ${file.originalname}</p>
              <p>저장된 이름: ${file.filename}</p>`);
});

// ---
// Level 8: 여러 파일 업로드 처리
// HTML: <form action="/upload-multiple" method="POST" enctype="multipart/form-data">
//   <input type="file" name="multipleFiles" multiple>
//   <button type="submit">업로드</button>
// </form>
// ---
app.get('/level8', (req, res) => {
    res.render('form-level-08'); 
});
app.post('/upload-multiple', upload.array('multipleFiles'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('<h1>Level 8: 여러 파일 업로드 실패!</h1><p>파일을 하나 이상 선택해주세요.</p>');
    }
    const files = req.files.map(file => `<li>${file.originalname}</li>`).join('');
    res.send(`<h1>Level 8: 여러 파일 업로드 성공!</h1>
              <p>업로드된 파일 목록:</p>
              <ul>${files}</ul>`);
});


// ---
// Level 9: 간단한 데이터베이스 통합 (메모리 배열)
// HTML: <form action="/add-item" method="POST">
//   <input type="text" name="item" placeholder="할 일 추가">
//   <button type="submit">추가</button>
// </form>
// ---

let items = []; // 간단한 인메모리 데이터베이스 역할

app.get('/list', (req, res) => {
    const listHtml = items.map((item, index) => `<li>${item}</li>`).join('');
    res.send(`<h1>Level 9: 할 일 목록</h1>
              <ul>${listHtml}</ul>
              <form action="/add-item" method="POST">
                  <input type="text" name="item" placeholder="할 일 추가">
                  <button type="submit">추가</button>
              </form>`);
});

app.post('/add-item', (req, res) => {
    const item = req.body.item;
    if (item) {
        items.push(item);
    }
    res.redirect('/list'); // 목록 페이지로 리디렉션
});

// ---
// Level 10: CRUD (Create, Read, Update, Delete)
// HTML: /crud 경로에 아래 폼과 목록, 버튼을 모두 포함
// <form action="/create-crud" method="POST">...</form> (Create)
// 목록: <ul>...<li><button>수정</button><button>삭제</button></li>...</ul> (Read, Update, Delete)
//
// 주의: Level 9의 items 배열을 확장합니다.
// ---

app.get('/crud', (req, res) => {
    const listHtml = items.map((item, index) => `
        <li>
            ${item}
            <form action="/update-crud/${index}" method="POST" style="display:inline;">
                <input type="text" name="updatedItem" placeholder="새 내용">
                <button type="submit">수정</button>
            </form>
            <form action="/delete-crud/${index}" method="POST" style="display:inline;">
                <button type="submit">삭제</button>
            </form>
        </li>
    `).join('');
    res.send(`<h1>Level 10: CRUD 예제</h1>
              <h2>할 일 목록</h2>
              <ul>${listHtml}</ul>
              <h2>새 할 일 추가</h2>
              <form action="/create-crud" method="POST">
                  <input type="text" name="item" placeholder="할 일 추가">
                  <button type="submit">추가</button>
              </form>`);
});

app.post('/create-crud', (req, res) => {
    const item = req.body.item;
    if (item) items.push(item);
    res.redirect('/crud');
});

app.post('/update-crud/:index', (req, res) => {
    const index = req.params.index;
    const updatedItem = req.body.updatedItem;
    if (index >= 0 && index < items.length && updatedItem) {
        items[index] = updatedItem;
    }
    res.redirect('/crud');
});

app.post('/delete-crud/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < items.length) {
        items.splice(index, 1);
    }
    res.redirect('/crud');
});


// Express 서버 시작
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log('실습을 시작하려면 브라우저에서 http://localhost:3000 으로 접속하세요.');
});

// 각 레벨의 HTML 폼은 다음과 같이 구성할 수 있습니다.
// 예를 들어, Level 1의 HTML은 다음과 같습니다:
// <!DOCTYPE html>
// <html lang="ko">
// <head>
//     <meta charset="UTF-8">
//     <title>Level 1 Form</title>
// </head>
// <body>
//     <h1>Level 1: GET 요청 폼</h1>
//     <form action="/submit-get" method="GET">
//         <label for="username">이름:</label>
//         <input type="text" id="username" name="username">
//         <button type="submit">제출</button>
//     </form>
// </body>
// </html>

// 나머지 레벨의 HTML 폼도 유사한 방식으로 작성할 수 있습니다.
// Level 6을 위해 'views' 폴더와 'views/form.ejs', 'views/article.ejs' 파일을 생성해야 합니다.

