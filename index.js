const sleep = time => {
  return new Promise(cb => setTimeout(cb, time))
}

class Limiter {
  constructor (amount, period, prefix, client) {
    this.amount = amount
    this.period = period
    this.prefix = prefix
    this.client = client
  }

  hit () {
    const commands = ['set', 'incr', 'pttl']

    return this.client.multi([
      [commands[0], `${this.prefix}:${this.amount}:${this.period}`, 0, 'px', this.period, 'nx'],
      [commands[1], `${this.prefix}:${this.amount}:${this.period}`],
      [commands[2], `${this.prefix}:${this.amount}:${this.period}`],
    ]).exec().then(results => {
      return {
        allow: results[1][1] <= this.amount,
        count: results[1][1],
        reset: results[2][1],
      }
    })
  }

  execute () {
    return this.hit().then(results => {
      if (results.allow === true) return results
      if (results.allow !== true) {
        return sleep(results.reset).then(_ => this.execute())
      }
    })
  }

  static create (amount, period, prefix, client) {
    return new Limiter(
      amount,
      period,
      prefix,
      client
    )
  }
}

module.exports = Limiter
