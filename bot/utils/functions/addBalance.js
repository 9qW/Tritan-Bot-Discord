const wallet = require("../../models/economy");

async function add(userid, amount) {
  return new Promise(async function (resolve, reject) {
    let userWallet = await wallet.findOne({ userId: userid });

    if (!userWallet) reject("user wallet not found");

    await wallet.updateOne({ userId: userid }, { $set: { balance: userWallet.balance + amount } });

    userWallet = await wallet.findOne({ userId: userid });

    resolve(userWallet);
  });
}

module.exports = add;
