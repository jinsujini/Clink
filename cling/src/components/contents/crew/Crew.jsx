import React, { useState, useEffect } from 'react';
import '../../../assets/scss/contents/crew/crew.scss';
import Banner from '../../../assets/img/crew/top.png';
import Plus from '../../../assets/img/crew/plus.png';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Header';
import axios from 'axios'
import Spinner from '../../../assets/img/loading.gif';
import CrewList from './CrewList';
import Support from './Support';

const Crew = () => {

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    };
    const slowfadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 3 } }
    };
   
    const [myCrew, setMyCrew] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('https://clinkback.store/api/my-page/position-and-crew', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setMyCrew(res.data);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);

            });
    }, [])


    

    const handleCrewClick = (crewId) => {
        navigate(`/mycrew/${crewId}`);
    };

    return (
       
        <div className='crew-page'>
            <Header />
            <div className="wrap">
                <motion.div className="banner"
                 variants={slowfadeIn}
                 initial="hidden"
                 animate="visible">
                    <img src={Banner} alt="배너" />
                    
                </motion.div>
                <Support />
               
               <CrewList />
                <motion.div className="mycrew"
                variants={fadeIn}
                initial="hidden"
                animate="visible">
                    <div className='sub-title'>
                        <h2 className='sub-title'>나의 크루</h2>
                    </div>
                    {loading ? (
                 <div className="loading">
                      <img src={Spinner} alt="Loading..." />
                    </div>
                 ) : (
                 
                    <div className='crew-list'>
                    {myCrew.positionsAndCrews && myCrew.positionsAndCrews.length > 0 && (
                                        myCrew.positionsAndCrews.map((positionsAndCrews, index) => (
                            <div key={index} className="crew">
                                <div className="badge">
                                    <div className="text">{positionsAndCrews.position}</div>
                                </div>
                                <h2 className="crewname">{positionsAndCrews.crewName}</h2>
                                <Link className='link' onClick={() => handleCrewClick(positionsAndCrews.crewName)} to={`/mycrew/${positionsAndCrews.crewName}`}>리크루팅 현황 확인하기</Link>
                                
                            </div>
                                        )
                        ))}
                       
                    </div>
                      )}
                </motion.div>
            </div>
            <div className="empty"></div>

        </div>
                  
    );
};

export default Crew;
