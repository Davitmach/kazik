import { SpinBox } from "./spinBox"

export const Spin = ()=> {
    return(
        <div className="w-full flex flex-col gap-[40px] items-center justify-center mb-[30px]">
            <div className="w-full flex flex-col items-center gap-[20px]">
                <div><svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.40192 13.5C7.55662 15.5 10.4434 15.5 11.5981 13.5L16.7942 4.5C17.9489 2.5 16.5056 0 14.1962 0H3.80385C1.49445 0 0.0510712 2.5 1.20577 4.5L6.40192 13.5Z" fill="#007AFF"/>
</svg>
</div>
                <div className="bg-[#0000000A] w-full py-[20px] px-[10px] flex gap-[10px] overflow-x-auto rates">
                    <SpinBox img="/img.png"/>
                    <SpinBox img="/img.png"/>
                    <SpinBox img="/img.png"/>
                    <SpinBox img="/img.png"/>

                </div>
            </div>
            <div className="w-full flex justify-center"><button className="outline-none max-w-[207px] w-full h-[50px] cursor-pointer font-[500] text-[17px] bg-[#007AFF] rounded-[10px] text-[white]">Spin</button></div>
        </div>
    )
}