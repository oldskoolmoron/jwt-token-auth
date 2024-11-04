const { log } = require('console');
const jwt = require('jsonwebtoken');
const express = require('express')
const JWT_SECRET = "randomanything";

const app = express();
const users = [];

app.use(express.json());


//should return a random long string
function generatetoken(){
  let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j' , 'k', 'l', 'm', 'n' , 'o', 'p', 'q' , 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let token = "";
  for(let i=0; i<32; i++){
    //use a simple function here

    token += options[Math.floor(Math.random()* options.length)];
  }
  return token;

}



function signupHandler(req, res){
  const username = req.body.username;
  const password = req.body.password;

  console.log("Request Body:", req.body); // Debugging log
  
  users.push({
    username: username,
    password: password
  })

  res.json({
    message: "You are signed up"
  })
  log(users);
}

function signinHandler(req, res){
  const username = req.body.username;
  const password = req.body.password;
  
  const user = users.find(function(u){
    if(u.username === username){
      return true;
    }
   
  })
                            //OR
 // const user = users.find((u) => u.username === username && u.password === password);
                          //OR
  // let founduser = null;
  // for(let i=0; i<users.length; i++){
  //   if(users[i].username == username && users[i].password == password){
  //     founduser = users[i];
  //   }
  // }
  if(user){
   // const token = generatetoken();
    // user.token = token;

                                                  // OR
    const token = jwt.sign({
      username: username,
    }, JWT_SECRET); // conver their username over to a jwt
   
    res.json({
      token : token
    })
  }else{
    res.json({
      message: "invalid username or password"
    })
    
  }
  log(users);
}

// function signinHandler(req, res) {
//   const username = req.body.username;
//   const password = req.body.password;

//   // Find user based on both username and password
//   const user = users.find((u) => u.username === username && u.password === password);

//   if (user) {
//     const token = generatetoken();
//     user.token = token;  // Attach token to the user object
//     res.json({
//       token: token  // Respond with the token if user is found
//     });
//   } else {
//     res.json({
//       message: "Invalid username or password"  // Respond with error message if not found
//     });
//   }
// }

app.get('/me', (req, res) => {
  const token = req.headers.token;         //OR
  const decodedinformation = jwt.verify(token, JWT_SECRET); 
  const username = decodedinformation.username;// {username: "xyz@gmail.com"}
  
  let foundUser = null;

  for(let i =0; i < users.length; i++){
    if(users[i].username == username){
      foundUser = users[i];
    }
  }
  if(foundUser){
    res.json({
      username: foundUser.username,
      password: foundUser.password
    })
  }else {
    res.json({
      message: "token invalid"
    })
  }
})

app.post('/signup', signupHandler)
app.post('/signin', signinHandler)


app.listen(3000, () =>{
  log("the server is running on port 3000");
})