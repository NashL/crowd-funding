// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

contract CampaignFactory {

    address[] public campaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        campaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return campaigns;
    }
}

contract Campaign {
    struct RequestView {
        string description; // explain why the request being made
        uint value;  //
        address payable recipient; // person who is gonna recive the money
        bool complete;   // check if request was completed or not
        uint approvalCount;
    }

    struct Request {
        string description; // explain why the request being made
        uint value;  //
        address payable recipient; // person who is gonna recive the money
        bool complete;   // check if request was completed or not
        uint approvalCount;
        mapping(address => bool) approvals;
    }


    uint numRequests;
    mapping(uint => Request) public requests;
    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    mapping(address => bool) public approvers;

    modifier managerRestricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint _minimumContribution, address creator) {
        manager = creator;
        minimumContribution = _minimumContribution;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public managerRestricted {
        uint requestID = numRequests++;
        Request storage request = requests[requestID];
        request.description = description;
        request.value = value;
        request.recipient = recipient;
        request.complete = false;
        request.approvalCount = 0;
    }

    function approveRequest(uint requestID) public  {
        Request storage request = requests[requestID];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestID) public managerRestricted {
        Request storage request = requests[requestID];

        require(request.approvalCount > (approversCount/2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
        minimumContribution,
        address(this).balance,
        numRequests,
        approversCount,
        manager
        );
    }

    function getRequests() public view returns (RequestView[] memory){
        RequestView[] memory resp = new RequestView[](numRequests);
        for (uint i = 0; i < numRequests; i++) {
            resp[i] = RequestView({
            description: requests[i].description,
            value: requests[i].value,
            recipient: requests[i].recipient,
            complete: requests[i].complete,
            approvalCount: requests[i].approvalCount
            });
        }
        return resp;
    }

    function getRequestsCount() public view returns (uint) {
        return numRequests;
    }

}
