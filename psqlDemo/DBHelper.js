const modules = require('./node');
const {Post,User,Category} = modules;
// CreateComment=()
CreatePost=(data)=>{
    var res;
    Post.create({
      title: data.title,
      description: data.des,
      publishDate: data.date,
      abstractBody: data.absBody,
      fullBody: data.body,
      imageURL: data.imgURL,
      status: "approving",
      userId: data.userID,
      categoryId: data.categoryID
    }, {
      include: [
        User.Post,
        Category.Post
      ]
    }).then(post =>{
      res = post
    }).catch(e => {
      console.log(e)
    })
    return res
}
UpdatePost=(data)=>{
  if (!data){
    return
  }
  Post.update({
    title: data.title,
    description: data.des,
    publishDate: data.date,
    abstractBody: data.absBody,
    fullBody: data.body,
    imageURL: data.imgURL,
    status: "approving",
    userId: data.userID,
    categoryId: data.categoryID
  },{
    where:{
      id: data.id
    }
  })
}
GetPostsByCategory=async(categoryId, offset, limit)=>{
  var res = "abc";
  Post.findAll({
    where: {
      categoryId: categoryId,
    },
    offset: offset,
    limit: limit
  }).then(data => {res=data; console.log(res)})
  return res
}
GetMostViewsPostsByCategory=(categoryId, offset, limit)=>{
  var res = "abc";
  Post.findAll({
    where: {
      categoryId: categoryId,
    },
    order: [
      ['view', 'desc']
    ],
    offset: offset,
    limit: limit
  }).then(data => {res=data; console.log(res)})
  return res
}
GetMostRecentPostsByCategory=(categoryId, offset, limit)=>{
  var res = "abc";
  Post.findAll({
    where: {
      categoryId: categoryId,
    },
    order: [
      ['createAt', 'desc']
    ],
    offset: offset,
    limit: limit
  }).then(data => {res=data; console.log(res)})
  return res
}
GetPostsByStatus=(status, offset, limit)=>{
  var res = "abc";
  Post.findAll({
    where: {
      status: status,
    },
    offset: offset,
    limit: limit
  }).then(data => {res=data; console.log(res)})
  return res
}
// CreateUser=(BOD, nickname, role)=>{
//   User.create({
//     BOD: BOD,
//     nickname: nickname,
//     role: role,  
//   })
// }
// User.update({
//   nickname: "dinh",
//   BOD: new Date()
// }, {
//   where: {
//     id: 2
//   }
// })
// const a = CreatePost(1, 1, "Dit chi tui may", "test", new Date(), "abstract Body", "body", "URL")
