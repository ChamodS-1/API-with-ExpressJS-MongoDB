const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/coursesdb')
    .then(()=> console.log('connected...'))
    .catch((err)=> console.log(err.message));

const schema = mongoose.Schema({
    name:{type:String,required:true,minlength:3,maxlength:15}
})

const Course = mongoose.model('course',schema);

app.get('/api/courses',async(req,res)=> {

    try{
        const result =  await Course.find().sort('name').select({name:1});
        res.send(result);
    }catch(err){
        res.status(500).send(err.message)
    }   
})

app.get('/api/course/:id',async(req,res)=> {

        try{
            const selectedCourse =  await Course.findById(req.params.id);
            res.send(selectedCourse);   
        }catch(err){
            res.status(500).send('Not Found');
        }    
});

app.post('/api/courses',async(req,res)=>{

    const course = new Course({
        name:req.body.name
    })

    try{
        const result = await course.save();
        res.send(result);
    }catch(err){
        for(const field in err.errors){
            res.status(500).send(err.errors[field].message);
        }
        
    }   
})

app.put('/api/course/:id',async(req,res)=> {

    try{
        const result = await Course.findById(req.params.id);
        result.set({
            name:req.body.name
        })

        try{
            const saved =  await result.save();
            res.send(saved);
        }catch(err){
            for(const field in err.errors){
                res.status(500).send(err.errors[field].message);
            }
        }
   
    }catch(err){
        res.status(500).send('Not Found!');
    } 
})

app.delete('/api/course/:id',async(req,res)=> {

    try{
        const result = await Course.findByIdAndDelete(req.params.id);
        res.send(result);
    }catch(err){
        res.status(500).send('Not Found');
    }
    
})

app.listen(3000, () => { console.log(`starting port 3000...`)});