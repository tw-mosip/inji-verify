import React, { useState } from 'react';
import { GradientScanIcon, QrIcon, WhiteScanIcon } from '../../../utils/theme-utils';
import StyledButton from "./commons/StyledButton";
import {UploadQrCode} from "./UploadQrCode";
import {useAppDispatch} from "../../../redux/hooks";
import {qrReadInit} from "../../../redux/features/verification/verification.slice";
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";
import {checkInternetStatus} from "../../../utils/misc";
import {updateInternetConnectionStatus} from "../../../redux/features/application-state/application-state.slice";
import { ScanOutline } from '../../../utils/theme-utils';

const Scan = () => {
    const dispatch = useAppDispatch();
    const [isHover, setHover] = useState(false)
    const ScanIcon = isHover? WhiteScanIcon :GradientScanIcon
    return (
        <>
            <StyledButton
                id="scan-button"
                icon={<ScanIcon /> }
                onMouseEnter={()=> setHover(true)}
                onMouseLeave={()=> setHover(false)}
                className='mx-0 my-1.5 text-center inline-flex absolute top-[160px] left-[33px] w-[205px] lg:w-[223px] lg:left-[63px] lg:top-[231px]'
                fill={false}
                onClick={async (event) => {
                    dispatch(updateInternetConnectionStatus({internetConnectionStatus: "LOADING"}))
                    let isOnline = await checkInternetStatus();
                    dispatch(updateInternetConnectionStatus({internetConnectionStatus: isOnline ? "ONLINE" : "OFFLINE"}))
                    if (isOnline) {
                        document.getElementById("trigger-scan")?.click();
                    }
                }}>
                Scan
            </StyledButton>
            <button id="trigger-scan" className="hidden" onClick={() => {dispatch(qrReadInit({method: "SCAN"}))}}/>
        </>
    )
}

const Upload = () => (
    <>
        <UploadQrCode
            className="absolute top-[160px] left-[33px] w-[205px] lg:w-[223px] lg:left-[63px] lg:top-[231px]"
            displayMessage="Upload"
        />
    </>
)

const ScanQrCode = () => {
    const method = useVerificationFlowSelector(state => state.method);
    return (
        <div
            className="flex flex-col pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
            <div className="xs:col-end-13">
                <div
                    className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto bg-cover`}
                    style={{backgroundImage: `url(${ScanOutline})`}}>
                    <div
                        className="grid bg-lighter-gradient rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center">
                    </div>
                    <div
                        className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                        <QrIcon className="w-[78px] lg:w-[100px]" />
                    </div>
                    {
                        method === "SCAN"
                            ? (<Scan/>)
                            : (<Upload/>)
                    }
                </div>
                {
                    method === "UPLOAD" && (
                        <div className="grid text-center content-center justify-center pt-2">
                            <p id="file-format-constraints" className="font-normal text-normalTextSize text-uploadDescription w-[280px]">
                                Allowed file formats: PNG/JPEG/JPG/PDF <br/>Min Size : 10KB | Max Size : 5MB
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default ScanQrCode;