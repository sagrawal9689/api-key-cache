const express= require('express')
const app= express();
const PORT = 3000;
const keyRoutes = require('./routes/keyRoutes')

app.get('/',(req,res)=>{
    res.send("hello")
})

app.use(express.json());
app.use('/', keyRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});