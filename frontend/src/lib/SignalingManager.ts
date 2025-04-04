

export const BASE_URL = "ws://localhost:8080" //Add the URL 

export class SignalingManager{
    private ws:WebSocket;
    private static instance:SignalingManager;
    private  bufferedMessages: any = [];
    private callbacks : any = {};
    private id : number ;
    private initialized : boolean = false;

    private constructor(){
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new SignalingManager();

        }
        return this.instance;
    }

    init(){
        this.ws.onopen = () =>{
            this.initialized = true;
            this.bufferedMessages.forEach((msg:any) => {
                this.ws.send(JSON.stringify(msg));
            });
            this.bufferedMessages = [];
        }
        
        this.ws.onmessage = (event)=>{
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if(this.callbacks[type])
            {
                this.callbacks[type].forEach(({callback}:{callback:any})=>{
                   if(type === "ticker")
                     {
                        const newTicker:any = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.q,
                            symbol:message.data.s
                        } 
                        callback(newTicker)
                     }
                    
                })
            }
                 
        }


    }

    sendMessage(message:any){
        const messageToSend = {
            ...message,
            id:this.id++
        }
        if(!this.initialized)
             {
                this.bufferedMessages.push(messageToSend);
             }
             this.ws.send(JSON.stringify(messageToSend));
    }
    async registerCallback(type:string,callback:any,id:string){
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({callback,id});
    }

    async deRegisterCallback(type:string,id:string){
      if(this.callbacks[type]){
        const index = this.callbacks[type].findIndex((callback:any)=>callback.id === id);
        if(index !== -1){
            this.callbacks[type].splice(index,1);
      }

    }
 } 




}
