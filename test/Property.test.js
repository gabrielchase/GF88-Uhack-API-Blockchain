const assert = require('assert')
const ganache = require('ganache-cli')

const compiledFactory = require('../ethereum/build/PropertyFactory.json')
const compiledProperty = require('../ethereum/build/Property.json')

const compiledUserFactory = require('../ethereum/build/UserFactory.json')
const compiledUser = require('../ethereum/build/User.json')

const Web3 = require('web3')

const provider = ganache.provider()
const web3 = new Web3(provider)


let userFactory
let accounts
let factory 
let properties
let property

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                            .deploy({ data: compiledFactory.bytecode })
                            .send({ from: accounts[0], gas: '1500000' })

    await factory.methods.createProperty('A92D1', '55 Malingap St. Quezon City', '121.44', '122.45').send({ from: accounts[0], gas: '1000000' })

    properties = await factory.methods.getAllProperties().call()
    property = await new web3.eth.Contract(JSON.parse(compiledProperty.interface), properties[0])


    userFactory = await new web3.eth.Contract(JSON.parse(compiledUserFactory.interface))
                            .deploy({ data: compiledUserFactory.bytecode })
                            .send({ from: accounts[0], gas: '1500000' })

    await userFactory.methods.createUser('Kyle', 'Tan', 'October 16, 1997', 'Filipino', 'driversLicenseLink', 'passportLink').send({ from: accounts[0], gas: '1000000' })

    users = await userFactory.methods.getAllUsers().call()
    user = await new web3.eth.Contract(JSON.parse(compiledUser.interface), users[0])
    let userFirstName = await user.methods.firstName().call()
    assert.equal('Kyle', userFirstName)
})

describe('Properties', () => {
    it('deploys a factory and a property', async () => {  
        assert.ok(factory.options.address)
        assert.ok(property.options.address)
    })

    it('Adds A92D1 property on the blockchain', async () => {
        let propertyNumber = await property.methods.propertyNumber().call()
        assert.equal('A92D1', propertyNumber)
    })  

    it('Adds A92D1 property address on the blockchain', async () => {
        let officialAddress = await property.methods.officialAddress().call()
        assert.equal('55 Malingap St. Quezon City', officialAddress)
    })  

    it('Transfers property', async () => {
        await property.methods.createTransferRecord(user.options.address, 'September 28, 2019', '1000000',  '', 'deed_link', 'title_link', 'payment_verification_hash').send({ from: accounts[0], gas: '1000000' })
        let newProperty = await new web3.eth.Contract(JSON.parse(compiledProperty.interface), properties[0])

        let historyTransaction = await newProperty.methods.history(0).call()
        console.log(historyTransaction)
        assert.equal(user.options.address, historyTransaction['0'])
        assert.equal('September 28, 2019', historyTransaction['1'])
        assert.equal(false, historyTransaction['7'])

        let propertyHistoryLength = await newProperty.methods.historyLength().call()
        assert.equal(1, propertyHistoryLength)




        await userFactory.methods.createUser('Gabriel', 'Patron', 'October 16, 1997', 'Filipino', 'driversLicenseLink', 'passportLink').send({ from: accounts[0], gas: '1000000' })
        users = await userFactory.methods.getAllUsers().call()
        let gabe = await new web3.eth.Contract(JSON.parse(compiledUser.interface), users[1])
        let firstName = await gabe.methods.firstName().call()
        assert.equal('Gabriel', firstName)

        await newProperty.methods.createTransferRecord(gabe.options.address, 'September 28, 2019', '1000000',  '', 'deed_link', 'title_link', 'payment_verification_hash').send({ from: accounts[0], gas: '1000000' })

        propertyHistoryLength = await newProperty.methods.historyLength().call()
        assert.equal(2, propertyHistoryLength)

        historyTransaction = await newProperty.methods.history(propertyHistoryLength-1).call()
        assert.equal(gabe.options.address, historyTransaction['0'])
        assert.equal(false, historyTransaction['7'])
    })

    it('Approves a transfer', async () => {
        user = await new web3.eth.Contract(JSON.parse(compiledUser.interface), users[0])

        await property.methods.createTransferRecord(user.options.address, 'September 28, 2019', '1000000',  '', 'deed_link', 'title_link', 'payment_verification_hash').send({ from: accounts[0], gas: '1000000' })
        await property.methods.approveTransfer(0, user.options.address).send({ from: accounts[0], gas: '1000000' })

        let historyTransaction = await property.methods.history(0).call()
        console.log('historyTransaction: ', historyTransaction)
        let propertyOwner = await property.methods.owner().call()
        console.log('user: ', await user.methods.firstName().call())
        console.log('user: ', await user.options.address)

        assert.equal(user.options.address, propertyOwner)
        assert.equal(user.options.address, historyTransaction['0'])
        assert.equal(true, historyTransaction['7'])
    })

})

