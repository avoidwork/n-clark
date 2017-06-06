# n-clark
LUIS.ai wrapper

### Example
```javascript
const nClark = require('n-clark'),
  luis = nClark('appId', 'subscriptionKey'[, verbose=true[, debug=true]]);
  
luis.predict('input text here').then(data => console.log(data));
```

### API
#### predict (text)
Makes a request to LUIS.ai to predict the context of the request

#### reply (text, context[, set])
Makes a request to LUIS.ai to analyse the reply in context

### License
MIT
