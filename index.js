const express = require("express");
const port = 8000;
const app = express();
const users = require("./MOCK_DATA.json");
const fs = require("fs");

app.get("/users",(req,res)=>{
  const html = `
  <ul>
    ${users.map(user=>`<li>${user.first_name}</li>`).join("")}
  </ul>`;
  res.send(html);
});


app.get("/api/users",(req,res)=> {
  return res.json(users);
})


// app.get("/api/users/:id",(req,res)=>{
//   const id = req.params.id;
//   const user = users.find((user) => user.id===id);
//   return res.json(user)
// })

app.use(express.urlencoded({extended : false}));
app
  .route("/api/users/:id")
  .get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=> user.id===id)
    if(user) return res.json(user)
    return res.json({status : "user not found"})
  })


  .patch((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=> user.id===id)
    if(user.first_name) user.first_name = req.body.first_name;
    if(user.email) user.email= req.body.email;
    if(user.gender) user.gender = req.body.gender;
    if(user.last_name) user.last_name = req.body.last_name;
    fs.writeFile("MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
      return res.json({status : "success"})
    })  
  })



  .delete((req,res)=>{
      const id = Number(req.params.id);
      const index = users.findIndex((user)=> user.id===id);
      if(index===-1){
        return res.json({status : "user not found" });
      }
      users.splice(index,1);
      fs.writeFile("MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
      return res.json({status : "deleted successfully"})

      })
    })

app.post("/api/users",(req,res)=>{
  const body = req.body;
  users.push({...body , id : users.length+1})
  fs.writeFile("MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
    return res.json({status:"success"})
  })
})

app.listen(port,()=>{
  console.log(`server started at port : ${port}`);
})
