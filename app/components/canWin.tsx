import { WinRate } from "./winRate"

export const CanWin = ()=> {
    return(
        <div className="  flex flex-col gap-[20px] items-start w-full mb-[20px]">
            <div className="px-[10px]"><h1 className="font-[600] text-[20px]">You can win...</h1></div>
            <div className="rates flex gap-[10px] items-center bg-[#0000000A] w-full p-[10px] overflow-x-auto">
                <WinRate img="/img.png" percent={3}/>
                 <WinRate img="/img.png" percent={3}/>
                  <WinRate img="/img.png" percent={3}/>
                   <WinRate img="/img.png" percent={3}/>
                    <WinRate img="/img.png" percent={3}/>
                     <WinRate img="/img.png" percent={3}/>

            </div>
        </div>
    )
}