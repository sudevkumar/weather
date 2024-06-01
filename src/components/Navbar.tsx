"use client";

import React, { useState } from "react";
import { FaSun } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { useCityContext } from "@/context/city";

type Props = { location?: string };

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const { setCities, setLoading } = useCityContext();

  const handleChange = async (value: string) => {
    setCity(value);
    if (value.length >= 3) {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_CITY_URL +
            `q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        const suggestion = res.data.list.map((ele: any) => ele.name);
        setSuggestions(suggestion);
        setError("");
        setShow(true);
      } catch (error) {
        setSuggestions([]);
        setShow(false);
      }
    } else {
      setSuggestions([]);
      setShow(false);
    }
  };

  const handleSugestionClick = (value: string) => {
    setCity(value);
    setShow(false);
  };

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (suggestions.length === 0) {
      setError("City not found.");
    } else {
      setError("");
      setCities(city);
      setShow(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (loc) => {
        const { latitude, longitude } = loc.coords;
        try {
          const res = await axios.get(
            process.env.NEXT_PUBLIC_URL_LATLONG +
              `lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
          );
          setCities(res.data.name);
        } catch (error) {
          console.log(error);
        }
      });
    }
  };

  return (
    <nav className=" sticky top-0 left-0 z-50 bg-white shadow-sm">
      <div className=" h-[70px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className=" flex items-center justify-center gap-2">
          <h2 className=" text-gray-500 text-3xl">Weather</h2>
          <FaSun className=" text-3xl mt-1 text-yellow-500" />
        </div>

        {/* Search Bar */}

        <section className=" flex gap-2 items-center">
          <FaLocationCrosshairs
            title="Your current location"
            onClick={handleCurrentLocation}
            className=" text-xl md:text-3xl mt-1 text-gray-500 hover:opacity-80 cursor-pointer"
          />

          <div className=" flex gap-1 items-center border border-black p-2 rounded-md cursor-help">
            <MdLocationOn
              title={`Location is ${location}`}
              className=" text-lg md:text-2xl mt-1 hover:opacity-80 "
            />
            <p className=" text-slate-900/80 text-sm">{location}</p>
          </div>

          <div className=" sm:block hidden relative">
            <SearchBox
              value={city}
              onChange={(e) => handleChange(e.target.value)}
              onSubmit={handleSubmitSearch}
            />
            <SuggestionBox
              show={show}
              suggestions={suggestions}
              handleSugestionClick={handleSugestionClick}
              error={error}
            />
          </div>
        </section>
      </div>
      <div className=" mb-2 block sm:hidden">
        <SearchBox
          value={city}
          onChange={(e) => handleChange(e.target.value)}
          onSubmit={handleSubmitSearch}
        />
      </div>
    </nav>
  );
}

function SuggestionBox({
  show,
  suggestions,
  handleSugestionClick,
  error,
}: {
  show: boolean;
  suggestions: string[];
  handleSugestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((show && suggestions.length > 0) || error) && (
        <ul className=" mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className=" text-red-500 p-1">{error}</li>
          )}

          {suggestions.map((ele, ind) => (
            <li
              className=" cursor-pointer p-1 rounded hover:bg-gray-200"
              key={ind}
              onClick={() => handleSugestionClick(ele)}
            >
              {ele}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
