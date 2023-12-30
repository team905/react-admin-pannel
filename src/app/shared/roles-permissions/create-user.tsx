'use client';

import { useEffect, useState } from 'react';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActionIcon } from '@/components/ui/action-icon';
import { useFormContext } from 'react-hook-form';
import FormGroup from '@/app/shared/form-group';
import Axios from 'axios';
import cn from '@/utils/class-names';
import Multiselect from 'multiselect-react-dropdown';
import {
  CreateUserInput,
  createUserSchema,
} from '@/utils/validators/create-user.schema';
import { Title } from '@/components/ui/text';
import Select from '@/components/ui/select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import {
  permissions,
  roles,
  statuses,
} from '@/app/shared/roles-permissions/utils';
import UploadZone from '@/components/ui/file-upload/upload-zone';
export default function CreateUser() {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [categoryData, setCategory] = useState([]);
  const [selectedList, setSelectedList] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ` }
};
let baseURL = "http://64.227.177.118:4000"
const onSubmit: SubmitHandler<CreateUserInput> = async (data) => {
    let categoryAccess:any = []
    selectedList.forEach((item:any)=>{
      categoryAccess.push(item?._id)
    })
    data['categoryAccess'] = categoryAccess
    try {
      const response = await Axios.post(`${baseURL}/users`, data);
      console.log(response);
      if(response){
         setLoading(false);

      closeModal();
      }
      // if(!response){
      //   window.location = '/ecommerce'
      // }
    } catch (error) {
      console.log(error);
    }
    // set timeout ony required to display loading state of the create category button
    // const formattedData = {
    //   ...data,
    //   createdAt: new Date(),
    // };
    // setLoading(true);
    // const { getValues, setValue } = useFormContext();
    // setTimeout(() => {
    //   console.log('formattedData', formattedData);
    //   setLoading(false);
    //   setReset({
    //     fullName: '',
    //     email: '',
    //     phone:'',
    //     role: '',
    //     permissions: '',
    //     status: '',
    //   });
    //   closeModal();
    // }, 600);
  };

  //Function for get all categories
  function getAllCategories() {
    Axios.post(`${baseURL}/category/all`).then(
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
  },[])


  const onSelect = (selectedListData:any, selectedItem:any) => {
    setSelectedList(selectedListData)
  }
  const onRemove = (selectedListData:any, selectedItem:any) => {
    setSelectedList(selectedListData)
  }
console.log("selectedList",selectedList)
  
  return (
    <Form<CreateUserInput>
      resetValues={reset}
      onSubmit={onSubmit}
      validationSchema={createUserSchema}
      className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900"
    >
      {({ register, control, watch, formState: { errors } }) => {
        console.log('errors', errors);

        return (
          <>
            <div className="col-span-full flex items-center justify-between">
              <Title as="h4" className="font-semibold">
                Add a new User
              </Title>
              <ActionIcon size="sm" variant="text" onClick={closeModal}>
                <PiXBold className="h-auto w-5" />
              </ActionIcon>
            </div>
            <Input
              label="Full Name"
              placeholder="Enter user's full name"
              {...register('name')}
              className="col-span-full"
              error={errors.name?.message}
            />

            <Input
              label="Email"
              placeholder="Enter user's Email Address"
              className="col-span-full"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
                label="Phone"
                placeholder="Enter user's phone no."
                className="col-span-full"
                {...register('phone')}
                error={errors.phone?.message}
              />
             
            <Controller
              name="role"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={roles}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Role"
                  className="col-span-full"
                  error={errors?.status?.message}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected: string) =>
                    roles.find((option) => option.value === selected)?.name ??
                    selected
                  }
                />
              )}
            />
           
           <div className="rizzui-input-root flex flex-col col-span-full">
              <label className="block"><span className='rizzui-input-label block text-sm mb-1.5'>Category Access</span></label>
              <Multiselect
                displayValue="name"
                onKeyPressFn={function noRefCheck(){}}
                onRemove={onRemove}
                onSearch={function noRefCheck(){}}
                onSelect={onSelect}
                options={categoryData}
                className="col-span-full"
                // selectedValueDecorator={function noRefCheck(){}}
              />
            </div>
            
          <FormGroup
      title="Upload logo"
      description="Upload logo here"
      // className={cn(className)}
    >
      {/* <UploadZone
        className="col-span-full"
        name="productImages"
        getValues={getValues}
        setValue={setValue}
      /> */}
    </FormGroup>
      <Controller
              name="status"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={statuses}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Status"
                  error={errors?.status?.message}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected: string) =>
                    statuses.find((option) => option.value === selected)
                      ?.name ?? selected
                  }
                />
              )}
            />
           

            {/* <Controller
              name="categoryAccess"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <Select
                  options={categoryData}
                  value={value}
                  onChange={onChange}
                  name={name}
                  label="Categeory Access"
                  error={errors?.status?.message}
                  getOptionValue={(option) => option.name}
                  displayValue={(selected: string) =>
                    permissions.find((option) => option.value === selected)
                      ?.name ?? selected
                  }
                />
              )}
            /> */}

            <div className="col-span-full flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={closeModal}
                className="w-full @xl:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full @xl:w-auto dark:bg-gray-200 dark:text-white dark:active:enabled:bg-gray-300"
              >
                Create User
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
