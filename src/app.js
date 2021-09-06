const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const session = require('express-session')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const morgan = require('morgan')
const port = 5000

const db = require('./utils/mongoose')
const Users = require('./models/User');
const User = require('./models/User');
const AuthControllers = require('./controllers/Auth')

app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(morgan('combined'))

// Use Cors
app.use(cors())

// Connect DB
db.connect()

// Custome Middleware to parser req.body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(passport.initialize())

app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    if (user.provider === 'google') {
        Users.findOne({ authGoogleId: user.id })
            .then((user) => {
                console.log(user)
                return done(null, user)
            })
            .catch(err => done(err))
    } else {
        Users.findOne({ authFacebookId: user.id })
            .then((user) => {
                console.log(user)
                return done(null, user)
            })
            .catch(err => done(err))
    }
});

passport.use(new GoogleStrategy({
        clientID: '255813218760-vs1m4qc7hjmkqdc7etfi91mthlua3ooe.apps.googleusercontent.com',
        clientSecret: 'JsXx2jLcv44DKNhcEbBKNSFc',
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true
    },
    async function(request, accessToken, refreshToken, profile, done) {
        console.log(profile)
            //console.log(profile)
        const user = await Users.findOne({ authGoogleId: profile.id })
        if (user) return done(null, profile)

        // Tạo User
        const newUser = new Users({
            authGoogleId: profile.id,
            username: profile.displayName
        })
        newUser.save()
        return done(null, profile)
    }
));

// app.get('/auth/google', AuthControllers.getGoogle);

// app.get('/auth/google/callback', AuthControllers.getGoogleCallback);
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        //successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    }),
    function(req, res) {
        res.redirect('/admin')
    });


app.get('/admin', (req, res, next) => {
    console.log(req.user)
    res.render('home', {
        user: (req.user).toObject()
    })
})

// Facebook
passport.use(new FacebookStrategy({
        clientID: '6195697313804323',
        clientSecret: '1e30d72ebfdcd23996657486dd37a828',
        callbackURL: "http://localhost:5000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
            //console.log(profile)
        const user = await Users.findOne({ authFacebookId: profile.id })
        if (user) return cb(null, profile)

        // Tạo User
        const newUser = new Users({
            authFacebookId: profile.id,
            username: profile.displayName
        })
        newUser.save()
        return cb(null, profile)
    }
));
app.get('/auth/facebook',
    passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/admin')
    });

app.get('/admin', (req, res, next) => {
    console.log(req.user)
    res.render('home', {
        user: (req.user).toObject()
    })
})


passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username)
        User.findOne({
                username: username,
                password: password
            })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                } else {
                    done(null, user)
                }
            })
            .catch(err => {
                done(err)
            })
    }
));


app.get('/login', (req, res, next) => {
    res.render('login')
})

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) { return res.json('Loi Sever!'); }
        if (!user) { return res.json('Username or password is incorrect!'); }
        console.log(user)
        try {
            var token = jwt.sign({ id: user._id }, 'mk')
                //console.log(token)
            req.session.token = token
            res.redirect('/private')
        } catch (error) {
            return res.json('Loi Token')
        }
    })(req, res, next);
});


app.get('/private', (req, res, next) => {
    //console.log(req.session.token)
    if (req.session.token) {
        //console.log(req.session)
        try {
            var data = jwt.verify(req.session.token, 'mk')
            Users.findById(data.id)
                .then(user => {
                    console.log(user)
                    req.data = user
                    next()
                })
        } catch (error) {
            return res.json('Loi')
        }
    }
}, (req, res, next) => {
    console.log(req.data)
    res.render('home', {
        user: (req.data).toObject()
    })
})

app.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
})

// function createUser() {
//     for (let i = 30; i <= 40; i++) {
//         const users = new Users({
//             username: 'Nodemy' + i,
//             password: '123456'
//         })
//         users.save()
//     }
// }
// createUser()



/* Login with JWT */
/*
var checkOut = (req, res, next) => {
    var cookie = req.cookies
    try {
        var id = jwt.verify(cookie.token, 'mk')
        if (id) {
            req.userId = id
            res.redirect('/')
        }
    } catch (error) {
        next()
    }

}

var checkLogin = (req, res, next) => {
    var cookie = req.cookies
    try {
        var id = jwt.verify(cookie.token, 'mk')
        console.log(id) // Lưu ý verify về là trả về nguyên mẫu cái data là {}
        if (id) {
            req.userId = id
            next()
        }
    } catch (error) {
        res.json('Loi Token')
    }
}

var checkRole = (req, res, next) => {
    var id = req.userId.id
    Users.findById(id)
        .then(user => {
            console.log(user)
            if (user.role >= 1) {
                console.log(user.role)
                next()
            } else {
                res.json('Not Permission!')
            }
        })
        .catch(err => res.json('Loi!'))

}

app.get('/', (req, res, next) => {
    var cookie = req.session.token
    console.log(cookie)
    try {
        if (cookie) {
            var data = jwt.verify(cookie, 'mk')
            console.log(data)
            res.user = data
            next()
        }
    } catch (error) {
        res.redirect('/login')
    }
}, (req, res, next) => {
    var idUser = res.user.id
    Users.findById(idUser)
        .then((user) => {
            res.render('home', {
                user: user.toObject()
            })
        })
        .catch(err => res.json('Khong Tim Thay User!'))
})

app.get('/admin', checkLogin, checkRole, (req, res, next) => {
    res.render('admin')
})

app.get('/login', checkOut, (req, res, next) => {
    res.render('login')
})

app.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
})
*/
// Đăng nhập bằng cách tự tạo cookies 
/*
app.post('/login', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    Users.findOne({
            username: username,
            password: password
        })
        .then((data) => {
            if (data) {
                console.log(data)
                var token = jwt.sign({ id: data._id }, 'mk')
                var cookie = req.cookies.token
                if (cookie === undefined) {
                    res.cookie('token', token);
                    res.redirect('/')
                } else {
                    res.redirect('/')
                }
            } else {
                res.redirect('/login')
            }
        })
        .catch(err => {
            console.log(err)
            res.json('Loi Sever!')
        })

})
*/
// Đăng nhập bằng dựa vào session
/*
app.post('/login', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    Users.findOne({
            username: username,
            password: password
        })
        .then((data) => {
            if (data) {
                console.log(data)
                var token = jwt.sign({ id: data._id }, 'mk')
                req.session.token = token
                console.log(123)
                res.redirect('/')
            } else {
                //console.log(123)
                res.redirect('/login')
            }
        })
        .catch(err => {
            console.log(err)
            res.json('Loi Sever!')
        })

})

*/

// Phan Trang
/*
app.get('/phantrang', (req, res, next) => {
    res.render('pagination')
})

app.get('/user', (req, res) => {
    const current_page = parseInt(req.query.page) || 1
    const PAGE_SIZE = 2

    let start = (current_page - 1) * PAGE_SIZE
    let end = PAGE_SIZE

    Users.find({})
        .skip(start)
        .limit(end)
        .then((data) => {
            Users.countDocuments({})
                .then(count => {
                    var tongSoPage = Math.ceil(count / PAGE_SIZE)
                    res.json({
                        NumberEl: count,
                        data: data,
                        total: tongSoPage
                    })
                })

        })
        .catch(err => res.json('Loi Sever'))
})
*/

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})