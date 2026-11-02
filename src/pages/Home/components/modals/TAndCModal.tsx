import React from 'react';

const TAndCModal = () => {
  const handleOpen = () => {
    const win = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Terms & Conditions</title>

          <style>
            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              height: 100%;
              font-family: Arial, Helvetica, sans-serif;
              background: #f4f4f4;
              color: #222;
            }

            .wrapper {
              height: 100vh;
              display: flex;
              flex-direction: column;
            }

            .header {
              flex-shrink: 0;
              background: #f2f2f2;
              border-bottom: 1px solid #d7d7d7;
              padding: 18px 24px;
              position: sticky;
              top: 0;
              z-index: 100;
            }

            .title {
              margin: 0;
              font-size: 20px;
              font-weight: 700;
              padding-left: 12px;
              border-left: 5px solid #f6b500;
            }

            .content {
              flex: 1;
              overflow-y: auto;
              padding: 24px;
              line-height: 1.8;
            }

            h2 {
              font-size: 18px;
              margin: 28px 0 12px;
              font-weight: 700;
            }

            h3 {
              font-size: 16px;
              margin: 22px 0 10px;
              font-weight: 700;
            }

            p,
            li {
              font-size: 15px;
              margin: 0 0 12px;
            }

            ul {
              margin: 0 0 16px;
              padding-left: 24px;
            }

            a {
              color: #1d4ed8;
            }

            .underline {
              text-decoration: underline;
            }
          </style>
        </head>

        <body>
          <div class="wrapper">
            <div class="header">
              <h1 class="title">General Terms and Conditions-ninewicket.live</h1>
            </div>

            <div class="content">
              ${termsContent}
            </div>
          </div>
        </body>
      </html>
    `);

    win.document.close();
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="underline text-gray-800 hover:text-gray-900 cursor-pointer"
    >
      Terms and Conditions
    </button>
  );
};

export default TAndCModal;

export const termsContent = `
  <h3>Description: Initial Terms and Conditions replacing general rules</h3>

  <p>Introduction</p>

  <p>
    These terms and conditions and the documents referred and linked to below (the “Terms”) set out the basis upon which the website operated under the URL www.ninewicket.live (the “Website”) and its related or connected services (collectively, the “Service”) will be provided to you.
  </p>

  <p>
   Please read these terms very carefully as they form a binding legal agreement between you - our customer (the “Customer”) - and us. By opening an account (the “Account”) and using the Service you agree to be bound by these terms, together with any amendment which may be published from time to time.
  </p>

  <p>
   The Service is supplied by ninewickets N.V.
  </p>

  <p>
  Transactions and payment services are operated by ninewickets N.V a limited liability company registered in Curacao, with company registration number 152377 and holding a license no. 365/JAZ Sub-License GLH- OCCHKTW0707072017.
  </p>

  <p>
    ninewickets will only communicate with Customers by email to their registered email address (the “Registered Email Address”) as provided when opening your ninewickets account: Communication from ninewickets will be issued through the following:
  </p>

  <p>
    Email only: support@ninewicket.live
  </p>

  <p class="underline">General Terms</p>

  <p>
    We reserve the right to amend the terms (including to any documents referred and linked to below) at any time. When such amendment is not substantial, we may not provide you with prior notice. You will be notified in advance for material changes to the terms and may require you to re-confirm acceptance to the updated terms before the changes come into effect. If you object to any such changes, you must immediately stop using the service and the termination provisions below will apply. Continued use of the service indicates your agreement to be bound by such changes. Any bets not settled prior to the changed terms taking effect will be subject to the pre-existing terms.
  </p>

  <p>
  If at any time you are in any doubt about how to place bets or otherwise use the service you should refer back to these terms or contact our customer service department (Customer Service Department) at support@ninewicket.live
  </p>

  1. <span class="underline">Your Obligations</span>
  <p></p>

  <p>
  You agree that at all times when using the Service:
  </p>
  
  <p>
  You are over 18 years of age (or over the age of majority as stipulated in the laws of the jurisdiction applicable to you) and can enter into a binding legal agreement with us.
  </p>
  
  <p>
  It is the User’s responsibility to check and enter this site only if the user is in a country where it is lawful to place bets on the service (if in doubt, you should seek local legal advice). It is your responsibility to ensure that your use of the service is legal.
  </p>
  
  <p>
  When sending money to us you are authorised to do so e.g. you are the authorised user of the debit/credit card or other payment method you use.
  </p>
  
  <p>
  You will not, by participating in the Services and/or placing bets be placed in a position of actual, potential or perceived conflict of interest in any manner.
  </p>
  
  <p>
  You have never failed to pay, or attempted to fail to pay a liability on a bet.
  </p>
  
  <p>
  You are acting solely on your own behalf as a private individual in a personal capacity and not on behalf of another party or for any commercial purposes.
  </p>
  
  <p>
  By placing bets you may lose some or all of your money lodged with us in accordance with these terms and you will be fully responsible for that loss.
  </p>
  
  <p>
  You must use the service for legitimate betting purposes only and must not nor attempt to manipulate any market or element within the service in bad faith or in a manner that adversely affects the integrity of the Service or us.
  </p>
  
  <p>
  When placing bets on the service you must not use any information obtained in breach of any legislation in force in the country in which you were when the bet was placed.
  </p>
  
  <p>
  You must make all payments to us in good faith and not attempt to reverse a payment made or take any action which will cause such payment to be reversed by a third party in order to avoid a liability legitimately incurred.
  </p>
  
  <p>
  You must otherwise generally act in good faith in relation to us of the service at all times and for all bets made through the service.
  </p>

  2. <span class="underline">Registration</span>
  <p></p>

  <p>
  You agree that at all times when using the service:
  </p>
  
  <p>
  In order to protect the integrity of the service and for other operational reasons we reserve the right to refuse to accept a registration application from any applicant at our sole discretion and without any obligation to communicate a specific reason.
  </p>

  <p>
  Before using the service, you must personally complete the registration form and read and accept these terms. In order to start betting on the service, we will require you to become a verified Customer which includes passing certain checks. You may be required to provide a valid proof of identification and any other document as it may be deemed necessary.
  </p>
  
  <p>
  This includes but is not limited to, a picture ID (copy of passport, driver’s licence or national ID card) and a recent utility bill listing your name and address as proof of residence to the minimum. We reserve the right to suspend wagering or restrict Account options on any Account until the required information is received. This procedure is a statutory requirement and is done in accordance with the applicable gaming regulation and the anti-money laundering legal requirements. Additionally, you will need to fund your ninewickets Account using the payment methods set out on the payment section of our Website.
  </p>
  
  <p>
  You must provide complete and accurate information about yourself, inclusive of a valid name, surname, address and email address, and update such information in the future to keep it complete and accurate. It is your responsibility to keep your contact details up to date on your account. Failure to do so may result in you failing to receive important account related notifications and information from us, including changes we make to these terms. We identify and communicate with our Customers via their Registered Email Address. It is the responsibility of the Customer to maintain an active and unique email account, to provide us with the correct email address and to advise ninewickets of any changes in their email address. Each Customer is wholly responsible for maintaining the security of his Registered Email Address to prevent the use of his Registered Email Address by any third party. ninewickets shall not be responsible for any damages or losses deemed or alleged to have resulted from communications between ninewickets and the Customer using the Registered Email Address. Any Customer not having an email address reachable by ninewickets will have his Account suspended until such an address is provided to us. We will immediately suspend your Account upon written notice to you to this effect if you intentionally provide false or inaccurate personal information. We may also take legal action against you for doing so in certain circumstances and/or contact the relevant authorities who may also take action against you.
  </p>
  
  <p>
  You are only allowed to register one Account with the service. Accounts are subject to immediate closure if it is found that you have multiple Accounts registered with us.
  </p>
  
  <p>
  This includes the use of representatives, relatives, associates, affiliates, related parties, connected persons and/ or third parties operating on your behalf.
  </p>
  
  <p>
  In order to ensure your financial worthiness and to confirm your identity, we may use any third party information providers we consider necessary.
  </p>
 
  <p>
  You must keep your password for the service confidential. Provided that the Account information requested has been correctly supplied, we are entitled to assume that bets, deposits and withdrawals have been made by you. We advise you to change your password on a regular basis and never disclose it to any third party. Passwords must contain at least one letter, one number and one special character and must be at least eight characters long. It is your responsibility to protect your password and any failure to do so shall be at your sole risk and expense. You must log out of the Service at the end of each session. If you believe any of your Account information is being misused by a third party, or your Account has been hacked into, or your password has been discovered by a third party, you must notify us immediately by email using your registered Email Address to support@ninewicket.live
  </p>
  
  <p>
  You must notify us if your registered email Address has been hacked into, we may, however, require you to provide additional information/ documentation so that we can verify your identity. We will immediately suspend your Account once we are aware of such an incident. In the meantime you are responsible for all activity on your Account including third party access, regardless of whether or not their access was authorised by you.
  </p>
  
  <p>
  You must not at any time transmit any content or other information on the service to another Customer or any other party by way of a screen capture (or other similar method), nor display any such information or content in a frame or in any other manner that is different from how it would appear if such Customer or third party had typed the URL for the service into the browser line;
  </p>
  
  <p>
  When registering, you will be required to choose the currency in which you will operate your account. This will be the currency of your deposits, withdrawals and bets placed and matched into the service as set out in these terms. Some payment methods do not process in all currencies. In such cases a processing currency will be displayed, along with a conversion calculator available on the page.
  </p>
  
  <p>
  We are under no obligation to open an account for you and our website sign-up page is merely an invitation to treat. It is entirely within our sole discretion whether or not to proceed with the opening of an account for you and, should we refuse to open an Account for you, we are under no obligation to provide you with a reason for the refusal.
  </p>
  
  <p>
  Upon receipt of your application, we may be in touch to request further information and/ or documentation from you in order for us to comply with our regulatory and legal obligations.
  </p>

  3. <span class="underline">Restricted Use</span>
  <p></p>
  
  <ul>
    <li>
    3.1 You must not use the Service:
    <p>if you are under the age of 18 years (or below the age of majority as stipulated in the laws of the jurisdiction applicable to you) or if you are not legally able to enter into a binding legal agreement with us;</P>
    <p>to collect nicknames, e-mail addresses and/or other information of other Customers by any means (for example, by sending spam, other types of unsolicited e-mails or the unauthorised framing of, or linking to, the Service);</P>
    <p>to disrupt or unduly affect or influence the activities of other Customers or the operation of the Service generally;.</P>
    <p>to promote unsolicited commercial advertisements, affiliate links, and other forms of solicitation which may be removed from the Service without notice;.</P>
    <p>in any way which, in our reasonable opinion, could be considered as an attempt to: (i) cheat the Service or another Customer using the Service; or (ii) collude with any other Customer using the Service in order to obtain a dishonest advantage;</P>
    <p>to scrape our odds or violate any of our Intellectual Property Rights; or.</P>
    <p>for any unlawful activity whatsoever.</P>
    </li>
    <li>
    3.2 You cannot sell or transfer your account to third parties, nor can you acquire a player account from a third party.
    </li>
    <li>
    3.3 You may not, in any manner, transfer funds between player accounts.
    </li>
    <li>
    3.4 We may immediately terminate your Account upon written notice to you if you use the Service for unauthorised purposes. We may also take legal action against you for doing so in certain circumstances.
    </li>
  </ul>

  4. <span class="underline">Privacy</span>
  <p></p>

  <p>
  Any information provided to us by you will be protected and processed in strict accordance with these Terms and our Privacy Policy.
  </p>
 
  <p>
  We will not reveal the identity of any person who places bets using the service unless the information is lawfully required by competent authorities such as Regulators, the Police (e.g. to investigate fraud, money laundering or sports integrity issues), or by Financial Entities such as banks or payment suppliers or as permitted from time to time pursuant to the Privacy Policy.
  </p>
  
  <p>
  Upon registration , your information will be stored in our database. This means that your personal information may be transferred outside the European Economic Area (EEA) to jurisdictions that may not provide the same level of protection and security as applied within the EU or EEA. By agreeing to these Terms you agree to the transfer of your personal information for the purpose of the provision of the Service object of this agreement and as further detailed in our Privacy Policy.
  </p>

  5. <span class="underline">Your Account</span>
  <p></p>
  
  <p>
    We accept Accounts in multiple currencies.
  </p>
  
  <p>
    We do not give credit for the use of the service.
  </p>
  
  <p>
    We may close or suspend an Account and refund any monies held if you are not or we reasonably believe that you are not complying with these Terms, or to ensure the integrity or fairness of the Service or if we have other reasonable grounds to do so. We may not always be able to give you prior notice.
  </p>
  
  <p>
    We reserve the right to suspend an account without prior notice and return all funds. Contractual obligations already matured will however be honoured.
  </p>
  
  <p>
    We reserve the right to refuse, restrict, cancel or limit any wager at any time for whatever reason, including any bet perceived to be placed in a fraudulent manner in order to circumvent our betting limits and/ or our system regulations.
  </p>
  
  <p>
    If we close or suspend your account due to you not complying with these terms, we may cancel and/or void any of your bets.
  </p>
  
  <p>
    If any amount is mistakenly credited to your account it remains our property and when we become aware of any such mistake, we shall notify you and the amount will be withdrawn from your Account.
  </p>
  
  <p>
    If, for any reason, your account goes overdrawn, you shall be in debt to us for the amount overdrawn.
  </p>
  
  <p>
    You must inform us as soon as you become aware of any errors with respect to your Account.
  </p>
  
  <p>
    Customers have the right to self-exclude themselves from ninewicket.live. These requests have to be received from the Customer’s Registered Email Address and have to be sent to support@ninewicket.live.
  </p>
  
  <p>
    Customers may set limitations on the amount they may wager and lose. Such request has to be sent from the Customer’s Registered Email Address to support@ninewicket.live .Implementation and increasing of limits shall be processed diligently, however, any request for removing or reducing limitations shall be done after a cooling-off period of seven days following your request.
  </p>
  
  <p>
    Should you wish to close your account with us, please send an email from your Registered Email Address to support@ninewicket.live.
  </p>

  6. <span class="underline">Deposit of Funds</span>
  <p></p>

  <p>
    You may deposit funds into your Account by any of the methods set out on our Website. All deposits should be made in the same currency as your Account and any deposits made in any other currency will be converted using the daily exchange rate obtained from www.oanda.com, or at our own bank’s prevailing rate of exchange following which your Account will be deposited accordingly.
  </p>

  <p>
    Fees and charges may apply to customer’s deposits and withdrawals. Any deposit made to an account which is not rolled over (risked) three times will incur a 3% processing fee and any applicable withdrawal fee. You are responsible for your own bank charges that you may incur due to depositing funds with us. Exceptions to this rule are outlined in our “Payment Options” pages.
  </p>
  
  <p>
    ninewickets is not a financial institution and uses a third party electronic payment processors to process credit and debit card deposits; they are not processed directly by us. If you deposit funds by either a credit card or a debit card, your Account will only be credited if we receive an approval and authorisation code from the payment issuing institution. If your card’s issuer gives no such authorisation, your account will not be credited with those funds.
  </p>
 
  <p>
    Your funds are deposited and held in the respective client account based on the currency of your account.
  </p>
  
  <p>
    We are not a financial institution and you will not be entitled to any interest on any outstanding account balances and any interest accrued on the client accounts will be paid to us.
  </p>
  
  <p>
    Funds originating from ill-gotten means must not be deposited with us.
  </p>

  7. <span class="underline">Withdrawal of Funds</span>
  <p></p>

  <p>
    You may withdraw any or all of your account Balance within the transaction.
  </p>
  
  <p>
    Note that fees may apply as outlined in section 7.b.
  </p>
  
  <p>
    All withdrawals must be made in the currency of your account, unless otherwise stipulated by us.
  </p>
  
  <p>
    We reserve the right to request documentation for the purpose of identity verification prior to granting any withdrawals from your Account. We also reserve our rights to request this documentation at any time during the lifetime of your relationship with us.
  </p>
  
  <p>
    All withdrawals must be made to the original debit, credit card, bank account, method of payment used to make the payment to your ninewicket.live Account. We may, and always at our own discretion, allow you to withdraw to a payment method from which your original deposit did not originate. This will always be subject to additional security checks.
  </p>
  <p>
    All withdrawals must be made to the original debit, credit card, bank account, method of payment used to make the payment to your ninewicket.live Account. We may, and always at our own discretion, allow you to withdraw to a payment method from which your original deposit did not originate. This will always be subject to additional security checks.
  </p>

  <p>
    Should you wish to withdraw funds but your account is either inaccessible, dormant, locked or closed, please contact our Customer Service Department at support@ninewicket.live
  </p>

  8. <span class="underline">Payment Transactions and Processors</span>
  <p></p>

  <p>
    You are fully responsible for paying all monies owed to us. You must make all payments to us in good faith and not attempt to reverse a payment made or take any action which will cause such payment to be reversed by a third party in order to avoid a liability legitimately incurred. You will reimburse us for any charge-backs, denial or reversal of payment you make and any loss suffered by us as a consequence thereof. We reserve the right to also impose an administration fee of €60, or currency equivalent per charge-back, denial or reversal of payment you make.
  </p>
  
  <p>
    We reserve the right to use third party electronic payment processors and or merchant banks to process payments made by you and you agree to be bound by their terms and conditions providing they are made aware to you and those terms do not conflict with these Terms.
  </p>
  
  <p>
    All transactions made on our site might be checked to prevent money laundering or terrorism financing activity. Suspicious transactions will be reported to the relevant authority depending on the jurisdiction governing the transaction.
  </p>

  9. <span class="underline">Errors</span>
  <p></p>

  <p>
    In the event of an error or malfunction of our system or processes, all bets are rendered void. You are under an obligation to inform us immediately as soon as you become aware of any error with the service. In the event of communication or system errors or bugs or viruses occurring in connection with the service and/or payments made to you as a result of a defect or effort in the Service, we will not be liable to you or to any third party for any direct or indirect costs, expenses, losses or claims arising or resulting from such errors, and we reserve the right to void all games/bets in question and take any other action to correct such errors.
  </p>
  
  <p>
    In the event of a casino system malfunction, or disconnection issues, all bets are rendered void. In the event of such error or any system failure or game error that results in an error in any odds calculation, charges, fees, rake, bonuses or payout, or any currency conversion as applicable, or other casino system malfunction (the “Casino Error”), we reserve the right to declare null and void any wagers or bets that were the subject of such Casino Error and to take any money from your Account relating to the relevant bets or wagers.
  </p>
  
  <p>
    We make every effort to ensure that we do not make errors in posting lines. However, if as a result of human error or system problems a bet is accepted at an odd that is: materially different from those available in the general market at the time the bet was made; or clearly incorrect given the chance of the event occurring at the time the bet was made then we reserve the right to cancel or void that wager, or to cancel or void a wager made after an event has started.
  </p>
  
  <p>
    We have the right to recover from you any amount overpaid and to adjust your account to rectify any mistake. An example of such a mistake might be where a price is incorrect or where we enter a result of an event incorrectly. If there are insufficient funds in your Account, we may demand that you pay us the relevant outstanding amount relating to any erroneous bets or wagers. Accordingly, we reserve the right to cancel, reduce or delete any pending plays, whether placed with funds resulting from the error or not.
  </p>

  10. <span class="underline">General Rules</span>
  <p></p>

  <p>
    If a sport-specific rule contradicts a general rule, then the general rule will not apply.
  </p>
  
  <p>
    The winner of an event will be determined on the date of the event’s settlement; we do not recognise protested or overturned decisions for wagering purposes. The result of an event suspended after the start of competition will be decided according to the wagering rules specified for that sport by us.
  </p>
  
  <p>
    All results posted shall be final after 72 hours and no queries will be entertained after that period of time. Within 72 hours after results are posted, the company will only reset/correct the results due to human error, system error or mistakes made by the referring results source.
  </p>
  
  <p>
    Minimum and maximum wager amounts on all sporting events will be determined by us and are subject to change without prior written notice. We also reserve the right to adjust limits on individual Accounts as well.
  </p>
  
  <p>
    Customers are solely responsible for their own account transactions. Please be sure to review your wagers for any mistakes before sending them in. Once a transaction is complete, it cannot be changed. We do not take responsibility for missing or duplicate wagers made by the Customer and will not entertain discrepancy requests because a play is missing or duplicated. Customers may review their transactions in the My Account section of the site after each session to ensure all requested wagers were accepted.
  </p>
  
  <p>
    For a wager to have action on any named contestant in a Yes/No Proposition, the contestant must enter and compete in the event.
  </p>
  
  <p>
    We attempt to follow the normal conventions to indicate home and away teams by indicating the home and away team by means of vertical placement on the desktop site version. This means in American Sports we would place the home team on the bottom. For Non-US sports, we would indicate the home team on top. In the case of a neutral venue, we attempt to include the letter “N” next to the team names to indicate this. For the Asian and mobile versions, we do not distinguish between European and American Sports. On the Asian and mobile versions of the site, the home team is always listed first. However, we do not guarantee the accuracy of this information and unless there is an official venue change subsequent to bets being placed, all wagers have action.
  </p>
  
  <p>
    A game/match will have action regardless of the League heading that is associated with the matchup. For example, two teams from the same League are playing in a Cup competition. If the matchup is mistakenly placed in the League offering, the game/match will still have action, as long as the matchup is correct. In other words, a matchup will have action as long as the two teams are correct, and regardless of the League header in which it is placed on our Website.
  </p>
  
  <p>
    If an event is not played on the same date as announced by the governing body, then all wagers on the event have no action. If an event is posted by us, with an incorrect date, all wagers have action based on the date announced by the governing body.
  </p>
  
  <p>
    ninewickets reserves the right to remove events, markets and any other product from the website.
  </p>
  
  <p>
    ninewickets reserves the right to restrict the casino access of any player without prior notice.
  </p>

  <p>
    In all futures wagering (for example, total season wins, Super Bowl winner, etc.), the winner as determined by the Governing Body will also be declared the winner for betting purposes except when the minimum number of games required for the future to have “action” has not been completed.
  </p>

  11. <span class="underline">Communications and Notices</span>
  <p></p>

  <p>
    All communications and notices to be given under these terms by you to us shall be sent to support@ninewicketscom
  </p>
  
  <p>
    All communications and notices to be given under these terms by us to you shall, unless otherwise specified in these terms, be either posted on the Website and/or sent to the Registered Email Address we hold on our system for the relevant Customer. The method of such communication shall be in our sole and exclusive discretion.
  </p>
  
  <p>
    All communications and notices to be given under these terms by either you or us shall be in writing in the English language when the service is not operated by ninewickets, and must be given to and from the Registered Email Address in your Account.
  </p>

  12. <span class="underline">Matters Beyond Our Control</span>
  <p></p>

  <p>
    We cannot be held liable for any failure or delay in providing the service due to an event of Force Majeure which could reasonably be considered to be outside our control despite our execution of reasonable preventative measures such as: an act of God; trade or labour dispute; power cut; act, failure or omission of any government or authority; obstruction or failure of telecommunication services; or any other delay or failure caused by a third party, and we will not be liable for any resulting loss or damage that you may suffer. In such an event, we reserve the right to cancel or suspend the Service without incurring any liability.
  </p>

  13. <span class="underline">Liability</span>
  <p></p>

  <p>
    TO THE EXTENT PERMITTED BY APPLICABLE LAW, WE WILL NOT COMPENSATE YOU FOR ANY REASONABLY FORESEEABLE LOSS OR DAMAGE (EITHER DIRECT OR INDIRECT) YOU MAY SUFFER IF WE FAIL TO CARRY OUT OUR OBLIGATIONS UNDER THESE TERMS UNLESS WE BREACH ANY DUTIES IMPOSED ON US BY LAW (INCLUDING IF WE CAUSE DEATH OR PERSONAL INJURY BY OUR NEGLIGENCE) IN WHICH CASE WE SHALL NOT BE LIABLE TO YOU IF THAT FAILURE IS ATTRIBUTED TO
  <ul>
    <li>(I) YOUR OWN FAULT;</li>
    <li>(II) A THIRD PARTY UNCONNECTED WITH OUR PERFORMANCE OF THESE TERMS (FOR INSTANCE PROBLEMS DUE TO COMMUNICATIONS NETWORK PERFORMANCE, CONGESTION, AND CONNECTIVITY OR THE PERFORMANCE OF YOUR COMPUTER EQUIPMENT); OR</li>
    <li>
    (III) ANY OTHER EVENTS WHICH NEITHER WE NOR OUR SUPPLIERS COULD HAVE FORESEEN OR FORESTALLED EVEN IF WE OR THEY HAD TAKEN REASONABLE CARE. AS THIS SERVICE IS FOR CONSUMER USE ONLY WE WILL NOT BE LIABLE FOR ANY BUSINESS LOSSES OF ANY KIND. IN THE EVENT THAT WE ARE HELD LIABLE FOR ANY EVENT UNDER THESE TERMS, OUR TOTAL AGGREGATE LIABILITY TO YOU UNDER OR IN CONNECTION WITH THESE TERMS SHALL NOT EXCEED
      <ul>
      <li>(A) THE VALUE OF THE BETS AND OR WAGERS YOU PLACED VIA YOUR ACCOUNT IN RESPECT OF THE RELEVANT BET/WAGER OR PRODUCT THAT GAVE RISE TO THE RELEVANT LIABILITY, OR</li>
      <li>(B) EUR €500 IN AGGREGATE, WHICHEVER IS LOWER. WE STRONGLY RECOMMEND THAT YOU (I) TAKE CARE TO VERIFY THE SUITABILITY AND COMPATIBILITY OF THE SERVICE WITH YOUR OWN COMPUTER EQUIPMENT PRIOR TO USE; AND (II) TAKE REASONABLE PRECAUTIONS TO PROTECT YOURSELF AGAINST HARMFUL PROGRAMS OR DEVICES INCLUDING THROUGH INSTALLATION OF ANTI-VIRUS SOFTWARE.</li>
      </ul>
    </li>
  </ul>
  </p>

  14. <span class="underline">Gambling By Those Under Age</span>
  <p></p>

  <p>
    If we suspect that you are or receive notification that you are currently under 18 years or were under 18 years (or below the age of majority as stipulated in the laws of the jurisdiction applicable to you) when you placed any bets through the service your account will be suspended to prevent you placing any further bets or making any withdrawals from your account. We will then investigate the matter, including whether you have been betting as an agent for, or otherwise on behalf, of a person under 18 years (or below the age of majority as stipulated in the laws of the jurisdiction applicable to you). If having found that you: (a) are currently; (b) were under 18 years or below the majority age which applies to you at the relevant time; or (c) have been betting as an agent for or at the behest of a person under 18 years or below the majority age which applies:
    <ul>
      <li>i. all winnings currently or due to be credited to your account will be retained;</li>
      <li>ii. all winnings gained from betting through the service whilst under age must be paid to us on demand (if you fail to comply with this provision we will seek to recover all costs associated with recovery of such sums); and/or</li>
      <li>iii. any monies deposited in your ninewicket.live account which are not winnings will be returned to you.</li>
    </ul>
  </p>

  <p>
    This condition also applies to you if you are over the age of 18 years but you are placing your bets within a jurisdiction which specifies a higher age than 18 years for legal betting and you are below that legal minimum age in that jurisdiction.
  </p>
  
  <p>
    In the event we suspect you are in breach of the provisions of this Clause 15 or are attempting to rely on them for a fraudulent purpose, we reserve the right to take any action necessary in order to investigate the matter, including informing the relevant law enforcement agencies.
  </p>

  15. <span>Anti Money-Laundering and KYC Policy</span>
  <p></p>

  <p>
    It is the policy of ninewickets to actively prevent the services of the firm being used to facilitate financial crime, money laundering and terrorist financing.
  </p>
  
  <p>
    Strict compliance with all applicable regulations will also protect the senior management and staff of the firm, as individuals, from the risks of breaches of the law, regulations, and supervisory requirements, and to preserve the reputation of the ninewickets against the damage that could be caused by being implicated in money laundering and terrorist financing activities.
  </p>
  
  <p>
    To achieve these objectives, it is the policy of this firm that:
    <ul>
      <li>Every staff member shall meet their personal obligations as appropriate to their role and responsibilities;</li>
      <li>Commercial considerations cannot take precedence over ninewickets anti-money laundering commitment;</li>
      <li>The firm shall appoint a Money Laundering Reporting Officer/Nominated Officer (“MLRO”), and a deputy to cover in their absence, and they shall be afforded every assistance and cooperation by all members of staff in carrying out their duties and responsibilities. The deputy will be the Director Chief Executive Officer (CEO).</li>
    </ul>
  </p>
  
  <p>
    ninewickets will strictly comply with all applicable AML/CFT rules and regulations with specific emphasis on:
    <ul>
      <li>A culture of compliance to be adopted and promulgated throughout the firm towards the prevention of financial crime;</li>
      <li>A commitment to ensuring that customer’s identities will be satisfactorily verified at required thresholds;</li>
      <li>A commitment to “knowing its customer” appropriately - both at acceptance and throughout the business relationship - through taking appropriate steps to verify the customer’s identity and monitoring their use ninewickets services;</li>
      <li>A commitment to ensuring that staff are trained and made aware of the law and their obligations under it, and to establishing procedures to implement these requirements; and</li>
      <li>Recognition of the importance of staff promptly reporting their suspicions internally:</li>
    </ul>
  </p>

  <p>
  At the heart of our policies, procedures and controls, and consistent with FATF Recommendation 1, is the risk-based approach. The risk-based approach means that we focus our resources on the areas of greatest risk.
  </p>
  
  <p>
  Our policies, procedures and internal controls are designed to ensure compliance with all applicable anti-money laundering and anti-terrorist financing regulations and regulatory guidelines and will be reviewed and updated on a regular basis to ensure appropriate policies, procedures and internal controls are in place to account for both changes in regulations and changes in our business.
  </p>

  15.1 <span class="underline"> Money Laundering and Terrorism Financing </span>
  <p></p>

  <p>
  Money Laundering means:
  </p>
  
  <p>
  a. The conversion or transfer of property, knowing that such property is derived from criminal activity or from an act of participation in such activity, for the purpose of concealing or disguising the illicit origin of the property or of assisting any person who is involved in the commission of such an activity to evade the legal consequences of that person's action;
  </p>
  
  <p>
  b. The concealment or disguise of the true nature, source, location, disposition, movement, rights with respect to, or ownership of, property, knowing that such property is derived from criminal activity or from an act of participation in such an activity;
  </p>
  
  <p>
  c. The acquisition, possession or use of property, knowing, at the time of receipt, that such property was derived from criminal activity or from an act of participation in such an activity;
  </p>
  
  <p>
  d. Participation in, association to commit, attempts to commit and aiding, abetting, facilitating and counselling the commission of any of the actions referred to in points (a), (b) and (c).
  </p>
  
  <p>
  Money laundering shall be regarded as such even where the activities which generated the property to be laundered were carried out in the territory of another Member State or in that of a third country.
  </p>
  
  <p>
  Terrorism financing means the provision or collection of funds, by any means, directly or indirectly, with the intention that they be used or in the knowledge that they are to be used, in full or in part, in order to carry out any terrorist act.
  </p>

  15.2 <span class="underline">Organization of the AML/CFT function</span>
  <p></p>

  15.2.1 <span class="underline">Senior Management</span>
  <p></p>

  <p>
  Senior Management are responsible for the overall compliance policy of ninewickets and ensuring adequate resources are provided for the proper training of staff and the implementing of risk systems. This includes computer software to assist in oversight. Senior management will receive and consider the monthly compliance reports sent by the MLRO and authorise changes based on the recommendations if required.
  </p>

  <p>
  Senior Management consists of the Board of Directors, the Executive Management Committee and the MLRO.
  </p>

  15.2.2 <span class="underline">The Nominated Officer/Money Laundering Reporting Officer</span>
  <p></p>

  <p>
  Responsible for receiving internal disclosures and making reports to the Gaming Control Board, Curacao. First point of contact for all compliance issues from staff. Prepares monthly report for consideration of senior management and conducts risk assessments of compliance systems. Undertakes regular random analysis of transactions including assessment of documentary evidence provided by customers. Assists in making any necessary amendments to AML Policy in line with risk assessment. Ensures everyone is periodically informed of any changes in anti- money laundering or anti-terrorist financing legislation, policies and procedures, as well as current developments and changes in money laundering or terrorist activity financing schemes particular to their jobs. Reviews customer identification information to ensure that all the necessary information has been obtained. Establishes and implement the risk scoring matrix following regulatory guidance and for review and approval by Senior Management.
  </p>

  15.2.3 <span class="underline">Staff</span>
  <p></p>

  <p>
  Responsible for knowing the AML Compliance Policy and understanding responsibilities. Ensure company procedures are adhered to and obtaining all documentary evidence as outlined within the manual. Ensure that all suspicious and unusual activity is reported to the MLRO.
  </p>

  15.3 <span class="underline">The Compliance Programme</span>
  <p></p>

  15.3.1 <span class="underline">The Money Laundering Reporting Officer (MLRO)</span>
  <p></p>

  <p>
  ninewickets has appointed a MLRO with full responsibility for ninewickets’s anti-money laundering compliance.
  </p>

  <p>
  The MLRO:
    <ul>
      <li>
      Will monitor the day-to-day operation of ninewickets TRADING’s AML/CFT policies and respond to any reasonable request made by the law enforcement and/or the Gaming Control Board, Curacao.
      </li>
      <li>
      Has the authority to act independently in carrying out their responsibilities, which includes direct access to the Gaming Control Board, Curacao and appropriate law enforcement agencies, in order that any suspicious activity may be reported to the right quarter as soon as is practicable.
      </li>
      <li>
      Has the authority and the resources necessary to discharge their responsibilities effectively.
      </li>
      <li>
      Is from a senior level and has direct access to senior management and the board of directors.
      </li>
      <li>
      May choose to delegate certain duties to other employees, but wherever such a delegation is made, the MLRO retains ultimate responsibility for the implementation of the compliance regime.
      </li>
      <li>
      At least annually, the MLRO will issue a report (the MLRO Report) to the senior management of ninewickets on the operation and effectiveness of the money laundering controls. This report will cover improvements, remedial programmes, the outcome of any internal audit reviews of the AML/CFT processes, and other relevant items.
      </li>
    </ul>
  </p>

  15.4 <span class="underline">Compliance Policies and Procedures</span>
  <p></p>

  <p>
  ninewickets has policies and procedures to assess the risks related to money laundering and terrorist financing. These policies and procedures are:
    <ul>
      <li>
      Written and maintained by the MLRO under the supervision of senior management
      </li>
      <li>
      Approved by senior management
      </li>
      <li>
      Communicated, understood and adhered to by everyone dealing with customers or their transactions, including those who work in the areas relating to customer identification, record keeping, and reportable transactions, who need enough information to process and complete a transaction properly as well as to ascertain the identity of customers and keep records as required.
      </li>
      <li>
      Policies and procedures which incorporate the reporting, record keeping, customer identification, risk assessment and risk mitigation requirements applicable.
      </li>
    </ul>
  </p>

  <p>
  Although directors and senior officers may not be involved in day-to-day compliance, they need to understand the statutory duties placed upon them, their staff and ninewickets itself.
  </p>

  15.4.1 <span class="underline">The Risk-Based Approach</span>
  <p></p>

  <p>
  In money laundering and terrorist financing, a risk-based approach covers the following:
    <ul>
      <li>
      The risk assessment of customer relationships and business activities;
      </li>
      <li>
      The risk mitigation to implement controls to handle identified risks;
      </li>
      <li>
      Keeping customer identification, beneficial ownership and business relationship information up to date; and
      </li>
      <li>
      The ongoing monitoring of business relationships and transactions.
      </li>
    </ul>
  </p>

  <p>
  Existing regulatory obligations, such as for customer identification, are a minimum baseline requirement. Where enhanced due diligence is appropriate, a principle of the risk-based approach is to focus resources where they are most needed to manage risks within our tolerance level.
  </p>

  15.4.2 <span class="underline">Risk Mitigation</span>
  <p></p>

  <p>
    Risk mitigation is implementing controls to limit the potential money laundering and terrorist financing risks identified in the risk assessment so as to stay within the risk tolerance level.
  </p>

  <p>
    When the risk assessment determines that risk is high for money laundering or terrorist financing, ninewickets will develop and apply appropriate risk mitigation strategies.
  </p>

  <p>
    In all situations, risk mitigation controls and measures include:
    <ul>
      <li>
        Focussing on operations (products and services, customers and business relationships, geographic locations, and any other relevant factors) that are more vulnerable to abuse by money launderers and criminals;
      </li>
      <li>
        Informing senior management of compliance initiatives, identified compliance deficiencies, corrective action taken, and suspicious transaction reports filed;
      </li>
      <li>
        Providing for program continuity despite changes in management, employees or structure;
      </li>
      <li>
        Focussing on meeting all regulatory record keeping and reporting requirements and ensuring timely updates in response to changes in requirements;
      </li>
      <li>
        Enabling the timely identification of reportable transactions and ensuring accurate filing of required reports;
      </li>
      <li>
        Incorporating AML/CFT compliance into job descriptions and performance evaluations of appropriate personnel;
      </li>
      <li>
        Providing adequate supervision and training of employees involved in customer identification, transaction monitoring, reporting obligations and other AML/CFT activities;
      </li>
      <li>
        Increasing awareness of high-risk situations across all business lines;
      </li>
      <li>
        Increasing the frequency of ongoing monitoring of transactions and business relationships;
      </li>
      <li>
        Escalating approval requirements for the establishment of accounts or business relationships where appropriate;
      </li>
      <li>
        Increasing the level of ongoing controls and reviews of customer relationships;
      </li>
      <li>
        Requesting additional documented information from high-risk customers regarding controls implemented to prevent misuse of their operations for money laundering or terrorist financing;
      </li>
      <li>
        Verifying customer identity using reliable and independent source documents, data or information;
      </li>
      <li>
        Preventing transactions with potential customers until identification and account opening requirements have been satisfied;
      </li>
      <li>
        Implementing an approval process for all relationships identified as high-risk or declining relationships that exceed ninewickets's risk tolerance level;
      </li>
      <li>
        Implementing a process to terminate existing high-risk relationships where management determines that the risk exceeds ninewickets's risk tolerance level.
      </li>
    </ul>
  </p>

  15.4.3 <span class="underline">Risk Assessment</span>
  <p></p>

  <p>
    ninewickets is required to and will analyse potential threats and vulnerabilities relating to money laundering and terrorist financing to which the business may be exposed through a documented risk assessment.
  </p>

  <p>
    The risk assessment will consider and document the following:
    <ul>
      <li>
        Products, services and delivery channels;
      </li>
      <li>
        Geographic locations and areas of operation; and
      </li>
      <li>
        Customers.
      </li>
    </ul>
  </p>

  <p>
    The risk assessment may identify high-risk situations for which additional risk mitigation controls, enhanced due diligence measures and ongoing monitoring may be required.
  </p>

  <p>
    The risk assessment is not static and will be reviewed and updated regularly to reflect changes in business activities, customer profiles, products, services, geographic exposure and regulatory requirements.
  </p>

  <p>
    When a customer is identified as high-risk, they will be subject to enhanced due diligence measures, including more frequent ongoing monitoring of transactions and business relationships, periodic reviews, and updating of customer identification information where appropriate.
  </p>

  <p>
    ninewickets shall perform an initial risk assessment at the commencement of a new customer relationship and shall conduct ongoing risk assessments of existing customers throughout the business relationship.
  </p>

  15.5 <span class="underline">Client and Business Risk</span>

  <p></p>

  15.5.1 <span class="underline">Products, Services and Delivery Channels</span>

  <p></p>

  <p>
    ninewickets will identify products and services or combinations of them that may pose an elevated risk of money laundering or terrorist financing. For example, products and services that support the movement and conversion of assets into, through and out of the financial system pose a high risk. Certain services have also been identified by financial regulators, governmental authorities or other credible sources as being potentially high-risk for money laundering or terrorist financing.
  </p>

  <p>
    <ul>
      <li>Wire transactions;</li>
      <li>Transactions involving third parties;</li>
      <li>Non-face-to-face business relationships.</li>
    </ul>
  </p>

  15.5.2 <span class="underline">Geographic Locations and Areas of Operation</span>

  <p></p>

  <p>
    Certain geographic locations potentially pose an elevated risk for money laundering and terrorist financing. These have been described by the FATF and by other resources such as Transparency International.
  </p>

  <p>
    Clients from, or identified as linked to these countries will be regarded as high risk:
  </p>

  <p>
    <ul>
      <li>Any country subject to sanctions, embargoes, or similar measures;</li>
      <li>Any country identified by credible sources as providing funding or support for terrorist activities, or that have designated terrorist organisations operating within their country;</li>
      <li>Any country known to be a tax haven, source of narcotics or other significant criminal activity;</li>
      <li>Any country identified by the Financial Action Task Force (FATF) as non-cooperative in the fight against money laundering or terrorist financing or subject to a FATF statement;</li>
      <li>Any country identified by credible sources as lacking appropriate money laundering or terrorist financing laws and regulations, or as having significant levels of corruption.</li>
    </ul>
  </p>

  <p>
    ninewickets does not do business with or provide services to anyone in any country belonging to a list of select countries subject to comprehensive international sanctions.
  </p>

  15.5.3 <span class="underline">Customer Relationships</span>

  <p></p>

  <p>
    The risk assessment requires to know your customers (“KYC”). This is not limited to identification or record keeping, but it is also about understanding the customers – including their activities, transaction patterns, and how they operate.
  </p>

  <p>
    Examples of the factors that will be considered are:
  </p>

  <p>
    <ul>
      <li>How long we have known the customer and had a business relationship;</li>
      <li>Customers wanting to carry out large transactions;</li>
      <li>Customers with regulatory or enforcement issues;</li>
      <li>Customers with multiple online complaints;</li>
      <li>Customers whose identification is difficult to verify;</li>
      <li>Customers whose who are politically exposed.</li>
    </ul>
  </p>

  <p>
    Each customer is risk-rated as either posing a low, medium or high risk of money laundering and/or terrorist financing. The rating given at the beginning of the business relationship may be adjusted after the re-assessment and may change over time. The level of customer due diligence will vary depending on the risk rating of the customer at the beginning of the relationship and as it changes.
  </p>

  <p>
    For all high-risk players, enhanced due diligence is applied right away.
  </p>

  15.5.4 <span class="underline">Regulatory risk</span>

  <p></p>

  <p>
    Regulatory risk means not meeting our obligations under applicable legislation. Examples of breaches of regulatory obligations include:
  </p>

  <p>
    <ul>
      <li>Customer identification not done properly;</li>
      <li>Failure to train staff adequately;</li>
      <li>Bot having an anti-money laundering and anti-terrorist financing (AML/CFT) program;</li>
      <li>Failure to report suspicious transactions;</li>
      <li>Not having an MLRO;</li>
      <li>Failing to keep complete customer records.</li>
    </ul>
  </p>

  15.5.5 <span class="underline">Compliance Training</span>

  <p></p>

  <p>
    ninewickets has a training program for all relevant employees and other individuals who act on behalf of the Company. The goal of this training is to make sure that those who have contact with customers, who see customer transaction activity or who handle funds in any way understand the reporting, customer identification and record keeping requirements.
  </p>

  <p>
    All new employees of ninewickets are required to complete anti-money laundering and terrorist financing compliance training within their first three months of employment, and for customer-facing staff training is delivered prior to dealing with customers.
  </p>

  <p>
    Training is currently conducted through a customised course. The training program is delivered electronically (via a learning management system). The training program is reviewed and updated by the MLRO to reflect requirements as they change. The compliance training includes a test which everyone must pass in order to consider their training complete.
  </p>

  <p>
    To ensure employee training is kept up to date, all existing employees will receive follow up training on new and existing AML and regulatory requirements on a regular basis (at least within one year of their last training). If the online training test results show that a staff member does not understanding the training material, ninewickets will ensure that the staff member receives specialised one-on-one training to understand the material.
  </p>

  <p>
    An employee log of assigned and completed training materials is kept by the MLRO and the Human Resources department for administrative purposes. Retention of these records is for a period of five years.
  </p>

  <p>
    Compliance training is adjusted in accordance to the employee’s role within the company. The MLRO will review functions and arrange to provide suitable and customised training.
  </p>

  <p>
    Our training will include at a minimum:
  </p>

  <p>
    <ul>
      <li>An understanding of the reporting, customer identification and record keeping requirements as well as penalties for not meeting those requirements;</li>
      <li>Making all employees aware of the internal policies and procedures for deterring and detecting money laundering and terrorist financing that are associated with their jobs;</li>
      <li>Delivering to employees and suppliers a clear understanding of their responsibilities under these policies and procedures;</li>
      <li>All those who have contact with customers, who see customer transaction activity, who handle cash or funds in any way or who are responsible for implementing or overseeing the compliance regime must understand the reporting, customer identification and record keeping requirements.</li>
      <li>Making all employees aware of how ninewickets is vulnerable to abuse by criminals laundering the proceeds of crime or by terrorists financing their activities;</li>
      <li>Making all employees and agents aware that they cannot disclose that they have made a suspicious transaction report, or disclose the contents of such a report, with the intent to prejudice a criminal investigation, whether it has started or not;</li>
      <li>That all employees and agents understanding that no criminal or civil proceedings may be brought against them for making a report in good faith;</li>
      <li>Background information on money laundering so everyone who needs to can understand what money laundering is, why criminals choose to launder money and how the process usually works;</li>
      <li>Details of what terrorist financing is and how that process usually works.</li>
    </ul>
  </p>

  <p>
    The MLRO is responsible for ensuring that everyone is informed of changes in anti-money laundering or anti-terrorist financing legislation, policies and procedures, and current developments in money laundering or terrorist activity financing schemes particularly relevant to their jobs.
  </p>

  <p>
    Certain employees, such as those in compliance, customer services and operations, require types of specialised additional training which will be provided either through external services or internally. The training program is reviewed and updated to reflect changes in requirements.
  </p>

  15.6. <span class="underline">Minimum standards – KYC POLICY</span>

  <p></p>

  <p>
    ninewickets has established standards regarding Know-Your-Customer (“KYC”). These standards require due diligence on each prospective customer before entering into a business relationship via identification and verification of his identity and, as the case may be, his representatives and beneficial owners on the basis of documents, data or information obtained from a reliable and independent source compliant with the domestic and European AML/CFT legislation and regulation.
  </p>

  <p>
    Interpretation of the KYC principle begins with identification of the customer by means of the necessary identification documents.
  </p>

  <p>
    That identification, completed by other information gathered, enables the Customer Acceptance Policy to be applied.
  </p>

  <p>
    In addition to these objective criteria, there are subjective elements which may arouse suspicions regarding a customer and to which particular attention should be paid.
  </p>

  <p>
    Finally, as KYC does not involve static data, but dynamic data through the relationship with the customer, it also needs follow-up and ongoing monitoring of the customer.
  </p>

  15.6.1. <span class="underline">Customer identification and verification (KYC)</span>

  <p></p>

  <p>
    The formal identification of customers on entry into commercial relations is a vital element, both for the regulations relating to money laundering and for the KYC policy.
  </p>

  <p>
    This identification relies on the following fundamental principles :
  </p>

  <p>
    <ul>
      <li>Each customer (= each individual person and/or each person involved in the case of a legal entity) must be identified by means of original supporting documents.</li>
      <li>These documents will be recorded in a centralised system.</li>
      <li>The identification must be completed by "face-to-face" contact.</li>
      <li>Distance identification is also authorised and possible within a dedicated acceptance process, but limits the opportunity to carry out certain transactions or to access certain products.</li>
      <li>Each person identified must be registered by IT means.</li>
      <li>A person will not be accepted as a customer if the identification process proves to be incomplete.</li>
      <li>The specific case of the due diligence exercised on the acceptance of politically exposed persons (PEP).</li>
    </ul>
  </p>

  <p>
    Concrete application at ninewickets is reflected by a specific identification procedure for customers referenced as PEP, whatever their place of residence.
  </p>

  15.6.2. <span class="underline">Risk Profile calculation</span>

  <p></p>

  <p>
    To assist in determining the level of AML/CFT due diligence to be exercised with regard to the Customer, a “Compliance” risk profile is calculated first of all on entry into relations (Low, Medium, High), and is then recalculated daily.
  </p>

  15.6.3. <span class="underline">Customer acceptance policy</span>

  <p></p>

  15.6.3.1. <span class="underline">Customer Identification</span>

  <p></p>

  <p>
    Client Identification is intended to confirm the existence and identify the individual with which ninewickets has a business relationship and obtain supporting identity information. This includes measures to:
  </p>

  <p>
    <ul>
      <li>Confirm the existence of the individual through identification documents;</li>
      <li>Conduct due diligence into the identity of the customer including:</li>
      <li>Cross-referencing customer names against government watch lists;</li>
      <li>Determining whether the customers are politically exposed persons;</li>
      <li>Determining whether any third parties are involved;</li>
      <li>Reviewing relevant publicly available information on the customer (e.g. adverse media, social media);</li>
      <li>Reviewing their background, reputation;</li>
      <li>Keep records of all information and documents obtained.</li>
    </ul>
  </p>

  15.6.3.2. <span class="underline">Identifying Information for Customers</span>

  <p></p>

  <p>
    This section sets out the standard identification requirements for individuals who have entered into a business relationship with ninewickets. This outline is likely to be sufficient for most situations. If, however, the customer is assessed as presenting a higher money laundering or terrorist financing risk, in line with our identified risk matrix, then ninewickets requires additional identity information to be provided and increase the level or verification accordingly.
  </p>

  <p>
    Where the result of the standard verification check gives rise to concern or uncertainty over identity, the number of matches that will be required to be reasonably satisfied as to the individual’s identity will increase. Any concerns must be reported to the MLRO.
  </p>

  <p>
    If a customer is unable to produce a primary ID, the reasons for this should be noted and they may not be able to maintain an account.
  </p>

  <p>
    All documentary evidence must be recent.
  </p>

  <p>
    <ul>
      <li>Passports and drivers’ licenses should be valid and not expired</li>
      <li>Utility bills should be dated within the last 3 months</li>
    </ul>
  </p>

  <p>
    In terms of beneficial ownership, we will ask every customer whether they are acting in their own capacity or on behalf of another person. If they are acting for another person then we will require details of such.
  </p>

  <p>
    Sources of evidence
  </p>

  <p>
    Proof of Identity - Acceptable photo identity:
  </p>

  <p>
    <ul>
      <li>Valid passport; or</li>
      <li>Valid photo card driving licence (full or provisional); or</li>
      <li>National identity card (non-UK nationals issued by EEA member states and Switzerland); or</li>
      <li>Identity card issued by the Electoral Office for Northern Ireland</li>
    </ul>
  </p>

  <p>
    Proof of Identity - Acceptable non-photo evidence of identity:
  </p>

  <p>
    Documents issued by a government department, incorporating the person’s name and residential address or their date of birth. E.g. (for proof of address or date of birth):
  </p>

  <p>
    <ul>
      <li>Instrument of a court appointment (such as a grant of probate, bankruptcy); or</li>
      <li>Current council tax demand letter or statement; or</li>
      <li>Current (within the last 3 months) bank statements, or credit/debit card statements issued by a regulated financial sector firm in the UK, EU or equivalent jurisdiction; or</li>
      <li>A recent (last available) utility bill (gas, water, electricity, telephone); it must be a bill or statement of account (not correspondence); statements printed off the internet are not acceptable on their own (a secondary check will be required such as a reference to a telephone directory including an online telephone directory); or</li>
      <li>Valid photo card driving licence (full or provisional); or</li>
      <li>A solicitor’s letter confirming recent house purchase or land previous address.</li>
    </ul>
  </p>

  <p>
    When accepting evidence of identity from a customer, it is important that we make sufficient checks on the evidence provided to satisfy us of the customer’s identity, and that we keep a record of the checks made. This will be done by the MLRO or under the supervision of the MLRO.
  </p>

  <p>
    Usual checks on photo ID may include:
  </p>

  <p>
    <ul>
      <li>Likeness against the customer</li>
      <li>Does the date of birth on the evidence match the apparent age of the customer?</li>
      <li>Is the ID valid?</li>
      <li>Is the spelling of names the same as other documents provided by the customer?</li>
    </ul>
  </p>

  <p>
    Checks on secondary evidence of ID may include:
  </p>

  <p>
    <ul>
      <li>Do the addresses match the address given on the photo ID?</li>
      <li>Does the name of the customer match with the name on the photo ID?</li>
    </ul>
  </p>

  15.6.3.3. <span class="underline">Identity Verification Triggers</span>

  <p></p>

  <p>
    Verification of the identity of the customer occurs either when the customer has reached the €2,000 threshold or if the player is considered to be a high-risk player upon registration. The main trigger for Identity Verification is considered a single transaction (or smaller, linked transactions) that reach or exceed €2,000 either at deposit or withdrawal stage. For example, transactions will be considered as linked when they are carried out by the same customer during a single period of being logged on to the ninewickets website or if they are carried out in 48 hours.
  </p>

  <p>
    In all cases, the customer will receive a notification to upload identity verification documents listed above. Each document that is provided by customers to ninewickets is checked manually by dedicated staff.
  </p>

  <p>
    Further events that may trigger Identity Verification processes:
  </p>

  <p>
    <ul>
      <li>When a customer requests a withdrawal to a different account than one that was used to make a deposit (e.g. due to the fact that certain payment service providers do not support incoming payments or other reasons). In these cases, the withdrawal requests will be immediately deducted from the customer’s account, however, will not be processed until the customer’s identity has been verified to ensure that the funds are going to the right person;</li>
      <li>When a customer makes multiple deposits within a short timeframe (five or more deposits in one hour);</li>
      <li>Staff identifies suspicious deposit patterns and or several payment cards are used (three or more different payment methods used within one week);</li>
      <li>Registration country and IP do not match – In such cases, the player account may not be blocked and the player may still make deposits and play games, however, no withdrawal will be allowed until verification has been carried out;</li>
      <li>When a deposit exceeds €5,000.</li>
    </ul>
  </p>

  <p>
    Copies will be kept of all the documents used for identification.
  </p>

  15.6.3.4. <span class="underline">Additional Documents</span>

  <p></p>

  <p>
    Additional documents may be requested from customers to substantiate their activities or to better understand their patters:
  </p>

  <p>
    <ul>
      <li>Proof of Bank Account – This may be a screenshot or copy of the bank statement stating the customer’s name and IBAN and the name of the bank (for instances when a customer requests a withdrawal to be deposited to a bank account);</li>
      <li>Proof of Payment Card – This may be a photo or copy of the front side of the card in question or a bank statement that will include both the card details and the name of the customer (for instances when suspicious deposit patters are identified) –</li>
    </ul>
  </p>

  <p>
    To protect the customer’s card data, ninewickets informs them that they may obfuscate some of the card details, however, the customer’s name, as well as the first and last four digits of the card number must be visible.
  </p>

  <p>
    Bank Statements and Payslips – These may be requested from customers displaying potentially problematic gambling patterns and when external information available on the customer does not validate the amounts being gambled. In such cases ninewickets would ask its higher volume customers for documents which would support the funds being spent on gambling.
  </p>

  15.6.3.5.<span class="underline">Mitigation of Impersonation Risk</span>

  <p></p>

  <p>
    Various additional customer identity checks are permitted on a risk-based approach. These checks may include:
  </p>

  <p>
    <ul>
      <li>Requiring the first payment to be carried out through an account in the customer’s name with an EU/EEA regulated credit institution or one from an equivalent jurisdiction;</li>
      <li>Verifying additional aspects of the customer’s identity, or of their electronic ‘footprint’;</li>
      <li>Telephone contact with the customer prior to opening the account on a home or business number which has been verified (electronically or otherwise) or a call to the customer before further transactions are permitted, using it to verify additional aspects of personal identity information that have been previously provided during the setting up of the account;</li>
    </ul>
  </p>

  15.6.3.6. <span class="underline">Keeping Information Up-to-Date</span>

  <p></p>

  <p>
    Once the identity of a customer has been confirmed, it does not have to be confirmed again. However, if there is any doubt about the information held, then that identification will be obtained again, including the identification of the customer.
  </p>

  <p>
    ninewickets may review the customer documentation and then update it as appropriate. Any changes to identification such as a change of name of the customer would require new documents to be obtained.
  </p>

  15.6.4. <span class="underline">Ongoing transaction monitoring</span>

  <p></p>

  <p>
    There are certain automated controls in place to monitor customer activities, for example:
  </p>

  <p>
    <ul>
      <li>First time deposits;</li>
      <li>Cash-out alerts for cash-outs greater than €1,000;</li>
      <li>Activity alerts when customer pays to, or stakes with the casino €2,000 during any period of 24 hours;</li>
      <li>Credit Card BIN alerts (when Credit Card country differs from player account country/IP);</li>
    </ul>
  </p>

  <p>
    In addition, all cash-out requests are processed manually by the Payments Team and are reviewed on a daily basis. Every request undergoes security checks before approval in order to determine that the origin of the funds/wins is compliant with the Gaming Control Board Curacao Policy and the terms and conditions of the Company.
  </p>

  15.7. <span class="underline">Organization of internal control</span>

  <p></p>

  <p>
    Any member of ninewickets can report suspicious activities to the MLRO, as ninewickets’s Nominated Officer. A suspicious activity is one where it is known, or suspected, there are reasonably grounds to know or suspect that a person is engaged in, or attempting, money laundering or terrorist financing.
  </p>

  15.7.1. <span class="underline">Suspicious transactions reporting</span>

  <p></p>

  <p>
    Having knowledge means knowing something to be true. Knowledge can be inferred from the surrounding circumstances; so, for example, a failure to ask obvious questions may imply knowledge. The knowledge must, however, have come to ninewickets during the course of business, or from a disclosure (to the MLRO).
  </p>

  <p>
    Suspicion is more subjective and falls short of proof based on firm evidence. Suspicion is more than speculation and is based on some foundation.
  </p>

  <p>
    An unusual transaction is not necessarily suspicious. Unusual patterns of gambling, including the spending of particularly large amounts of money in relation to the casino or customer’s profile, should receive attention, but unusual behaviour should not necessarily lead to grounds for knowledge or suspicion of money laundering, or the making of a report to the FIAU. The MLRO is required to assess all of the circumstances and, in some cases, it may be helpful to ask the customer or others more questions. The choice depends on what is already known about the customer and the transaction, and how easy it is to make enquiries.
  </p>

  <p>
    Members of staff who consider a transaction or activity to be suspicious, would not necessarily be expected to know or to establish the exact nature of any underlying criminal offence, or that the particular funds or property were those arising from a crime, money laundering or terrorist financing. “Reasonable grounds to know or suspect” introduces an objective test of suspicion. The test is likely to be met when there are facts or circumstances, known to the member of staff, from which a reasonable person (in a payments firm) would have inferred knowledge, or formed the suspicion, that another person was engaged in money laundering or terrorist financing.
  </p>

  <p>
    A defence of failing to meet the test of suspicion, would be for staff to demonstrate that they took reasonable steps to know the customer and the rationale for the transaction, activity or instruction.
  </p>

  15.7.2 <span class="underline">How to Make a Suspicious Activity Report</span>

  <p></p>

  <p>
    Any member of staff, who is suspicious that a transaction may involve money laundering or who becomes aware during the course of their work that someone else is involved in money laundering, must make a disclosure to the MLRO using the ninewickets Suspicious Transaction Report form.
  </p>

  <p>
    Once completed, the form should be printed off. The member of staff making the report must sign and date the form before giving it to the MLRO. The MLRO will take note of the date and time of report receipt.
  </p>

  <p>
    Upon receipt of the form by the MLRO, they will then decide what is to be done as a result of the report, e.g., whether the matter must be reported to Gaming Control board, Curacao. or not, or further enquiries made and record its decision and the reason for it in the customer files. The member of staff concerned must be informed of the decision and the reasons for it.
  </p>

  <p>
    If the matter is to be referred to GCB, the MLRO or a subordinate will complete the FIAU report form and discussing with the reporting member of staff how matters with the customer are to be conducted from that stage. The GCB report form must be signed off by the MLRO or the CEO.
  </p>

  <p>
    ninewickets must not proceed with a transaction whilst we await consent from the concerned from GCB it is given 7 working days (not including weekends or bank holidays) to consider the report.
  </p>

  <p>
    If we hear nothing then we may continue with the transaction but not inform the customer about the report. GCB may give consent to proceed earlier than this time limit. They may also refuse consent in which case they have a further 31 calendar days (including weekends or bank holidays) to further consider the report. After this they must either begin proceedings or allow the transaction to continue.
  </p>

  <p>
    The MLRO will submit a softcopy version of the report to the GCB. Any paper file for each matter will be kept by the MLRO.
  </p>

  <p>
    There must be no record on the customer file or on the computer system which refers in any way to suspicious activity reporting, money laundering, etc., to avoid the risk of tipping off. It is a criminal offence to inform a customer that a SAR has been submitted, or to inform them of an investigation into their affairs.
  </p>

  <p>
    All records of SARs will be kept in the central reporting file, which is kept by the MLRO.
  </p>

  15.7.3 <span class="underline">How to Identify Suspicious Activity</span>

  <p></p>

  <p>
    Transactions may give reasonable grounds to suspect that they are related to money laundering or terrorist activity financing regardless of the sum of money involved. There is no monetary threshold for making a SAR. Suspicious transactions may involve several factors that on their own seem insignificant, but together raise suspicion that the transaction is related to the commission or attempted commission of a money laundering or terrorist activity financing offence, or both. As a general guide, a transaction may be connected to money laundering or terrorist activity financing when we think that it (or a group of transactions) raises questions or gives rise to discomfort, apprehension or mistrust.
  </p>

  <p>
    ninewickets will examine, as far as reasonably possible, the background and purpose of all complex, unusual large transactions, and all unusual patterns of transactions, which have no apparent economic or lawful purpose.
  </p>

  <p>
    The context in which the transaction occurs or is attempted is a significant factor in assessing suspicion and this will vary from one customer to another.
  </p>

  <p>
    Transactions will be evaluated in terms of what seems appropriate and is within normal practices in business and based on our knowledge of the customer. The fact that transactions do not appear to be in keeping with normal industry practices may be a relevant factor.
  </p>

  <p>
    Reasonable evaluation of relevant factors, including the knowledge of the customer's business, financial history, background and behaviour is the basis of assessing suspicion. Behaviour is suspicious, not people. We have listed below some indicators to help with this assessment.
  </p>

  15.7.4 <span class="underline">Indicators of Suspicious Transactions</span>

  <p></p>

  <p>
    Certain products, services, activities or channels may pose a higher risk of misuse for money laundering. Listed below are several anti-money laundering risk indicators or “red flags” that might be grounds for suspicion. The list is not exhaustive and not conclusive but will be used as a guide for inquiry and follow-up, alongside other material.
  </p>

  <p>
    A single indicator does not necessarily indicate reasonable grounds to suspect money laundering or terrorist financing activity. However, if several indicators are present during one or a series of transactions, then we will take a closer look at other factors before deciding whether the transaction must be reported.
  </p>

  <p>
    In the case of a transaction aborted in the belief that the property is owned or controlled by or on behalf of a terrorist or a terrorist group, then there must be a terrorist property report. If there are reasonable grounds to suspect that the transaction is related to an attempted commission of a terrorist activity financing or money laundering offence, then a suspicious transaction report about the attempted transaction is also required.
  </p>

  <p>
    Becoming aware of certain indicators could trigger reasonable grounds to suspect that one or more transactions from the past (that had not previously seemed suspicious) were related to money laundering or terrorist financing.
  </p>

  15.7.4.1 <span class="underline">Application and Identification</span>

  <p></p>

  <p>
    <ul>
      <li>Information mismatch from application</li>
      <li>Application information/address/customer differs from initial registration</li>
      <li>Inability to provide government issued identification details</li>
      <li>Change of address to high-fraud area or to problematic jurisdiction, shortly after the application</li>
      <li>Lack of reliable third party and/or governmental verification of individual</li>
      <li>The address indicated (or corroborated) is identified as mail drop or other high-risk address, as opposed to a physical street address</li>
      <li>Transaction volume, deposits, and cash-outs are inconsistent</li>
    </ul>
  </p>

  15.7.4.2 <span class="underline">Account Settlement</span>

  <p></p>

  <p>
    <ul>
      <li>Large, cross-border wire transfer payments</li>
      <li>Settlements/partial settlements from unrelated third parties</li>
      <li>Excessive/ongoing large credit refunds</li>
    </ul>
  </p>

  15.7.4.3 <span class="underline">Transaction and Customer Monitoring</span>

  <p></p>

  <p>
    <ul>
      <li>Stakes wagered by a customer become unusually high or out of the ordinary and the customer is believed to be spending beyond his or her known means. This requires some knowledge of the customer but, nevertheless, there may be circumstances that appear unusual and raise the suspicion that he is using money obtained unlawfully.</li>


  <li>It may be that the customer lives in low cost accommodation with no known source of income but nonetheless is spending money well above his or her apparent means.</li>

  <li>There is no set amount which dictates when a SAR should be made and much will depend on what is known, or suspected, about the customer.</li>

  <li>A customer exhibits unusual gambling patterns with an almost guaranteed return or very little financial risk.</li>

  <li>It is accepted that some customers prefer to gamble in this way but, in some instances, the actions may raise suspicion because they are different from the customer’s normal gambling practices.</li>

  <li>Money is deposited by a customer or held over a period and withdrawn by the customer without being used for gambling.</li>

  <li>For instance, suspicions should be raised by any large amounts deposited in gaming machines or gambling accounts that are then cashed or withdrawn after very little game play or gambling.</li>

  <li>A customer regularly gambles large amounts of money and appears to find a level of losses acceptable.</li>

  <li>In this instance, the customer may be spending the proceeds of crime and sees the losses as an acceptable consequence of the process of laundering those proceeds.</li>

  <li>A customers spend increases over a period of time, thereby masking high spend and potential money laundering.</li>

  <li>A customer spends little, but often, and his annual aggregate spend is high and out of kilter with his expected spend.</li>

  <li>A customer displays gambling patterns where spend is high but the risk is low, for example gambling on red and black in roulette. The customer could be laundering money in a way that guarantees minimal loss.</li>

  <li>Instances of high spend by customers that lead to significant commercial risk for the operator may also indicate suspicious activity.</li>
    </ul>
  </p>

  <p>
  Indicators to help establish suspicion that a transaction may be related to a terrorist activity financing offence mostly resemble those relating to money laundering, although there are some differences. For example, amounts relating to terrorist financing generally may be smaller.
  </p>

  15.7.4. <span class="underline">Financial Sanctions</span>

  <p></p>

  <p>
    It is the policy of ninewickets to verify the identity of all customers, and to check that they are not the subject of sanctions or other statutory measures prohibiting the Company from providing its services. The member of staff conducting verification of identity will complete the process by checking that the customer is not the subject of sanctions or other statutory measures, using the screening methods set out by the MLRO. These include the direct questions to the prospective customer, screening of all new customers against sanctions and other databases (via direct reference to an official list or using a commercially available product), and ongoing screening of all customer names (via ongoing subscription to commercially available products and automatic uploads).
  </p>

  15.7.5. <span class="underline">Adverse Media</span>

  <p></p>

  <p>
    Along with Sanctions and PEP databases, third-party providers offer a service that screens individuals for adverse media. ninewickets uses such a service to identify if a customer has been identified by the media as having links to financial crime, terrorist financing and/or other criminal activity. These individuals, once confirmed to be one and the same in both media and among the ninewickets customers, would only be allowed to continue using ninewickets services after a close review by the MLRO and/or senior management.
  </p>

  15.8. <span class="underline">Anti-Bribery and Whistleblowing</span>

  <p></p>

  <p>
    As an extension to the AML/CFT efforts, ninewickets also employs Anti-Bribery and Whistleblowing Policies and Procedures. These are standalone documents that are available to all employees and are part of their onboarding package.
  </p>

  15.9. <span class="underline">Employee Background Checks</span>

  <p></p>

  <p>
    ninewickets is committed to establish and maintain procedures which enable it to be satisfied as to the integrity of all new staff members and by extension their likeliness to follow the ninewickets policies and procedures. To meet this requirement, the Human Resource Department is responsible for undertaking all of the checks listed in relation to new members of staff and for retaining the appropriate records:
  </p>

  <p>
    <ul>
      <li>Obtain and confirm references, if required;</li>
      <li>Confirm their employment history and the qualifications they have;</li>
      <li>Request a recent police conduct certificate; and</li>
      <li>Request details of any regulatory action taken against them.</li>
    </ul>
  </p>

  
  16. <span class="underline">Fraud</span>

  <p></p>

  <p>
    We will seek criminal and contractual sanctions against any Customer involved in fraud, dishonesty or criminal acts. We will withhold payment to any Customer where any of these are suspected.
  </p>

  <p>
    The Customer shall indemnify and shall be liable to pay to us on demand, all costs, charges or losses sustained or incurred by us (including any direct, indirect or consequential losses, loss of profit, loss of business and loss of reputation) arising directly or indirectly from the Customer’s fraud, dishonesty or criminal act.
  </p>


  17. <span class="underline">Responsible Gaming Policy</span>

  <p></p>

  <p>
    ninewickets is committed to endorsing responsible wagering among its customers as well as promoting the awareness of problem gambling and improving prevention, intervention and treatment.
  </p>

  <p>
    ninewickets’s Responsible Gambling Policy sets out its commitment to minimizing the negative effects of problem gambling and to promoting responsible gambling practices.
  </p>

  <p>
    ninewickets supports the generation of online gamblers offering them a wide range of games and entertainment. We also take responsibility for our product line-up.
  </p>

  <p>
    The aim of ninewickets is to provide the world’s safest and most innovative gaming platform for adults. The offered clear and safe products allow each user to play within his financial means and to receive the highest quality service. Integrity, fairness and reliability are the guiding principles of ninewickets’s work. It is therefore clear that ninewickets should do its best to avoid and reduce the problems, which can arise from participation in gambling, particularly in cases of immoderate playing. At the same time it is important to respect the rights of those who take part in games of chance to a reasonable extent as means of entertainment.
  </p>

  <p>
    Responsible Gaming at ninewickets is based on three fundamental principles: Security of the player, Security of the game and Protection against gaming addiction. Together with research institutes, associations and therapy institutions, we work on creation of a responsible, secure and reliable framework for online gaming.
  </p>

  <p>
    Player security
  </p>

  <p>
    We take responsibility for the security of our players. Protection of the players is based on forbidding the attendance of the minors from participation in games and the protection of privacy, which involves responsible processing of personal data and payments. Fairness and the random nature of the products offered are monitored closely by independent organizations. Marketing communication is also geared towards player protection: we promise only what players can receive in our transparent line.
  </p>

  <p>
    Protection against gaming addiction: research – prevention – intervention
  </p>

  <p>
    The majority of users who make sports bets, casino bets and other gaming offers play in moderation for entertainment. Certain habits and behavior patterns (such as shopping, playing sports, eating or consumption of alcohol) which are considered to be normal and not causing any concern can develop into addiction for some people and cause problems. In the same way, bets on sports and gambling can lead to problems for a small group of customers.
  </p>

  <p>
    Clients with gaming addiction are prohibited from further participation in the gaming line-up. Subsequently the customers are provided with contacts of organizations where they can receive professional advice and support.
  </p>

  <p>
    Self-responsibility is the most sustainable form of prevention
  </p>

  <p>
    The basic principle promoted by ninewickets is that the final decision and responsibility on whether to play or not, and how much money can be spent on the game should be assumed by the customer himself.
  </p>

  <p>
    Self-responsibility of the customer is therefore the most effective form of protection from addiction. ninewickets sees its responsibility in assisting the customers by providing transparent products, full information and keeping a clear line of conduct.
  </p>

  <p>
    Protection of minors
  </p>

  <p>
    ninewickets does not allow minors (persons under the age of 18) to participate in games and make bets. That’s why the confirmation of having reached the age of majority and the confirmation of date of birth are mandatory requirements during registration. ninewickets considers the issue of minors taking part in games and betting very seriously. In order to offer the best possible protection of minors, we also rely on the support of parents and caregivers. Please keep your data for account access in a safe place (user ID and password).
  </p>

  <p>
    Furthermore, we would recommend that you install filter software. This software will allow you to restrict the access to Internet resources inappropriate for children and teenagers.
  </p>

  <p>
    Responsibility towards problems
  </p>

  <p>
    ninewickets offers a variety of games and bets, which are forms of entertainment for the majority of customers. At the same time the company takes responsibility for its customers by providing support and tools for maintenance of a secure and entertaining environment taking into account the associated risks.
  </p>

  <p>
    The clients who have difficulty in assessing risks, recognizing their own limits or those who suffer from gambling addiction are not able to enjoy our product line-up responsibly and perceive it as a form of entertainment. ninewickets takes responsibility for such users by blocking their access to its products for their own protection.
  </p>

  <p>
    Get informed with the main issues
  </p>

  <p>
    Most people play for pleasure. Moderate participation in games within their financial capacity is fully acceptable. However, for a small percentage of people gambling is not a form of entertainment, it is a challenge that must be considered seriously.
  </p>

  <p>
    What is the problematic game behavior?
  </p>

  <p>
    A problematic game behavior is considered to be such behavior, which interferes mode of life, work, financial position or health of a person or his family. Long participation in games is counter indicative to such person as it can lead to negative consequences.
  </p>

  <p>
    In 1980 the pathological game dependence has been officially recognized and enlisted in the list of psychological diseases of international classification system DSM-IV and ICD-10. It is defined as long, repeating and frequently amplifying inclination for game, despite of existing negative personal and social circumstances, such as a debt, rupture of family relations and delay of professional growth.
  </p>

  <p>
    In what cases behavior of a person should be considered as dependence?
  </p>

  <p>
    It is necessary to underline that the diagnoses of game dependence can be qualified only by experts. The material presented on this web-page will help you to estimate and define your own game behaviour.
  </p>

  <p>
    The special hazard of addictions that are not associated with any substance is that it is very difficult to define the line between pleasure and addiction. Nevertheless, there are some diagnostic signals that may point out the existing problems. In the presence of at least five of the following symptoms, the likelihood of the severe dependence is high:
  </p>

  <p>
    1. The player is deeply involved in gambling, all his thoughts are only about the game.
  </p>

  <p>
    2. Bet sum increases in course of time.
  </p>

  <p>
    3. Attempts to quit or control his participation in the games appear to be unsuccessful.
  </p>

  <p>
    4. When limiting his participation in gambling, a person experiences irritation and disappointment.
  </p>

  <p>
    5. The game is a way to escape from problems or discomfort.
  </p>

  <p>
    6. The player tries to win back the lost amount,
  </p>

  <p>
    7. Lies about his playing behavior,
  </p>

  <p>
    8. Commits illegal acts,
  </p>

  <p>
    9. Spoils or breaks the relationship with family and colleagues,
  </p>

  <p>
    10. Borrows to participate in the games.
  </p>

  <p>
    Rules for responsible games
  </p>

  <p>
    Following the rules placed below, you can enjoy the game without anxiety:
  </p>

  <p>
    1. Start playing only when you are calm and concentrated.
  </p>

  <p>
    2. Take regular breaks.
  </p>

  <p>
    3. Define for yourself beforehand the monthly amount you can spend on the game.
  </p>

  <p>
    4. Once setting a maximum limit, do not further increase it.
  </p>

  <p>
    5. Before you start playing, define the maximum amount of winning, after reaching of which you should stop playing.
  </p>

  <p>
    6. Define the amount you can afford to lose beforehand.
  </p>

  <p>
    7. Do not start playing under alcohol or drug influence.
  </p>

  <p>
    8. Do not start playing in a depressed state.
  </p>

  18. <span class="underline">Intellectual Property</span>

  <p></p>

  <p>
    We trade as ninewickets and the ninewickets name and logo are registered trademarks. Any unauthorised use of our trademark and logo may result in legal action being taken against you.
  </p>

  <p>
    The www.ninewicket.live uniform resource locator (URL) is owned by us and no unauthorised use of the URL is permitted on another website or digital platform without our prior written consent.
  </p>

  <p>
    As between us and you, we are the sole owners of the rights in and to the Service, our technology, software and business systems (the “Systems”) as well as our odds.
  </p>

  <p>
    i. you must not use your personal profile for your own commercial gain (such as selling your status update to an advertiser); and
  </p>

  <p>
    ii. when selecting a nickname for your Account we reserve the right to remove or reclaim it if we believe it appropriate.
  </p>

  <p>
    You may not use our URL, trademarks, trade names and/or trade dress, logos (the “Marks”) and/or our odds in connection with any product or service that is not ours, that in any manner is likely to cause confusion among Customers or in the public or that in any manner disparages us.
  </p>

  <p>
    Except as expressly provided in these Terms, we and our licensors do not grant you any express or implied rights, licence, title or interest in or to the Systems or the Marks and all such rights, licence, title and interest specifically retained by us and our licensors. You agree not to use any automatic or manual device to monitor or copy web pages or content within the Service. Any unauthorised use or reproduction may result in legal action being taken against you.
  </p>


  19. <span class="underline">Your Licence</span>

  <p></p>

  <p>
    Subject to these terms and your compliance with them, we grant to you a non-exclusive, limited, non transferable and non sub-licensable licence to access and use the Service for your personal non-commercial purposes only. Our licence to you terminates if our agreement with you under these Terms ends.
  </p>

  <p>
    Save in respect of your own content, you may not under any circumstances modify, publish, transmit, transfer, sell, reproduce, upload, post, distribute, perform, display, create derivative works from, or in any other manner exploit, the service and/or any of the content thereon or the software contained therein, except as we expressly permit in these terms or otherwise on the website. No information or content on the service or made available to you in connection with the Service may be modified or altered, merged with other data or published in any form including for example screen or database scraping and any other activity intended to collect, store, reorganise or manipulate such information or content.
  </p>

  <p>
    Any non-compliance by you with this Clause may also be a violation of our or third parties’ intellectual property and other proprietary rights which may subject you to civil liability and/or criminal prosecution.
  </p>


  20. <span class="underline">Your Conduct and Safety</span>

  <p></p>

  <p>
    We would like you to enjoy the Service. However, for your protection and that of all Customers, the posting of any content on the service, as well as conduct in connection therewith and/or the service, which is in any way unlawful, inappropriate or undesirable is strictly prohibited - it is Prohibited Behaviour. If you engage in Prohibited Behaviour, or we determine in our sole discretion that you are engaging in Prohibited Behaviour, your ninewicket.live Account and/or your access to or use of the Service may be terminated immediately without notice to you.
  </p>

  <p>
    Legal action may be taken against you by another Customer, other third party, enforcement authorities and/or us with respect to you having engaged in Prohibited Behaviour.
  </p>

  <p>
    Prohibited Behaviour includes, but is not limited to, accessing or using the Service to:
  </p>

  <p>
    <ul>
      <li>i. promote or share information that you know is false, misleading or unlawful;</li>
      <li>ii. conduct any unlawful or illegal activity, such as, but not limited to, any activity that furthers or promotes any criminal activity or enterprise, provides instructional information about making or buying weapons, violates another Customer’s or any other third party’s privacy or other rights or that creates or spreads computer viruses;</li>
      <li>iii. harm minors in any way;</li>
      <li>iv. transmit or make available any content that is unlawful, harmful, threatening, abusive, tortuous, defamatory, vulgar, obscene, lewd, violent, hateful, or racially or ethnically or otherwise objectionable;</li>
      <li>v. transmit or make available any content that the user does not have a right to make available under any law or contractual or fiduciary relationship, including without limitation, any content that infringes a third party’s copyright, trademark or other intellectual property and proprietary rights;</li>
      <li>vi. transmit or make available any content or material that contains any software virus or other computer or programming code (including HTML) designed to interrupt, destroy or alter the functionality of the Service, its presentation or any other website, computer software or hardware;</li>
      <li>vii. interfere with, disrupt or reverse engineer the Service in any manner, including, without limitation, intercepting, emulating or redirecting the communication protocols used by us, creating or using cheats, mods or hacks or any other software designed to modify the Service, or using any software that intercepts or collects information from or through the Service;</li>
      <li>viii. retrieve or index any information from the Service using any robot, spider or other automated mechanism;</li>
      <li>ix. participate in any activity or action that, in the sole and entire unfettered discretion of us results or may result in another Customer being defrauded or scammed;</li>
      <li>x. transmit or make available any unsolicited or unauthorised advertising or mass mailing such as, but not limited to, junk mail, instant messaging, "spim", "spam", chain letters, pyramid schemes or other forms of solicitations;</li>
      <li>xi. create ninewicket.live Accounts by automated means or under false or fraudulent pretences;</li>
      <li>xii. impersonate another Customer or any other third party, or</li>
      <li>xiii. any other act or thing done that we reasonably consider to be contrary to our business principles.</li>
    </ul>
  </p>

  <p>
    The above list of Prohibited Behaviour is not exhaustive and may be modified by us at any time or from time to time. If you become aware of the misuse of the service by another Customer or any other person, please contact us through the “Contact Us” section of the Website. We reserve the right to investigate and to take all such actions as we in our sole discretion deems appropriate or necessary under the circumstances, including without limitation, deleting the Customer’s posting(s) from the Service and/or terminating their account, and take any action against any Customer or third party who directly or indirectly in, or knowingly permits any third party to directly or indirectly engage in, Prohibited Behaviour, with or without notice to such Customer or third party.
  </p>


  21. <span class="underline">Links to Other Websites</span>

  <p></p>

  <p>
    The Service may contain links to third party websites that are not maintained by, or related to, us, and over which we have no control. Links to such websites are provided solely as a convenience to Customers, and are in no way investigated, monitored or checked for accuracy or completeness by us. Links to such websites do not imply any endorsement by us of, and/or any affiliation with, the linked websites or their content or their owner(s). We have no control over or responsibility for the availability nor their accuracy, completeness, accessibility and usefulness. Accordingly when accessing such websites we recommend that you should take the usual precautions when visiting a new website including reviewing their privacy policy and terms of use.
  </p>


  22. <span class="underline">Self-exclusion</span>

  <p></p>

  <p>
    If you feel you are at risk of developing a gambling problem or believe you currently have a gambling problem, please consider using Self-Exclusion which prevents you gambling with ninewickets for a specified period of 6 months, 1 year, 2 years, 5 years or permanently.
  </p>

  <p>
    If you want to stop playing for other reasons, please consider a Time-Out or using Account Closure.
  </p>

  <p>
    What happens when you self-exclude?
  </p>

  <p>
    During a period of Self-Exclusion you will not be able to use your account for betting, although you will still be able to login and withdraw any remaining balance. It will not be possible to re-open your account for any reason, and ninewickets will do all it can to detect and close any new accounts you may open.
  </p>

  <p>
    Next steps
  </p>

  <p>
    Whilst we will remove you from our marketing databases, we also suggest that you remove bet365 from your notifications and delete/uninstall all ninewickets apps, downloads and social media links. You may also wish to consider installing software that blocks access to gambling websites, click here for more information.
  </p>

  <p>
    We recommend that you seek support from a problem gambling support service to help you deal with your problem.
  </p>

  <p>
    You can self-exclude your account in the My Gambling Controls section of Members by choosing Self-Exclusion.
  </p>

  <p>
    Alternatively you can contact our customer care team for assistance and further information.
  </p>

  <p>
    Self-Exclusion Notice
  </p>

  <p>
    Should you opt to self-exclude from ninewickets, we strongly recommend that you seek exclusion from all other gambling operators you have an account with.
  </p>

  <p>
    You can self-exclude by contacting other gambling operators directly or you can exclude from other Northern Territory licensed operators by completing a Self-Exclusion Notice form.
  </p>

  <p>
    Once completed the Northern Territory Self-Exclusion Notice form should be submitted to the nominated site, sports bookmaker or betting exchange operator.
  </p>


  23. <span class="underline">Complaints</span>

  <p></p>

  <p>
    If you have any concerns or questions regarding these terms you should contact our Customer Service Department via email at support@ninewicket.live
  </p>

  <p>
    NOTWITHSTANDING THE FOREGOING, WE TAKE NO LIABILITY WHATSOEVER TO YOU OR TO ANY THIRD PARTY WHEN RESPONDING TO ANY COMPLAINT THAT WE RECEIVED OR TOOK ACTION IN CONNECTION THEREWITH.
  </p>

  <p>
    Any Customer of the Service who has any concerns or questions regarding these Terms regarding the settlement of any ninewicket.live market should contact our Customer Service Department at support@ninewicket.live using their Registered Email Address.
  </p>

  <p>
    If a Customer is not satisfied with how a bet has been settled then the Customer should provide details of their grievance to our Customer Service Department via email at support@ninewicket.live. We shall use our reasonable endeavours to respond to queries of this nature within a few days (and in any event we intend to respond to all such queries within 28 days of receipt).
  </p>

  <p>
    Disputes must be lodged within three (3) days from the date the wager in question has been decided. No claims will be honored after this period. The Customer is solely responsible for their Account transactions. Complaints/disputes have to be sent to support@ninewicket.live and must be sent from the Customer’s Registered Email Address.
  </p>

  <p>
    In the event of a dispute arising between you and us our Customer Service Department will attempt to reach an agreed solution. Should our Customer Service Department be unable to reach an agreed solution with you, the matter will be escalated to our management in accordance with our Complaints Procedure (available upon request).
  </p>

  <p>
    The Customer has the right to lodge a complaint with one of our licensing bodies should all efforts to resolve a dispute to the Customer’s satisfaction have failed.
  </p>


  24. <span class="underline">Registration and Account Security</span>

  <p></p>

  <p>
    Customers of the service must provide their real names and information and, in order to comply with this, all Customers must commit to the following rules when registering & maintaining your Account:
  </p>

  <p>
    <ul>
      <li>i. you must not provide any false personal information on the Service, or create an Account for anyone other than yourself;</li>
      <li>ii. you must not use your personal profile for your own commercial gain (such as selling your status update to an advertiser); and</li>
      <li>iii. when selecting a nickname for your Account we reserve the right to remove or reclaim it if we believe appropriate.</li>
    </ul>
  </p>

  25. <span class="underline">Assignment</span>

  <p></p>

  <p>
    Neither these terms nor any of the rights or obligations hereunder may be assigned by you without the prior written consent of us, which consent will not be unreasonably withheld. We may, without your consent, assign all or any portion of our rights and obligations hereunder to any third party provided such third party is able to provide a service of substantially similar quality to the Service by posting written notice to this effect on the Service.
  </p>

  26. <span class="underline">Severability</span>

  <p></p>

  <p>
    In the event that any provision of these terms is deemed by any competent authority to be unenforceable or invalid, the relevant provision shall be modified to allow it to be enforced in line with the intention of the original text to the fullest extent permitted by applicable law. The validity and enforceability of the remaining provisions of these terms shall not be affected.
  </p>

  27. <span class="underline">Breach of These Terms</span>

  <p></p>

  <p>
    Without limiting our other remedies, we may suspend or terminate your account and refuse to continue to provide you with the service, in either case without giving you prior notice, if, in our reasonable opinion, you breach any material term of these Terms. Notice of any such action taken will, however, be promptly provided to you.
  </p>

  28. <span class="underline">Governing Law and Jurisdiction</span>

  <p></p>

  <p>
    This Agreement shall in all respects be governed, interpreted by, and construed in accordance with the laws of Curacao. All disputes, differences, complaints etc., shall be subject to Arbitration under the Curacao. The arbitrator will be appointed by the company after due consent from the company and the user. The place of arbitration shall be Curacao.
  </p>

  29. <span class="underline">General Provisions</span>

  <p></p>

  <p>
    <span class="underline">Term of agreement</span>. These terms shall remain in full force and effect while you access or use the service or are a Customer of ninewicket.live. These terms will survive the termination of your ninewicket.live Account for any reason.
  </p>

  <p>
    <span class="underline">Gender</span>. Words importing the singular number shall include the plural and vice versa, words importing the masculine gender shall include the feminine and neuter genders and vice versa and words importing persons shall include individuals, partnerships, associations, trusts, unincorporated organisations and corporations.
  </p>

  <p>
    <span class="underline">Waiver</span>. No waiver by us, whether by conduct or otherwise, of a breach or threatened breach by you of any term or condition of these Terms shall be effective against, or binding upon, us unless made in writing and duly signed by us, and, unless otherwise provided in the written waiver, shall be limited to the specific breach waived. The failure of us to enforce at any time any term or condition of these Terms shall not be construed to be a waiver of such provision or of the right of us to enforce such provision at any other time.
  </p>

  <p>
    <span class="underline">Headings</span>. The division of these Terms into paragraphs and sub-paragraphs and the insertion of headings are for convenience of reference only, and shall not affect or be utilised in the construction or interpretation of these Terms agreement. The terms "these Terms", "hereof", “hereunder” and similar expressions refer to these Terms and not to any particular paragraph or sub-paragraph or other portion hereof and include any agreement supplemental hereto. Unless the subject matter or context is inconsistent therewith, references herein to paragraphs and sub-paragraphs are to paragraphs and sub-paragraphs of these Terms.
  </p>

  <p>
    <span class="underline">Acknowledgement</span>. By hereafter accessing or using the Service, you acknowledge having read, understood and agreed to each and every paragraph of these Terms. As a result, you hereby irrevocably waive any future argument, claim, demand or proceeding to the contrary of anything contained in these Terms.
  </p>

  <p>
    <span class="underline">Language</span>. In the event of there being a discrepancy between the English language version of these rules and any other language version, the English language version will be deemed to be correct.
  </p>

  <p>
    <span class="underline">Entire agreement</span>. These Terms constitute the entire agreement between you and us with respect to your access to and use of the Service, and supersedes all other prior agreements and communications, whether oral or written with respect to the subject matter hereof.
  </p>

  <p>
    <span class="underline">Betting Rules</span>
  </p>

  <p>
    Any dispute related to the sports betting product shall be emailed to: support@ninewicket.live
  </p>

  <p>
    <span class="underline">Casino Rules</span>
  </p>

  <p>
    Any dispute related to the casino product shall be emailed to: support@ninewicket.live
  </p>

  <p>
    Complete casino rules can be accessed from within the casino games.
  </p>

  <p>
    <span class="underline">ACCEPTING THE TERMS AND CONDITIONS</span>
  </p>

  <p>
    You hereby accept the fact that you have read, understood and are willing to abide by the above Terms and Conditions.
  </p>

`;
