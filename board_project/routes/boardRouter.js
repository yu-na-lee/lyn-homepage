const express = require('express');
const router = express.Router();
const pool = require('../db'); 


router.get('/new', (req, res) => {
    res.render('post_new', { boardTitle: '새 글 작성' });
});


router.post('/', async (req, res) => {
    
    let connection;

    const { title, content } = req.body;
    
    
    const userId = 1; 
    const boardType = 'FREE'; 

    try {
        connection = await pool.getConnection();

        
        await connection.execute(
            `INSERT INTO Post (user_id, board_type, title, content, view_count)
             VALUES (?, ?, ?, ?, 0)`,
            [userId, boardType, title, content]
        );

        res.redirect('/board/free');

    } catch (error) {
        console.error('게시물 작성 중 에러 발생:', error);
        res.status(500).send('게시물 작성에 실패했습니다.');
    } finally {
        if (connection) connection.release();
    }
});


router.get('/edit/:post_id', async (req, res) => {
    
    let connection;
    const postId = req.params.post_id;

    try {
        connection = await pool.getConnection();
        
        const [rows] = await connection.execute(
            `SELECT post_id, title, content 
             FROM Post 
             WHERE post_id = ?`,
            [postId]
        );

        if (rows.length === 0) {
            res.status(404).send('수정할 게시물을 찾을 수 없습니다.');
            return;
        }

        const post = rows[0];

        res.render('post_edit', { 
            boardTitle: '게시물 수정',
            post: post,
            postId: postId
        });

    } catch (error) {
        console.error('수정 폼 로드 에러:', error);
        res.status(500).send('수정 페이지를 불러오는 데 실패했습니다.');
    } finally {
        if (connection) connection.release();
    }
});

router.post('/edit/:post_id', async (req, res) => {
    
    let connection;
    const postId = req.params.post_id;
    const { title, content } = req.body;
    
    try {
        connection = await pool.getConnection();

        await connection.execute(
            `UPDATE Post SET title = ?, content = ?, updated_at = NOW() 
             WHERE post_id = ?`,
            [title, content, postId]
        );

        res.redirect(`/post/${postId}`);

    } catch (error) {
        console.error('게시물 수정 중 에러 발생:', error);
        res.status(500).send('게시물 수정에 실패했습니다.');
    } finally {
        if (connection) connection.release();
    }
});

router.post('/delete/:post_id', async (req, res) => {
    
    let connection;
    const postId = req.params.post_id;
    
    try {
        connection = await pool.getConnection();

        await connection.execute(
            `DELETE FROM Post WHERE post_id = ?`,
            [postId]
        );

        res.redirect('/board/free');

    } catch (error) {
        console.error('게시물 삭제 중 에러 발생:', error);
        res.status(500).send('게시물 삭제에 실패했습니다.');
    } finally {
        if (connection) connection.release();
    }
});


router.get('/free', async (req, res) => {
    
    let connection; 

    const page = parseInt(req.query.page) || 1; 
    const pageSize = 10; 
    const offset = (page - 1) * pageSize; 
    const boardType = 'FREE'; 
    const searchKeyword = req.query.search || ''; 
    
    let whereClause = 'WHERE p.board_type = ?';
    let queryParams = [boardType];

    if (searchKeyword) {
        whereClause += ' AND p.title LIKE ?';
        queryParams.push(`%${searchKeyword}%`);
    }

    try {
        connection = await pool.getConnection(); 

        const [totalCountRows] = await connection.execute(
            `SELECT COUNT(*) AS total_count FROM Post p ${whereClause}`,
            queryParams 
        );
        const totalCount = totalCountRows[0].total_count;
        const totalPages = Math.ceil(totalCount / pageSize);

        const [posts] = await connection.execute(
            `SELECT p.post_id, p.title, p.view_count, p.created_at, u.name as writer_name
             FROM Post p
             JOIN User u ON p.user_id = u.user_id
             ${whereClause} 
             ORDER BY p.created_at DESC 
             LIMIT ${pageSize} OFFSET ${offset}`,
            queryParams
        );

        res.render('board_list', {
            posts: posts,
            page: page,
            totalPages: totalPages,
            boardTitle: '자유 게시판',
            searchKeyword: searchKeyword
        });

    } catch (error) {
        console.error('게시물 목록 조회 중 심각한 에러 발생:', error); 
        res.status(500).send('서버에서 데이터를 가져오는 데 실패했습니다. (DB 쿼리 오류)');
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


router.get('/:post_id', async (req, res) => {
    
    let connection;
    const postId = req.params.post_id; 

    try {
        connection = await pool.getConnection();

        await connection.execute(
            `UPDATE Post SET view_count = view_count + 1 WHERE post_id = ?`,
            [postId]
        );

        const [rows] = await connection.execute(
            `SELECT p.*, u.name as writer_name 
             FROM Post p
             JOIN User u ON p.user_id = u.user_id
             WHERE p.post_id = ?`,
            [postId]
        );

        if (rows.length === 0) {
            res.status(404).send('게시물을 찾을 수 없습니다.');
            return;
        }

        const post = rows[0];

        res.render('post_view', { post: post });

    } catch (error) {
        console.error('게시물 본문 조회 에러:', error);
        res.status(500).send('게시물 상세 정보를 가져오는 데 실패했습니다.');
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;