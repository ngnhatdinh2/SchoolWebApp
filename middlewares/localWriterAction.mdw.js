var actionList = [{ action: "Danh sách bài viết", href: "/writer" },
{ action: "Đăng bài", href: "/writer/newpost" },
{ action: "Bài viết đã được duyệt", href: "/writer/publishedpost" },
{ action: "Bài viết chờ duyệt", href: "/writer/pendingpost" },
{ action: "Bài viết không được duyệt", href: "/writer/bannedpost" }];
module.exports = {
    actionList: (req, res, next) => {
        res.locals.lcActionList = actionList;
        next();
    }
}