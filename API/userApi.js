const exp=require("express")
const {Db}=require("mongodb")

const User_app=exp.Router()

//module used for hashing the password

const bcryptjs=require("bcryptjs")
const expressAsyncHandler=require("express-async-handler")
const jwt=require("jsonwebtoken")

//middleware to verify token
let verifyToken=require("../middleWares/verifyToken")

User_app.use(exp.json())


//privatr Route
User_app.get("/get-users",expressAsyncHandler(async(request,response)=>{

    const usersCollection=request.app.get('usersCollection')

    let users=await usersCollection.find().toArray()
    response.status(201).send({message:"users",payload:users})
}))

//private route
User_app.get("/get-users/:username",expressAsyncHandler(async(request,response)=>{

    const usersCollection=request.app.get('usersCollection')
    let usernamedb=request.params.username

    let users=await usersCollection.findOne({username:usernamedb})
    response.status(201).send({message:"users",payload:users})
}))


//creating new users
//public route
User_app.post("/register-user",expressAsyncHandler(async(request,response)=>{

    const usersCollection=request.app.get("usersCollection")
    const newUser=request.body;

    //checking new user in the database
    const userdb=await usersCollection.findOne({username:{$eq:newUser.username}})
    
    if(userdb!==null){
        response.status(200).send({message:"user already exists"})
    }

    // if user not present in the data base then we have to insert into the database

    else{

        let hashedPassword=await bcryptjs.hash(newUser.password,6)
        //replace plain password to hashed password
        newUser.password=hashedPassword
        await usersCollection.insertOne(newUser)
        response.status(201).send({message:"user inserted successfully"})
    }
}))

//private Route
User_app.delete("/delete-user/:username",verifyToken,expressAsyncHandler(async(request,response)=>{

    const usersCollection=request.app.get('usersCollection')
    let usernamedb=request.params.username

    let users=await usersCollection.findOne({username:usernamedb})
    if(users==null){
        response.status(200).send({message:"user not found in the data base"})
    }
    else{
        await usersCollection.deleteOne({name:{$eq:username}})
        response.status(201).send({message:"user deleted"})
    }
}))





//login rout
//public route

User_app.post("/user-login",expressAsyncHandler(async(request,response)=>{

    //userCollection object getting
    let usersCollection=request.app.get("usersCollection")

    // get the login user credentials
    let userCredentialObj=request.body;


    //verify the username 

    let user=await usersCollection.findOne({username:userCredentialObj.username})

    // IF USERNAME IS INVALID   
    if(user===null){
        response.status(200).send({message:"user not found"})
    }
    //if user name is valid
    else{

        //comparing password
        let isEqual=await bcryptjs.compare(userCredentialObj.password,user.password)

        //if password is not matched

        if(!isEqual){
            response.status(201).send({message:"Invalid password"})
        }
        //create jwt token and send the token
        else{

            let jwtToken=jwt.sign({username:user.username},"abcde",{expiresIn:4000})
            response.status(201).send({message:"user logged in",token:jwtToken})

            
        }

    }
}))



User_app.get("/test",verifyToken,expressAsyncHandler(async(request,response)=>{
 
        response.send({message:"response from test"})
}))


module.exports=User_app