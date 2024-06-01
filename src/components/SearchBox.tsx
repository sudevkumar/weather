import { cn } from "@/utils/cn";
import React from "react";
import { FaSearchLocation } from "react-icons/fa";
import { MdSearch } from "react-icons/md";

type Props = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  className?:string
};

export default function SearchBox(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className = {cn("flex relative items-center justify-center h-10", props.className)}
    >
      <input
        type="text"
        className=" border px-4 py-2 w-[80%] sm:w-[230px]  border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full"
        name=""
        id=""
        placeholder="Enter the city name... "
        onChange={props.onChange}
        value={props.value}
      />
      <button className=" rounded-r-md bg-blue-500 px-4 py-2 h-full hover:bg-blue-600 text-white text-xl">
        <MdSearch />
      </button>
    </form>
  );
}