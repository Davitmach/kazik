import { CanWin } from "./components/canWin";
import { Header } from "./components/header";
import { Menu } from "./components/menu";
import { Spin } from "./components/spin";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen max-w-[480px] mx-auto w-full">
      <Header />
      <Spin />
      <CanWin />

      <div className="mt-auto">
        <Menu />
      </div>
    </div>
  );
}
