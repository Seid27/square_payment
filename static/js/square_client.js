
const appId = 'sandbox-sq0idb-yZsFhf9evWm-BkGntPWJXQ';
const locationId = 'LDTPR9XCEFDF9';

const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('.tab-content');
const tabOptions = document.querySelectorAll('.tabs');
let card;

const verificationDetails = {
  amount: '10.00',
  billingContact: {
    givenName: 'John',
    familyName: 'Doe',
    email: 'john.doe@square.example',
    phone: '3214563987',
    addressLines: ['123 Main Street', 'Apartment 1'],
    city: 'London',
    state: 'LND',
    countryCode: 'GB',
  },
  currencyCode: 'GBP',
  intent: 'CHARGE',
  customerInitiated: true,
  sellerKeyedIn: false
};

tabs.forEach(tab=>{
  tab.addEventListener('click', ()=>{
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active');
    });
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });
    target.classList.add('active');
    tab.classList.add('active');
  })
})

document.addEventListener('DOMContentLoaded', async function () {

  if (!window.Square) {
    throw new Error('Square.js failed to load properly');
  }
  const payments = window.Square.payments(appId, locationId);
  try {
    card = await initializeCard(payments);
    await initializeGooglePay(payments);
    await initializeCashApp(payments);
    await initializeACH(payments);
    // await initializeApplePay(payments);
  } catch (e) {
    console.error('Initializing Card failed', e);
  }
 });
//  ==========================================================
//add event listener to card payment button
const cardButton = document.getElementById('card-button');
cardButton.addEventListener('click', async function (event) {
  await handlePaymentMethodSubmission(event, card);
  
});

//submit payment form
async function handlePaymentMethodSubmission(event, card) {
  event.preventDefault();
  
  try {
    // disable the submit button as we await tokenization and make a payment request.
    cardButton.disabled = true;
    // const token = await tokenize(card,verificationDetails);
    // console.log(token);
    // const paymentResults = await createPayment(token);
    displayPaymentResults('SUCCESS');

    // console.log('Payment Success', paymentResults);
  } catch (e) {
    // cardButton.disabled = false;
    displayPaymentResults('FAILURE');
    console.error(e.message);
  }
}

//get token
async function tokenize(paymentMethod, verificationDetails) {
  const tokenResult = await paymentMethod.tokenize(verificationDetails);
  if (tokenResult.status === 'OK') {
    return tokenResult.token;
  } else {
    let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
    if (tokenResult.errors) {
      errorMessage += ` and errors: ${JSON.stringify(
        tokenResult.errors,
      )}`;
    }
    throw new Error(errorMessage);
  }
}

//make a payment
async function createPayment(token) {
  const body = JSON.stringify({
    locationId,
    sourceId: token,
    idempotencyKey: window.crypto.randomUUID(),
  });
  const paymentResponse = await fetch('/process-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  if (paymentResponse.ok) {
    return paymentResponse.json();
  }
  const errorBody = await paymentResponse.text();
  throw new Error(errorBody);
}


//payment result
async function displayPaymentResults(status) {  
  if (status === 'SUCCESS') {
    console.log('success');
    window.location.href = "/payment-success";
  //   await fetch('/payment-success', {
  //     method: 'GET'
  //   }).then((res)=>console.log(res.json));
  //   // window.location.href = res.text()

  // } else {
  //   console.log('failure');
  //   await fetch('/payment-failure', {
  //     method: 'GET'
  //   });
  }
}


// =====================================================
 async function initializeCard(payments) {
  const card = await payments.card();
  await card.attach('#card-container'); 
  return card; 
}

 function buildPaymentRequest(payments) {
  return payments.paymentRequest({
    countryCode: 'US',
    currencyCode: 'USD',
    total: {
      amount: '1.00',
      label: 'Total',
    },
  });
}
 
 async function initializeGooglePay(payments) {
  const paymentRequest = buildPaymentRequest(payments)

  const googlePay = await payments.googlePay(paymentRequest);
  await googlePay.attach('#google-pay-button');

  return googlePay;
}

async function initializeApplePay(payments) {
  const paymentRequest = buildPaymentRequest(payments)
  const applePay = await payments.applePay(paymentRequest);
  // Note: You don't need to `attach` applePay.
  return applePay;
}

async function initializeCashApp(payments) {
  const paymentRequest = buildPaymentRequest(payments)
  const cashAppPay = await payments.cashAppPay(paymentRequest,{
    redirectURL: 'https://my.website/checkout',
    referenceId: 'my-website-00000001',
  });
  const buttonOptions = {
    shape: 'semiround',
    size: 'medium',
    };
  await cashAppPay.attach('#cash-app-pay', buttonOptions);
  return cashAppPay;
}

async function initializeACH(payments) {
  let redirectURI= '';
  let transactionId = '';
  const ach = await payments.ach({ redirectURI, transactionId });
  // Note: ACH doesn't have an .attach(...) method
  // the ACH auth flow is triggered by .tokenize(...)
  return ach;
}