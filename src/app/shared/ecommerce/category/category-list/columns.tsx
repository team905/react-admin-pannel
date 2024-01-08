'use client';

import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Title, Text } from '@/components/ui/text';
import { HeaderCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip } from '@/components/ui/tooltip';
import { ActionIcon } from '@/components/ui/action-icon';
import PencilIcon from '@/components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';


type Columns = {
  sortConfig?: any;
  onDeleteItem: (value: string) => void;
  handleCatIdStorage: (id: string) => void;
  openModalFunction: (id: string,data:any) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};

export const getColumns = ({
  sortConfig,
  onDeleteItem,
  onHeaderCellClick,
  onChecked,
  openModalFunction,
  handleCatIdStorage
}: Columns) => [
  {
    title: <></>,
    dataIndex: 'checked',
    key: 'checked',
    width: 30,
    render: (_: any, row: any,index:number) => (
      <div className="inline-flex ps-2">
        <Checkbox
          value={row.id}
          className="cursor-pointer"
          {...(onChecked && { onChange: (e) => onChecked(e, e.target.value) })}
        />
       <span className='ml-3'>  {index + 1} </span>
      </div>
    ),
  },
  {
    title: <HeaderCell title="Image" />,
    dataIndex: 'image',
    key: 'image',
    width: 100,
    render: (image: any, row: any) => (
      <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt={row.name}
          src={image}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
        />
      </figure>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Category Name"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'name'
        }
        
      />
    ),
    dataIndex: 'name',
    key: '_id',
    width: 200,
    onHeaderCell: () => onHeaderCellClick('name'),
    render: (image: any, row: any) => (
      <div onClick={()=>handleCatIdStorage(row._id)} >
        <Title      
           className="!text-sm font-medium">
            {row.name}
          </Title>
      </div>
    ),
    
  },
  {
    title: <HeaderCell title="Description" />,
    dataIndex: 'description',
    key: 'description',
    width: 250,
    render: (description: string) => (
      <Text className="truncate !text-sm "><div dangerouslySetInnerHTML={{__html: description}} ></div></Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Included Items"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'slug'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('slug'),
    dataIndex: 'slug',
    key: 'slug',
    width: 200,
    render: (slug: string) => <Text>{slug}</Text>,
  },
  // {
  //   title: (
  //     <HeaderCell
  //       title="Products"
  //       align="center"
  //       sortable
  //       ascending={
  //         sortConfig?.direction === 'asc' && sortConfig?.key === 'products'
  //       }
  //     />
  //   ),
  //   onHeaderCell: () => onHeaderCellClick('products'),
  //   dataIndex: 'products',
  //   key: 'products',
  //   width: 120,
  //   render: (products: any) => <div className="text-center">{products}</div>,
  // },
  {
    title: <>Action</>,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={() => 'Edit Category'}
          placement="top"
          color="invert"
        >
          {/* <Link href={routes.eCommerce.editCategory(row._id)}> */}
            <ActionIcon size="sm" variant="outline" onClick={()=>openModalFunction(row._id,row)}>
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          {/* </Link> */}
        </Tooltip>
        <DeletePopover
          title={`Delete the category`}
          description={`Are you sure you want to delete this #${row.name} category?`}
          onDelete={() => onDeleteItem(row._id)}
        />
      </div>
    ),
  },
];
