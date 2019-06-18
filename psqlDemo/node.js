const Sequelize = require('sequelize');
const Moment = require('moment');
const Model = Sequelize.Model;
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/dinh');

// Init Classes
class Comment extends Model{}
class Tag extends Model{}
//Category: name
class Category extends Model{}
class Post extends Model{}
class User extends Model{}
class Worker extends Model{}

Comment.init({
  date: Sequelize.DATE,
  body: Sequelize.STRING
},{ sequelize, modelName: 'comment'});

Tag.init({
  name: Sequelize.TEXT
  },{ sequelize, modelName: 'tag'});

Category.init({
  name: {
    type: Sequelize.STRING,
  }
}, { sequelize, modelName: 'category' });

Post.init({
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  publishDate: Sequelize.DATE,
  abstractBody: Sequelize.TEXT,
  fullBody: Sequelize.TEXT,
  imageURL: Sequelize.TEXT,
  status: Sequelize.TEXT,
  view: Sequelize.INTEGER
}, { sequelize, modelName: 'post' });

Worker.init({ // Tags_Posts
  user_id: Sequelize.STRING,
  tag_id: Sequelize.STRING
}, { sequelize, modelName: 'posts_tags'})

User.init({
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  BOD: Sequelize.DATE,
  nickname: Sequelize.STRING,
  role: Sequelize.TEXT,
}, {sequelize, modelName:'user'});

Comment.belongsTo(Post)
Comment.belongsTo(User)
Category.Post = Category.hasMany(Post)
Post.hasMany(Comment)
User.Post = User.hasMany(Post);
Post.belongsToMany(Tag, {through: Worker, foreignKey: "user_id", otherKey: 'id'});
Tag.belongsToMany(Post, {through: Worker, foreignKey: 'tag_id', otherKey: 'id'});
sequelize.sync({force: true});
// Post.sync({alter: true})


CreatePost=(userID, category, title, des, date, absBody, body, imgURL)=>{
  var res;
  Post.create({
    title: title,
    description: des,
    publishDate: date,
    abstractBody: absBody,
    fullBody: body,
    imageURL: imgURL,
    status: "approving",
    userId: userID,
    categoryId: category
  }, {
    include: [{
    association: User.Post
  }, {
    association: Category.Post
  }]
  }).then(post =>{
    res = post
  }).catch(e => {
    console.log(e)
    return
  })
  // gang Tag cho no
  Worker.create({
    
  })
  return res
}





module.exports = {Post, User, Comment, Tag, Category};




