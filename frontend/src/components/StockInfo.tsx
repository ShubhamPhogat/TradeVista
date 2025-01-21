
const StockInfo = () => {
  return (
    <div className="flex items-center overflow-hidden flex-row relative w-full rounded-lg bg-baseBackgroundL1">
  <div className="flex items-center flex-row no-scrollbar mr-4 h-[72px] w-full overflow-auto pl-4">
    <div className="flex justify-between flex-row w-full gap-4">
      <div className="flex flex-row shrink-0 gap-[32px]">
        <button
          type="button"
          aria-expanded="false"
          id="react-aria1723945980-:re7:"
          className="react-aria-Button"
          data-rac=""
        >
          <div className="flex items-center justify-between flex-row cursor-pointer rounded-xl bg-baseBackgroundL2 p-2 hover:opacity-90">
            <div className="flex flex-row mr-2">
              <a href="/trade/SOL_USDC">
                <div className="flex items-center flex-row gap-2 undefined">
                  <div className="flex flex-row relative shrink-0">
                    <img
                      alt="SOL Logo"
                      loading="lazy"
                      width={24}
                      height={24}
                      decoding="async"
                      data-nimg={1}
                      className="z-10 rounded-full "
                      srcSet="/_next/image?url=%2Fcoins%2Fsol.png&w=32&q=75 1x, /_next/image?url=%2Fcoins%2Fsol.png&w=48&q=75 2x"
                      src="/_next/image?url=%2Fcoins%2Fsol.png&w=48&q=75"
                      style={{ color: "transparent" }}
                    />
                  </div>
                  <p className="font-medium text-nowrap text-baseTextHighEmphasis undefined">
                    SOL
                  </p>
                </div>
              </a>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-down text-baseIcon"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </button>
        <div className="flex items-center flex-row space-x-6">
          <div className="flex flex-col h-full justify-center">
            <p className="font-medium tabular-nums text-redText text-lg">
              201.70
            </p>
            <p className="font-medium text-baseTextHighEmphasis text-left text-sm tabular-nums">
              $201.70
            </p>
          </div>
          <div className="flex justify-center flex-col relative">
            <p className="font-medium text-xs text-baseTextMedEmphasis">
              24H Change
            </p>
            <span className="mt-1 text-sm font-normal tabular-nums leading-4 text-baseTextHighEmphasis text-greenText">
              +11.78 +6.19%
            </span>
          </div>
          <div className="flex justify-center flex-col relative">
            <p className="font-medium text-xs text-baseTextMedEmphasis">
              24H High
            </p>
            <span className="mt-1 text-sm font-normal tabular-nums leading-4 text-baseTextHighEmphasis ">
              206.14
            </span>
          </div>
          <div className="flex justify-center flex-col relative">
            <p className="font-medium text-xs text-baseTextMedEmphasis">
              24H Low
            </p>
            <span className="mt-1 text-sm font-normal tabular-nums leading-4 text-baseTextHighEmphasis ">
              185.81
            </span>
          </div>
          <button
            type="button"
            className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-accentBlue text-base text-left"
            data-rac=""
            id="react-aria1723945980-:rea:"
          >
            <div className="flex justify-center flex-col relative">
              <p className="font-medium text-xs text-baseTextMedEmphasis">
                24H Volume (USDC)
              </p>
              <span className="mt-1 text-sm font-normal tabular-nums leading-4 text-baseTextHighEmphasis ">
                4,628,739.40
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default StockInfo