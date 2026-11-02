import Modal from '@/components/common/Modal';
import React from 'react';

const UnderagePolicyModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="underline text-gray-800 hover:text-gray-900 cursor-pointer"
      >
        Under Age Policy
      </button>

      <Modal open={open} title="Terms & Conditions" onClose={handleClose}>
        <div className="space-y-2">
          <p>
            It is illegal for anyone under the age of 18 to open an account or gamble with{' '}
            <a href="https://www.{DD.domain}/" target="_blank">
              https://www.skyxch.vip/
            </a>
            (hereinafter "skyxch.vip"). We strictly prohibit minors from registering or gambling,
            and we require new members to declare that they are over 18 years of age.
          </p>
          <p>
            skyxch.vip takes all reasonable steps to prevent underage gamblers from accessing and
            using our services, including the use of identity verification services to ensure that
            all users are eligible to play. As a registered user, you can help us prevent underage
            gambling online.
          </p>
          <p>
            Especially if you access your skyxch.vip account on a shared computer, or if you have
            underage individuals in your household, it's important that you take precautions to
            prevent underage gambling. Do not use software that saves your username and password on
            shared devices, and consider installing parental control programs that can help prevent
            minors from accessing online gambling websites.
          </p>
          <p>
            skyxch.vip includes several mechanisms that can help you detect unauthorized use of your
            player account. Note the last login time and IP address when you log into your account,
            and review your game transactions and financial transactions in your account details to
            ensure that there is no suspicious activity.
          </p>
          <p>
            Parents with immediate concerns about underage gambling should report immediately to
            either email&nbsp;<a href="mailto:support@skyxch.vip">support@skyxch.vip</a> or the
            support chat.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default UnderagePolicyModal;
