const userDB = {
    users: require("../model/users"),
    setUsers: function(data)  { this.users = data },
  };
  
  const fsPromises = require("fs").promises;
  const path = require("path");
  const bcrypt = require("bcrypt");
  const { v4 } = require('uuid');
  
  const register = async (req, res) => {
    const { userName, password } = req.body;
  
    if (!userName || !password) {
      return res.status(400).json({ error: "User name and password are required" });
    }
  
    const duplicate = userDB.users.find((user) => user.userName === userName);
  
    if (duplicate) {
      return res.sendStatus(409);
    }
  
    try {
      const usersFilePath = path.join(__dirname, "..", "model", "users.json");
      const hashedPwd = await bcrypt.hash(password, 10);
      const newUser = {
        userName: userName,
        password: hashedPwd,
        id: v4(),
        socketID: undefined,
      };
  
      userDB.setUsers([...userDB.users, newUser]);
      
      await fsPromises.writeFile(
        usersFilePath,
        JSON.stringify(userDB.users)
      );
      
      res.status(201).json({...newUser, password});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  const login = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ error: "User name and password are required" });
    }
  
    const foundUser = userDB.users.find((user) => user.userName === userName);
console.log(foundUser)
    if(!foundUser) return res.sendStatus(401); //Unauthorized

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      //create JWT
      res.cookie("id", foundUser.id, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
      
      const user = {...foundUser};
      // delete user.password;
      res.status(200).json(user);
    } else {
      res.sendStatus(401);
    }
  };

  const autoLogin = async (req, res) => {
    const user = req.user;
    
    if (!user) return res.sendStatus(401);

      //create JWT
    res.cookie("id", user.id, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    delete user.password;
    res.status(200).json(user);
  };

  const logout = async (req, res) => {
   
    res.clearCookie("id", { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    res.sendStatus(204);
  };
  
  module.exports = { register, login, autoLogin, logout }
  