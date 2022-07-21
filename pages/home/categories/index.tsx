import React, { useState } from 'react';
import { layoutAdmin } from 'layout';
import { errorHandler, withAuthServerSideProps } from 'utils';
import { http } from 'http/server';
import clientHttp from 'http/client';
import Button from 'components/base/Button';
import Input from 'components/base/Input';
import message from 'components/base/message';
import Icon from 'components/base/Icon';

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
          <Input required type="text" placeholder="分类名称" autoFocus defaultValue={props.name} onBlur={handleBlur} />
        ) : (
          props.name
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap space-x-2">
        <Button theme="indigo" ghost title="编辑" onClick={handleEditMode}>
          <Icon id="pencil" />
        </Button>
        <Button theme="red" ghost title="删除" onClick={() => props.onDelete(props.id)}>
          <Icon id="trash" />
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
          <div className="overflow-hidden rounded border border-gray-200">
            <table className="min-w-full table-fixed">
              <colgroup>
                <col className="w-auto" />
                <col className="w-auto md:w-48" />
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
                    <Button theme="indigo" htmlForm="createCategoryForm" type="submit">
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
