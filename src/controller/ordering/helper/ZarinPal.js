export const zarinConfig = {
  https: "https://payment.zarinpal.com/pg/v4/payment/",
  sandbox: "https://sandbox.zarinpal.com/pg/v4/payment/",
  merchantIDLength: 36,
  API: {
    PR: "request.json",
    PV: "verify.json",
    UT: "unVerified.json",
  },
  PG: function (sandbox) {
    if (sandbox) {
      return "https://sandbox.zarinpal.com/pg/StartPay/";
    }
    return "https://www.zarinpal.com/pg/StartPay/";
  },
};
export default class {
  constructor(MerchantID, sandBox, currency = "IRT") {
    if (typeof MerchantID !== "string") {
      throw Error("MerchantID is invalid");
    }
    if (MerchantID.length === zarinConfig.merchantIDLength) {
      this.merchandId = MerchantID;
    } else {
      console.error(`The MerchantId must be ${zarinConfig.merchantIDLength} characters`);
    }
    const validCurrencies = ["IRT", "IRR"];
    if (!validCurrencies.includes(currency)) {
      console.error("Invalid currecy. Valid options are 'IRR' or 'IRT'");
    }
    this.sandbox = sandBox || false;
    this.url = sandBox === true ? zarinConfig.sandbox : zarinConfig.https;
    this.currency = currency || "IRT";
  }
  async request(url, path, params, method) {
    const request = await fetch(`${url}${path}`, {
      method,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: params,
    });
    return await request.json();
  }
  async paymentRequest(input) {
    try {
      const params = {
        merchant_id: this.merchant,
        currency: this.currency,
        amount: input.Amount,
        callback_url: input.CallbackURL,
        description: input.Description,
        metadata: { email: input.Email, mobile: input.Mobile },
      };
      const response = await this.request(this.url, zarinConfig.API.PR, params, "POST");
      return {
        status: response.code,
        authority: response.authority,
        url: zarinConfig.PG(this.sandbox) + response.authority,
      };
    } catch (error) {
      throw error;
    }
  }
  async paymentVerification(input) {
    try {
      const params = {
        merchant_id: this.merchandId,
        amount: input.amount,
        authority: input.authority,
      };
      const data = await this.request(this.url, zarinConfig.API.PV, params, "POST");
      return {
        status: data.code,
        message: data.message,
        cardHash: data.card_hash,
        cardPan: data.cardPan,
        refId: data.ref_id,
        feeType: data.fee_type,
        fee: data.fee,
      };
    } catch (error) {
      throw error;
    }
  }
}
