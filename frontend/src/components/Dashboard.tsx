import Card from "./Card"
import Search from "./Search"
import { ChartComponent } from "./ChartComponent"
import { initialData } from "../lib/constants"
import OrderBook from "./OrderBook"
import StockInfo from "./StockInfo"
import BuyOrder from "./BuyOrder"

const Dashboard = () => {
    return (
        <div className="flex flex-1 flex-col overflow-auto bg-baseBackgroundL0 text-baseTextHighEmphasis">
            <div className="flex flex-col flex-1">
                <div className="flex flex-row mb-4 h-screen flex-1 gap-2 overflow-hidden px-4">
                    <div className="flex flex-col flex-1 gap-2">
                        <div className="flex flex-col flex-1 gap-2 overflow-hidden">
                            <StockInfo/>

                        </div>
                        <div className="flex flex-row h-[620px] gap-2">
                         <ChartComponent data={initialData}/>
                         <OrderBook/>
                        </div>
                    </div>
                     
                    <BuyOrder/>
                </div>
                
            </div>
        </div>
    )
}

export default Dashboard