import app from './app.js'
import {PORT} from './config.js'


app.listen(PORT); // escucha en x puerto
console.log(`server up ,`,PORT);

