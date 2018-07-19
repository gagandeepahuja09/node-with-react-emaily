const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');	//Model Instance

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(new GoogleStrategy({
	clientID: keys.googleClientID,
	clientSecret: keys.googleClientSecret,
	callbackURL: '/auth/google/callback'
	},
	(accessToken, refreshToken, profile, done) => {
		// Create an instance of user and then save it to the database
		User.findOne({ googleID: profile.id }).then(exisitingUser => {
			if(exisitingUser) {
				//User already exists
				done(null, exisitingUser);
			}
			else {
				// New Model Instance
				new User({	googleID: profile.id }).save()	
				.then(user => done(null, user));
			}
		});
		console.log(profile.id);
	}
));