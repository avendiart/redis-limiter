# Example usage:

## Definition
```javascript
const Redis = require('ioredis')

const config = {
  prefix: process.env.REDIS_PREFIX || 'prefix',
  period: 1000,
  amount: 1,
  client: new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
}

const limiter = require('@pligasov/limiter').create(
  config.amount,
  config.period,
  config.prefix,
  config.client
)

module.exports = {
  throttle: cb => limiter.execute().then(cb)
}
```

## Consumer
```javascript
const throttle = require('./throttle')

throttle(() => {
  someAction('data')
})
```
