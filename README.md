# n-clark
LUIS.ai wrapper

### Example
```javascript
const luis = require('n-clark')({id: 'appId', key: 'subscriptionKey', host: 'eastus2'});
  
luis.predict('input text here').then(data => console.log(data));
```

### Configuration
#### id = ''
LUIS.ai application ID

#### key = ''
Azure subscription key

#### host = 'westus'
LUIS.ai host to interact with

#### params = ''
Extra query string parameters (staging=true, etc.)

#### verbose = true
Verbose mode

#### debug = false
Debugging mode, captures input/output in `this.results` (Set of [status, input, output])

### API
#### predict (text)

_Promise_

Makes a request to LUIS.ai to predict the context of the request

#### reply (text, context[, set])

_Promise_

Makes a request to LUIS.ai to analyse the reply in context


### Properties
#### results

_Set_

Set of LUIS.ai requests & responses

### License
MIT
