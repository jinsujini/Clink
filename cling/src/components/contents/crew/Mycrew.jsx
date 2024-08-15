import React, { useState, useEffect } from 'react';
import '../../../assets/scss/contents/crew/crew.scss';
import Header from '../../Header';
import left from '../../../assets/img/crew/left.png';
import NoticeList from './NoticeList';
import Recrewting from './Recrewting';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import List from './List';
import axios from 'axios'


const Mycrew = () => {

    const navigate = useNavigate();
    const { department } = useParams();

    const [myCrew, setMyCrew] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const encodedDepartment = encodeURIComponent(department);
        console.log(decodeURIComponent(encodedDepartment));
        axios.get(`https://clinkback.store/applications/${decodeURIComponent(encodedDepartment)}/info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log(res);
                    setMyCrew(res.data);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);

            });
    }, []);


    const handleBackClick = () => {
        navigate(-1);
    };
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    };

    return (
        <div className='mycrew-page'>
            <Header />
            <motion.div className="wrap"
                variants={fadeIn}
                initial="hidden"
                animate="visible">
                <div className="title">
                    <img src={left} alt="뒤로가기" onClick={handleBackClick} />
                    <h1>{department}</h1>
                </div>
                <NoticeList department={department} />
                <Recrewting department={department} />
                {myCrew && (
                    <List
                        department={myCrew.department || ""}
                        step={myCrew.step || ""}
                        title={myCrew.title || ""}
                    />)}
            </motion.div>
            <div className="empty"></div>
            <div className="empty"></div>
        </div>
    );
};

export default Mycrew;
