const jsonServer = require("json-server"); 
const bodyParser = require("body-parser"); 
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080; //  choose port from here like 8080, 3001

server.use(middlewares);
server.use(bodyParser.json()); // using bodyParser to parse JSON data

server.use(async (req, res, next) => {
    await new Promise((res) => {
        setTimeout(res, 3000);
    });
    next();
});

server.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const db = require("./db.json");
        const { users = [] } = db;

        const userFromBd = users.find(
            (user) => user.username === username && user.password === password,
        );

        if (userFromBd) {
            return res.json(userFromBd);
        }

        return res.status(403).json({ message: 'User not found' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: e.message });
    }
});

server.use((req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: 'AUTH ERROR' });
    }

    next();
});

server.use(router); // make sure to keep this line below other routes

server.listen(port);
