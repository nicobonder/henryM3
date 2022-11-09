var http = require('http');
var fs = require('fs');

var beatles=[{
  name: "John Lennon",
  birthdate: "09/10/1940",
  profilePic:"https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
},
{
  name: "Paul McCartney",
  birthdate: "18/06/1942",
  profilePic:"http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
},
{
  name: "George Harrison",
  birthdate: "25/02/1946",
  profilePic:"https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
},
{
  name: "Richard Starkey",
  birthdate: "07/08/1940",
  profilePic:"http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
}
];


/***RESOLUCION DEL PROFE */
http
/*****HTML Y TEMPLATES */
  .createServer((req, res) => {
    if(req.url === "/"){
      const index = fs.readFileSync("./index.html", "utf-8");
      return res.writeHead(200, {"Content-type": "text/html" }).end(index);
    }

    const miUrl = req.url.split("/");
    if(miUrl.length < 3){
      const beatleName = miUrl[1].replace("%20", " "); //el beatle va a ser el el en el index 1 de miurl
      const beatle = beatles.filter((el) => el.name === beatleName)[0];
      let template = fs.readFileSync("./beatle.html", "utf-8");
      
      template = template.replace("{nombre}", beatle.name);
      template = template.replace("{nacimiento}", beatle.birthdate);
      template = template.replace("{foto}", beatle.profilePic)
      console.log(beatleName);
      return res.writeHead(200, {"Content-type": "text/html" }).end(template);
    }

/********API */
    if(req.url === '/api'){
      return res
        .writeHead(200, {"Content-type": "application/json"})
        .end(JSON.stringify(beatles))
    }
    const beatleName = req.url.split("/").pop().replace("%20", " "); //eso genera un aray 
                                      //q divide los elem cada vez que hay una /
    console.log(beatleName);
    
    if(req.url.includes("/api") && beatleName){
      const beatle = beatles.filter((el) => el.name === beatleName);
      if(!beatle.length) 
        return res.writeHead(404).end("Beatle not found");
      
      return res
        .writeHead(200, { "Content-type": "application/json" })
        .end(JSON.stringify(beatle));
    }
  })
    .listen(3001, "localhost");



//MI FORMA DE HACERLO*/
/* 
http
  .createServer((req, res) => {
    if(req.url === '/api'){
      return res
        .writeHead(200, {"Content-type": "application/json"})
        .end(JSON.stringify(beatles))
        
    }
    if(req.url === '/api/John%20Lennon'){
      res.writeHead(200, {"Content-type": "application/json"});
      var john ={
        name: "John Lennon",
        birthdate: "09/10/1940",
        profilePic:"https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"
      };
      res.end(JSON.stringify(john))
    }
    if(req.url === '/api/Paul%20McCartney'){
      res.writeHead(200, {"Content-type": "application/json"});
      var paul ={
         name: "Paul McCartney",
        birthdate: "18/06/1942",
        profilePic:"http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
      };
      res.end(JSON.stringify(paul))
    }
    if(req.url === '/api/George%20Harrison'){
      res.writeHead(200, {"Content-type": "application/json"});
      var george ={
        name: "George Harrison",
        birthdate: "25/02/1946",
        profilePic:"https://canaldosbeatles.files.wordpress.com/2012/02/george-george-harrison-8321345-438-600.jpg"
      };
      res.end(JSON.stringify(george))
    }
    if(req.url === '/api/Richard%Starkey'){
      res.writeHead(200, {"Content-type": "application/json"});
      var richard ={
        name: "Richard Starkey",
        birthdate: "07/08/1940",
        profilePic:"http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
      };
      res.end(JSON.stringify(richard))
    
    } if(req.url === '/'){
      res.writeHead(200, { "Content-type": "text/html"});
      let miHtml = miHtml.fs.readFileSync('./index.html', 'utf-8');
      res.end(miHtml);

    } if(req.url === '/johnDetail'){
      res.writeHead(200, { "Content-type": "text/html"});
      let johnTemplate = miHtml.fs.readFileSync('./index.html', 'utf-8');
      const name = "John Lennon";
      const birthdate = "09/10/1940";
      profilePic = "https://blogs.correiobraziliense.com.br/trilhasonora/wp-content/uploads/sites/39/2020/10/CBNFOT081020100047-550x549.jpg"; 
      
      johnTemplate = johnTemplate.replace("{nombre}", name)
      johnTemplate = johnTemplate.replace("{nacimiento}", birthdate)
      johnTemplate = johnTemplate.replace("{foto}", profilePic)
      res.end(johnTemplate);  
      
    } else {
      res.writeHead(404, {"Content-type": "text/plain"});
      res.end("Error: Página no encontrada")
    }
  })
  .listen(3001, "localhost");
*/


