import AskTable from "./depth/AskTable"
import BidsTable from "./depth/BidsTable"

const OrderBook = () => {
    return (
        <div className="flex flex-col w-[300px] overflow-hidden rounded-lg bg-baseBackgroundL1">
  <div className="flex flex-col h-full">
    {/* Title  */}
    <div className="px-4 py-4">
      <div className="items-center justify-start flex-row flex space-x-2">
        <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 text-sm font-medium outline-none hover:opacity-90 h-[32px] text-baseTextHighEmphasis px-3 bg-baseBackgroundL2">
          Book
        </div>
        <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 text-sm font-medium outline-none hover:opacity-90 h-[32px] text-baseTextMedEmphasis px-3">
          Trades
        </div>
      </div>
    </div>
    <div className="flex flex-col grow overflow-y-hidden">
      <div className="flex flex-col h-full grow overflow-x-hidden">
        {/* Views  */}
        <div className="flex items-center justify-between flex-row pl-2">
          
          <div className="flex items-center justify-center flex-row gap-2">
            <button className="rounded flex h-6 w-6 items-center justify-center hover:brightness-125 focus:outline-none disabled:cursor-not-allowed bg-baseBackgroundL1">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x={3} y={3} width={8} height={2} fill="#00c278" />
                <rect x={3} y={11} width={8} height={2} fill="#00c278" />
                <rect x={3} y={7} width={8} height={2} fill="#00c278" />
                <rect x={3} y={15} width={8} height={2} fill="#00c278" />
                <rect x={3} y={19} width={8} height={2} fill="#00c278" />
                <rect x={13} y={3} width={8} height={2} fill="#75798a" />
                <rect x={13} y={11} width={8} height={2} fill="#75798a" />
                <rect x={13} y={7} width={8} height={2} fill="#75798a" />
                <rect x={13} y={15} width={8} height={2} fill="#75798a" />
                <rect x={13} y={19} width={8} height={2} fill="#75798a" />
              </svg>
            </button>
            <button className="rounded flex h-6 w-6 items-center justify-center hover:brightness-125 focus:outline-none disabled:cursor-not-allowed bg-baseBackgroundL1">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x={3} y={3} width={8} height={2} fill="#75798a" />
                <rect x={3} y={11} width={8} height={2} fill="#75798a" />
                <rect x={3} y={7} width={8} height={2} fill="#75798a" />
                <rect x={3} y={15} width={8} height={2} fill="#75798a" />
                <rect x={3} y={19} width={8} height={2} fill="#75798a" />
                <rect x={13} y={3} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={11} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={7} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={15} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={19} width={8} height={2} fill="#fd4b4e" />
              </svg>
            </button>
            <button className="rounded flex h-6 w-6 items-center justify-center hover:brightness-125 focus:outline-none disabled:cursor-not-allowed bg-baseBackgroundL2">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x={3} y={3} width={8} height={2} fill="#00c278" />
                <rect x={3} y={11} width={8} height={2} fill="#00c278" />
                <rect x={3} y={7} width={8} height={2} fill="#00c278" />
                <rect x={3} y={15} width={8} height={2} fill="#00c278" />
                <rect x={3} y={19} width={8} height={2} fill="#00c278" />
                <rect x={13} y={3} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={11} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={7} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={15} width={8} height={2} fill="#fd4b4e" />
                <rect x={13} y={19} width={8} height={2} fill="#fd4b4e" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between flex-row px-3">
            <div className="flex items-center flex-row">
              <button
                type="button"
                disabled=""
                className="rounded-2xl text-baseIcon transition hover:bg-baseBackgroundL2 hover:text-white p-1 !rounded-md bg-transparent"
                data-rac=""
                id="react-aria1723945980-:rec:"
                data-disabled="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-minus"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <p
                className="font-medium text-baseTextHighEmphasis mx-0.5 select-none text-center text-xs"
                style={{ width: "4ch" }}
              >
                0.01
              </p>
              <button
                type="button"
                className="rounded-2xl text-baseIcon transition hover:bg-baseBackgroundL2 hover:text-white p-1 !rounded-md bg-baseBackgroundL2"
                data-rac=""
                id="react-aria1723945980-:ree:"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-plus"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Table Titles */}
        <TableHeader/>
        
        <div className="flex flex-col no-scrollbar h-full flex-1 overflow-y-auto font-sans">
          <AskTable/>
          {/* Middle Element  */}
          <div className="flex flex-col flex-0 z-20 snap-center bg-baseBackgroundL1 px-3 py-1 sticky bottom-0">
            <div className="flex justify-between flex-row">
              <div className="flex items-center flex-row gap-1.5">
                <button
                  type="button"
                  className="hover:opacity-90"
                  data-rac=""
                  id="react-aria1723945980-:rgg:"
                >
                  <p className="font-medium tabular-nums text-redText">
                    202.83
                  </p>
                </button>
              </div>
              <button
                type="button"
                className="font-medium hover:opacity-80 hover:cursor-pointer text-accentBlue text-xs transition-opacity pointer-events-none opacity-0 duration-200"
                data-rac=""
                id="react-aria1723945980-:rgi:"
              >
                Recenter
              </button>
            </div>
          </div>
          <BidsTable/>
        </div>
        <div className="relative mx-3 my-1 overflow-hidden">
          <div className="flex justify-between">
            <p className="z-10 bg-[#0B3227] py-1 pl-2 text-xs font-normal text-greenText/90">
              53%
            </p>
            <p className="z-10 bg-[#3A1E24] py-1 pr-2 text-xs font-normal text-redText/90">
              47%
            </p>
          </div>
          <div>
            <div
              className="absolute bottom-0 left-0 top-0 -skew-x-25 border-r-2 border-baseBackgroundL0 bg-greenL2"
              style={{
                width: "52.7241%",
                transition: "width 0.3s ease-in-out"
              }}
            />
            <div
              className="absolute bottom-0 right-0 top-0 -skew-x-25 border-l-2 border-baseBackgroundL0 bg-redL2"
              style={{
                width: "47.2759%",
                transition: "width 0.3s ease-in-out"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    )
}
function TableHeader()
{
  return (
    <div className="flex flex-row gap-3 px-3 py-2">
          <p className="font-medium text-baseTextHighEmphasis w-1/3 text-xs">
            Price (USDC)
          </p>
          <button
            type="button"
            className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer h-auto w-1/3 truncate text-right text-xs text-baseTextMedEmphasis"
            data-rac=""
            id="react-aria1723945980-:reg:"
          >
            Size (SOL)
          </button>
          <button
            type="button"
            className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer h-auto w-1/3 truncate text-right text-xs text-baseTextMedEmphasis"
            data-rac=""
            id="react-aria1723945980-:rei:"
          >
            Total (SOL)
          </button>
        </div>
  )
}

export default OrderBook