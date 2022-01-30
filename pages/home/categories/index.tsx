import React, { useState } from 'react';
import { layoutAdmin } from 'layout';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { http } from 'http/server';
import clientHttp from 'http/client';
import Button from 'components/Button';
import Input from 'components/Input';
import message from 'components/message';

type CategoriesResponse = Category[];

export const getServerSideProps = withAuthServerSideProps(async () => {
  const { data } = await http.get<CategoriesResponse>('/api/categories');
  return {
    props: {
      data,
      meta: {
        title: '分类管理',
      },
    },
  };
});

interface ItemProps extends Category {
  onChange: (id: BaseModel['id'], newName: string) => void;
  onDelete: (id: BaseModel['id']) => void;
}

const Item = (props: ItemProps) => {
  const [editMode, setEditMode] = useState(false);

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    setEditMode(false);
    const newName = event.target.value;
    if (newName != props.name) {
      // update category name
      props.onChange(props.id, event.target.value);
    }
  };

  return (
    <tr key={props.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        {editMode ? (
          <input
            required
            type="text"
            placeholder="分类名称"
            autoFocus
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            defaultValue={props.name}
            onBlur={handleBlur}
          />
        ) : (
          props.name
        )}
      </td>
      <td className="px-6 py-4 flex flex-row flex-nowrap justify-between">
        <Button type="indigo" onClick={handleEditMode}>
          编辑
        </Button>
        <Button type="red" ghost onClick={() => props.onDelete(props.id)}>
          删除
        </Button>
      </td>
    </tr>
  );
};

interface CategoriesProps {
  data: CategoriesResponse;
}

function Categories(props: CategoriesProps) {
  const { data } = props;
  const [categories, setCategories] = useState(data);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data: category } = await clientHttp.post<Category>(`/api/admin/categories/`, { name: newCategoryName });
      setNewCategoryName('');
      setCategories(categories => [...categories, category]);
      message.success({ message: '添加成功' });
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const handleChange = async (id: BaseModel['id'], newName: string) => {
    try {
      await clientHttp.put(`/api/admin/categories/${id}`, { name: newName });
      setCategories(categories => {
        return categories.map(category => (category.id === id ? { ...category, name: newName } : category));
      });
      message.success({ message: '修改成功' });
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const handleDelete = async (id: BaseModel['id']) => {
    try {
      await clientHttp.delete(`/api/admin/categories/${id}`);
      setCategories(categories => categories.filter(category => category.id !== id));
      message.success({ message: '删除成功' });
    } catch (error) {
      message.error({ message: errorHandler(error) });
    }
  };

  const categoryList = categories.map(c => (
    <Item key={c.id} onChange={handleChange} onDelete={handleDelete} {...c}></Item>
  ));

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <colgroup>
                <col className="w-auto" />
                <col className="w-48" />
              </colgroup>
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th scope="col" className="px-6 py-3 uppercase tracking-wider">
                    分类名称
                  </th>
                  <th scope="col" className="px-6 py-3 tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryList}
                <tr key="addNewCategories">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Input
                      form="createCategoryForm"
                      type="text"
                      placeholder="分类名称"
                      required
                      value={newCategoryName}
                      onChange={event => setNewCategoryName(event.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 flex flex-row flex-nowrap justify-between">
                    <Button type="indigo" htmlForm="createCategoryForm" htmlType="submit">
                      新增
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            <form id="createCategoryForm" onSubmit={handleCreateCategory}></form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default layoutAdmin(Categories);
