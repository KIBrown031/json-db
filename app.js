const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000

// logger
app.use( (req, res, next) => {
    // console.log(`${req.method} ${req.path}`)
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`
    console.log(`${time} <> ${req.method}\t${req.path}\t${req.headers.origin}\t${req.url}`)
    
    next()
})

app.use( express.json() )


app.get('/', (req, res) => {

    fs.readFile('./json/junk.json', 'utf8', (err, data) => {
    let jsonData = JSON.parse(data)
    
    
    jsonData = jsonData.sort( (a,b) => {
        if ( a["Last Name"] < b["Last Name"] ) {
            return -1;
        }
    })

    if ( true  ) 
    {
        console.log(`CONS-LOG: ${req.query.search}`)
        
        const regex1 = new RegExp(req.query.search, 'i')
        const regex2 = new RegExp(/^z0.*/, 'i')
        
        let result = []
        result.push( 
                     {  "   Head": `JSON data`, 
                        " Search": `${req.query.search}`,
                        "  RegEx": `RegEx1: ${regex1}  RegEx2: ${regex2}`,
                        " Extras": ``
                     }         
                   )



        jsonData.forEach ( data => {
            
            // search 'Last Name' or 'First Name'
            if ( ( regex1.test(data["Last Name"]) || regex1.test(data["First Name"]) ) && 
                 ! regex2.test(data["Last Name"]) ) {
                
                result.push( {
                                "   Name": `${data["Last Name"]}, ${data["First Name"]}`,
                                "  Phone":  data["Phone 1 - Value"],
                                "  Email":  data["E-mail 1 - Value"],
                                "Address":  (data["Address 1 - Formatted"]).replace(/\n/g, ' ')
                             } 
                            )
                
                 }
        })
        
        res.status(200).json(result)  // res.download('junk.json')
    
    } else {
        res.status(500).json(jsonData)  // res.download('junk.json')
    }
    
    }) // fs.readFile  
  
})  //app.get






app.get('/json/:filename', (req, res) => {
    
    console.log(req.params.filename)
    fs.readFile(`./json/${req.params.filename}`, 'utf8', (err, data) => {
    let jsonData = JSON.parse(data)

    jsonData = jsonData.sort( (a,b) => {
        if ( a.Name < b.Name ) {
            return -1;
        }
    })

    res.status(200).json(jsonData)
    })
    
})
//
app.get('/name/:user_name', (req, res) => {
    res.status(200);
    res.set('Content-type','text/html');
    res.end('<html><body>'+
    '<h1>Hello ' +req.params.user_name+'</h1>'+
    '</body></html>')
})



app.get('/upload', (req, res) => {
    
    res.status(200).download('junk.json')
      
  
})

app.get('/pdf', (req, res) => {
    
    res.status(200).sendFile( __dirname + '/pdf/Express.js-Guide.pdf')
      
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
