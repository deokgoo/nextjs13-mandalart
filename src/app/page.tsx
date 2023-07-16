'use client'

import { useEffect } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth0 } from "@auth0/auth0-react";

import logo from '../../public/logo.png';

const Home = () => {
  const router = useRouter()
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/main');
    }
  }, [isAuthenticated]);

  const onClickStart = () => {
    loginWithRedirect();
  }

  return (
    <main className="w-screen h-screen flex flex-col">
      <div className="h-1/6 flex justify-center items-center">
        <h1></h1>
      </div>
      <div className="h-4/6 flex justify-center items-center">
        <div className="w-1/2">
          <NextImage src={logo} alt="logo"></NextImage>
        </div>
      </div>
      <div className="h-1/6 flex justify-center items-center">
        <button className="w-1/2 h-1/4 rounded-md border-2" onClick={onClickStart}>
          시작하기/로그인하기
        </button>
      </div>
    </main>
  );
};

export default Home;
