import Image from "next/image"

export const WinRate = (props:{img:string})=> {
    return(
<div className="shrink-0 w-[73px] h-[93px] rounded-[13px] py-[5px] px-[10px] relative overflow-hidden flex items-end justify-center">
    <img  alt="2" width={73} height={93} src={props.img} className="absolute left-0 top-0 w-full h-full"/>
</div>
    )
}
export const NotLoadWinRate =()=> {
    return(
        <div className="shrink-0 w-[73px] h-[93px] rounded-[13px] py-[5px] px-[10px] relative overflow-hidden flex items-end bg-[white] justify-center">

</div>
    )
}