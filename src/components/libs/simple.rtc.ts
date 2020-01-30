
class SimpleRTC {
    public id: string;
    public pc: RTCPeerConnection;
    public offerOption: RTCOfferOptions = {
        iceRestart: true ,
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
    } as RTCOfferOptions;
    public recvChannel: RTCDataChannel;
    public sendChannel: RTCDataChannel;
    private isRunning: boolean;
    constructor(id: string, onIceCandidate: (e: RTCPeerConnectionIceEvent, id: string) => void, onIceConnectionStateChange: (e: object, id: string) => void ){
        const iceConfig: RTCConfiguration = {
            iceTransportPolicy: "all"
        };
        this.id = id;
        this.pc = new RTCPeerConnection(iceConfig);
        this.pc.addEventListener('icecandidate', e => onIceCandidate(e, this.id));
        this.pc.addEventListener('iceconnectionstatechange', e => onIceConnectionStateChange(e, this.id) );
        if (id=='1') {
            this.sendChannel = this.pc.createDataChannel(`dc-${id}`);
            //this.sendChannel.addEventListener('open', e => console.warn('local data channel opened', e));
            //this.sendChannel.addEventListener('close', e => console.warn('local data channel closed', e));
        } else if(id=='2') {
            this.pc.addEventListener('datachannel', (e: RTCDataChannelEvent) => {
                this.recvChannel = e.channel;
                //this.recvChannel.addEventListener('open', e => console.warn('remote data channel opened', e));
                //this.recvChannel.addEventListener('close', e => console.warn('remote data channel closed', e));
            });
        }
    }
    public async setIceCandidate(iceCandidate?: RTCIceCandidate){
        if(!iceCandidate){
            return ;
        }
        await this.pc.addIceCandidate(iceCandidate)
    }
    public async doOffer(): Promise<RTCSessionDescriptionInit>{
        const sdp = await this.pc.createOffer(this.offerOption);
        await this.pc.setLocalDescription(sdp);
        return sdp;
    }
    public async doAnswer(): Promise<RTCSessionDescriptionInit>{
        const answerSDP = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answerSDP);
        return answerSDP;
    }
    public async setRemoteDescription(sdp: RTCSessionDescriptionInit): Promise<void> {
        await this.pc.setRemoteDescription(sdp);
    }
    public dispose(){
        this.pc?.close();
        this.sendChannel?.close();
        this.recvChannel?.close();

        this.pc = undefined;
        this.sendChannel = undefined;
        this.recvChannel = undefined;
    }
}

export default SimpleRTC;