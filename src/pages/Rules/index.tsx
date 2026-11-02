import { rulesContent } from './rules-content';

const [title, ...rules] = rulesContent;

const Rules = () => {
  return (
    <main className="w-full bg-[#eeeeee] p-[10px] pb-[30px]">
      <section aria-labelledby="rules-heading">
        <h1
          id="rules-heading"
          className="mb-[10px] bg-[#212121] px-[5px] py-[5px] text-sm font-semibold text-white"
        >
          {title}
        </h1>
        <div className="space-y-[10px] text-sm leading-[1.5] text-[#212121]">
          {rules.map((rule, index) => (
            <p key={index} className="whitespace-pre-line">
              {rule}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Rules;
