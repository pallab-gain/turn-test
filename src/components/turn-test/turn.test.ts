import SimpleRTC from "../libs/simple.rtc";

class TurnTester{
    private peer1: SimpleRTC;
    private peer2: SimpleRTC;
    private intervalId: NodeJS.Timeout;
    private readonly resultCallback: (error: string, success: string) => void;
    private readonly progressCallback: (progress: number) => void;
    private readonly testIterationCount: number;

    constructor(testTimeoutMs = 30000, resultCallback: (error: string, success: string) => void,
                progressCallback: (progress: number) => void) {
        this.testIterationCount = Math.round(testTimeoutMs / 1000);
        this.resultCallback = resultCallback;
        this.progressCallback = progressCallback;
        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.onIceConnectionStateChange = this.onIceConnectionStateChange.bind(this);
    }

    private async onIceCandidate(e: RTCPeerConnectionIceEvent, id: string): Promise<void> {
        if(id=='1') {
            await this.peer2?.setIceCandidate(e.candidate);
        } else{
            await this.peer1?.setIceCandidate(e.candidate);
        }
    }

    private async onIceConnectionStateChange(e: object, id: string): Promise<void> {
        // @ts-ignore
        if(e?.currentTarget.iceConnectionState === 'connected') {
            document.dispatchEvent(new Event('onTestSuccess'))
        } else {
            // @ts-ignore
            if(e?.currentTarget.iceConnectionState === 'failed') {
                document.dispatchEvent(new Event('onTestFailed'))
            }
        }
    }

    private async getFeedback(): Promise<string> {
        let totalCount = this.testIterationCount;
        this.intervalId = setInterval(()=> {
            totalCount -= 1;
            const completed: number = (this.testIterationCount - totalCount);
            this.progressCallback( Math.round((100.*completed)/(Math.max(1,this.testIterationCount))) );
            if(totalCount < 0) {
                document.dispatchEvent(new Event('onTestFailed'));
            }
        }, 1000);

        return new Promise((resolve, reject)=>{
            document.addEventListener('onTestSuccess', ()=> {
                //console.warn('successfully connected to the turn server');
                clearInterval(this.intervalId);
                resolve('success')
            });
            document.addEventListener('onTestFailed', ()=> {
                //console.warn('failed to connect to the turn server');
                clearInterval(this.intervalId);
                reject('failed');
            });
        });
    }

    private async testLoopbackConnection(rtcIceServer: RTCIceServer[]): Promise<void> {
        this.peer1 = new SimpleRTC('1', rtcIceServer, this.onIceCandidate, this.onIceConnectionStateChange);
        this.peer2 = new SimpleRTC('2', rtcIceServer, this.onIceCandidate, this.onIceConnectionStateChange);

        const offerSDP = await this.peer1.doOffer();
        await this.peer2.setRemoteDescription(offerSDP);
        const answerSDP = await this.peer2.doAnswer();
        await this.peer1.setRemoteDescription(answerSDP);
    }

    private async dispose(): Promise<void> {
        this.peer1?.dispose();
        this.peer2?.dispose();
        this.peer1 = undefined;
        this.peer2 = undefined;
    }

    public startTest(turnURL: string, turnUserName: string, turnPassword: string): void{
        this.getFeedback().then( _ => {
            this.resultCallback('', 'success');
            this.dispose().catch();
        }).catch( _ => {
            this.resultCallback('failed', '');
            this.dispose().catch();
        });
        const rtcIceServer: RTCIceServer[] = [{
            urls: turnURL,
            credential: turnPassword,
            username: turnUserName
        },{
            urls: "stun:stun.l.google.com:19302" 
        }] as RTCIceServer[];
        this.dispose().then( async _=>{
            try{
                await this.testLoopbackConnection(rtcIceServer);
            } catch(err){
                document.dispatchEvent(new Event('onTestFailed'));
            }
        })
    }

    private endTest(): void {
        this.dispose().catch();
        clearInterval(this.intervalId);
    }

}

export default TurnTester;
