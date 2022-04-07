import web3 from "../ethereum/web3";

// interface SummaryObject {
//   [campaignId]: string;
//   minimumContribution: string;
//   balance: string;
//   requestsCount: string;
//   approversCount: string;
//   manager: string;
// }

class CampaignParser {
  parseRequests(requests, approversCount) {
    return requests.map((request, idx) => ({
      id: idx,
      description: request[0],
      amount: web3.utils.fromWei(request[1], "ether"),
      recipient: request[2],
      approvalCount: `${request[4]}/${approversCount}`,
      finalize: request[3],
    }));
  }

  parseCampaignSummary(campaignTuple) {
    return {
      minimumContribution: campaignTuple[0],
      balance: campaignTuple[1],
      requestsCount: campaignTuple[2],
      approversCount: campaignTuple[3],
      manager: campaignTuple[4],
    };
  }

  parseCardListItems(campaigns) {
    return campaigns.map((address) => {
      return {
        title: "Campaign",
        subtitle: address,
        description: "",
        button: {
          url: `/campaigns/${address}`,
          text: "View Campaign",
        },
      };
    });
  }

  parseSummaryToCardObjects(object) {
    // TODO make this dynamic adding a server and fetching data from there
    return [
      {
        title: object.manager,
        subtitle: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
      },
      {
        title: object.minimumContribution,
        subtitle: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        title: object.requestsCount,
        subtitle: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        title: object.approversCount,
        subtitle: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        title: web3.utils.fromWei(object.balance, "ether"),
        subtitle: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
    ];
  }
}

export default new CampaignParser();
