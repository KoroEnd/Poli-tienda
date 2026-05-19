const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('hola mi perro f*ck men!')
})



app.listen(4000,()=>{
    console.log("levante el server "+ 4000)
 
})


