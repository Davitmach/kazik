import Image from "next/image"

export const WinRate = (props:{img:string,percent:number})=> {
    return(
<div className="shrink-0 w-[73px] h-[93px] rounded-[13px] py-[5px] px-[10px] relative overflow-hidden flex items-end justify-center">
    <Image quality={100} alt="2" width={73} height={93} src={props.img} className="absolute left-0 top-0 w-full h-full"/>
<h1 className="text-[#FFFFFF] font-[500] text-[16px] z-50">{props.percent}%</h1>
</div>
    )
}