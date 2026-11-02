import React from 'react';

const ResponsibleGamingModal = () => {
  const handleOpen = () => {
    const win = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

    if (!win) return;

    const content = `
      <p>ninewickets is committed to endorsing responsible wagering among its customers as well as promoting the awareness of problem gambling and improving prevention, intervention and treatment.</p>

      <p>ninewickets’s Responsible Gambling Policy sets out its commitment to minimizing the negative effects of problem gambling and to promoting responsible gambling practices.</p>

      <p>ninewickets supports the generation of online gamblers offering them a wide range of games and entertainment. We also take responsibility for our product line-up.</p>

      <p>The aim of ninewickets is to provide the world’s safest and most innovative gaming platform for adults. The offered clear and safe products allow each user to play within his financial means and to receive the highest quality service. Integrity, fairness and reliability are the guiding principles of ninewickets’s work. It is therefore clear that ninewickets should do its best to avoid and reduce the problems, which can arise from participation in gambling, particularly in cases of immoderate playing. At the same time it is important to respect the rights of those who take part in games of chance to a reasonable extent as means of entertainment.</p>

      <p>Responsible Gaming at ninewickets is based on three fundamental principles: Security of the player, Security of the game and Protection against gaming addiction. Together with research institutes, associations and therapy institutions, we work on creation of a responsible, secure and reliable framework for online gaming.</p>

      <h3>Player security</h3>

      <p>We take responsibility for the security of our players. Protection of the players is based on forbidding the attendance of the minors from participation in games and the protection of privacy, which involves responsible processing of personal data and payments. Fairness and the random nature of the products offered are monitored closely by independent organizations. Marketing communication is also geared towards player protection: we promise only what players can receive in our transparent line.</p>

      <h3>Protection against gaming addiction: research – prevention – intervention</h3>

      <p>The majority of users who make sports bets, casino bets and other gaming offers play in moderation for entertainment. Certain habits and behavior patterns (such as shopping, playing sports, eating or consumption of alcohol) which are considered to be normal and not causing any concern can develop into addiction for some people and cause problems. In the same way, bets on sports and gambling can lead to problems for a small group of customers.</p>

      <p>Clients with gaming addiction are prohibited from further participation in the gaming line-up. Subsequently the customers are provided with contacts of organizations where they can receive professional advice and support.</p>

      <h3>Self-responsibility is the most sustainable form of prevention</h3>

      <p>The basic principle promoted by ninewickets is that the final decision and responsibility on whether to play or not, and how much money can be spent on the game should be assumed by the customer himself.</p>

      <p>Self-responsibility of the customer is therefore the most effective form of protection from addiction. ninewickets sees its responsibility in assisting the customers by providing transparent products, full information and keeping a clear line of conduct.</p>

      <h3>Protection of minors</h3>

      <p>ninewickets does not allow minors (persons under the age of 18) to participate in games and make bets. That’s why the confirmation of having reached the age of majority and the confirmation of date of birth are mandatory requirements during registration. ninewickets considers the issue of minors taking part in games and betting very seriously. In order to offer the best possible protection of minors, we also rely on the support of parents and caregivers. Please keep your data for account access in a safe place (user ID and password).</p>

      <p>Furthermore, we would recommend that you install filter software. This software will allow you to restrict the access to Internet resources inappropriate for children and teenagers. These include:</p>

      <p>www.netnanny.com</p>

      <p>www.cybersitter.com</p>

      <h3>Responsibility towards problems</h3>

      <p>ninewickets offers a variety of games and bets, which are forms of entertainment for the majority of customers. At the same time the company takes responsibility for its customers by providing support and tools for maintenance of a secure and entertaining environment taking into account the associated risks.</p>

      <p>The clients who have difficulty in assessing risks, recognizing their own limits or those who suffer from gambling addiction are not able to enjoy our product line-up responsibly and perceive it as a form of entertainment. ninewickets takes responsibility for such users by blocking their access to its products for their own protection.</p>

      <h3>Get informed with the main issues!</h3>

      <p>Most people play for pleasure. Moderate participation in games within their financial capacity is fully acceptable. However, for a small percentage of people gambling is not a form of entertainment, it is a challenge that must be considered seriously.</p>

      <h3>What is the problematic game behavior?</h3>

      <p>A problematic game behavior is considered to be such behavior, which interferes mode of life, work, financial position or health of a person or his family. Long participation in games is counter indicative to such person as it can lead to negative consequences.</p>

      <p>In 1980 the pathological game dependence has been officially recognized and enlisted in the list of psychological diseases of international classification system DSM-IV and ICD-10. It is defined as long, repeating and frequently amplifying inclination for game, despite of existing negative personal and social circumstances, such as a debt, rupture of family relations and delay of professional growth.</p>

      <h3>In what cases behavior of a person should be considered as dependence?</h3>

      <p>It is necessary to underline that the diagnoses of game dependence can be qualified only by experts. The material presented on this web-page will help you to estimate and define your own game behaviour.</p>

      <p>The special hazard of addictions that are not associated with any substance is that it is very difficult to define the line between pleasure and addiction. Nevertheless, there are some diagnostic signals that may point out the existing problems. In the presence of at least five of the following symptoms, the likelihood of the severe dependence is high:</p>

      <ol>
        <li>The player is deeply involved in gambling, all his thoughts are only about the game.</li>
        <li>Bet sum increases in course of time.</li>
        <li>Attempts to quit or control his participation in the games appear to be unsuccessful.</li>
        <li>When limiting his participation in gambling, a person experiences irritation and disappointment.</li>
        <li>The game is a way to escape from problems or discomfort.</li>
        <li>The player tries to win back the lost amount,</li>
        <li>Lies about his playing behavior,</li>
        <li>Commits illegal acts,</li>
        <li>Spoils or breaks the relationship with family and colleagues,</li>
        <li>Borrows to participate in the games.</li>
      </ol>

      <h3>Rules for responsible games</h3>

      <p>Following the rules placed below, you can enjoy the game without anxiety:</p>

      <ol>
        <li>Start playing only when you are calm and concentrated.</li>
        <li>Take regular breaks.</li>
        <li>Define for yourself beforehand the monthly amount you can spend on the game.</li>
        <li>Once setting a maximum limit, do not further increase it.</li>
        <li>Before you start playing, define the maximum amount of winning, after reaching of which you should stop playing.</li>
        <li>Define the amount you can afford to lose beforehand.</li>
        <li>Do not start playing under alcohol or drug influence.</li>
        <li>Do not start playing in a depressed state.</li>
      </ol>

      <h3>Exclusion from games</h3>

      <p>Should the player feel they have a problem or wish to take an enforced break they can do so by using the following online tool to prevent access to gambling sites:www.gamblock.com</p>

      <p>At any time should the player feel that they have a problem they can contact us to have their account permanently closed.</p>

      <p>In addition to this, should we feel that at any time the player has a problem then we reserve the right to suspend the account until the player has proven their level of activity is not a problem or permanently close the account.</p>

      <h3>Seeking help</h3>

      <p>Organizations are available to support players with gaming addictions and other disorders related to games and we recommend any player with an issue contacts a self-help organization for additional assistance. The following website can offer help and guidance to those in need: www.gamblingtherapy.org</p>
    `;

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Responsible Gaming</title>

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
              font-weight: 700;
              margin: 0 0 16px;
            }

            h3 {
              font-size: 16px;
              font-weight: 700;
              margin: 24px 0 10px;
              color: #0f2740;
            }

            p,
            li {
              font-size: 15px;
            }

            ol {
              padding-left: 24px;
            }
          </style>
        </head>

        <body>
          <div class="wrapper">
            <div class="header">
              <h1 class="title">Responsible Gaming</h1>
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
      Responsible Gaming
    </button>
  );
};

export default ResponsibleGamingModal;
