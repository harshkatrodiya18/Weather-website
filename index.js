const http = require("http");
const fs = require("fs");
var requests = require("requests");

const helloFile = fs.readFileSync("hello.html","utf-8");

const replaceval =(tempval , orgval) =>{
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature =  temperature.replace("{%location%}", orgval.name);
    temperature =  temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=bb6ada4631cf00d606eafc6c9ada61ee")
            .on('data',  (chunk)=> {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map(val =>  replaceval(helloFile,val)).join("");
                res.write(realTimeData);
                // console.log(realTimeData);

            })
            .on('end',  (err) =>{
                if (err) return console.log('connection closed due to errors', err);

                // console.log('end');
                res.end();
            });
    }
})


server.listen(1000,"127.0.0.1",()=>{
    console.log("port listion success:)");
});