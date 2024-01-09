'use client';

import dynamic from 'next/dynamic';
import { useColumn } from '@/hooks/use-column';
import ControlledTable from '@/components/controlled-table';
import { categories } from '@/data/product-categories';
import { useCallback, useMemo, useState ,useEffect } from 'react';
import Axios from 'axios';
import { useTable } from '@/hooks/use-table';
import { getColumns } from '@/app/shared/ecommerce/category/category-list/columns';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useModal } from '@/app/shared/modal-views/use-modal';
import CreateCategory from '@/app/shared/ecommerce/category/create-category';
import { ActionIcon } from '@/components/ui/action-icon';
import { PiPlusBold, PiXBold } from 'react-icons/pi';
import { Title } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// dynamic import
const TableFooter = dynamic(
  () => import('@/app/shared/ecommerce/category/category-list/table-footer'),
  { ssr: false }
);

export default function CategoryTable() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPageSelected, setCurrentPageSelected] = useState(1);
  const [searchTerm1, setsearchTerm] = useState('');

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });
  let pageData = {"page": currentPageSelected,"limit": pageSize ,"search":searchTerm1}
  let baseURL = "http://64.227.177.118:8000"
  const { push } = useRouter();

  const [categoeyData ,setCategory] = useState<any>([])

    function getAllCategories(data:any) {
      Axios.post(`${baseURL}/category/all`,data).then(
          (response:any) => {
              let result = response.data;
                result.data.forEach((data:any)=>{
                  data['image'] = "https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp";
               
                });
              setCategory(result)
          },
          (error) => {
              console.log(error);
          }
      );
    }

    const dataChange = (e:any) => {
      getAllCategories(pageData)
     };
   
    useEffect(()=>{
      getAllCategories(pageData)
    },[pageSize,searchTerm1,currentPageSelected])

    const handleSearchdata = (data:any) =>{
      setsearchTerm(data)
    }
   

        // FUNCTION FOR PAGINATION
    const handlePaginateFunc = (page:any) =>{
      setCurrentPageSelected(page)
   
    }

  const onDeleteItem = useCallback((id: any) => {
    let data = {"id":id}
    Axios.post(`${baseURL}/category/delete`,data).then(
      (response) => {
          var result = response.data;
          toast.success(response.data.message);
          getAllCategories(pageData)
          setPageSize(10)
      },
      (error) => {
          console.log(error);
      }
  );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCatIdStorage = (catId:string) => {
    // Set the value in local storage
    sessionStorage.setItem('catId', catId);
    push("/ecommerce/products")
  };

  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const onChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (event.target.checked) {
      setCheckedItems((prevItems) => [...prevItems, id]);
    } else {
      setCheckedItems((prevItems) => prevItems.filter((item) => item !== id));
    }
  };

  function CreateCategoryModalView(props:any) {
    const { closeModal } = useModal();
    return (
      <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
        <div className="mb-7 flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            Update Category
          </Title>
          <ActionIcon size="sm" variant="text" onClick={() => closeModal()}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>
        <CreateCategory id={props.id} category={props.category} isModalView={false} dataChange={props.dataChange} />
      </div>
    );
  }
  const { openModal } = useModal();
const openModalFunction = (id: any,categoryData:any)=>{
  const view = <CreateCategoryModalView id={id} category={categoryData} isModalView={false} dataChange={dataChange}/> 
  const customSize = '500px';
  openModal({
    view,
    // customSize,
  })
}

  const {
    isLoading,
    isFiltered,
    tableData,
    currentPage,
    totalItems,
    handlePaginate,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    handleDelete,
  } = useTable(categories, pageSize);

  const columns = useMemo(
    () =>
      getColumns({ sortConfig, onHeaderCellClick,handleCatIdStorage, onDeleteItem, onChecked ,openModalFunction}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      onChecked,
      openModalFunction,
      handleCatIdStorage
    ]
  );
 

  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);

  return (
    <>
    <ToastContainer />
    <ControlledTable
      variant="modern"
      isLoading={isLoading}
      showLoadingText={true}
      data={categoeyData.data}
      // @ts-ignore
      columns={visibleColumns}
      paginatorOptions={{
        pageSize,
        setPageSize,
        total: categoeyData.total,
        current: currentPageSelected,
        onChange: (page: number) => handlePaginateFunc(page),
      }}
      filterOptions={{
        searchTerm:searchTerm1,
        onSearchClear: () => {
          handleSearchdata('');
        },
        onSearchChange: (event) => {
          handleSearchdata(event.target.value);
        },
        hasSearched: isFiltered,
        columns,
        checkedColumns,
        setCheckedColumns,
      }}
      tableFooter={
        <TableFooter
          checkedItems={checkedItems}
          handleDelete={(ids: string[]) => {
            handleDelete(ids);
            setCheckedItems([]);
          }}
        />
      }
      className="overflow-hidden rounded-md border border-gray-200 text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
    />
    </>
   
  );
}
