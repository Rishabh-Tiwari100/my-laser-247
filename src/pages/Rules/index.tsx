import { useState } from 'react';
import { rulesSections } from './rules-content';

const Rules = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(['speed-cash']));

  const toggleSection = (id: string) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      aria-labelledby="rules-heading"
      className="mx-[2px] min-w-0 rounded-[3px] bg-white font-helvetica text-[#212529]"
    >
      <h1
        id="rules-heading"
        className="m-0 bg-[#343a40] p-[5px] text-[15px] font-medium leading-[1.2] text-white"
      >
        Rules
      </h1>
      <div className="p-[5px]">
        <div className="mt-2">
          {rulesSections.map((section) => {
            const isOpen = openSections.has(section.id);
            return (
              <div key={section.id} className="rounded-[3px]">
                <h2 className="mb-[5px] bg-log-button p-[10px]">
                  <button
                    type="button"
                    id={`rules-trigger-${section.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`rules-panel-${section.id}`}
                    onClick={() => toggleSection(section.id)}
                    className="block w-full p-0 text-left text-[15px] font-normal uppercase leading-[1.5] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {section.title}
                  </button>
                </h2>
                <div
                  id={`rules-panel-${section.id}`}
                  role="region"
                  aria-labelledby={`rules-trigger-${section.id}`}
                  hidden={!isOpen}
                >
                  <div
                    className="overflow-x-auto p-[5px] text-sm leading-[1.5] [overflow-wrap:anywhere] [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-[#dee2e6] [&_td]:border [&_td]:border-[#dee2e6] [&_td]:p-3 [&_td]:align-top"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Rules;
