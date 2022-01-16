import React from 'react';
import { layout, layoutAdmin } from 'layout';
import { withAuthServerSideProps } from 'utils';
import { newHttp } from 'http/server';

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

function Home(props: HomeProps) {
  return (
    <div className="grid gap-2 lg:grid-cols-3">
      {props.data.map((pair, index) => (
        <Card key={index} title={pair.name} value={pair.value}></Card>
      ))}
    </div>
  );
}

export default layoutAdmin(Home);
