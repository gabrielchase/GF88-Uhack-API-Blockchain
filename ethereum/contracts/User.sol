pragma solidity ^0.4.17;


contract UserFactory {
    address[] public users;
    
    function createUser(string _firstName, string _lastName, string _birthDate, string _nationality, string _driversLicense, string _passport) public {
        address newUser = new User(_firstName, _lastName, _birthDate, _nationality, _driversLicense, _passport);
        users.push(newUser);
    }

    function getAllUsers() public view returns (address[]) {
        return users;
    }
}

contract User {
    string public firstName;
    string public lastName;
    string public birthDate;
    string public nationality;
    
    string public driversLicense;
    string public passport;
    
    
    function User(string _firstName, string _lastName, string _birthDate, string _nationality, string _driversLicense, string _passport) public {
        firstName = _firstName;
        lastName = _lastName;
        birthDate = _birthDate;
        nationality = _nationality;
        
        driversLicense = _driversLicense;
        passport = _passport;
    }
}
