'use client';

import { useEffect, useState ,useLayoutEffect } from 'react';
import toast from 'react-hot-toast';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import cn from '@/utils/class-names';
import { Text } from '@/components/ui/text';
import FormNav, {
  formParts,
} from '@/app/shared/ecommerce/product/create-edit/form-nav';
import ProductSummary from '@/app/shared/ecommerce/product/create-edit/product-summary';
import { defaultValues } from '@/app/shared/ecommerce/product/create-edit/form-utils';
import ProductMedia from '@/app/shared/ecommerce/product/create-edit/product-media';
import PricingInventory from '@/app/shared/ecommerce/product/create-edit/pricing-inventory';
import ProductIdentifiers from '@/app/shared/ecommerce/product/create-edit/product-identifiers';
import ShippingInfo from '@/app/shared/ecommerce/product/create-edit/shipping-info';
import ProductSeo from '@/app/shared/ecommerce/product/create-edit/product-seo';
import DeliveryEvent from '@/app/shared/ecommerce/product/create-edit/delivery-event';
import ProductVariants from '@/app/shared/ecommerce/product/create-edit/product-variants';
import ProductTaxonomies from '@/app/shared/ecommerce/product/create-edit/product-tags';
import FormFooter from '@/components/form-footer';
import { useRouter } from 'next/navigation';
import {
  CreateProductInput,
  productFormSchema,
} from '@/utils/validators/create-product.schema';
import { useLayout } from '@/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import Axios from 'axios';

const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: ProductSummary,
  // [formParts.media]: ProductMedia,
   [formParts.pricingInventory]: PricingInventory,
  // [formParts.productIdentifiers]: ProductIdentifiers,
  // [formParts.shipping]: ShippingInfo,
  // [formParts.seo]: ProductSeo,
  // [formParts.deliveryEvent]: DeliveryEvent,
  // [formParts.variantOptions]: ProductVariants,
  // [formParts.tagsAndCategory]: ProductTaxonomies,
};

interface IndexProps {
  slug?: string;
  className?: string;
  product?: CreateProductInput;
}

export default function CreateEditProduct({
  slug,
  product,
  className,
}: IndexProps) {
  const { layout } = useLayout();
  const [isLoading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any>({});
  let baseURL = "http://64.227.177.118:8000"
  const { push } = useRouter();

  useLayoutEffect(()=>{
    if(slug){
      getProdcutDetaiId(slug)
    }
  },[])

  function getProdcutDetaiId(id:string) {
    let payload = {
      id:id
    }
    Axios.post(`${baseURL}/product/getProduct`,payload).then(
        (response) => {
            var result = response.data;
            setProductData(result.data)
        },
        (error) => {
            console.log(error);
        }
    );
  }
  const methods = useForm<CreateProductInput>({
    // resolver: zodResolver(productFormSchema),
    defaultValues:productData,
  });
  console.log("productData",productData ,methods)

  const onSubmit: SubmitHandler<CreateProductInput> = async (data:any)  => {
    // alert("kk")
    setLoading(true);

    let customUrl = slug? `${baseURL}/product/update` :  `${baseURL}/product/add`;

    let payload:any = {
        "userId":"8af8ba06-4d25-422a-b08d-9e581f4bf578",// temporary data to to removed after adding tokens functionality
        "price":data.price,
        "name":data.name,
        "type":data.type,
        "categoryId": "582ffab1-b9f1-4589-a664-ecdcecfc0228",
        }
        if(slug){
          payload["id"] = slug
        }
        try {
          const response = await Axios.post(`${customUrl}`, payload);
          console.log(response);
          if(response){
             setLoading(false);
             if (response.data['errors'] !== undefined){
              toast.error(response.data.message);
             } else {
              toast.success(response.data.message);
              debugger
              // router.replace(router.as);
              push("/ecommerce/products")
              
              setLoading(false);
              // closeModal();
              methods.reset();
             }
            //  {errors}
            
     
          }
          // if(!response){
          //   window.location = '/ecommerce'
          // }
        } catch (error:any) {
          console.log(error);
          toast.error(error.message);
        }
  
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   console.log('product_data', data);
    //   toast.success(
    //     <Text as="b">Product successfully {slug ? 'updated' : 'created'}</Text>
    //   );
    //   methods.reset();
    // }, 600);
  };



  return (
    <div className="@container">
      <FormNav
        className={cn(layout === LAYOUT_OPTIONS.BERYLLIUM && '2xl:top-[72px]')}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn('[&_label.block>span]:font-medium', className)}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                {<Component className="pt-7 @2xl:pt-9 @3xl:pt-11" />}
              </Element>
            ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={slug ? 'Update Product' : 'Create Product'}
          />
        </form>
      </FormProvider>
    </div>
  );
}
