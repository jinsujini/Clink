import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spinner from '../../../assets/img/loading.gif';

const CrewList = () => {
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    };

    const [recrewting, setRecrewting] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://clinkback.store/recruitments', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setRecrewting(res.data.reverse());
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <motion.div className="recrewting"
            variants={fadeIn}
            initial="hidden"
            animate="visible">
            <h2 className='sub-title'>리크루팅 중인 크루</h2>
            {loading ? (
                <div className="loading">
                    <img src={Spinner} alt="로딩" />
                </div>
            ) : (
                <div className="notice-list">
                    {recrewting.map((item) => (
                        <div className="notice" key={item.id}>
                            <Link className="wrap" to={`/notice/${item.id}`}>
                                <h3 className='name'>{item.crew}</h3>
                                <div className='notice-title'><h3>{item.title}</h3></div>
                            </Link>
                            <div className="line"></div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

export default CrewList;
