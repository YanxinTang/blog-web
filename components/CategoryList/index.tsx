import React from 'react';
import ActiveLink from '@components/ActiveLink';
import styles from './CategoryList.module.css';
import { mergeClassNames } from '@util';

export interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList(props: CategoryListProps) {
  return (
    <ul className="text-sm rounded-md bg-white -my-2">
      {props.categories.map(category => (
        <li key={category.id} className="cursor-pointer text-gray-700">
          <ActiveLink href={`/categories/${category.id}`} passHref>
            {active => (
              <a className={mergeClassNames(styles.category, active ? styles.categoryActive : '')}>
                <span className={styles.dot}></span>
                <div className="flex-grow font-medium px-2">{category.name}</div>
                <div className="text-sm font-normal text-gray-500 tracking-wide"></div>
              </a>
            )}
          </ActiveLink>
        </li>
      ))}
    </ul>
  );
}
