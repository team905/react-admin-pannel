'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import { Button } from '@/components/ui/button';
import ControlledTable from '@/components/controlled-table';
import { getColumns } from '@/app/shared/ecommerce/product/product-list/columns';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CreateUser from '@/app/shared/roles-permissions/create-user';
import { useModal } from '@/app/shared/modal-views/use-modal';
const FilterElement = dynamic(
  () => import('@/app/shared/ecommerce/product/product-list/filter-element'),
  { ssr: false }
);
const TableFooter = dynamic(() => import('@/app/shared/table-footer'), {
  ssr: false,
});

const filterState = {
  price: ['', ''],
  createdAt: [null, null],
  status: '',
};

export default function ProductsTable({ data = [] }: { data: any[] }) {
  const [pageSize, setPageSize] = useState(10);
  const [productDataTable ,setProductDataTable]= useState<any>([])
  const [searchTerm1, setsearchTerm] = useState('');
  const [currentPageSelected, setCurrentPageSelected] = useState(1);
  const [selectedCatId, setselectedCatId] = useState('');


  if(typeof window !== 'undefined') {
    console.log('You are on the browser');
    useEffect(()=> {
      const id:any  = sessionStorage.getItem('catId');
      setselectedCatId(id)
    },[])
    
  } else {
    useEffect(()=> {
      const id:any  = sessionStorage.getItem('catId');
      setselectedCatId(id)
    },[])
  }
  let baseURL = "http://64.227.177.118:8000"

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });
 
  console.log("selectedCatIdwwww",selectedCatId)
  let pageData = {
    "page": currentPageSelected,
    "limit": pageSize ,
    "search":searchTerm1 ,
    "categoryId":selectedCatId
  }  
  useEffect(()=>{
    getAllproductDetails(pageData)
  },[selectedCatId])
     //Function for get all product with specific category
     function getAllproductDetails(data:any) {
      Axios.post(`${baseURL}/product/getByCategory`,data).then(
          (response) => {
              var result = response.data;
              setProductDataTable(result)
          },
          (error) => {
              console.log(error);
          }
      );
    }

const handleSearchdata = (data:any) =>{
  setsearchTerm(data)
}

    // FUNCTION FOR PAGINATION
    const handlePaginateFunc = (page:any) =>{
      setCurrentPageSelected(page)
    }
    useEffect(()=>{
      getAllproductDetails(pageData)
    },[pageSize,currentPageSelected ,searchTerm1,selectedCatId])

  const onDeleteItem = useCallback((id: string) => {
    let data = {"id":id}
    Axios.post(`${baseURL}/product/delete`,data).then(
      (response) => {
          var result = response.data;
          toast.success(response.data.message);
          getAllproductDetails(pageData)
      },
      (error) => {
          console.log(error);
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isLoading,
    isFiltered,
    tableData,
    currentPage,
    totalItems,
    handlePaginate,
    filters,
    updateFilter,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    selectedRowKeys,
    setSelectedRowKeys,
    handleRowSelect,
    handleSelectAll,
    handleDelete,
    handleReset,
  } = useTable(data, pageSize, filterState);

  const columns = useMemo(
    () =>
      getColumns({
        data,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedRowKeys,
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
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
        data={productDataTable.data}
        // @ts-ignore
        columns={visibleColumns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: productDataTable.total,
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
          hideIndex: 1,
          columns,
          checkedColumns,
          setCheckedColumns,
          enableDrawerFilter: true,
        }}
        filterElement={
          <FilterElement
            filters={filters}
            isFiltered={isFiltered}
            updateFilter={updateFilter}
            handleReset={handleReset}
          />
        }
        tableFooter={
          <TableFooter
            checkedItems={selectedRowKeys}
            handleDelete={(ids: string[]) => {
              setSelectedRowKeys([]);
              handleDelete(ids);
            }}
          >
            <Button size="sm" className="dark:bg-gray-300 dark:text-gray-800">
              Download {selectedRowKeys.length}{' '}
              {selectedRowKeys.length > 1 ? 'Products' : 'Product'}
            </Button>
          </TableFooter>
        }
        className="overflow-hidden rounded-md border border-gray-200 text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
      />
    </>
  );
}
