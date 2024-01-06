'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { useColumn } from '@/hooks/use-column';
import { Button } from '@/components/ui/button';
import ControlledTable from '@/components/controlled-table';
import { getColumns } from '@/app/shared/roles-permissions/users-table/columns';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CreateUser from '@/app/shared/roles-permissions/create-user';
import { useModal } from '@/app/shared/modal-views/use-modal';
const FilterElement = dynamic(
  () => import('@/app/shared/roles-permissions/users-table/filter-element'),
  { ssr: false }
);
const TableFooter = dynamic(() => import('@/app/shared/table-footer'), {
  ssr: false,
});

const filterState = {
  role: '',
  status: '',
};

export default function UsersTable({ data = [] }: { data: any[] }) {
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm1, setsearchTerm] = useState('');
  const [currentPageSelected, setCurrentPageSelected] = useState(1);
  let baseURL = "http://64.227.177.118:8000"
  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = useCallback((id: string) => {
    let data = {"id":id}
    Axios.post(`${baseURL}/users/deleteUser`,data).then(
      (response) => {
          var result = response.data;
          getAlluserDetails({})
          toast.success(response.data.message);
         

      },
      (error) => {
          console.log(error);
      }
  );
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
  let pageData = {"page": currentPageSelected,"limit": pageSize ,"search":searchTerm1}
  const [userDataTable ,setUserDataTable]= useState<any>([])
   //Function for get all categories
   function getAlluserDetails(data:any) {
    Axios.post(`${baseURL}/users/all`,data).then(
        (response) => {
            var result = response.data;
            setUserDataTable(result)
        },
        (error) => {
            console.log(error);
        }
    );
  }

  const handleSearchdata = (data:any) =>{
    setsearchTerm(data)
  }
  
    useEffect(()=>{
      getAlluserDetails(pageData)
    },[pageSize ,currentPageSelected,searchTerm1])

    // FUNCTION FOR PAGINATION
    const handlePaginateFunc = (page:any) =>{
      setCurrentPageSelected(page)
   
    }
   
    const { openModal } = useModal();
    const openModalFunction = (id: any,userData:any)=>{
      const view = <CreateUser id={id} user={userData} /> 
      const customSize = '500px';
      openModal({
        view,
        // customSize,
      })
    }
  
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
        pageSize,
        openModalFunction
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
      openModalFunction
    ]
  );
  const { visibleColumns, checkedColumns, setCheckedColumns } = useColumn(columns);
  return (
    <div className="mt-14">
        <ToastContainer />

      <FilterElement
        isFiltered={isFiltered}
        filters={filters}
        updateFilter={updateFilter}
        handleReset={handleReset}
        onSearch={handleSearchdata}
        searchTerm={searchTerm1}
      />
      <ControlledTable
        variant="modern"
        data={userDataTable.data}
        isLoading={isLoading}
        showLoadingText={true}
        // @ts-ignore
        columns={visibleColumns}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: userDataTable?.total,
          current: currentPageSelected,
          onChange: (page: number) => handlePaginateFunc(page),
        }}
        tableFooter={
          <TableFooter
            checkedItems={selectedRowKeys}
            handleDelete={(ids: string[]) => {
              setSelectedRowKeys([]);
              handleDelete(ids);
            }}
          />
        }
        className="overflow-hidden rounded-md border border-gray-200 text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
      />
    </div>
  );
}
