import React, { Fragment } from 'react';

interface TabsProps {
  tabs: string[];
  children: React.ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
  const [openTab, setOpenTab] = React.useState(tabs.length);

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-row space-x-4 ">
        {tabs.map((tab, index) => (
          <ul key={tab} className={'flex mb-0 list-none flex-wrap pb-4 flex-row border-gray-100'} role="tablist">
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center ">
              <a
                className={
                  'text-xs font-bold uppercase px-5 py-3 shadow rounded block leading-normal ' +
                  (openTab === index + 1 ? 'text-gray-100 border-b-2 border-sky-600' : '')
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(index + 1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                {tab}
              </a>
            </li>
          </ul>
        ))}
      </div>
      {children[openTab - 1]}
    </div>
  );
};

export default Tabs;
