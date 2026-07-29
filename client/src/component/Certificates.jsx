import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import { media } from '../config/media'
import { FaLock } from "react-icons/fa";
import { API_BASE } from '../config';

const Certificates = () => {


    const token = localStorage.getItem("token");

    const generateCertificate = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/certificate/generateCertificate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
            })
            const data = await response.json();
            console.log(data);
        } catch (error) {

        }
    }
    const [mycertificates, setMyCertificate] = useState([]);
    const myCertificates = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/certificate/myCertificate`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
            })
            const data = await response.json();
            console.log(data.certificate[0].certificateImage);
            if (data.success) {
                setMyCertificate(data.certificate)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        myCertificates();
    }, [token])



    return (
        <>
            {/* {!localStorage.getItem("token") &&
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", width: "100%", backgroundColor: "#121413", color: "white" }} >Please Sign in To access Certificates
                    <div>
                        <Link className='text-red-500 hover:text-blue-500' to='/signin' >&nbsp;&nbsp;&nbsp;Click Here To Sign In</Link>
                    </div></div>} */}
            {!localStorage.getItem("token") && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        flexDirection: "column",
                        textAlign: "center",
                        fontSize: "24px",
                    }}
                >
                    {/* Background with blurred effect */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${media.back1})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(18px)",
                            zIndex: -1,
                        }}
                    ></div>

                    {/* Dimmed overlay */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
                            zIndex: 0,
                        }}
                    ></div>

                    {/* Content shown when user is not signed in */}
                    <div style={{ zIndex: 1 ,display: "flex",justifyContent: "center",flexDirection: "column",alignItems: "center"}}>
                        <span className='text-center my-2'><FaLock size={40} color='yellow' className='text-center'/></span>
                        <p>Please Sign in To access Certificates</p>
                        <Link className="text-red-500 hover:text-blue-500" to="/signin">
                            &nbsp;&nbsp;&nbsp;Click Here To Sign In
                        </Link>
                    </div>
                </div>
            )}
            {localStorage.getItem("token") &&
                <div style={{ backgroundColor: "rgb(13 15 15)" }}>
                    <div className='certificateContainer' >
                        {mycertificates.length === 0 ? (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", width: "100%", backgroundColor: "#121413", color: "white" }}>No Certificates have been issued</div>) : (
                            mycertificates.map((certificate) => {
                                return (
                                    <div key={certificate._id} className='certificateBox'>
                                        <div className='certificateImg'>
                                            <img src={certificate.certificateImage} alt="" />
                                        </div>
                                        <div className='certificateDetails'>
                                            <a download={certificate.certificateImage} className="flex cursor-pointer justify-center mx-auto mt-16 text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-500 rounded text-lg"><span className='text-center'>Click To Download</span></a>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    <button onClick={generateCertificate} className="flex justify-center mx-auto mt-16 text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-500 rounded text-lg"><span className='text-center'>Click To Generate Certificate</span></button>
                </div>}
        </>
    )
}

export default Certificates
