
const BuyOrder = () => {
  return (
    <div className="flex flex-col gap-2">
  <div className="flex flex-col w-[332px] gap-4 rounded-lg bg-baseBackgroundL1 px-[16px] py-[16px]">
    <div className="flex flex-col gap-4">
      <div className="flex h-[48px] w-full overflow-hidden rounded-xl bg-baseBackgroundL2">
        <button className="w-full overflow-hidden rounded-xl text-sm font-semibold bg-greenBackgroundTransparent text-greenText">
          Buy
        </button>
        <button className="w-full rounded-xl text-sm font-semibold text-baseTextLowEmphasis hover:text-redText">
          Sell
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-row">
          <div className="items-center justify-start flex-row flex space-x-2">
            <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 text-sm font-medium outline-none hover:opacity-90 h-[32px] text-baseTextHighEmphasis px-3 bg-baseBackgroundL2">
              Limit
            </div>
            <div className="flex justify-center flex-col cursor-pointer rounded-lg py-1 text-sm font-medium outline-none hover:opacity-90 h-[32px] text-baseTextMedEmphasis px-3">
              Market
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col flex-1 gap-3 text-baseTextHighEmphasis">
            <div className="flex justify-between flex-row">
              <button
                type="button"
                className="cursor-help "
                data-rac=""
                id="react-aria1723945980-:rih:"
              >
                <p className="relative text-xs font-normal text-baseTextMedEmphasis">
                  Balance
                  <span className="absolute bottom-0 left-0 w-full translate-y-full border-b border-dashed border-baseBorderMed" />
                </p>
              </button>
              <p className="text-xs font-medium text-baseTextHighEmphasis">–</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between flex-row">
                <p className="text-xs font-normal text-baseTextMedEmphasis">
                  Price
                </p>
                <button
                  type="button"
                  className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-accentBlue text-xs"
                  data-rac=""
                  id="react-aria1723945980-:rje:"
                >
                  Mid
                </button>
              </div>
              <div className="flex flex-col relative">
                <input
                  placeholder={0}
                  className="undefined h-12 rounded-lg border-2 border-solid border-baseBackgroundL2 bg-baseBackgroundL2 pr-12 text-left text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0"
                  type="text"
                  defaultValue="3,231.49"
                  inputMode="numeric"
                />
                <div className="flex flex-row absolute right-1 top-1 p-2">
                  <div className="relative">
                    <img
                      alt="USDC"
                      loading="lazy"
                      width={24}
                      height={24}
                      decoding="async"
                      data-nimg={1}
                      className="rounded-full"
                      srcSet="/_next/image?url=%2Fcoins%2Fusdc.png&w=32&q=75 1x, /_next/image?url=%2Fcoins%2Fusdc.png&w=48&q=75 2x"
                      src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fusdc.png&w=48&q=75"
                      style={{ color: "transparent" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-normal text-baseTextMedEmphasis">
                Quantity
              </p>
              <div className="flex flex-col relative">
                <input
                  placeholder={0}
                  className="undefined h-12 rounded-lg border-2 border-solid border-baseBackgroundL2 bg-baseBackgroundL2 pr-12 text-left text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0"
                  type="text"
                  defaultValue=""
                  inputMode="numeric"
                />
                <div className="flex flex-row absolute right-1 top-1 p-2">
                  <div className="relative">
                    <img
                      alt="SOL"
                      loading="lazy"
                      width={24}
                      height={24}
                      decoding="async"
                      data-nimg={1}
                      className="rounded-full"
                      srcSet="/_next/image?url=%2Fcoins%2Fsol.png&w=32&q=75 1x, /_next/image?url=%2Fcoins%2Fsol.png&w=48&q=75 2x"
                      src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fsol.png&w=48&q=75"
                      style={{ color: "transparent" }}
                    />
                  </div>
                </div>
              </div>
              <div
                role="group"
                id="react-aria1723945980-:rij:"
                aria-label="Percentage Slider"
                className="mb-1 mt-4"
                data-rac=""
                data-orientation="horizontal"
              >
                <div
                  className="mx-2 h-1 cursor-pointer rounded-full bg-baseBackgroundL3 before:absolute before:-top-4 before:h-8 before:w-full before:content-['']"
                  data-rac=""
                  data-orientation="horizontal"
                  style={{ position: "relative", touchAction: "none" }}
                >
                  <div
                    className="h-full rounded-full bg-accentBlue"
                    style={{ width: "0%" }}
                  />
                  <div
                    className="top-0.5 h-2.5 w-2.5 rounded-full border-2 bg-baseBackgroundL0 border-baseBackgroundL3"
                    data-rac=""
                    data-disabled="true"
                    style={{
                      position: "absolute",
                      left: "0%",
                      transform: "translate(-50%, -50%)",
                      touchAction: "none"
                    }}
                  >
                    <div
                      style={{
                        border: 0,
                        clip: "rect(0px, 0px, 0px, 0px)",
                        clipPath: "inset(50%)",
                        height: 1,
                        margin: "-1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        width: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <input
                        id="react-aria1723945980-:rik:-1"
                        aria-labelledby="react-aria1723945980-:rij:"
                        type="range"
                        min={0}
                        step={1}
                        disabled=""
                        aria-orientation="horizontal"
                        aria-valuetext="NaN"
                        aria-describedby=""
                        aria-details=""
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div
                    className="top-0.5 h-2.5 w-2.5 rounded-full border-2 bg-baseBackgroundL0 border-baseBackgroundL3"
                    data-rac=""
                    data-disabled="true"
                    style={{
                      position: "absolute",
                      left: "25%",
                      transform: "translate(-50%, -50%)",
                      touchAction: "none"
                    }}
                  >
                    <div
                      style={{
                        border: 0,
                        clip: "rect(0px, 0px, 0px, 0px)",
                        clipPath: "inset(50%)",
                        height: 1,
                        margin: "-1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        width: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <input
                        id="react-aria1723945980-:rik:-2"
                        aria-labelledby="react-aria1723945980-:rij:"
                        type="range"
                        step={1}
                        disabled=""
                        aria-orientation="horizontal"
                        aria-valuetext="NaN"
                        aria-describedby=""
                        aria-details=""
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div
                    className="top-0.5 h-2.5 w-2.5 rounded-full border-2 bg-baseBackgroundL0 border-baseBackgroundL3"
                    data-rac=""
                    data-disabled="true"
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      touchAction: "none"
                    }}
                  >
                    <div
                      style={{
                        border: 0,
                        clip: "rect(0px, 0px, 0px, 0px)",
                        clipPath: "inset(50%)",
                        height: 1,
                        margin: "-1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        width: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <input
                        id="react-aria1723945980-:rik:-3"
                        aria-labelledby="react-aria1723945980-:rij:"
                        type="range"
                        step={1}
                        disabled=""
                        aria-orientation="horizontal"
                        aria-valuetext="NaN"
                        aria-describedby=""
                        aria-details=""
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div
                    className="top-0.5 h-2.5 w-2.5 rounded-full border-2 bg-baseBackgroundL0 border-baseBackgroundL3"
                    data-rac=""
                    data-disabled="true"
                    style={{
                      position: "absolute",
                      left: "75%",
                      transform: "translate(-50%, -50%)",
                      touchAction: "none"
                    }}
                  >
                    <div
                      style={{
                        border: 0,
                        clip: "rect(0px, 0px, 0px, 0px)",
                        clipPath: "inset(50%)",
                        height: 1,
                        margin: "-1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        width: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <input
                        id="react-aria1723945980-:rik:-4"
                        aria-labelledby="react-aria1723945980-:rij:"
                        type="range"
                        step={1}
                        disabled=""
                        aria-orientation="horizontal"
                        aria-valuetext="NaN"
                        aria-describedby=""
                        aria-details=""
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div
                    className="top-0.5 h-2.5 w-2.5 rounded-full border-2 bg-baseBackgroundL0 border-baseBackgroundL3"
                    data-rac=""
                    data-disabled="true"
                    style={{
                      position: "absolute",
                      left: "100%",
                      transform: "translate(-50%, -50%)",
                      touchAction: "none"
                    }}
                  >
                    <div
                      style={{
                        border: 0,
                        clip: "rect(0px, 0px, 0px, 0px)",
                        clipPath: "inset(50%)",
                        height: 1,
                        margin: "-1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        width: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <input
                        id="react-aria1723945980-:rik:-5"
                        aria-labelledby="react-aria1723945980-:rij:"
                        type="range"
                        step={1}
                        disabled=""
                        aria-orientation="horizontal"
                        aria-valuetext="NaN"
                        aria-describedby=""
                        aria-details=""
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div
                    className="top-0.5 h-3.5 w-3.5 cursor-grab rounded-full bg-accentBlue"
                    data-rac=""
                    style={{
                      position: "absolute",
                      left: "0%",
                      transform: "translate(-50%, -50%)",
                      touchAction: "none"
                    }}
                  >
                    <div
                      style={{
                        border: 0,
                        clip: "rect(0px, 0px, 0px, 0px)",
                        clipPath: "inset(50%)",
                        height: 1,
                        margin: "-1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        width: 1,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <input
                        tabIndex={0}
                        id="react-aria1723945980-:rik:-0"
                        aria-labelledby="react-aria1723945980-:rij:"
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        aria-orientation="horizontal"
                        aria-valuetext={0}
                        aria-describedby=""
                        aria-details=""
                        defaultValue={0}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between flex-row mt-2">
                  <p className="font-normal text-baseTextMedEmphasis pl-1 text-xs">
                    0
                  </p>
                  <p className="font-normal text-baseTextMedEmphasis text-xs">
                    100%
                  </p>
                </div>
              </div>
              <p className="text-xs font-normal text-baseTextMedEmphasis">
                Order Value
              </p>
              <div className="flex flex-col relative">
                <input
                  placeholder={0}
                  className="undefined h-12 rounded-lg border-2 border-solid border-baseBackgroundL2 bg-baseBackgroundL2 pr-12 text-left text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0"
                  type="text"
                  defaultValue=""
                  inputMode="numeric"
                />
                <div className="flex flex-row absolute right-1 top-1 p-2">
                  <div className="relative">
                    <img
                      alt="USDC"
                      loading="lazy"
                      width={24}
                      height={24}
                      decoding="async"
                      data-nimg={1}
                      className="rounded-full"
                      srcSet="/_next/image?url=%2Fcoins%2Fusdc.png&w=32&q=75 1x, /_next/image?url=%2Fcoins%2Fusdc.png&w=48&q=75 2x"
                      src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fusdc.png&w=48&q=75"
                      style={{ color: "transparent" }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div />
            <div className="flex flex-col pb-2">
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  className="text-center font-semibold focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 text-buttonPrimaryText bg-buttonPrimaryBackground h-12 rounded-xl text-base px-4 py-2"
                  data-rac=""
                  id="react-aria1723945980-:rp4:"
                >
                  <div className="flex flex-row items-center justify-center gap-2">
                    Sign up to trade
                  </div>
                </button>
                <button
                  type="button"
                  className="text-center font-semibold focus:ring-blue-200 focus:none focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 text-buttonSecondaryText bg-buttonSecondaryBackground h-12 rounded-xl text-base px-4 py-2"
                  data-rac=""
                  id="react-aria1723945980-:rp6:"
                >
                  <div className="flex flex-row items-center justify-center gap-2">
                    Sign in to trade
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex items-center flex-row">
                <input
                  className="form-checkbox rounded border-2 border-baseBorderMed bg-base-950 text-transparent shadow-transparent outline-none ring-0 ring-transparent checked:border-baseBorderMed checked:bg-base-900 checked:hover:border-baseBorderMed focus:bg-base-900 focus:ring-0 focus:ring-offset-0 focus:checked:border-baseBorderMed h-5 w-5 cursor-pointer"
                  type="checkbox"
                  id="postOnly"
                />
                <button
                  type="button"
                  className="cursor-help flex"
                  data-rac=""
                  id="react-aria1723945980-:rj9:"
                >
                  <label
                    className="font-medium text-baseTextMedEmphasis select-none text-xs pl-2 cursor-help"
                    htmlFor="postOnly"
                  >
                    Post Only
                  </label>
                </button>
              </div>
              <div className="flex items-center flex-row">
                <input
                  className="form-checkbox rounded border-2 border-baseBorderMed bg-base-950 text-transparent shadow-transparent outline-none ring-0 ring-transparent checked:border-baseBorderMed checked:bg-base-900 checked:hover:border-baseBorderMed focus:bg-base-900 focus:ring-0 focus:ring-offset-0 focus:checked:border-baseBorderMed h-5 w-5 cursor-pointer"
                  type="checkbox"
                  id="ioc"
                />
                <button
                  type="button"
                  className="cursor-help flex"
                  data-rac=""
                  id="react-aria1723945980-:rjc:"
                >
                  <label
                    className="font-medium text-baseTextMedEmphasis select-none text-xs pl-2 cursor-help"
                    htmlFor="ioc"
                  >
                    IOC
                  </label>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="flex flex-1" />
</div>

  )
}

export default BuyOrder