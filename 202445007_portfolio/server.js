const express = require('express');
const db = require('./db_config');
const app = express();
const port = 3000;

app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.set('views', './views'); 

app.get('/db-test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT NOW() as `current_time`'); 
        res.send(`DB 연결 테스트 성공! 현재 시간: ${rows[0].current_time}`);
    } catch (error) {
        console.error('DB 쿼리 오류:', error);
        res.status(500).send('DB 연결 테스트 실패.');
    }
});

app.get('/', async (req, res) => {
    try {
        const userId = '202445007'; 

        const userQuery = 'SELECT name, major, self_introduction FROM User WHERE user_id = ?';
        const [userRows] = await db.query(userQuery, [userId]);
        const userData = userRows[0]; 

        if (!userData) {
            return res.status(404).send('사용자 정보를 찾을 수 없습니다. User 테이블에 데이터를 넣어주세요.');
        }

        const projectQuery = 'SELECT title, period, description, project_link FROM Project WHERE user_id = ? ORDER BY proj_id DESC';
        const [projectRows] = await db.query(projectQuery, [userId]);
        const projects = projectRows;

        const skillQuery = 'SELECT skill_id, skill_name, category FROM Skill ORDER BY category, skill_name';
        const [skillRows] = await db.query(skillQuery);
        const skills = skillRows;

        res.render('index', { 
            name: userData.name,
            major: userData.major,
            introduction: userData.self_introduction,
            projects: projects,
            skills: skills 
        }); 

    } catch (error) {
        console.error('메인 페이지 데이터 조회 오류:', error);
        res.status(500).send('서버 오류로 데이터를 불러올 수 없습니다.');
    }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});