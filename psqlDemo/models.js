const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/dinh');
class Comment extends Model{}
Comment.init({
  name: Sequelize.TEXT
},{
  sequelize,
  modelName: 'comment'
} 
);

class Tag extends Model{}
Tag.init({
  name: Sequelize.TEXT
},{
  sequelize,
  modelName: 'tag'
} 
);

class Post extends Model{}
Post.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  publishDate: Sequelize.DATE,
  abstractBody: Sequelize.TEXT,
  fullBody: Sequelize.TEXT,
  imageURL: Sequelize.TEXT,
}, { sequelize, modelName: 'post' });
module.exports = Post, Comment, Tag;