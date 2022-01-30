import React from 'react';

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

export default function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    ></textarea>
  );
}
