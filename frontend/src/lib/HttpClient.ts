import axios from "axios";

const BASE_URL = "https://api.binance.com/api/v3";

export async function getTicker(market:string) : Promise<any>{
    const tickers = await getTickers();
    //@ts-ignore
    const ticker = tickers.find(t => t.symbol === market);
    if(!ticker){
        throw new Error('Ticker not found');
    }
    return ticker;
} 

export async function getTickers(): Promise<any> {
    const response = await axios.get(`${BASE_URL}/tickers`);
    return response.data;
}

export async function getDepth(market: string): Promise<any> {
    const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
    return response.data;
}
export async function getKlines(market: string, interval: string,startTime:number,endTime:number): Promise<any> {
 const response = await axios.get(`${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
  const data = response.data
  return data.sort((a:any,b:any)=>Number(a.end)<Number(b.end)?-1:1);
}

 