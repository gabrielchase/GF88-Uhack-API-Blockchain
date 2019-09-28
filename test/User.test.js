const assert = require('assert')

const compiledFactory = require('../ethereum/build/UserFactory.json')
const compiledUser = require('../ethereum/build/User.json')

const Web3 = require('web3')

const ganache = require('ganache-cli')
const provider = ganache.provider()
const web3 = new Web3(provider)


let accounts
let factory 
let users
let user

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                            .deploy({ data: compiledFactory.bytecode })
                            .send({ from: accounts[0], gas: '1500000' })

    await factory.methods.createUser('Kyle', 'Tan', 'October 16, 1997', 'Filipino', 'driversLicenseLink', 'passportLink').send({ from: accounts[0], gas: '1000000' })

    users = await factory.methods.getAllUsers().call()
    console.log()
    user = await new web3.eth.Contract(JSON.parse(compiledUser.interface), users[0])
})

describe('Users', () => {
    it('deploys a factory and a user', async () => {
        assert.ok(factory.options.address)
        assert.ok(user.options.address)
    })

    it('gives us Kyles info', async () => {
        let firstName = await user.methods.firstName().call()
        let lastName = await user.methods.lastName().call()

        assert.equal('Kyle', firstName)
        assert.equal('Tan', lastName)
    })

    it('adds another user', async () => {
        await factory.methods.createUser('Gabriel', 'Patron', 'February 1, 1997', 'Filipino', 'driversLicenseLink', 'passportLink').send({ from: accounts[0], gas: '1000000' })

        users = await factory.methods.getAllUsers().call()
        assert.equal(2, users.length)

        let latestUser = await new web3.eth.Contract(JSON.parse(compiledUser.interface), users[users.length-1])

        let firstName = await latestUser.methods.firstName().call()
        let lastName = await latestUser.methods.lastName().call()

        assert.equal('Gabriel', firstName)
        assert.equal('Patron', lastName)
    })
})

