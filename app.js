var express= require("express");
var app= express();
var bodyParser= require("body-parser");
var mongoose= require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var flash= require("connect-flash");
var passport= require("passport");
var methodOverride= require("method-override");
var LocalStrategy= require("passport-local");
var passportLocalMongoose=  require("passport-local-mongoose");
var User= require("./models/user");

//REQUIRING ROUTES
var commentRoutes = 	require("./routes/comments"),
	campgroundRoutes =  require("./routes/campgrounds"),
	indexRoutes =       require("./routes/index");


app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

 mongoose.connect(Your database);


//SEED THE DATABASE
//seedDB();


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	
	secret: "Kerala my own country",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//SCHEMA Setup

app.use(function(req, res, next){
	res.locals.currentUser= req.user;
	res.locals.error =req.flash("error");
	res.locals.success =req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

var port = process.env.PORT || 8080;

app.listen(port,function(){
	
	console.log("YelpCamp has started...");
});