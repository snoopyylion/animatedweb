import React, { useEffect, useRef, useState } from 'react'
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from './Button';
import { TiLocationArrow } from "react-icons/ti";
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const [currentVideo, setCurrentVideo] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    const totalVideos = 4;
    const nextVideoRef = useRef(null);
    const upcomingVideoRef = useRef(null); // Reference for upcoming video

    const handleVideoLoad = () => {
        setLoadedVideos((prev) => prev + 1);
    };

    const upcomingVideoIndex = (currentVideo % totalVideos) + 1;

    const handleMiniVdClick = () => {
        setHasClicked(true);
        setCurrentVideo(upcomingVideoIndex);
    };

    useEffect(() => {
        if (loadedVideos === totalVideos - 1) {
            setIsLoading(false);
        }
    }, [loadedVideos]);

    useGSAP(() => {
        if (hasClicked) {
            gsap.set('#next-video', { visibility: 'visible' });

            gsap.to('#next-video', {
                transformOrigin: 'center center',
                scale: 1,
                width: '100%',
                height: '100%',
                duration: 1,
                ease: 'power1.inOut',
                onStart: () => nextVideoRef.current.play(),
            });

            gsap.from('#current-video', {
                transformOrigin: 'center center',
                scale: 0,
                duration: 1.5,
                ease: 'power1.inOut'
            });
        }
    }, { dependencies: [currentVideo], revertOnUpdate: true });

    useGSAP(() => {
        gsap.set('#video-frame', {
            clipPath: 'polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)',
            borderRadius: '0 0 40% 10%'
        });
        gsap.from('#video-frame', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            borderRadius: '0 0 0 0',
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '#video-frame',
                start: 'center center',
                end: 'bottom center',
                scrub: true,
            }
        });
    });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (upcomingVideoRef.current) {
                const { left, top, width, height } = upcomingVideoRef.current.getBoundingClientRect();
                const x = (e.clientX - left - width / 2) / 25;
                const y = (e.clientY - top - height / 2) / 25;

                gsap.to(upcomingVideoRef.current, {
                    rotationY: x * 5,
                    rotationX: -y * 5,
                    transformPerspective: 500,
                    transformOrigin: "center center",
                    ease: "power2.out",
                    duration: 0.7,
                });
            }
        };

        const handleMouseLeave = () => {
            if (upcomingVideoRef.current) {
                gsap.to(upcomingVideoRef.current, {
                    rotationY: 0,
                    rotationX: 0,
                    ease: "power2.out",
                    duration: 0.3,
                });
            }
        };

        const miniVideoContainer = document.getElementById("mini-video-container");
        if (miniVideoContainer) {
            miniVideoContainer.addEventListener("mousemove", handleMouseMove);
            miniVideoContainer.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (miniVideoContainer) {
                miniVideoContainer.removeEventListener("mousemove", handleMouseMove);
                miniVideoContainer.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, []);

    const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>
            {isLoading && (
                <div className='flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50'>
                    <div className='three-body'>
                        <div className='three-body__dot' />
                        <div className='three-body__dot' />
                        <div className='three-body__dot' />
                    </div>
                </div>
            )}

            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
                <div>
                    {/* Mini upcoming video with animation */}
                    <div id="mini-video-container" className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg'>
                        <div onClick={handleMiniVdClick} className='origin-center scale-50 opacity-0 transition-all ease-in hover:scale-100 hover:opacity-100 '>
                            <video 
                                ref={upcomingVideoRef} 
                                src={getVideoSrc(upcomingVideoIndex)} 
                                muted 
                                id='upcoming-video' 
                                className='size-64 origin-center scale-150 object-cover object-center' 
                                onLoadedData={handleVideoLoad} 
                                loop
                            />
                        </div>
                    </div>
                    
                    <video ref={nextVideoRef} src={getVideoSrc(currentVideo)} loop muted id='next-video' className='absolute-center invisible absolute z-20 size-64 object-cover object-center' onLoadedData={handleVideoLoad}/>
                    <video src={getVideoSrc(currentVideo == totalVideos - 1 ? 1 : currentVideo)} loop muted autoPlay playsInline className='absolute left-0 top-0 size-full object-cover object-center' onLoadedData={handleVideoLoad}/>
                </div>
                
                <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>G<b>a</b>ming</h1>
                <div className='absolute top-0 left-0 z-40 size-full'>
                    <div className='mt-24 px-5 sm:px-10'>
                        <h1 className='special-font hero-heading text-blue-100'>redefi<b>n</b>e</h1>
                        <p className='mb-5 max-w-64 font-robert-regular text-blue-100'>Enter the new Web Era <br /> Unleash the <b>Snoopy</b> Power</p>
                        <Button id='watch-trailer' title='Watch Trailer' leftIcon={<TiLocationArrow/>} containerClass='!bg-yellow-300 flex-center gap-1'/>
                    </div>
                </div>
            </div>

            <h1 className='special-font hero-heading absolute bottom-5 right-5 text-black'>G<b>a</b>ming</h1>
        </div>
    );
};

export default Hero;
