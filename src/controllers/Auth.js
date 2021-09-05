const express = require('express')
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const app = express()
var Users = require('../models/User')

class AuthControllers {
    show(req, res, next) {

    }

}
/*
class AuthControllers {
    // [GET] /auth/google
    getGoogle(req, res, next) {
        console.log(123)
        passport.authenticate('google', {
            scope: ['email', 'profile']
        })
    }

    // [GET] /auth/google/callback
    getGoogleCallback(req, res, next) {
        passport.authenticate('google', {
                //successRedirect: '/auth/google/success',
                failureRedirect: '/auth/google/failure'
            }),
            function(req, res) {
                res.redirect('/admin')
            }
    }

    // [GET] /admin
    getAdmin(req, res, next) {
        console.log(req.user)
        res.render('home', {
            user: (req.user).toObject()
        })
    }

}
*/

module.exports = new AuthControllers()