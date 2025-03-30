
const appId = 'sandbox-sq0idb-yZsFhf9evWm-BkGntPWJXQ';
const locationId = 'LDTPR9XCEFDF9';

const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('.tab-content');
const tabOptions = document.querySelectorAll('.tabs');

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


// async function initializeCard(payments) {
//     const card = await payments.card();
//     await card.attach('#card-container'); 
//     return card; 
//   }
// const cashAppBtn = document.querySelector("#cash-app-pay");
// document.querySelector("#cash-app-pay").shadowRoot.querySelector("button").style.color("red");
// console.log(document.querySelector("#cash_app_pay_v1_element"));
// cash_app_pay_v1_element
// div
// ShadowRoot
// button
document.addEventListener('DOMContentLoaded', async function () {

  if (!window.Square) {
    throw new Error('Square.js failed to load properly');
  }
  const payments = window.Square.payments(appId, locationId);
  
  try {
    await initializeCard(payments);
    await initializeGooglePay(payments);
    await initializeCashApp(payments);
    await initializeACH(payments);
    // await initializeApplePay(payments);
  } catch (e) {
    console.error('Initializing Card failed', e);
    return;
  }

  // let payment_methods = document.getElementsByClassName("payment-method");

  // Array.from(payment_methods).forEach((method)=>{
  //   if (method.checked){
  //     initializePaymentType(method.value,payments);
  //   }
  //   method.addEventListener('click', ()=>{
  //     console.log(method.value);
  //     initializePaymentType(method.value,payments);
  //   })
  // })
//    let card;
//    try {
//      card = await initializeCard(payments);
//    } catch (e) {
//      console.error('Initializing Card failed', e);
//      return;
//    }
 
   // Step 5.2: create card payment
 });

//  async function initializePaymentType(paymentType, payments) {

//   if (paymentType === 'card') {
//     const card = await payments.card();
//     await card.attach('#card-container'); 
//     console.log(card);
    
//     return card;
    
//   }
  
//  }

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