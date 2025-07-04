'use client';
import { useQuery } from "@tanstack/react-query";
import { NotLoadWinRate, WinRate } from "./winRate"
import { bet } from "../service/bet";
import { useEffect, useState } from "react";
import { useRandomStore } from "../store";

export const CanWin = ()=> {
    const [random,setRandom] = useState<string[]>([]);
    const DOMEN = process.env.NEXT_PUBLIC_DOMEN;
    const {setItems} = useRandomStore();
    const { data, isLoading, error } = useQuery({
    queryKey: ['random'],
    queryFn: bet.getRandom,
    refetchInterval: 5000, 
  });
  useEffect(()=> {
if(data) {
    setRandom(data);
    setItems(data);
}

  },[data])
    return(
        <div className="  flex flex-col gap-[20px] items-start w-full mb-[20px]">
            <div className="px-[10px]"><h1 className="font-[600] text-[20px]">You can win...</h1></div>
            <div className="rates flex gap-[10px] items-center bg-[#0000000A] w-full p-[10px] overflow-x-auto">
          {random.length>0 ? random.map((e)=> (
            <WinRate img={`${DOMEN+'/media/img/'+e+'.png'}`}/>
          )) :   Array.from({ length: 20 }, (_, i) => (
    <NotLoadWinRate key={i} />
  ))}

            </div>
        </div>
    )
}