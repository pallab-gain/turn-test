import * as React from 'react';
import SimpleRTC from "../libs/simple.rtc";

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

const TurnTest = () => {
    let peer1: SimpleRTC;
    let peer2: SimpleRTC;
    let intervalId: NodeJS.Timeout;
    const onIceCandidate = async (e: RTCPeerConnectionIceEvent, id: string) => {
        console.warn('on ice candidate', id, e);
        if(id=='1') {
            await peer2?.setIceCandidate(e.candidate);
        } else{
            await peer1?.setIceCandidate(e.candidate);
        }
    };

    const onIceConnectionStateChange = async (e: object, id: string) => {
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

    const getFeedback = async ()=> {
        return new Promise((resolve, reject)=>{
            let totalCount = 30;
            intervalId = setInterval(()=> {
                console.warn('running test', totalCount);
                totalCount -= 1;
                if(totalCount < 0) {
                    document.dispatchEvent(new Event('onTestFailed'));
                }
            }, 1000);
            document.addEventListener('onTestSuccess', ()=> {
                //console.warn('successfully connected to the turn server');
                clearInterval(intervalId);
                resolve('success')
            });
            document.addEventListener('onTestSuccess', ()=> {
                //console.warn('failed to connect to the turn server');
                clearInterval(intervalId);
                reject('failed');
            });
        });
    }

    const testLoopbackConnection = async ()=> {
        peer1 = new SimpleRTC('1', onIceCandidate, onIceConnectionStateChange);
        peer2 = new SimpleRTC('2', onIceCandidate, onIceConnectionStateChange);

        const offerSDP = await peer1.doOffer();
        await peer2.setRemoteDescription(offerSDP);
        const answerSDP = await peer2.doAnswer();
        await peer1.setRemoteDescription(answerSDP);
    };

    const dispose = async () => {
        peer1?.dispose();
        peer2?.dispose();
        peer1 = undefined;
        peer2 = undefined;
    }

    const startTest = () => {
        getFeedback().then( _ => {
            console.warn('successfully connected to the turn server');
            dispose().catch();
        }).catch( _ => {
            console.warn('failed to connect to the turn server');
            dispose().catch();
        });
        dispose().then( async _=>{
            try{
                await testLoopbackConnection();
            } catch(err){
                document.dispatchEvent(new Event('onTestFailed'));
            }
        })
    }
    const endTest = ()=> {
        dispose().catch();
        clearInterval(intervalId);
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="sm">
                <Button variant="contained" onClick={()=> startTest()}>Start Test</Button>
                <Button variant="contained" onClick={()=> endTest()}>End Test</Button>
            </Container>
        </React.Fragment>
    );
}

export default TurnTest;
