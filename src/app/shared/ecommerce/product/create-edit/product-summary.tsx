
'use client';
import { useState,useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import FormGroup from '@/app/shared/form-group';
import cn from '@/utils/class-names';
import {
  categoryOption,
  typeOption,
} from '@/app/shared/ecommerce/product/create-edit/form-utils';
import dynamic from 'next/dynamic';
import SelectLoader from '@/components/loader/select-loader';
import QuillLoader from '@/components/loader/quill-loader';
import Axios from 'axios';
const Select = dynamic(() => import('@/components/ui/select'), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function ProductSummary({ className }: { className?: string }) {
  let data = useFormContext()
  const [selectedCatId, setselectedCatId] = useState<any>('');
  const [categoryData, setCategory] = useState<any>([]);
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  // State for the selected option's ID and Name
  const [selectedId, setSelectedId] = useState(null);
  const [selectedName, setSelectedName] = useState<any>("");

  // Handle selection changes
  const handleChange = (option:any) => {
    const selectedOption = categoryData.find((data:any) => data._id === option);
    if (selectedOption) {
      setSelectedId(option);
      setSelectedName(selectedOption.name);
    } else {
      // Handle the case where the selected option is not found
      setSelectedId(null);
      setSelectedName("");
    }
    console.log(option)
  };


  let baseURL = "http://64.227.177.118:8000"

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
   //Function for get all categories
   let catPage = {"page": 1,"limit": 10000}
   function getAllCategories() {
     Axios.post(`${baseURL}/category/all`,catPage).then(
         (response) => {
             var result = response.data;
             console.log(result,"result");
             setCategory(result.data)
         },
         (error) => {
             console.log(error);
         }
     );
   }
  
   useEffect(()=>{
     getAllCategories()
   },[selectedCatId])

   useEffect(()=>{
    const selectedOption = categoryData.find((data:any) => data._id === selectedCatId);
    if (selectedOption) {
      setSelectedId(selectedCatId);
      setSelectedName(selectedOption.name);
    } 
    setSelectedId(selectedCatId);
   },[categoryData])
  return (
    <FormGroup
      title="Summary"
      description="Edit your product description and necessary information from here"
      className={cn(className)}
    >
      <Input
        label="name"
        placeholder="Enter Product name"
        {...register('name')}
        error={errors.title?.message as string}
      />
      <Input
        label="SKU"
        placeholder="Enter value"
        {...register('sku')}
        error={errors.sku?.message as string}
      />

      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            options={typeOption}
            value={value}
            onChange={onChange}
            label="Product Type"
            error={errors?.type?.message as string}
            getOptionValue={(option) => option.name}
          />
        )}
      />

      <Controller
        name="categoryId"
        // {...register('categoryId')}
        control={control}
        defaultValue={selectedCatId}
        render={({ field: { onChange, value } }) => (
            <Select
              options={categoryData}
              onChange={handleChange}
              label="Categories"
              name="categoryId"
              value={selectedName} // Display the selected name
              error={errors?.categories?.message as string}
              getOptionValue={(option) => option._id}
              getOptionLabel={(option:any) => option.name}
            />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Description"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
          />
        )}
      />
    </FormGroup>
  );
}
