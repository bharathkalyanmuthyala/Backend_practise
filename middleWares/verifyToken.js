const jwt=require("jsonwebtoken")
const verifyToken=(request,response,next)=>{

    //token verification logic

    //get bearer token from the request header 
    let bearerToken=request.headers.authorization

    //if bearer token is no existed unauthorised token
    if(bearerToken===undefined){
        response.send({mesaage:"unauthorized Token"})
    }
    else{
    //separate token from the whole key
    const Token=bearerToken.split(" ")[1]
    try{
        jwt.verify(Token,"abcde")
        next();
    }
    catch(err){

        response.send({message:err})
    }

    }
    

}

module.exports=verifyToken;