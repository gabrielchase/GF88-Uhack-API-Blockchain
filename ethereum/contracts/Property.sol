pragma solidity ^0.4.17;


contract PropertyFactory {
    address[] public properties;
    
    function createProperty(string _propertyNumber, string _officialAddress, string _latitude, string _longitude) public {
        address newProperty = new Property(_propertyNumber, _officialAddress, _latitude, _longitude);
        properties.push(newProperty);
    }

    function getAllProperties() public view returns (address[]) {
        return properties;
    }
}

contract Property {
    struct TransferRecord { 
        // youre so awesome
    // and i love u 
    // so  muchzos!
        address owner;
        string datesOfSale;
        string price;
        string notes;
        
        string deedOfSale;
        string title;
        string paymentVerification;
        
        bool approved;
    }

    address public owner;
    
    string public propertyNumber;
    string public officialAddress;

    // mwah
    // mwa <3 <3 luv luv
    string public latitude;
    string public longitude;
    
    TransferRecord[] public history;
    
    function Property(string _propertyNumber, string _officialAddress, string _latitude, string _longitude) public {
        propertyNumber = _propertyNumber;
        officialAddress = _officialAddress;
        latitude = _latitude;
        longitude = _longitude;
    }
    
    function createTransferRecord(address _owner, string _datesOfSale, string _price, string _notes, string _deedOfSale, string _title, string _paymentVerification) public {
        TransferRecord memory newRecord = TransferRecord({
            owner: _owner,
            datesOfSale: _datesOfSale,
            price: _price,
            approved: false,
            notes: _notes,
            deedOfSale: _deedOfSale,
            title: _title,
            paymentVerification: _paymentVerification
        });
        
        history.push(newRecord);
    }

    function approveTransfer(uint index, address newOwner) public {
        history[index].approved = true;
        owner = newOwner;
    }
    
    function historyLength() public view returns (uint) {
        return history.length;
    }
}
