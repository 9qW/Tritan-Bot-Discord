const wallet = require("../../models/economy");

async function walletCheck(userid) {
  return new Promise(async function (resolve, reject) {
    let userWallet = await wallet.findOne({ userId: userid });
    if (userWallet) resolve(userWallet);

    userWallet = await new wallet({
      userId: userid,
      balance: 0
    }).save();

    resolve(userWallet);
  });
}

module.exports = walletCheck;
