const { Client, PrivateKey, AccountCreationTransaction, AccountBalanceQuery, Hbar } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    //Hedera testnet account ID and Key from .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    //iF Account Id and Key can not be grabed, we throw in a new error
    if (myAccountId == null ||
        myPrivateKey == null ) {
            throw new Error("Environment variables myAccountId and myPrivayeKey must be present");
        }

        // Connection to the Hedera network
        // The Hedera JS SDK makes this easy!
        const client = Client.forTestnet();

        client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccountPrivateKey = await PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    //Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreationTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    //Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.myAccountId;

    //Log the account ID
    console.log("The new account ID is: " +newAccountId);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);
    
    console.log("The new account balance is: " +accountBalance.bhars.toTinybars() + "tinybar.");

    //Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) //Sending account
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving account
        .execute(client);

    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("The transfer transaction from my account was: " + transactionReceipt.status.toString());

    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .getCost(client);

    console.log("The cost of query is: " +queryCost);

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() +"tinybar.")

}
main();