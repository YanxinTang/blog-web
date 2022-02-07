import React, { useEffect, useState } from 'react';
import { layoutAdmin } from 'layout';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { newHttp } from 'http/server';
import clientHttp from 'http/client';
import Progress from 'components/base/Progress';
import message from 'components/base/message';

type OverviewResponse = Array<{ name: string; value: number }>;

export const getServerSideProps = withAuthServerSideProps(async ctx => {
  const { data } = await newHttp(ctx).get<OverviewResponse>('/api/admin/overview');
  return {
    props: {
      data,
      meta: {
        title: '总览',
      },
    },
  };
});

interface CardProps {
  title: string;
  value: string | number;
}

const Card = (props: CardProps) => {
  return (
    <div className="p-5 bg-white rounded shadow-sm">
      <div className="text-base text-gray-400 ">{props.title}</div>
      <div className="flex items-center pt-1">
        <div className="text-2xl font-bold text-gray-900 ">{props.value}</div>
        <span className="flex items-center px-2 py-0.5 mx-2 text-sm text-green-600 bg-green-100 rounded-full">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 15L12 9L6 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span>0.00%</span>
        </span>
      </div>
    </div>
  );
};

interface HomeProps {
  data: OverviewResponse;
}

type OverviewStorageList = Array<{
  id: number;
  name: string;
  usage: number;
  capacity: number;
}>;

function Home(props: HomeProps) {
  const [overviewStorages, setOverviewStorages] = useState<OverviewStorageList>([]);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await clientHttp.get<OverviewStorageList>('/api/admin/overview/storage');
        if (isMounted) {
          setOverviewStorages(data);
        }
      } catch (error) {
        if (isMounted) {
          message.error(errorHandler(error));
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h2>内容</h2>
        <div className="grid gap-2 lg:grid-cols-3">
          {props.data.map((pair, index) => (
            <Card key={index} title={pair.name} value={pair.value}></Card>
          ))}
        </div>
      </section>
      <section>
        <h2>存储</h2>
        <div className="p-5 bg-white rounded shadow-sm space-y-4">
          {overviewStorages.map(item => {
            const percent = Math.floor((item.usage / item.capacity) * 100);
            return (
              <div className="flex items-center" key={item.id}>
                <div className="basis-24 text-overflow-ellipsis">
                  <strong>{item.name}</strong>
                </div>
                <div className="flex-grow">
                  <Progress percent={percent}></Progress>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default layoutAdmin(Home);
