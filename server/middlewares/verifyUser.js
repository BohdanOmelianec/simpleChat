const userDB = {
    users: require("../model/users"),
    setUsers: function(data)  { this.users = data },
  };

const verifyUser = (req, res, next) => {
    const cookieId = req.headers.cookie;
    if(!cookieId) return res.sendStatus(401);

    const id = cookieId.split("=")[1];

    const foundUser = userDB.users.find((user) => user.id === id);

    if(!foundUser) return res.sendStatus(403);

    req.user = foundUser;
    next();
}

module.exports = verifyUser