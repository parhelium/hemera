'use strict'

describe('Extension error', function () {
  var PORT = 6242
  var authUrl = 'nats://localhost:' + PORT
  var server

  // Start up our own nats-server
  before(function (done) {
    server = HemeraTestsuite.start_server(PORT, done)
  })

  // Shutdown our server after we are done
  after(function () {
    server.kill()
  })

  it('Invalid extension type', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      try {
        hemera.ext('test', function (ctx, next) {})
      } catch (e) {
        expect(e.name).to.be.equals('HemeraError')
        expect(e.message).to.be.equals('Invalid extension type')
        hemera.close(done)
      }
    })
  })

  it('Invalid extension handler type', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    hemera.ready(() => {
      try {
        hemera.ext('test', 'foo')
      } catch (e) {
        expect(e.name).to.be.equals('HemeraError')
        expect(e.message).to.be.equals('Invalid extension type')
        hemera.close(done)
      }
    })
  })

  it('Should be able to pass a super error to onClientPostRequest', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClientPostRequest', function (ctx, next) {
        next(new UnauthorizedError('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Unauthorized')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })

  it('Should be able to pass an error to onClientPostRequest', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClientPostRequest', function (ctx, next) {
        next(new Error('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })

  it('Should be able to pass a custom super error to onClientPreRequest', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClientPreRequest', function (ctx, next) {
        next(new UnauthorizedError('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Unauthorized')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })

  it('Should be able to pass an error to onClientPreRequest', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onClientPreRequest', function (ctx, next) {
        next(new Error('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })

  it('Should be able to pass a custom super error to onServerPreRequest', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onServerPreRequest', function (ctx, req, res, next) {
        next(new UnauthorizedError('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Unauthorized')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })

  it('Should be able to pass an error to onServerPreRequest', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onServerPreRequest', function (ctx, req, res, next) {
        next(new Error('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })

  it('Should be able to pass a custom super error to onServerPreResponse', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onServerPreResponse', function (ctx, req, res, next) {
        next(new UnauthorizedError('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Unauthorized')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })

  it('Should be able to pass an error to onServerPreResponse', function (done) {
    const nats = require('nats').connect(authUrl)

    const hemera = new Hemera(nats)

    let plugin = function (options) {
      let hemera = this

      hemera.ext('onServerPreResponse', function (ctx, req, res, next) {
        next(new Error('test'))
      })

      hemera.add({
        cmd: 'add',
        topic: 'math'
      }, (resp, cb) => {
        cb(null, resp.a + resp.b)
      })
    }

    hemera.use({
      plugin: plugin,
      attributes: {
        name: 'myPlugin'
      },
      options: {}
    })

    hemera.ready(() => {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: 1,
        b: 2
      }, (err, resp) => {
        expect(err).to.be.exists()
        expect(err.name).to.be.equals('Error')
        expect(err.message).to.be.equals('test')
        hemera.close(done)
      })
    })
  })
})
