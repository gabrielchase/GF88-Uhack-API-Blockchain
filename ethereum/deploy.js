const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const compiledPropertyFactory = require('./build/PropertyFactory.json')
const compiledUserFactory = require('./build/UserFactory.json')

const provider = new HDWalletProvider(
    'chair summer display orchard muscle rare trade gallery cement record burden leisure',
    'https://rinkeby.infura.io/v3/b5b9ed2842784d22b906df8d5c785d7a'
)

const web3 = new Web3(provider)
// console.log('web3: ', web3)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    console.log('Attempting to deploy from account ', accounts[0])

    // console.log(JSON.parse(compiledPropertyFactory.bytecode))
    const propertyFactoryResult = await new web3.eth.Contract(JSON.parse(compiledPropertyFactory.interface))
        .deploy({ data: compiledPropertyFactory.bytecode })
        .send({ gas: '1500000', from: accounts[0] })
        
    console.log('Property Factory Smart Contract deployed to: ', propertyFactoryResult.options.address)
    
    const userFactoryResult = await new web3.eth.Contract(JSON.parse(compiledUserFactory.interface))
        .deploy({ data: compiledUserFactory.bytecode })
        .send({ gas: '1500000', from: accounts[0] })

    console.log('User Factory Smart Contract deployed to: ', userFactoryResult.options.address)

}

deploy()
