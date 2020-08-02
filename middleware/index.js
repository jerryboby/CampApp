//all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next)
{
	//is user logged in?
	if(req.isAuthenticated())
	{
			Campground.findById(req.params.id, function(err,foundCampGround){
		if(err){
			req.flash("error","Campground not found");
			res.redirect("back");
		}
		else{
			  // // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via //connect-flash and send us back to the homepage
			  if (!foundCampGround) {
			  req.flash("error", "Item not found.");
			  return res.redirect("back");
			  }
			
			//does the user own the campground?
			if(foundCampGround.author.id.equals(req.user._id)){    //req.user._id is a string,other is an object. cant compare
				next();
				}
			else{
				req.flash("error","You don't have permission to do that..!");
				res.redirect("back");
			}
		}
	  });
	}
	else{
		req.flash("error","You need to be logged in to do that..!");
		res.redirect("back");
	}
}


middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in?
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			
			res.redirect("back");
		}
		else{
			//does the user own the comment?
			if(foundComment.author.id.equals(req.user._id)){    //req.user._id is a string,other is an object. cant compare
				next();
				}
			else{
				req.flash("error","You don't have permission to do that..!");
				res.redirect("back");
			}
		}
	  });
	}
	else{
		req.flash("error","You need to be logged in to do that..!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that...!");
	res.redirect("/login");
  
   	
}

module.exports = middlewareObj;