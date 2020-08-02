var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");   //index.js because of its name gets added automatically

//INDEX ROUTE: SHOW ALL CAMPGROUNDS
router.get("/",function(req,res){
	console.log(req.user);
	Campground.find({},function(err,allCampgrounds){
		
		if(err){
			console.log(err);
		}
		else{
				res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user});
		}
		
	});

});

//CREATE ROUTE: ADD NEW CAMPGROUND TO DB
router.post("/", middleware.isLoggedIn, function(req,res){
  var name=req.body.name;
  var image=req.body.image;
  var description=req.body.description;
  var price= req.body.price;
  var author={
	  id: req.user._id,
	  username: req.user.username
  };
  var newCampground={image:image, name:name, description:description, author:author, price:price};
  Campground.create(newCampground,function(err,newlyCreated){
	  
	  if(err){
		  console.log(err);
	  }
	  else{
		  res.redirect("/campgrounds");
	  }
  });

});

//NEW ROUTE:SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});


//SHOW:SHOW MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id",function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampGround){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show",{campground:foundCampGround});
		}
	});
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
	
		   Campground.findById(req.params.id, function(err, foundCampGround){

				res.render("campgrounds/edit", {campground: foundCampGround});
				});
	  });


//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate( req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" +req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports= router;