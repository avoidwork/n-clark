# n-clark
LUIS.ai wrapper

### Example
```javascript
const luis = require('n-clark')('appId', 'subscriptionKey'[, verbose=true[, debug=false]]);
  
luis.predict('input text here').then(data => console.log(data));
```

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
