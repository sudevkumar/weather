"use client";

import Navbar from "@/components/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import Loader from "@/components/Loader";
import { format, parseISO } from "date-fns";
import CommonContainer from "@/components/CommonContainer";
import { toCelSius } from "@/utils/toCelSius";
import WeatherIcon from "@/components/WeatherIcon";
// import { FaEye, FaWind } from "react-icons/fa";
import { IoWaterOutline, IoSpeedometerOutline } from "react-icons/io5";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { useCityContext } from "../context/city";
import { convertToTime } from "@/utils/convertToTime";
import { useEffect } from "react";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const { cities, loading } = useCityContext();

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        process.env.NEXT_PUBLIC_URL +
          `q=${cities}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&cnt=56`
      );

      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [cities, refetch]);

  const currentDay = data?.list[0]?.dt_txt;
  const currentDayResults = data?.list?.filter(
    (ele) => ele.dt_txt.slice(0, 10) === currentDay?.slice(0, 10)
  );

  const uniqueDays = [
    ...new Set(
      data?.list.map(
        (ele) => new Date(ele.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];
  const getFiveDays = uniqueDays?.slice(1, 6);

  const firstDAteForEachDate = getFiveDays.map((ele) => {
    return data?.list.find((e) => {
      const entryDate = new Date(e.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(e.dt * 1000).getHours();
      return entryDate === ele && entryTime >= 6;
    });
  });

  // console.log(firstDAteForEachDate())
  if (isLoading) return <Loader />;
  if (error) return "Somthing went wrong!";

  return (
    <div className=" flex flex-col gap-4 min-h-screen bg-gray-100 bg-[url('https://images.unsplash.com/photo-1475116127127-e3ce09ee84e1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      <Navbar location={data?.city?.name} />
      <main className=" px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 ">
        {/* Today Section */}

        <section className=" space-y-4">
          <div className=" space-y-4">
            <h2 className=" flex gap-1 text-2xl items-end text-white">
              <p>{format(parseISO(currentDay ?? ""), "EEEE")}</p>
              <p className=" text-lg">
                ({format(parseISO(currentDay ?? ""), "dd/MM/yyyy")})
              </p>
            </h2>

            {/* <CommonContainer className=" gap-10 px-6 items-center bg-transparent bg-white"> */}
            <CommonContainer className="isolate gap-3 sm:gap-10 px-6 items-center w-full rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5">
              {/* Today's Temp with min max temp */}
              <div className=" flex flex-col px-1 gap-1">
                <p className=" text-5xl">
                  {toCelSius(data?.list[0]?.main?.temp ?? 296.37)}°
                </p>
                <p className=" text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {toCelSius(data?.list[0]?.main?.feels_like ?? 296.37)}°
                  </span>
                </p>

                <p className=" text-xs space-x-2">
                  <span className=" text-green-500">
                    {toCelSius(data?.list[0]?.main?.temp_min ?? 296.37)}↓°
                  </span>
                  <span className=" text-red-500">
                    {toCelSius(data?.list[0]?.main?.temp_max ?? 296.37)}↑°
                  </span>
                </p>
              </div>

              {/* Today's temp with time */}
              <div className="flex gap-10 sm:gap-1 overflow-x-auto w-full justify-between pr-3">
                {currentDayResults?.map((ele: any, ind: any) => (
                  <div
                    key={ind}
                    className=" flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className=" whitespace-nowrap">
                      {format(parseISO(ele.dt_txt), "h:mm a")}
                    </p>
                    <WeatherIcon icon={ele.weather[0].icon} />
                    <p className=" whitespace-nowrap">
                      {toCelSius(ele?.main?.temp ?? 296.3)}°
                    </p>
                  </div>
                ))}
              </div>
            </CommonContainer>
          </div>

          <div className=" flex gap-4 h-[100px] sm:h-auto">
            {/* left */}
            <CommonContainer className=" w-fit justify-center flex-col px-4 gap-4 items-center">
              <p className=" capitalize text-center">
                {data?.list[0]?.weather[0].description}
              </p>
              <WeatherIcon icon={data?.list[0]?.weather[0]?.icon ?? ""} />
            </CommonContainer>
            {/* right */}

            <div className="flex gap-2 sm:gap-6 overflow-x-auto w-full justify-between ">
              <div className=" bg-green-300/80 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2">
                <p className=" font-bold text-sm">Visibility</p>
                <span>{/* <FaEye className=" text-xl sm:text-3xl " /> */}</span>
                <p className=" font-bold">
                  {data?.list[0]?.visibility / 1000}Km
                </p>
              </div>

              <div className=" bg-red-300/80 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2">
                <p className=" font-bold text-sm">Humidity</p>
                <span>
                  <IoWaterOutline className=" text-xl sm:text-3xl " />
                </span>
                <p className=" font-bold">{data?.list[0]?.main?.humidity}%</p>
              </div>

              <div className=" bg-blue-300/80 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2">
                <p className=" font-bold text-sm">Speed</p>
                <span>
                  {/* <FaWind className=" text-xl sm:text-3xl " /> */}
                </span>
                <p className=" font-bold">{data?.list[0]?.wind.speed}km/h</p>
              </div>

              <div className=" bg-orange-300/80 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2">
                <p className=" font-bold text-sm">Pressure</p>
                <span>
                  <IoSpeedometerOutline className=" text-xl sm:text-3xl " />
                </span>
                <p className=" font-bold">{data?.list[0]?.main?.pressure}hPa</p>
              </div>

              <div className=" bg-yellow-300/80 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2">
                <p className=" font-bold text-sm">Sunrise</p>
                <span>
                  <FiSunrise className=" text-xl sm:text-3xl " />
                </span>
                <p className=" font-bold">
                  {convertToTime(data?.city?.sunrise)}
                </p>
              </div>

              <div className=" bg-red-500/80 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2">
                <p className=" font-bold text-sm">Sunset</p>
                <span>
                  <FiSunset className=" text-xl sm:text-3xl " />
                </span>
                <p className=" font-bold">
                  {convertToTime(data?.city?.sunset)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Next 5 Day Section */}
        <section className=" flex w-full flex-col gap-4">
          <p className=" text-white font-bold text-2xl md:text-3xl">
            Next 5 days Forcast
          </p>
          {firstDAteForEachDate.map((ele, ind) => {
            console.log(ele);
            return (
              <div
                className=" flex gap-4 h-[100px] w-full sm:w-[80%] m-auto sm:h-auto"
                key={ind}
              >
                {/* left */}
                <CommonContainer className=" w-[150px] justify-center flex-col px-4 gap-2 items-center">
                  <p className=" capitalize text-center font-bold">
                    {format(parseISO(ele?.dt_txt ?? ""), "eeee")}
                  </p>

                  <p> {toCelSius(ele?.main?.temp ?? 296.37)}°</p>

                  <p className=" text-xs space-x-2">
                    <span className=" text-green-500">
                      {toCelSius(ele?.main?.temp_min ?? 296.37)}↓°
                    </span>
                    <span className=" text-red-500">
                      {toCelSius(ele?.main?.temp_max ?? 296.37)}↑°
                    </span>
                  </p>
                </CommonContainer>
                {/* right */}

                <div className="flex gap-2 sm:gap-6 overflow-x-auto w-full justify-between ">
                  <div className=" isolate text-white bg-green-300/60 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2 shadow-lg ring-1 ring-black/5">
                    <p className=" font-bold text-sm">Visibility</p>
                    <span>
                      {/* <FaEye className=" text-xl sm:text-3xl " /> */}
                    </span>
                    <p className=" font-bold">{ele?.visibility / 1000}Km</p>
                  </div>

                  <div className=" bg-red-300/50 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2 shadow-lg ring-1 ring-black/5 text-white">
                    <p className=" font-bold text-sm">Humidity</p>
                    <span>
                      <IoWaterOutline className=" text-xl sm:text-3xl " />
                    </span>
                    <p className=" font-bold">{ele?.main?.humidity}%</p>
                  </div>

                  <div className=" bg-blue-300/50 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2 shadow-lg ring-1 ring-black/5 text-white">
                    <p className=" font-bold text-sm">Speed</p>
                    <span>
                      {/* <FaWind className=" text-xl sm:text-3xl " /> */}
                    </span>
                    <p className=" font-bold">{ele?.wind.speed}km/h</p>
                  </div>

                  <div className=" bg-orange-300/60 w-[200px] flex flex-col justify-between items-center p-3 rounded-md mb-2 shadow-lg ring-1 ring-black/5 text-white">
                    <p className=" font-bold text-sm">Pressure</p>
                    <span>
                      <IoSpeedometerOutline className=" text-xl sm:text-3xl " />
                    </span>
                    <p className=" font-bold">{ele?.main?.pressure}hPa</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
