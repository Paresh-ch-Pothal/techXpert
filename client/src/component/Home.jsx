// import React from 'react'
// import { Link } from 'react-router-dom'
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { EffectCoverflow, Pagination } from 'swiper/modules';
// import { FaCloudUploadAlt } from "react-icons/fa";
// import { MdOutlineConnectWithoutContact } from "react-icons/md";
// import { MdOutlineVpnKey } from "react-icons/md";
// import { FaSearch } from "react-icons/fa";
// import { GiProgression } from "react-icons/gi";
// import { MdOutlineBiotech } from "react-icons/md";
// import { media } from '../config/media'
// import animation1 from '../public/animation1.json'
// import animation2 from '../public/animation2.json'
// import animation3 from '../public/animation3.json'
// import animation4 from '../public/animation4.json'
// import animation5 from '../public/animation5.json'
// import animation6 from '../public/animation6.json'
// import animation7 from '../public/animation7.json'
// import Lottie from 'lottie-react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';

// const Home = () => {
//     return (

//         <div>
//             <div></div>

//             <div>

//                 <section className="text-gray-400 body-font" style={{ background: "linear-gradient(135deg, rgb(11 10 10), rgb(30 31 37), rgb(19 23 25), rgb(16 16 19), rgb(35 26 26))" }}>

//                     <div className="container px-5 py-24 mx-auto">
//                         <h1 style={{
//                             fontFamily: 'Noto Sans Devanagari', fontSize: "60px", textAlign: "center", background: "linear-gradient(98deg, #0ac12b, #5c3933, #200107)",
//                             WebkitBackgroundClip: "text",
//                             color: "transparent"
//                         }}>"ज्ञानं परमं बलम्।।"</h1>
//                         <div style={{textAlign:"center",color:"#3b809a"}}>Knowledge is supreme power.</div>

//                         {/* <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
//                             <img src={media.logoHome} alt="" style={{ height: "25vh", width: "13vw" }} />
//                             <h1 className="sm:text-3xl text-2xl font-medium title-font text-white mb-4" style={{ fontSize: "50px" }}>TechXpert</h1>
//                             <p className="lg:w-1/2 w-full leading-relaxed text-opacity-80 text-red-500 mb-4" style={{ fontSize: "20px" }}>"Empowering minds, one line of code at a time."</p>
//                             <p className="lg:w-1/2 w-full leading-relaxed text-opacity-80">TechXpert is an innovative platform designed for developers and learners to sharpen their programming skills through challenges, tutorials, and resources. From coding exercises to real-world projects, it caters to everyone from beginners to experts. With a community-driven approach, TechXpert aims to inspire collaboration, growth, and excellence in the tech world.</p>
//                         </div> */}
//                         <div className="container mx-auto flex px-10 py-24 md:flex-row flex-col items-center">
//                             <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
//                                 <h1 className="title-font mb-4 font-medium text-white" style={{ fontSize: "4.5rem" }}>TechXpert
//                                 </h1>
//                                 <p className="mb-8 leading-relaxed">TechXpert is an innovative platform designed for developers and learners to sharpen their programming skills through challenges, tutorials, and resources. From coding exercises to real-world projects, it caters to everyone from beginners to experts. With a community-driven approach, TechXpert aims to inspire collaboration, growth, and excellence in the tech world.</p>
//                                 <div className="flex justify-center">
//                                     <button className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg">Lets Started</button>
//                                     <button className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg">About Us</button>
//                                 </div>
//                             </div>
//                             <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
//                                 <Lottie
//                                     animationData={animation1}
//                                     loop={true}
//                                     style={{ width: 400, height: 400 }}
//                                 />
//                             </div>
//                         </div>



//                         <div className="flex flex-wrap -m-4">
//                             {/* <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                     <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                         <MdOutlineConnectWithoutContact size={25} />
//                                     </div>
//                                     <h2 className="text-lg text-white font-medium title-font mb-2">Bridging Needs with Opportunities</h2>
//                                     <p className="leading-relaxed text-base">TechXpert connects passionate learners with dedicated teachers, creating a platform where knowledge meets curiosity</p>
//                                 </div>
//                             </div> */}
//                             {/* <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                     <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                         <MdOutlineVpnKey size={25} />
//                                     </div>
//                                     <h2 className="text-lg text-white font-medium title-font mb-2">Seamless and Secure Access</h2>
//                                     <p className="leading-relaxed text-base">TechXpert ensures an effortless and secure authentication process, allowing users to focus on learning and teaching without any worries about their data's safety.</p>
//                                 </div>
//                             </div> */}
//                             {/* <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                     <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                         <FaSearch size={25} />
//                                     </div>
//                                     <h2 className="text-lg text-white font-medium title-font mb-2">Quick and Efficient Searches</h2>
//                                     <p className="leading-relaxed text-base">TechXpert offers lightning-fast search capabilities, helping users find the resources or connections they need in an instant, saving time and boosting productivity.</p>
//                                 </div>
//                             </div> */}
//                             {/* <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                     <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                         <MdOutlineBiotech size={25} />
//                                     </div>
//                                     <h2 className="text-lg text-white font-medium title-font mb-2">Diverse Tech Learning Opportunities</h2>
//                                     <p className="leading-relaxed text-base">TechXpert provides a wide range of tech-related courses, catering to various interests and skill levels, ensuring something valuable for every aspiring learner and professional.</p>
//                                 </div>
//                             </div> */}
//                             {/* <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                     <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                         <GiProgression size={25} />
//                                     </div>
//                                     <h2 className="text-lg text-white font-medium title-font mb-2">Track Your Daily Progress</h2>
//                                     <p className="leading-relaxed text-base">TechXpert offers a daily progress completion card, helping learners stay motivated and organized by tracking their achievements and milestones throughout their learning journey.</p>
//                                 </div>
//                             </div> */}

//                             <div className="xl:w-1/2 md:w-1/2 p-4 h-28">
//                                 <div className="p-6 rounded-lg flex" style={{ backgroundColor: "rgb(30 31 37)" }}>
//                                     <div className='flex justify-center flex-col'>
//                                         <div ><h2 className="text-lg text-white title-font mb-2" style={{ fontSize: "1.8rem" }}>Bridging Needs with Opportunities</h2></div>
//                                         <p className="leading-relaxed text-base">TechXpert connects passionate learners with dedicated teachers, creating a platform where knowledge meets curiosity</p>
//                                         <Link to={"/uploadvideo"} className="my-4 text-black bg-white border-0 focus:outline-none hover:bg-gray-900 hover:text-white  text-center" style={{ borderRadius: "20px", padding: "9px" }}>Read More</Link>
//                                     </div>
//                                     <div className='flex flex-row justify-between'>
//                                         {/* <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                             <FaCloudUploadAlt size={25} />
//                                         </div> */}
//                                         <div>
//                                             <Lottie
//                                                 animationData={animation3}
//                                                 loop={true}
//                                                 style={{ width: 350, height: 350 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className="p-6 rounded-lg flex " style={{ backgroundColor: "rgb(19 23 25)" }}>
//                                     <div className='flex justify-center flex-col'>
//                                         <div ><h2 className="text-lg text-white title-font mb-2" style={{ fontSize: "1.8rem" }}>Seamless and Secure Access</h2></div>
//                                         <p className="leading-relaxed text-base">TechXpert ensures an effortless and secure authentication process, allowing users to focus on learning and teaching without any worries about their data's safety.</p>
//                                         <Link to={"/uploadvideo"} className="my-4 text-black bg-white border-0 focus:outline-none hover:bg-gray-900 hover:text-white  text-center" style={{ borderRadius: "20px", padding: "9px" }}>Read More</Link>
//                                     </div>
//                                     <div className='flex flex-row justify-between'>
//                                         {/* <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                             <FaCloudUploadAlt size={25} />
//                                         </div> */}
//                                         <div>
//                                             <Lottie
//                                                 animationData={animation4}
//                                                 loop={true}
//                                                 style={{ width: 400, height: 400 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className=" p-6 rounded-lg flex " style={{ backgroundColor: "rgb(19 23 25)" }}>
//                                     <div className='flex justify-center flex-col'>
//                                         <div ><h2 className="text-lg text-white title-font mb-2" style={{ fontSize: "1.8rem" }}>Quick and Efficient Searches</h2></div>
//                                         <p className="leading-relaxed text-base">TechXpert offers lightning-fast search capabilities, helping users find the resources or connections they need in an instant, saving time and boosting productivity.</p>
//                                         <Link to={"/uploadvideo"} className="my-4 text-black bg-white border-0 focus:outline-none hover:bg-gray-900 hover:text-white  text-center" style={{ borderRadius: "20px", padding: "9px" }}>Read More</Link>
//                                     </div>
//                                     <div className='flex flex-row justify-between'>
//                                         {/* <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                             <FaCloudUploadAlt size={25} />
//                                         </div> */}
//                                         <div>
//                                             <Lottie
//                                                 animationData={animation5}
//                                                 loop={true}
//                                                 style={{ width: 400, height: 400 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className=" p-6 rounded-lg flex " style={{ backgroundColor: "rgb(19 23 25)" }}>
//                                     <div className='flex justify-center flex-col'>
//                                         <div ><h2 className="text-lg text-white title-font mb-2" style={{ fontSize: "1.8rem" }}>Diverse Tech Learning Opportunities</h2></div>
//                                         <p className="leading-relaxed text-base">TechXpert provides a wide range of tech-related courses, catering to various interests and skill levels, ensuring something valuable for every aspiring learner and professional.</p>
//                                         <Link to={"/uploadvideo"} className="my-4 text-black bg-white border-0 focus:outline-none hover:bg-gray-900 hover:text-white  text-center" style={{ borderRadius: "20px", padding: "9px" }}>Read More</Link>
//                                     </div>
//                                     <div className='flex flex-row justify-between'>
//                                         {/* <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                             <FaCloudUploadAlt size={25} />
//                                         </div> */}
//                                         <div>
//                                             <Lottie
//                                                 animationData={animation6}
//                                                 loop={true}
//                                                 style={{ width: 400, height: 400 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className=" p-6 rounded-lg flex" style={{ backgroundColor: "rgb(16 16 19)" }}>
//                                     <div className='flex justify-center flex-col'>
//                                         <div ><h2 className="text-lg text-white title-font mb-2" style={{ fontSize: "1.8rem" }}>Track Your Daily Progress</h2></div>
//                                         <p className="leading-relaxed text-base">TechXpert offers a daily progress completion card, helping learners stay motivated and organized by tracking their achievements and milestones throughout their learning journey.</p>
//                                         <Link to={"/uploadvideo"} className="my-4 text-black bg-white border-0 focus:outline-none hover:bg-gray-900 hover:text-white  text-center" style={{ borderRadius: "20px", padding: "9px" }}>Read More</Link>
//                                     </div>
//                                     <div className='flex flex-row justify-between'>
//                                         {/* <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                             <FaCloudUploadAlt size={25} />
//                                         </div> */}
//                                         <div>
//                                             <Lottie
//                                                 animationData={animation7}
//                                                 loop={true}
//                                                 style={{ width: 400, height: 400 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="xl:w-1/2 md:w-1/2 p-4">
//                                 <div className=" p-6 rounded-lg flex" style={{ backgroundColor: "rgb(26 22 22 1)" }}>
//                                     <div className='flex justify-center flex-col'>
//                                         <div ><h2 className="text-lg text-white title-font mb-2" style={{ fontSize: "1.8rem" }}>Upload Videos</h2></div>
//                                         <p className="leading-relaxed text-base">TechXpert makes it simple to upload your videos, allowing educators and learners to share valuable content effortlessly.
//                                             Click here to upload your videos and get started!</p>
//                                         <Link to={"/uploadvideo"} className="my-4 text-black bg-white border-0 focus:outline-none hover:bg-gray-900 hover:text-white  text-center" style={{ borderRadius: "20px", padding: "9px" }}>Read More</Link>
//                                     </div>
//                                     <div className='flex flex-row justify-between'>
//                                         {/* <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                             <FaCloudUploadAlt size={25} />
//                                         </div> */}
//                                         <div>
//                                             <Lottie
//                                                 animationData={animation2}
//                                                 loop={true}
//                                                 style={{ width: 400, height: 400 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>



//                         </div>

//                         <Link to='/signin' className="flex justify-center mx-auto mt-16 text-black bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-white rounded text-lg"><span className='text-center'>Get Started!</span></Link>
//                     </div>
//                 </section>
//                 {/* <Swiper
//                     effect={'coverflow'}
//                     grabCursor={true}
//                     centeredSlides={true}
//                     slidesPerView={'auto'}
//                     coverflowEffect={{
//                         rotate: 50,
//                         stretch: 0,
//                         depth: 100,
//                         modifier: 1,
//                         slideShadows: true,
//                     }}
//                     pagination={true}
//                     modules={[EffectCoverflow, Pagination]}
//                     className="mySwiper"
//                 >
//                     <div className='swipper'>
//                     <SwiperSlide>
//                         <div className="xl:w-1/3 md:w-1/2 p-4">
//                             <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                 <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                     <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
//                                         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
//                                     </svg>
//                                 </div>
//                                 <Link to={"/uploadvideo"}><h2 className="text-lg text-white font-medium title-font mb-2">Upload Videos</h2></Link>
//                                 <p className="leading-relaxed text-base">Become a Educator and Start Teaching</p>
//                             </div>
//                         </div>
//                     </SwiperSlide>
//                     <SwiperSlide>
//                         <div className="xl:w-1/3 md:w-1/2 p-4">
//                             <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                 <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                     <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
//                                         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
//                                     </svg>
//                                 </div>
//                                 <Link to={"/uploadvideo"}><h2 className="text-lg text-white font-medium title-font mb-2">Upload Videos</h2></Link>
//                                 <p className="leading-relaxed text-base">Become a Educator and Start Teaching</p>
//                             </div>
//                         </div>
//                     </SwiperSlide>
//                     <SwiperSlide>
//                         <div className="xl:w-1/3 md:w-1/2 p-4">
//                             <div className="border border-gray-700 border-opacity-75 p-6 rounded-lg">
//                                 <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-gray-800 text-green-400 mb-4">
//                                     <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
//                                         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
//                                     </svg>
//                                 </div>
//                                 <Link to={"/uploadvideo"}><h2 className="text-lg text-white font-medium title-font mb-2">Upload Videos</h2></Link>
//                                 <p className="leading-relaxed text-base">Become a Educator and Start Teaching</p>
//                             </div>
//                         </div>
//                     </SwiperSlide>
//                     </div>
//                 </Swiper> */}
//             </div >
//         </div >
//     )
// }

// export default Home


import React from 'react'
import { Link } from 'react-router-dom'
import animation1 from '../public/animation1.json'
import animation2 from '../public/animation2.json'
import animation3 from '../public/animation3.json'
import animation4 from '../public/animation4.json'
import animation5 from '../public/animation5.json'
import animation6 from '../public/animation6.json'
import animation7 from '../public/animation7.json'
import Lottie from 'lottie-react'

/**
 * NOTE: add this to your index.html <head> for the fonts to load:
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
 */

const steps = [
    {
        number: "01",
        title: "Watch or upload",
        text: "Learners pick a path and start a course. Teachers upload a video and TechXpert handles the rest.",
    },
    {
        number: "02",
        title: "Practice for real",
        text: "Work through lessons, exercises and projects at your own pace — no locked schedules.",
    },
    {
        number: "03",
        title: "Earn your certificate",
        text: "Finish the course and your certificate is issued and verified automatically. No waiting on anyone.",
    },
]

const features = [
    {
        title: "Bridging needs with opportunities",
        text: "TechXpert connects passionate learners with dedicated teachers, creating a platform where knowledge meets curiosity.",
        animation: animation3,
    },
    {
        title: "Seamless and secure access",
        text: "An effortless, secure sign-in so you can focus on learning and teaching without worrying about your data.",
        animation: animation4,
    },
    {
        title: "Quick and efficient search",
        text: "Lightning-fast search helps you find the exact course or lesson you need in seconds.",
        animation: animation5,
    },
    {
        title: "Diverse tech learning tracks",
        text: "A wide range of tech courses across every interest and skill level, from first line of code to production systems.",
        animation: animation6,
    },
    {
        title: "Track your daily progress",
        text: "A daily progress card keeps you motivated and organized, tracking every milestone along the way.",
        animation: animation7,
    },
    {
        title: "Upload in minutes",
        text: "Recording beats writing. Upload a video and TechXpert turns it into a structured course automatically.",
        animation: animation2,
    },
]

const teacherPoints = [
    "Upload a video — no editing suite or slide deck required",
    "Captions, chapters and quizzes are generated automatically",
    "Certificates are issued to your students the moment they finish",
    "You keep teaching; TechXpert handles hosting and grading",
]

// Same seal mark used in the navbar, kept local so this file has no
// cross-file dependency. Reused here on the certificate mock for continuity.
const SealMark = ({ size = 34 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#101827" />
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="#C6741B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="20" y="25" textAnchor="middle" fontFamily="'Fraunces', serif" fontWeight="600" fontSize="13" fill="#FAF6EF">TX</text>
        <circle cx="31.5" cy="30.5" r="2.1" fill="#C6741B" />
    </svg>
)

const Home = () => {
    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-[#FFFEFB]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

                .txp-wordmark { font-family: 'Fraunces', serif; }
                .txp-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

                .txp-card {
                    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
                }
                .txp-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 32px -14px rgba(16, 24, 39, 0.16);
                    border-color: #C6741B;
                }

                .txp-btn-fill {
                    background: #C6741B;
                    border: 1.5px solid #C6741B;
                    transition: background-color 180ms ease, border-color 180ms ease, transform 150ms ease;
                }
                .txp-btn-fill:hover { background: #A15E13; border-color: #A15E13; transform: translateY(-1px); }

                .txp-btn-outline {
                    border: 1.5px solid #101827;
                    transition: background-color 180ms ease, color 180ms ease;
                }
                .txp-btn-outline:hover { background: #101827; color: #FFFEFB; }

                .txp-btn-outline-light {
                    border: 1.5px solid rgba(255, 254, 251, 0.35);
                    transition: background-color 180ms ease, border-color 180ms ease;
                }
                .txp-btn-outline-light:hover { background: rgba(255, 254, 251, 0.08); border-color: rgba(255, 254, 251, 0.7); }

                .txp-cert-card {
                    animation: txp-float 6s ease-in-out infinite;
                }
                @keyframes txp-float {
                    0%, 100% { transform: rotate(-2.5deg) translateY(0); }
                    50% { transform: rotate(-2.5deg) translateY(-10px); }
                }

                .txp-step-line {
                    background-image: linear-gradient(to right, #D8D2C4 0 8px, transparent 8px 16px);
                    background-size: 16px 1.5px;
                    background-repeat: repeat-x;
                    background-position: center;
                }

                .txp-pipe-chip { transition: border-color 200ms ease, transform 200ms ease; }
                .txp-pipe-chip:hover { border-color: #C6741B; transform: translateY(-2px); }

                @media (prefers-reduced-motion: reduce) {
                    .txp-cert-card { animation: none; }
                    .txp-card, .txp-btn-fill, .txp-btn-outline, .txp-btn-outline-light, .txp-pipe-chip {
                        transition: none;
                    }
                }
            `}</style>

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-[#E8E4DA]">
                <div
                    aria-hidden="true"
                    className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-60"
                    style={{ background: "radial-gradient(circle, #FBF0DF 0%, rgba(251,240,223,0) 70%)" }}
                />
                <div className="relative container max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="txp-mono inline-flex items-center gap-2 text-[#A15E13] text-[11px] uppercase px-3 py-1.5 rounded-full border border-[#EAD3AE] bg-[#FBF0DF] mb-7">
                                Learn free &middot; Teach anyone &middot; Get certified
                            </div>

                            <h1 className="txp-wordmark text-[#101827] font-semibold text-4xl sm:text-5xl leading-[1.12] mb-6">
                                Skills you can prove, not just claim.
                            </h1>

                            <p className="text-[#5B6472] text-lg leading-relaxed mb-8 max-w-lg">
                                TechXpert is a two-sided classroom: anyone can teach by uploading
                                a video, anyone can learn from it, and every finished course ends
                                in a certificate — issued and verified automatically, no staff
                                involved.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-10">
                                <Link
                                    to="/course"
                                    className="txp-btn-fill inline-flex items-center justify-center text-[#FFFEFB] py-3 px-8 rounded-lg text-base font-semibold"
                                >
                                    Start learning
                                </Link>
                                <div
                                    className="txp-btn-outline inline-flex items-center justify-center text-[#101827] bg-transparent py-3 px-8 rounded-lg text-base font-semibold"
                                >
                                    Start teaching
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-8 gap-y-3">
                                {["Self-paced", "No sign-up fee", "Verified certificates"].map((h) => (
                                    <div key={h} className="flex items-center gap-2 text-sm text-[#334155] font-medium">
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                            <circle cx="10" cy="10" r="10" fill="#2F6F4E" />
                                            <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {h}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex justify-center md:justify-end">
                            <div
                                className="txp-cert-card relative bg-[#FFFEFB] border border-[#E8E4DA] rounded-2xl p-7 w-full max-w-sm"
                                style={{ boxShadow: "0 24px 50px -20px rgba(16, 24, 39, 0.25)" }}
                            >
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-3 rounded-xl pointer-events-none"
                                    style={{ border: "1px solid #EAD3AE" }}
                                />
                                <div className="relative flex items-start justify-between mb-6">
                                    <div>
                                        <p className="txp-mono text-[10px] text-[#A15E13] uppercase mb-1">Certificate of completion</p>
                                        <p className="txp-wordmark text-[#101827] text-lg font-semibold">TechXpert</p>
                                    </div>
                                    <SealMark />
                                </div>
                                <p className="text-xs text-[#5B6472] mb-1">This certifies that</p>
                                <p className="txp-wordmark text-[#101827] text-2xl mb-4">Asha Verma</p>
                                <p className="text-xs text-[#5B6472] mb-1">has completed</p>
                                <p className="text-[#101827] font-semibold mb-6">Full-Stack Web Development</p>
                                <div className="flex items-end justify-between pt-4 border-t border-dashed border-[#E8E4DA]">
                                    <div>
                                        <div className="w-24 border-b border-[#101827] mb-1" />
                                        <p className="txp-mono text-[9px] text-[#94918A] uppercase">Instructor signature</p>
                                    </div>
                                    <p className="txp-mono text-[9px] text-[#94918A] uppercase">No. TXP-2026-0482</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="container max-w-6xl mx-auto px-6 py-20 md:py-24">
                <div className="max-w-xl mb-14">
                    <span className="txp-mono text-[#A15E13] text-xs uppercase">How it works</span>
                    <h2 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3">
                        From first video to verified certificate
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 relative">
                    {steps.map((step, i) => (
                        <div key={step.number} className="relative">
                            {i < steps.length - 1 && (
                                <div className="txp-step-line hidden md:block absolute top-6 left-[calc(100%-1.25rem)] w-[calc(100%-1.5rem)] h-[1.5px]" />
                            )}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-12 h-12 rounded-full bg-[#101827] text-[#FBF0DF] flex items-center justify-center txp-mono text-sm">
                                    {step.number}
                                </span>
                            </div>
                            <h3 className="txp-wordmark text-[#101827] font-semibold text-xl mb-2">{step.title}</h3>
                            <p className="text-[#5B6472] text-[15px] leading-relaxed">{step.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="bg-[#FBF7EF] border-y border-[#E8E4DA]">
                <div className="container max-w-6xl mx-auto px-6 py-20 md:py-24">
                    <div className="max-w-2xl mb-14">
                        <span className="txp-mono text-[#A15E13] text-xs uppercase">Why TechXpert</span>
                        <h2 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-4">
                            Everything you need to learn and teach tech
                        </h2>
                        <p className="text-[#5B6472] text-base leading-relaxed">
                            From your first login to your next milestone, TechXpert keeps
                            learners and educators moving forward.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="txp-card bg-white border border-[#E8E4DA] rounded-2xl p-6 flex flex-col"
                            >
                                <div className="w-16 h-16 rounded-xl bg-[#FBF0DF] flex items-center justify-center mb-5 -ml-1">
                                    <Lottie animationData={feature.animation} loop={true} style={{ width: 48, height: 48 }} />
                                </div>
                                <h3 className="txp-wordmark text-[#101827] font-semibold mb-2 text-lg leading-snug">
                                    {feature.title}
                                </h3>
                                <p className="leading-relaxed text-[#5B6472] text-[15px] mb-5 flex-1">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Built for teachers too */}
            <section className="container max-w-6xl mx-auto px-6 py-20 md:py-24">
                <div className="grid md:grid-cols-2 gap-14 items-center">
                    <div>
                        <span className="txp-mono text-[#A15E13] text-xs uppercase">For educators</span>
                        <h2 className="txp-wordmark text-[#101827] font-semibold text-3xl sm:text-4xl mt-3 mb-5">
                            Anyone who can teach, can teach here
                        </h2>
                        <p className="text-[#5B6472] text-base leading-relaxed mb-7 max-w-lg">
                            You don't need a production studio or a grading team. Upload a
                            video and TechXpert automates the rest — from structuring the
                            course to issuing your students' certificates.
                        </p>
                        <ul className="flex flex-col gap-3 mb-8">
                            {teacherPoints.map((point) => (
                                <li key={point} className="flex items-start gap-3 text-[#334155] text-[15px]">
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0">
                                        <circle cx="10" cy="10" r="10" fill="#2F6F4E" />
                                        <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {point}
                                </li>
                            ))}
                        </ul>
                        <Link
                            to="/uploadvideo"
                            className="txp-btn-fill inline-flex items-center justify-center text-[#FFFEFB] py-3 px-8 rounded-lg text-base font-semibold"
                        >
                            Upload your first video
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="rounded-2xl bg-[#FBF7EF] border border-[#E8E4DA] p-6">
                            <Lottie animationData={animation1} loop={true} style={{ width: "100%", maxWidth: 340, height: 260, margin: "0 auto" }} />
                            <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                                {["Upload", "Auto-process", "Publish"].map((label, i) => (
                                    <React.Fragment key={label}>
                                        <span className="txp-pipe-chip txp-mono text-[10px] uppercase text-[#101827] bg-white border border-[#E8E4DA] rounded-full px-3 py-1.5">
                                            {label}
                                        </span>
                                        {i < 2 && <span className="text-[#94918A]">&rarr;</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA banner */}
            <section className="bg-[#101827]">
                <div className="container max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
                    <h2 className="txp-wordmark text-[#FFFEFB] font-semibold text-3xl sm:text-4xl mb-4">
                        Ready to start?
                    </h2>
                    <p className="text-[#B8BDC7] text-base mb-9 max-w-xl mx-auto">
                        Join TechXpert as a learner or an educator — your certificate,
                        or your first course, is a few minutes away.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center mb-6">
                        <Link
                            to="/signin"
                            className="txp-btn-fill inline-flex items-center justify-center text-[#FFFEFB] py-3.5 px-10 rounded-lg text-base font-semibold"
                        >
                            Start learning free
                        </Link>
                        <Link
                            to="/uploadvideo"
                            className="txp-btn-outline-light inline-flex items-center justify-center text-[#FFFEFB] py-3.5 px-10 rounded-lg text-base font-semibold"
                        >
                            Become an instructor
                        </Link>
                    </div>
                    <p className="txp-mono text-[10px] text-[#6B7280] uppercase">
                        Certificates verified automatically &middot; No credit card required
                    </p>
                </div>
            </section>
        </div>
    )
}

export default Home