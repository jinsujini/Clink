import React, { useEffect } from 'react';
import '../assets/scss/section/landing.scss';
import Header from './Header';
import Landing1 from '../assets/img/landing/landing1.png';
import Landing2 from '../assets/img/landing/landing2.png';
import Landing3 from '../assets/img/landing/landing3.png';
import Landing4 from '../assets/img/landing/landing4.png';
import bubble1 from '../assets/img/landing/bubble1.png';
import bubble3 from '../assets/img/landing/bubble2.png';
import bubble2 from '../assets/img/landing/bubble3.png';
import bubble4 from '../assets/img/landing/bubble4.png';
import bubble7 from '../assets/img/landing/bubble5.png';
import bubble6 from '../assets/img/landing/bubble6.png';
import bubble5 from '../assets/img/landing/bubble7.png';
import signBtn from '../assets/img/landing/signupBtn.png';
import RingImg from '../assets/img/landing/ring.png';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Landing = () => {
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    };

    const updown = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: [30, -30, 0],
            opacity: [0, 0.5, 1],
            transition: { duration: 1 }
        }
    };
  

    const bubbleVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: (i) => ({
            y:  0,
            opacity: 1,
            transition: { duration: 0.6, delay: (6 - i) * 0.3 } 
        })
    };

    const topControls = useAnimation();
    const [topRef, topInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (topInView) {
            topControls.start("visible");
        }
    }, [topControls, topInView]);

    const midControls = useAnimation();
    const [midRef, midInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (midInView) {
            midControls.start("visible");
        }
    }, [midControls, midInView]);

    const botControls = useAnimation();
    const [botRef, botInView] = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (botInView) {
            botControls.start("visible");
        }
    }, [botControls, botInView]);

    return (
        <div className='landing'>
            <Header />
            <div className="wrap">
                <motion.section className='top'
                    ref={topRef}
                    variants={fadeIn}
                    initial="hidden"
                    animate={topControls}>
                    <motion.img
                        className='ringImg'
                        src={RingImg}
                        alt="연결고리"
                        variants={updown}
                        initial="hidden"
                        animate={topControls}
                    />
                    <img className='top-text' src={Landing1} alt="랜딩1" />
                </motion.section>

                <motion.section className='mid'
                    variants={{
                        hidden: { opacity: 1 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.5, 
                                duration: 1
                            }
                        }
                    }}
                    initial="hidden"
                    animate={midControls}>
                    <motion.h1 className='mid-text1'
                        variants={fadeIn}
                        initial="hidden"
                        animate={midControls}>나와 같은 학과 선배, 후배, 동기들과의<br />
                        네트워킹은 물론!
                    </motion.h1>
                    <motion.img
                        ref={midRef}
                        className='bubble1'
                        src={Landing2}
                        alt="예시1"
                        variants={updown}
                    />
                    <motion.img
                        className='bubble2'
                        src={Landing3}
                        alt="예시2"
                        variants={updown}
                    />
                    <motion.img
                        className='bubble3'
                        src={Landing4}
                        alt="예시3"
                        variants={updown}
                    />
                    <motion.h1 className='mid-text2'
                        variants={fadeIn}
                        initial="hidden"
                        animate={midControls}>
                        다른 학과에 궁금한 이야기들도<br />
                        크링에서 물어봐!
                    </motion.h1>
                </motion.section>

                <motion.section className='bot'
                    ref={botRef}
                    variants={fadeIn}
                    initial="hidden"
                    animate={botControls}>
                    <div className='bubble'>
                        {[bubble1, bubble2, bubble3, bubble4, bubble5, bubble6, bubble7].map((src, index) => (
                            <motion.img
                                key={index}
                                src={src}
                                alt={`bubble${index + 1}`}
                                className={`b${index + 1}`}
                                variants={bubbleVariants}
                                custom={index} 
                                initial="hidden"
                                animate={botControls}
                            />
                        ))}
                    </div>
                    <Link to="/create"><motion.img src={signBtn} alt="signBtn" className='signBtn' variants={fadeIn} initial="hidden" animate={botControls} /></Link>
                </motion.section>
            </div>
        </div>
    );
};

export default Landing;
