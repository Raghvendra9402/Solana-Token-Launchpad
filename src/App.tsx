import TokenLaunchPad from "./component/TokenLaunchPad"
import { WalletAdapterSolana } from "./component/WalletAdapterSolana"



function App() {


  return (
    <div className="h-screen flex justify-center items-center bg-[#212121]">
      <WalletAdapterSolana>
       <TokenLaunchPad />
       </WalletAdapterSolana>
    </div>
  )
}

export default App
