import React from 'react';
import Header from '../../Header';
import '../../../assets/scss/contents/matching/loading.scss';
import { motion } from 'framer-motion';

const Loading = () => {

    const animationSettings = (delay) => ({
        hidden: { y: 0, x: 0 },
        visible: {
            y: [0, -30, 30, -30, 0],
            transition: {
                duration: 5,
                repeat: Infinity,
                repeatType: 'loop',
                delay: delay,
            }
        }
    });
    const textAnimation = {
        hidden: { opacity: 0, x: -100 },
        visible: {
            opacity: 1, 
            x: 0, 
            transition: {
                duration: 2, 
                ease: 'easeOut' 
            }
        }
    };

    return (
        <div className='loading-page'>

            <div className="content">
                <motion.div className="circle circle1"
                    variants={animationSettings(0.5)}
                    initial="hidden"
                    animate="visible">
                </motion.div>
                <motion.div className="circle circle2"
                    variants={animationSettings(0)}
                    initial="hidden"
                    animate="visible">
                </motion.div>
                <motion.div className="circle circle3"
                    variants={animationSettings(0.3)}
                    initial="hidden"
                    animate="visible">
                </motion.div>
                <div className="text">
                    C-link 중입니다
                </div>
            </div>
        </div>
    );
}

export default Loading;
