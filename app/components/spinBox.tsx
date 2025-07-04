import Image from "next/image"

export const SpinBox = (props:{img:string})=> {
    return(
        <div className="spinbox-side shrink-0 w-[200px] h-[256px] rounded-[20px] overflow-hidden"><img className="object-cover h-full"  alt="w" width={200} height={256} src={props.img}/></div>
    )
}