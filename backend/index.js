import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
// https://www.youtube.com/watch?v=-42K44A1oMA -> for mongoDB
const app = express();

app.use(cors())

app.use(express.json())

const port = 8080//process.env.PORT

const testCase = [{'live':['living', 'livid'], 'diet':['fasting', 'not eating']}]

app.get('/api/messages', async (req, res) => {
  const retval = testCase

  return res.status(200).send({message: retval})
})

// get the messages in DB given USER
app.get('/api/messages/:id', async (req, res) => {
    const userId = req.params.id
    const retval = `User ${userId}: I'm alive!`
    return res.status(234).send({message: retval})
});

// // add a message to a user in DB
// app.post('/api/messages', async (req, res) => {
//     try{
//         if (!req.finalMessages){
//             return res.status(400).send({
//                 message: 'Send at least one word'
//             })
//         }
//     }catch(error){
//         console.log(error.message)
//         return res.status(500).send({message: error.message})
//     }
// })

const mongoDBURL = `mongodb+srv://andrewpre03:hGFkBiXPFXZSJPay@cluster0.lrjas.mongodb.net/messages-collection?retryWrites=true&w=majority&appName=Cluster0`//`${process.env.mongoDBURL}`

app.listen(port, () => {
  console.log(`App is listening to port: ${port}`)
});

// mongoose
//     .connect(mongoDBURL)
//     .then(()=>{
//         console.log('App connected to database')
//         app.listen(port, () => {
//             console.log(`App is listening to port: ${port}`)
//         });
//     })
//     .catch((error) => {
//         console.log(error)
//     })

