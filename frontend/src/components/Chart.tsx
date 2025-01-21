import { ChartComponent } from "./ChartComponent"
import { initialData } from "../lib/constants"
const Chart = () => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-lg bg-baseBackgroundL1">
  <div className="flex items-center justify-between flex-row px-4 py-4">
    <p className="font-medium text-sm text-baseTextMedEmphasis">Chart</p>
    <div className="items-center justify-start flex-row flex space-x-2">
      <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 text-sm font-medium outline-none hover:opacity-90 h-[32px] text-baseTextHighEmphasis px-3 bg-baseBackgroundL2">
        Trading View
      </div>
      <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 text-sm font-medium outline-none hover:opacity-90 h-[32px] text-baseTextMedEmphasis px-3">
        Depth
      </div>
    </div>
  </div>
  <div className="h-full ">
    <div id="tv_chart_container" className="tradingview-chart">
      <ChartComponent data={initialData}/>
    </div>
  </div>
</div>

  )
}

export default Chart