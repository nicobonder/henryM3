// const bodyParser = require("body-parser");
const express = require("express"); //importa express

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express(); //creo el server

// to enable parsing of json bodies for post requests
server.use(express.json()); //middleware para pasar los archivos json.
let id = 1;

// TODO: your code to handle requests

server.post('/posts', (req, res) => {
    const { author, title, contents } = req.body;

    const newPost = {
        id: id++,
        author,
        title,
        contents
    }

    posts.push(newPost);
    if(author && title && contents){
        return res.status(200).json(newPost);
    } else if(!author){
        return res.status(STATUS_USER_ERROR).json({
            error: `No se recibieron los parámetros necesarios para crear el Post. Falta el ${author}`
        })
    } else if(!title){
        return res.status(STATUS_USER_ERROR).json({
            error: `No se recibieron los parámetros necesarios para crear el Post. Falta el ${title}`
        })
    } else if(!contents){
        return res.status(STATUS_USER_ERROR).json({
            error: `No se recibieron los parámetros necesarios para crear el Post. Falta el ${contents}`
        })
    }
}) 

server.post('/posts/author/:author', function(req, res){
    const { title, contents } = req.body;
    let id = 1;
    const { author } = req.params;

    const newPost = {
        id: id++,
        author,
        title,
        contents
    }

    if(title && contents){
        return res.status(200).send(newPost);
    } else if(!title){
        return res.status(STATUS_USER_ERROR).json({
            error: `No se recibieron los parámetros necesarios para crear el Post. Falta el ${title}`
        })
    } else if(!contents){
        return res.status(STATUS_USER_ERROR).json({
            error: `No se recibieron los parámetros necesarios para crear el Post. Falta el ${contents}`
        })
    }
})  

server.get('/posts', (req, res) =>{
    const { term } = req.query;
    if(!term){
        return res.status(200).json(posts)
    } else {
        const result = posts.filter((p) => {
            return p.title.includes(term) ||(p.contents.includes(term))
        })
        return res.json(result)
    }
})

server.get('/posts/:author', (req, res) =>{
    const { author } = req.params;
    
    const result = posts.filter((p) =>{
        return p.author === author
    })
    
    if(result.length ===0){
        return res.status(STATUS_USER_ERROR).json({
            error: "No existe ningun post del autor indicado"
        }) 
    }else {
        return res.status(200).json(result)
    }    
})

server.get('/posts/:author/:title', (req, res) =>{
    const { author, title } = req.params;

    const result = posts.filter((p) =>{
        return (p.author === author && p.title === title )
    })
    if(result.length ===0){
        return res.status(STATUS_USER_ERROR).json({
            error: "No existe ningun post con dicho titulo y autor indicado"
        }) 
    }else {
        return res.status(200).json(result)
    }    
})

server.put('/posts', (req, res) =>{
    const { id, title, contents } = req.body;

    if(!id || !title || !contents){
       return res
        .status(STATUS_USER_ERROR)
        .json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
    } 

    const post = posts.find((post)=> post.id === parseInt(id)) //porque lo guardamos como numero y sin el parse int va a venir como string. 

    if(post) {
        post.title = title;
        post.contents = contents;
        res.status(200).json(post);
    } else {
        res
        .status(STATUS_USER_ERROR)
        .json({error: "El id no es valido"})
    }
})

server.delete('/posts', (req, res) =>{
    const { id } = req.body;
    const result = posts.find((p) =>{return p.id === parseInt(id)})
    
    if(!id || !result){
        res
        .status(STATUS_USER_ERROR)
        .json({error: "El id no es valido"})
    } else{
        posts = posts.filter((p) =>  p.id !== parseInt(id))
        return res.status(200).json({success: true})
    }
})

server.delete('/author', (req, res) =>{
    const { author } = req.body;
    const result = posts.filter((p) =>{return p.author === author})
    
    if(!author || !result.length){
        return res
        .status(STATUS_USER_ERROR)
        .json({error: "No existe el autor indicado"})
    } 
        
    posts = posts.filter((p) => p.author !== author)
        return res.status(200).json(result)

})

module.exports = { posts, server };
