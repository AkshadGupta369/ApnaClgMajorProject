const User=require("../models/user");

module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupform=(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        let newUser=await User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            };
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");    
        });

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

});

module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginForm=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in!");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
    })
};