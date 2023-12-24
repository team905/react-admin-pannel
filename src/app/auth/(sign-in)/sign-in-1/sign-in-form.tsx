'use client';

import { useState } from 'react';
// import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Password } from '@/components/ui/password';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/utils/validators/login.schema';
import Axios from 'axios';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

const initialValues: LoginSchema = {
  email: 'admin@gmail.com',
  password: 'test@123',
};

export default function SignInForm() {
  //TODO: why we need to reset it here
  const [reset, setReset] = useState({});
  const router = useRouter();
  let baseURL = "http://64.227.177.118:4000/auth/login"
  // const router = useRouter();
const onSubmit = async (data:any) => {
  try {
    const response = await Axios.post(baseURL, data);
    console.log(response.data);
    if(response.data.message =="Login successful"){
      localStorage.setItem('userData',JSON.stringify(response.data.user));
      router.push('/ecommerce');
     
    }
    // router.push('/about');
    
    // if(!response){
    //   window.location = '/ecommerce'
    // }
  } catch (error) {
    console.log(error);
  }
};
  // const onSubmit: SubmitHandler<LoginSchema> = (data) => {
  //   debugger;
  //   console.log(data);
  // Axios.post( '64.227.177.118:4000/auth/login',
  //   data,

  // ).then(((res)=>{
  //   console.log("res",res)
  //   // navigate("/ecommerce");
  // })).catch(console.log);
  //   // signIn('credentials', {
  //   //   ...data,
  //   // });
  //   // setReset({ email: "", password: "", isRememberMe: false });
  // };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              color="info"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              color="info"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                color="info"
                variant="flat"
                className="[&>label>span]:font-medium"
              />
              <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forget Password?
              </Link>
            </div>
            <Button className="w-full" type="submit" size="lg" color="info">
              <span>Sign in</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-6 w-6" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don’t have an account?{' '}
        <Link
          href={routes.auth.signUp1}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign Up
        </Link>
      </Text>
    </>
  );
}
