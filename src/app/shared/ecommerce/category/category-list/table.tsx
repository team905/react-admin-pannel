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
// dynamic import
const TableFooter = dynamic(
  () => import('@/app/shared/ecommerce/category/category-list/table-footer'),
  { ssr: false }
);

export default function CategoryTable() {
  const [pageSize, setPageSize] = useState(10);
  const [currentPageSelected, setCurrentPageSelected] = useState(1);

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });
  let pageData = {"page": currentPageSelected,"limit": pageSize}

  let baseURL = "http://64.227.177.118:8000"

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
   
      useEffect(()=>{
        getAllCategories(pageData)
      },[pageSize])

      useEffect(()=>{
        getAllCategories(pageData)
      },[currentPageSelected])

        // FUNCTION FOR PAGINATION
    const handlePaginateFunc = (page:any) =>{
      setCurrentPageSelected(page)
   
    }
  const onDeleteItem = useCallback((id: string) => {
    console.log("delete")
    let data = {"id":id}
    Axios.post(`${baseURL}/category/delete`,data).then(
      (response) => {
          var result = response.data;
          toast.success(response.data.message);
          window.location.reload()
      },
      (error) => {
          console.log(error);
      }
  );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      getColumns({ sortConfig, onHeaderCellClick, onDeleteItem, onChecked }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      onChecked,
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
        current: currentPage,
        onChange: (page: number) => handlePaginateFunc(page),
      }}
      filterOptions={{
        searchTerm,
        onSearchClear: () => {
          handleSearch('');
        },
        onSearchChange: (event) => {
          handleSearch(event.target.value);
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
