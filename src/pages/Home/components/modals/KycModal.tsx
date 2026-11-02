import React from 'react';

const KycModal = () => {
  const handleOpen = () => {
    const win = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

    if (!win) return;

    const content = `
      <div class="site-name">ninewicket.live</div>

      <h2>KNOW YOUR CUSTOMER POLICY</h2>

      <p>
        To maintain the highest level of security, we require all our members to provide us with
        certain documentation in order to validate their accounts.
      </p>

      <p>
        Please note that the identification procedures shall be done before a cardholder starts
        operating and using services of our merchants.
      </p>

      <h2>Why do I need to provide documentation?</h2>

      <p>There are several reasons:</p>

      <p>
        We are committed to providing a socially responsible platform for online gaming. All of our
        members must be 18 or older and we are bound by our licensing agreement to verify this.
      </p>

      <p>
        Secondly, as a respected online and global company it is in our interests to guarantee
        maximum security on all transactions.
      </p>

      <p>
        Thirdly, our payment processors require that our policies are in line with international
        banking standards. A proven business relationship with each and every member is mandatory
        for the protection of all parties. Our licensing agreement also obliges us to comply with this.
      </p>

      <p>
        Finally, by ensuring that your account details are absolutely correct, the inconvenience of
        "missing payments" can be avoided. It can take weeks (and sometimes months) to trace,
        recall and resend using the correct information. This lengthy process also results in
        additional fees from our processors.
      </p>

      <h2>What documents do I need to provide?</h2>

      <h3>PROOF OF ID:</h3>

      <p>
        A color copy of a valid government issued form of ID
        (Driver's License, Passport, State ID or Military ID)
      </p>

      <h3>PROOF OF ADDRESS:</h3>

      <p>A copy of a recent utility bill showing your address.</p>

      <p>
        Note: If your government ID shows your address, you do not need to provide further proof
        of address.
      </p>

      <p>
        Additional documentation might be required depending on the withdrawal method you choose.
      </p>

      <h2>When do I need to provide these documents?</h2>

      <p>
        We greatly appreciate your cooperation in providing these at your earliest possible
        convenience to avoid any delays in processing your transactions. We must be in receipt of
        the documents before any cash transactions can be sent back to you. Under special
        circumstances we may require the documents before further activity (deposits and wagering)
        can take place on your account.
      </p>

      <p>
        Please understand, if we do not have the required documents on file, your pending
        withdrawals will be cancelled and credited back to your account. You will be notified when
        this happens via the notification system.
      </p>

      <h2>How can I send you these documents?</h2>

      <p>
        Please scan your documents, or take a high quality digital camera picture, save the images
        as JPG files, then upload the files using our secure form.
      </p>

      <h2>How do I know my documents are safe with you?</h2>

      <p>
        The security of your documentation is of paramount importance. All files are protected with
        the highest level of encryption at every step of the review process. All documentation
        received is treated with the utmost respect and confidentiality.
      </p>

      <p>
        We'd like to thank you for your cooperation in helping us make ninewicket.live a safer place
        to play. As always, if you have any questions about this policy, or anything else, don't
        hesitate to contact us using the contact us links on this page.
      </p>
    `;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>KYC</title>

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
              background: #f7f7f7;
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
              border-bottom: 1px solid #d8d8d8;
              padding: 18px 24px;
              position: sticky;
              top: 0;
              z-index: 100;
            }

            .title {
              margin: 0;
              font-size: 22px;
              font-weight: 700;
              border-left: 5px solid #f5b301;
              padding-left: 12px;
            }

            .content {
              flex: 1;
              overflow-y: auto;
              padding: 24px;
              line-height: 1.8;
            }

            .site-name {
              text-align: center;
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 30px;
            }

            h2 {
              font-size: 18px;
              font-weight: 700;
              margin: 24px 0 12px;
            }

            h3 {
              font-size: 16px;
              font-weight: 700;
              margin: 18px 0 8px;
              text-transform: uppercase;
            }

            p {
              margin: 0 0 14px;
              font-size: 15px;
            }
          </style>
        </head>

        <body>
          <div class="wrapper">
            <div class="header">
              <h1 class="title">KYC</h1>
            </div>

            <div class="content">
              ${content}
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
      KYC
    </button>
  );
};

export default KycModal;
