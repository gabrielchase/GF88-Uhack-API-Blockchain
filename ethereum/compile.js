const path = require('path')
const fs = require('fs-extra')
const solc = require('solc')


const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)

const propertyPath = path.resolve(__dirname, 'contracts', 'Property.sol')
const userPath = path.resolve(__dirname, 'contracts', 'User.sol')

const propertySource = fs.readFileSync(propertyPath, 'utf8')
const userSource = fs.readFileSync(userPath, 'utf8')

const propertyOutput = solc.compile(propertySource, 1).contracts
const userOutput = solc.compile(userSource, 1).contracts

fs.ensureDirSync(buildPath)

console.log('1', propertyOutput)

for (let contract in propertyOutput) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        propertyOutput[contract]
    )
}

for (let contract in userOutput) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        userOutput[contract]
    )
}




