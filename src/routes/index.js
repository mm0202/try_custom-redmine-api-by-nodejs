var express = require('express');
var router = express.Router();
var axios = require('axios');

// 起動確認用ページ
router.get('/', function (req, res) {
  res.render('index', {title: 'Express'});
});

// API リクエストのデフォルト設定
axios.defaults.baseURL = 'http://' + process.env.REDMINE_API;
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'X-Redmine-API-Key': process.env.API_ACCESS_KEY
};

// カスタム Projects API
var projects = express.Router();

// プロジェクトリスト表示
projects.get('/', async (req, res, next) => {
  const response = await axios.get('/projects.json').catch(next);
  res.send(response.data)
});

// プロジェクト検索
projects.get('/search', async (req, res, next) => {
  const response = await axios.get('/projects.json').catch(next);

  const result = [];
  for (let project of response.data.projects) {
    if (project.identifier.match(req.query.key)) {
      result.push(project)
    }
  }

  res.send(result)
});

// プロジェクト一括追加
projects.post('/addMany', async (req, res, next) => {
  const result = [];

  for (let identifier of req.body.identifiers) {
    const response = await axios.post('/projects.json', {
      project: {
        name: identifier,
        identifier: identifier
      }
    }).catch(next);

    result.push(response.data)
  }

  res.send(result)
});

// 全プロジェクトの削除
projects.delete('/all', async (req, res, next) => {
  const response = await axios.get('/projects.json').catch(next);

  const result = [];
  for (let project of response.data.projects) {
    const response = await axios.delete(
        `/projects/${project.identifier}.json`
    ).catch(next);

    result.push(response.data)
  }

  res.send(result)
});


router.use('/projects', projects);

module.exports = router;