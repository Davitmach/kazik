'use client'
import { useMutation } from '@tanstack/react-query';
import { bet } from "../service/bet"
import { useRandomStore } from "../store"
import { SpinBox } from "./spinBox"
import { useEffect, useState, useMemo, useRef } from 'react';

export const Spin = () => {
  const { items } = useRandomStore(); // массив элементов
  const [el, setEl] = useState<string | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
 const DOMEN = process.env.NEXT_PUBLIC_DOMEN; 
  // мутация
  const mutation = useMutation({
    mutationFn: bet.spin,
    onError: (error) => {
      console.error('Spin error:', error);
    },
  });

  // При получении результата — сохраняем el
  useEffect(() => {
    if (mutation.data) {
      setEl(mutation.data);
    }
  }, [mutation.data]);

  // Генерируем 30 случайных элементов из items для ленты (при каждом рендере можно зафиксировать)
  // Чтобы не менять каждый рендер, создадим стейт
  const [random30, setRandom30] = useState<string[]>([]);
  useEffect(() => {
    if (items.length > 0) {
      // Выбираем 30 случайных элементов (с повторениями можно)
      let shuffled = [];
      for (let i = 0; i < 30; i++) {
        const randIndex = Math.floor(Math.random() * items.length);
        shuffled.push(items[randIndex]);
      }
      setRandom30(shuffled);
    }
  }, [items]);

  // Формируем массив элементов для рендера:
  // Если el есть — 30 случайных + el + 3 случайных
  // Если нет — просто 30 случайных
  const displayedItems = useMemo(() => {
    if (!el) return random30;
    // 3 случайных после el
    const afterEl = [];
    for (let i = 0; i < 3; i++) {
      const randIndex = Math.floor(Math.random() * items.length);
      afterEl.push(items[randIndex]);
    }
    return [...random30, el, ...afterEl];
  }, [el, random30, items]);

  // После появления el — делаем анимацию прокрутки, чтобы el оказался в центре
  useEffect(() => {
    if (!el || !containerRef.current) return;

    const container = containerRef.current;
    // Найдем индекс el в displayedItems
    const elIndex = displayedItems.findIndex(i => i === el);
    if (elIndex === -1) return;

    // Предположим, что ширина одного SpinBox фиксирована (например 100px + gap 10px)
    // Можно взять вычисленную ширину из DOM
    const child = container.children[elIndex] as HTMLElement;
    if (!child) return;

    const containerWidth = container.clientWidth;
    const childWidth = child.offsetWidth;
    const gap = 10; // gap между элементами, px

    // Позиция центра child относительно контейнера
    const childCenter = child.offsetLeft + childWidth / 2;

    // Позиция центра контейнера
    const containerCenter = containerWidth / 2;

    // Скролл, чтобы child центрировался
    const scrollTo = childCenter - containerCenter;

    // Анимируем прокрутку по горизонтали с плавным эффектом
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth',
    });

    // По окончании анимации через примерно 600ms ставим класс анимации победы
    const timeout = setTimeout(() => {
      child.classList.add('spinbox-win');
    }, 600);

    // Уберём класс у других элементов
    Array.from(container.children).forEach((elChild, idx) => {
      if (idx !== elIndex) {
        elChild.classList.remove('spinbox-win');
      }
    });

    return () => clearTimeout(timeout);

  }, [el, displayedItems]);

  return (
    <div className="w-full flex flex-col gap-[40px] items-center justify-center mb-[30px]">
      <div className="w-full flex flex-col items-center gap-[20px]">
        <div>
          <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.40192 13.5C7.55662 15.5 10.4434 15.5 11.5981 13.5L16.7942 4.5C17.9489 2.5 16.5056 0 14.1962 0H3.80385C1.49445 0 0.0510712 2.5 1.20577 4.5L6.40192 13.5Z" fill="#007AFF" />
          </svg>
        </div>
        <div
          ref={containerRef}
          className="bg-[#0000000A] w-full py-[20px] px-[10px] flex gap-[10px] overflow-x-auto rates"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayedItems.map((item, i) => (
            <SpinBox
              key={i}
              img={`${DOMEN}/media/img/${item}.png`}
              
            />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="outline-none max-w-[207px] w-full h-[50px] cursor-pointer font-[500] text-[17px] bg-[#007AFF] rounded-[10px] text-[white]"
        >
          {mutation.isPending ? 'Spinning...' : 'Spin'}
        </button>
      </div>

      <style jsx>{`
        .spinbox-side {
          opacity: 0.7;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .spinbox-win {
          opacity: 1 !important;
          transform: scale(1.15);
          box-shadow: 0 0 20px 6px #007AFF;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        /* Скрываем скролл для Firefox */
        .rates {
          scrollbar-width: none;
        }
        /* Скрываем скролл для Chrome, Edge и Safari */
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
