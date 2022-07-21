import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useIsMounted } from 'hooks';

export interface CrumbProps {
  text: string;
  textGenerator: null | (() => string | Promise<string>);
  href: string;
  last: boolean;
}

export default function Crumb(props: CrumbProps) {
  const { text, textGenerator, href, last } = props;
  const [displayText, setDisplayText] = useState(text);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (textGenerator) {
      (async () => {
        const finalDisplayText = await textGenerator();
        if (finalDisplayText && isMounted()) {
          setDisplayText(finalDisplayText);
        }
      })();
    }
  }, [textGenerator, isMounted]);

  return (
    <li className={last ? 'text-gray-800' : 'text-gray-500'}>
      <span>
        {last ? (
          displayText
        ) : (
          <Link href={href}>
            <a className="transition-colors hover:text-gray-600">{displayText}</a>
          </Link>
        )}
      </span>
      {!last && <span>/</span>}
    </li>
  );
}
