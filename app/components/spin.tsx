'use client'
import { useMutation } from '@tanstack/react-query'
import { bet } from '../service/bet'
import { useRandomStore } from '../store'
import { SpinBox } from './spinBox'
import { useEffect, useMemo, useRef, useState } from 'react'

export const Spin = () => {
  const { items } = useRandomStore()
  const [prefix] = useState(() => [...Array(3)].map(() => randomItem(items))) // первые 3 фиксированные
  const [middle, setMiddle] = useState<string[]>([])
  const [el, setEl] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const DOMEN = process.env.NEXT_PUBLIC_DOMEN

  function randomItem(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  function makeMiddle(exclude?: string) {
    const res: string[] = []
    while (res.length < 27) {
      const candidate = randomItem(items)
      if (exclude && candidate === exclude) continue
      res.push(candidate)
    }
    return res
  }

  const mutation = useMutation({
    mutationFn: bet.spin,
    onSuccess: (result: string) => {
      setMiddle(makeMiddle(result))
      setEl(result)
    },
  })

  const displayedItems = useMemo(() => {
    if (!el) return [...prefix, ...middle]
    return [...prefix, ...middle, el]
  }, [prefix, middle, el])

  useEffect(() => {
    if (!el || !containerRef.current) return

    const container = containerRef.current
    const elIndex = displayedItems.length - 1
    const child = container.children[elIndex] as HTMLElement
    if (!child) return

    const targetScrollLeft =
      child.offsetLeft + child.offsetWidth / 2 - container.clientWidth / 2

    const duration = 5000 // 5 секунд
    const startScroll = container.scrollLeft
    const distance = targetScrollLeft - startScroll
    let startTime: number | null = null

    const animateScroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // easeOutCubic

      container.scrollLeft = startScroll + distance * ease

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        // победная анимация
        child.classList.add('spinbox-win')
      }
    }

    requestAnimationFrame(animateScroll)

    // сброс анимации на остальных
    Array.from(container.children).forEach((c, i) => {
      if (i !== elIndex) c.classList.remove('spinbox-win')
    })

    return () => {
      cancelAnimationFrame(animateScroll as any)
    }
  }, [el, displayedItems])

  return (
    <div className="w-full flex flex-col gap-10 items-center justify-center mb-[30px]">
      <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
        <path d="M6.4 13.5c1.15 2 4.05 2 5.2 0l5.2-9C18 2.5 16.55 0 14.25 0H3.8C1.5 0 .05 2.5 1.2 4.5l5.2 9Z" fill="#007AFF" />
      </svg>

      <div
        ref={containerRef}
        className="rates bg-[#0000000A] w-full py-5 px-2.5 flex gap-2.5 overflow-x-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        {displayedItems.map((name, i) => (
          <SpinBox key={i} img={`${DOMEN}/media/img/${name}.png`} />
        ))}
      </div>

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="outline-none max-w-[207px] w-full h-[50px] cursor-pointer font-medium text-[17px] bg-[#007AFF] rounded-[10px] text-white"
      >
        {mutation.isPending ? 'Spinning…' : 'Spin'}
      </button>

      <style jsx>{`
        .spinbox-win {
          transform: scale(1.15);
          box-shadow: 0 0 20px 6px #007aff;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .rates {
          scrollbar-width: none;
        }
        .rates::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}


// 'use client'
// import { useRandomStore } from '../store'
// import { SpinBox } from './spinBox'
// import { useEffect, useMemo, useRef, useState } from 'react'

// export const Spin = () => {
//   const { items } = useRandomStore()            // массив названий картинок
//   const [el, setEl] = useState<string | null>(null)
//   const [random30, setRandom30] = useState<string[]>([])
//   const containerRef = useRef<HTMLDivElement>(null)
//   const DOMEN = process.env.NEXT_PUBLIC_DOMEN

//   /** Берём 30 случайных элементов из items (допускаем повторы) */
//   const makeRandom30 = () => {
//     const arr: string[] = []
//     if (!items.length) return arr
//     for (let i = 0; i < 30; i++) {
//       arr.push(items[Math.floor(Math.random() * items.length)])
//     }
//     return arr
//   }

//   /* при первой загрузке заполняем ленту */
//   useEffect(() => {
//     setRandom30(makeRandom30())
//   }, [items])

//   /** Нажатие на кнопку Spin */
//   const handleSpin = () => {
//     if (!items.length) return
//     setRandom30(makeRandom30())                         // обновим первые 30
//     const result = items[Math.floor(Math.random() * items.length)]
//     setEl(result)                                       // победный элемент
//   }

//   /** Массив, который реально рендерится */
//   const displayedItems = useMemo(() => {
//     if (!el) return random30
//     const after: string[] = []
//     for (let i = 0; i < 3; i++) after.push(items[Math.floor(Math.random() * items.length)])
//     return [...random30, el, ...after]
//   }, [el, random30, items])

//   /** Прокрутка к el и подсветка */
//   useEffect(() => {
//     if (!el || !containerRef.current) return

//     const container = containerRef.current
//     const idx = displayedItems.findIndex((it) => it === el)
//     if (idx === -1) return

//     const child = container.children[idx] as HTMLElement
//     if (!child) return

//     // центрируем элемент
//     const scrollTo = child.offsetLeft + child.offsetWidth / 2 - container.clientWidth / 2
//     container.scrollTo({ left: scrollTo, behavior: 'smooth' })

//     // через 600 мс после прокрутки включаем анимацию победы
//     const t = setTimeout(() => {
//       Array.from(container.children).forEach((c) => c.classList.remove('spinbox-win'))
//       child.classList.add('spinbox-win')
//     }, 600)

//     return () => clearTimeout(t)
//   }, [el, displayedItems])

//   return (
//     <div className="w-full flex flex-col gap-[40px] items-center justify-center mb-[30px]">
//       <div className="w-full flex flex-col items-center gap-[20px]">
//         {/* стрелка‑указатель */}
//         <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
//           <path d="M6.4 13.5c1.15 2 4.05 2 5.2 0l5.2-9C18 2.5 16.55 0 14.25 0H3.8C1.5 0 .05 2.5 1.2 4.5l5.2 9Z" fill="#007AFF" />
//         </svg>

//         {/* сама лента */}
//         <div
//           ref={containerRef}
//           className="rates bg-[#0000000A] w-full py-[20px] px-[10px] flex gap-[10px] overflow-x-auto"
//           style={{ scrollBehavior: 'smooth' }}
//         >
//           {displayedItems.map((img, i) => (
//             <SpinBox key={i} img={`${DOMEN}/media/img/${img}.png`} />
//           ))}
//         </div>
//       </div>

//       {/* кнопка */}
//       <button
//         onClick={handleSpin}
//         className="outline-none max-w-[207px] w-full h-[50px] cursor-pointer font-medium text-[17px] bg-[#007AFF] rounded-[10px] text-white"
//       >
//         Spin
//       </button>

//       {/* мини‑CSS прямо в компоненте */}
//       <style jsx>{`
//         .spinbox-win {
//           transform: scale(1.15);
//           box-shadow: 0 0 20px 6px #007aff;
//           transition: transform 0.4s ease, box-shadow 0.4s ease;
//         }
//         .rates {
//           scrollbar-width: none;             /* Firefox */
//         }
//         .rates::-webkit-scrollbar {
//           display: none;                     /* Chrome / Safari / Edge */
//         }
//       `}</style>
//     </div>
//   )
// }
