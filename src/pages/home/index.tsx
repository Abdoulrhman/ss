import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import React, { useState } from "react";

const Home: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left panel with gradient background */}
      <div
        className="flex flex-1 bg-gradient-to-b from-gray-800 to-gray-600 text-white p-8 lg:w-1/2 flex-col justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Logo</h1>
        </div>
        <div>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 justify-center items-center p-8 lg:w-1/2">
        {isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <RegisterForm setIsLogin={setIsLogin} />}
      </div>
    </div>
  );
};

export default Home;
