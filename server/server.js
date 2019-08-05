const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

class Message extends Sequelize.Model {}
Message.init({
  content: Sequelize.STRING,
  displayName: Sequelize.STRING,
  clicked: Sequelize.STRING,
  countMetal: Sequelize.INTEGER
}, { sequelize, modelName: 'message' });

app.post('/api', function (req, res) {
  console.log(req.body.displayName);
  sequelize.sync()
    .then(() => Message.create({
      content: req.body.content,
      displayName: req.body.displayName,
      clicked: "",
      countMetal: 0
    }))
    .then(mes => {
      console.log(mes.toJSON());
  });
});

app.get('/api', function (req, res) {
  const response = [
  { id: 0,
    displayName: "A県B小C.D君",
    content: "失恋した",
    clicked: 'new Map([["hokkaido", 3],["aomori", 3],["okinawa", 51],["osaka", 101],["siga",151]])',
    countMetal: 100
  },
  {
    id: 1,
    displayName: "D県B小C.D君",
    content: "恋した",
    clicked: 'new Map[["kanagawa", 3],["aomori", 3],["okinawa", 51],["osaka", 101],["siga",151]]',
    countMetal: 50
  }
  ]
  res.set('Content-Type', 'application/json');
  res.send(response);
});


if (process.env.NODE_ENV === 'production') {
  console.log(`Production mode detected: Serving client`);
  const path = require('path');

  const buildDir = path.join(__dirname, '../client/build');

  app.use(express.static(buildDir));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});

