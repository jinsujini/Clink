import React from 'react';
import '../../assets/scss/section/Loading.scss';
import { motion } from 'framer-motion';

const Loading = () => {

    const animationSettings = (delay) => ({
        hidden: { y: 0, x: 0 },
        visible: {
            y: [0, -30, 30, -30, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
                delay: delay,
            }
        }
    });
    

    return (
        <div className='Loading'>

            <div className="content">
                <motion.div className="circle circle1"
                    variants={animationSettings(0)}
                    initial="hidden"
                    animate="visible">
                </motion.div>
                <motion.div className="circle circle2"
                    variants={animationSettings(1)}
                    initial="hidden"
                    animate="visible">
                </motion.div>
                <motion.div className="circle circle3"
                    variants={animationSettings(0.5)}
                    initial="hidden"
                    animate="visible">
                </motion.div>
                <div className="text">
                    로딩 중...
                </div>
            </div>
        </div>
    );
}

export default Loading;
