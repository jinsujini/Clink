import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LOGO from '../../../assets/img/logo.png';
import '../../../assets/scss/contents/user/newpw.scss';

const Newpw = () => {
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const [popup, setPopup] = useState("hide");
    const [animation, setAnimation] = useState("hidden");
    const navigate = useNavigate();

    const handleClick = () => {
        setPopup(""); 
        setAnimation("visible");
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    return (
        <div className='newpw'>
            <div className={`popup ${popup}`}>
                <motion.div 
                    className="alert"
                    variants={fadeIn}
                    initial="hidden"
                    animate={animation}
                >
                    <h1>새 비밀번호 설정이 완료되었습니다</h1>
                </motion.div>
            </div>
            <div className="empty"></div>
            <Link to='/' className="c-logo">
                <img src={LOGO} alt="logo" />
            </Link>
            <div method="post" className='set-pw'>
                <input className="password" type="password" placeholder='New Password' />
                <input className="password" type="password" placeholder='New Password' />
                <button className="btn" type="button" onClick={handleClick}>Next</button>
            </div>
        </div>
    );
};

export default Newpw;
