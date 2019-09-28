const UserFactory = require('./ethereum/build/UserFactory.json')
const User = require('./ethereum/build/User.json')
const PropertyFactory = require('./ethereum/build/PropertyFactory.json')
const Property = require('./ethereum/build/Property.json')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')

const provider = new HDWalletProvider(
    'chair summer display orchard muscle rare trade gallery cement record burden leisure',
    'https://rinkeby.infura.io/v3/b5b9ed2842784d22b906df8d5c785d7a'
)

const web3 = new Web3(provider)

const userFactory = new web3.eth.Contract(
    JSON.parse(UserFactory.interface), 
    '0x490577602490e63180cCE4359EE08a1dCB625d0c'
)

const propertyFactory = new web3.eth.Contract(
    JSON.parse(PropertyFactory.interface), 
    '0x37E875fD36DcA91613b89fBD8BbBA88a3f55f46f'
)


const getEthAccount = async () =>  {
    let accounts = await web3.eth.getAccounts()
    return accounts[0]    
}

getEthAccount().then((account) => {
    const LRA_ACCOUNT = account
    console.log('LRA_ACCOUNT: ', account)
    
    const app = new express()
    
    app.use(bodyParser.json({ limit: '192mb' }))
    app.use(bodyParser.urlencoded({ extended: true })) // to support URL-encoded bodies
    app.use(cors())
    
    app.put('/api/property/:property_id/authenticate', async (req, res) => {
        const { property_id } = req.params 
        const { recordIndex, newOwner } = req.body

        let property = await new web3.eth.Contract(
            JSON.parse(Property.interface), 
            property_id
        )
        
        try {
            await property.methods
                        .approveTransfer(recordIndex, newOwner)
                        .send({ from: LRA_ACCOUNT, gas: '1000000' })
            res.json({ success: true })
        } catch (error) {
            res.json({ success: false })
        }
    })
    
    app.post('/api/property/:property_id/verify', async (req, res) => {
        const { property_id } = req.params 
        const { newOwner, dateOfSale, price, notes, deedOfSale, title, paymentVerification } = req.body
    
        let property = await new web3.eth.Contract(
            JSON.parse(Property.interface), 
            property_id
        )
        
        try {
            await property.methods
                        .createTransferRecord(newOwner, dateOfSale, price, notes, deedOfSale, title, paymentVerification)
                        .send({ from: LRA_ACCOUNT, gas: '1000000' })
            res.json({ success: true })
        } catch (error) {
            res.json({ success: false })
        }
    })

    app.get('/api/users', async (req, res) => {
        const users = await userFactory.methods.getAllUsers().call()
        res.json({ users })
    })

    app.get('/api/user/:user_id', async (req, res) => {
        const { user_id } = req.params
        
        const user = await new web3.eth.Contract(
            JSON.parse(User.interface), 
            user_id
        )
        
        const userJSON = {
            firstName: await user.methods.firstName().call(),
            lastName: await user.methods.lastName().call(),
            nationality: await user.methods.nationality().call(),
            driversLicense: await user.methods.driversLicense().call(),
            passport: await user.methods.passport().call()
        }

        res.json(userJSON)
    })

    app.get('/api/properties', async (req, res) => {
        const properties = await propertyFactory.methods.getAllProperties().call()
        res.json(properties)
    })
    
    app.get('/api/property/:property_id', async (req, res) => {
        const { property_id } = req.params 
    
        let property = await new web3.eth.Contract(
            JSON.parse(Property.interface), 
            property_id
        )

        let propertyHistoryLength = await property.methods.historyLength().call()
        let history = []

        for (let i=0; i < propertyHistoryLength; i++) {
            let h = await property.methods.history(i).call()
            console.log(h)
            history.push(h)
        }

        const propertyJSON = {
            owner: await property.methods.owner().call(),
            propertyNumber: await property.methods.propertyNumber().call(),
            officialAddress: await property.methods.officialAddress().call(),
            latitude: await property.methods.latitude().call(),
            longitude: await property.methods.longitude().call(),
            propertyHistoryLength,
            history
        }

        res.json(propertyJSON)
    })
    
    app.listen(3005, () => {
        console.log(`Server running on 3005`)
    })
})
