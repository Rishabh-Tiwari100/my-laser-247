import React from 'react';
import { ChevronLeft } from 'lucide-react';
import BackButton from '@/components/common/BackButton';

function TermsPolicy() {
  return (
    <div className="p-4 flex flex-col">
      <BackButton />

      {/* Main Layout */}
      <div className="flex gap-4 mt-4">
        {/* Terms Box */}
        <div className="p-2 flex-1 bg-white rounded-md border border-gray-200 shadow-sm">
          <div className="bg-primary text-white text-xs font-semibold px-3 py-2 rounded-md border border-black">
            TERM & POLICY
          </div>

          {/* Scrollable Content */}
          <div className="pt-3 text-sm overflow-y-auto space-y-4 leading-relaxed">
            <div className="text-xs font-medium text-white bg-black rounded-md p-2 px-4 ">
              NOTE:
              <p className="my-2">
                1. Players using VPN and login from different IP frequently may result to void bets.
              </p>
              <p>
                2. And do the bets of different IP from multiple city we can suspend the account and
                void bets.
              </p>
            </div>

            <div className="space-y-6 text-[13px] leading-relaxed">
              <div>
                <h2 className="font-bold text-[15px] uppercase">1. Introduction</h2>
                <p>
                  The following terms and conditions apply to your use of this website (the
                  “website”) and its related or connected services (collectively, the “service”).
                  You should carefully review these terms as they contain important information
                  concerning your rights and obligations relating to your use of the website,
                  whether as a guest or registered user with an account (“an account”). By accessing
                  this website and using the service you agree to be bound by these terms together
                  with any amendments which may be published from time to time by us. If you do not
                  accept these terms, you must not access this website or use any part of it.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-[15px] uppercase">2. General Terms</h2>
                <p>
                  We reserve the right to revise and amend these terms of service at any time. You
                  should visit this page periodically to review the terms and conditions. Any such
                  changes will be binding and effective immediately upon publication on this
                  website, unless you object to any such changes, in which case you must stop using
                  our services. Your continued use of our website following such publication will
                  indicate your agreement to be bound by the terms as amended. Any bets not settled
                  prior to such changes taking effect will be subject to the pre-existing terms.
                </p>
              </div>

              <div>
                <h2 className="font-bold text-[15px] uppercase">3. Your Obligations</h2>
                <div className="space-y-1">
                  <p>
                    3.1. You Acknowledge That At All Times When Accessing The Website And Using The
                    Service:
                  </p>
                  <p>
                    3.2. You must be 18 years or older, or at least the legal age of majority in the
                    jurisdiction where you live, to participate in any of our games. We reserve the
                    right to ask for proof of age documents at any time.
                  </p>
                  <p>
                    3.3. You Are Of Legal Capacity And Can Enter Into A Binding Legal Agreement With
                    Us. You Must Not Access The Website Or Utilize The Service If You Are Not Of
                    Legal Capacity.
                  </p>
                  <p>
                    3.3. You Are A Resident In A Jurisdiction That Allows Gambling. You Are Not A
                    Resident Of Any Country In Which Access To Online Gambling To Its Residents Or
                    To Any Person Within Such Country Is Prohibited. It Is Your Sole Responsibility
                    To Ensure That Your Use Of The Service Is Legal.
                  </p>
                  <p>
                    3.4. You May Not Use A VPN, Proxy Or Similar Services Or Devices That Mask Or
                    Manipulate The Identification Of Your Real Location.
                  </p>
                  <p>3.5. You Are The Authorized User Of The Payment Method You Use.</p>
                  <p>
                    3.6. You Must Make All Payments To Us In Good Faith And Not Attempt To Reverse A
                    Payment Made Or Take Any Action Which Will Cause Such Payment To Be Reversed By
                    A Third Party.
                  </p>
                  <p>
                    3.7. When Placing Bets You May Lose Some Or All Of Your Money Deposited To The
                    Service In Accordance With These Terms And You Will Be Fully Responsible For
                    That Loss.
                  </p>
                  <p>
                    3.8. When Placing Bets You Must Not Use Any Information Obtained In Breach Of
                    Any Legislation In Force In The Country In Which You Were When The Bet Was
                    Placed.
                  </p>
                  <p>
                    3.9. You Are Not Acting On Behalf Of Another Party Or For Any Commercial
                    Purposes, But Solely On Your Own Behalf As A Private Individual In A Personal
                    Capacity.
                  </p>
                  <p>
                    3.10. You Must Not Either Attempt To Manipulate Any Market Or Element Within The
                    Service In Bad Faith Nor In A Manner That Adversely Affects The Integrity Of The
                    Service Or Us.
                  </p>
                  <p>
                    3.11. You Must Generally Act In Good Faith In Relation To Us Of The Service At
                    All Times And For All Bets Made Using The Service.
                  </p>
                  <p>
                    3.12. You, Or If Applicable, Your Employees, Employers, Agents, Or Family
                    Members, Are Not Registered As An Affiliate In Our Affiliate Program.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-bold text-[15px] uppercase">4. Restricted Use</h2>

                <div className="space-y-1">
                  <p>4.1. You Must Not Use The Service:</p>
                  <p>
                    4.1.1 If You Are Under The Age Of 18 Years (Or Below The Age Of Majority As
                    Stipulated In The Laws Of The Jurisdiction Applicable To You) Or If You Are Not
                    Legally Able To Enter Into A Binding Legal Agreement With Us Or You Acting As An
                    Agent For, Or Otherwise On Behalf, Of A Person Under 18 Years (Or Below The Age
                    Of Majority As Stipulated In The Laws Of The Jurisdiction Applicable To You);
                  </p>

                  <p>
                    4.1.2 If You Reside In A Country In Which Access To Online Gambling Is To Its
                    Residents Or To Any Person Within Such Country Is Prohibited.
                  </p>

                  <p>
                    4.1.3 If You Are A Resident Of One Of The Following Countries, Or Accessing The
                    Website From One Of The Following Countries:
                  </p>
                  <ul className="list-disc ml-6">
                    <li>United States Of America And Its Territories,</li>
                    <li>France And Its Territories,</li>
                    <li>
                      Netherlands And Its Territories And Countries That Form The Kingdom Of
                      Netherlands, Including Bonaire, Sint Eustatius, Saba, Aruba, Curaçao And Sint
                      Maarten,
                    </li>
                    <li>Australia And Its Territories,</li>
                    <li>United Kingdom Of Great Britain And Northern Ireland,</li>
                    <li>Cyprus, Spain</li>
                  </ul>

                  <p>
                    4.1.4. To Collect Nicknames, E-Mail Addresses And/Or Other Information Of Other
                    Customers By Any Means (For Example, By Sending Spam, Other Types Of Unsolicited
                    Emails Or The Unauthorized Framing Of, Or Linking To, The Service);
                  </p>
                  <p>
                    4.1.5. To Disrupt Or Unlawfully Affect Or Influence The Activities Of Other
                    Customers Or The Operation Of The Service Generally;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Ads */}
        <div className="hidden lg:flex flex-col gap-3 w-40">
          <img src="/ads/aviator.png" className="rounded-md shadow" alt="" />
          <img src="/ads/dice.png" className="rounded-md shadow" alt="" />
          <img src="/ads/aviator.png" className="rounded-md shadow" alt="" />
        </div>
      </div>
    </div>
  );
}

export default TermsPolicy;
