/* eslint-disable react/prop-types */

import InputField from "../Common/InputField";

// image imports
import wavyPattern from "../../assets/images/wavy-circles.png";

export default function LoginCard({ page, formDataSetter, formData, onSubmit }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* bg image */}
      <div className="h-full w-full absolute z-[-1] flex items-center top-[10%]">
        <img src={wavyPattern} alt="" className="" />
      </div>

      {/* card */}
      <div className="w-3/4 min-h-3/4 max-h-[85%] bg-white shadow-lg rounded-lg flex items-stretch p-2">
        {/* illustration */}
        <div className="flex-1 bg-yellow-100 rounded-lg"></div>

        {/* form */}
        <div className="flex-1 p-6 flex flex-col items-center justify-evenly">
          <div className="flex flex-col space-y-2 items-center">
            <p className="text-4xl font-medium"> {page.displayName} </p>
            <p className="text-[#838383] text-sm w-3/4 text-center">
              {" "}
              Welcome Back! Please log in to get access to your account.{" "}
            </p>
          </div>

          <form onSubmit={onSubmit} className="w-3/4 flex flex-col items-center">
            <div className="space-y-2 mb-6 text-right">
              <InputField args={{ placeholder: "Enter your Email", required: true }} value={formData.email} setter={(val) => formDataSetter(prevData => ({ ...prevData, email: val }))} />
              <InputField args={{ placeholder: "Enter your Password", required: true }} value={formData.password} setter={(val) => formDataSetter(prevData => ({ ...prevData, password: val }))} />

              <p className="cursor-pointer text-sm"> Forgot Password? </p>
            </div>

            <button className="p-3 rounded-2xl bg-[#FECC00] w-full font-semibold">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
