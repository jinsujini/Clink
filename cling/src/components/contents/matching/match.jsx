import React, { useState, useEffect } from 'react';
import Header from '../../Header';
import '../../../assets/scss/contents/matching/match.scss';
import { Link, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Loading from '../Loading';
import { motion } from 'framer-motion';


const Match = () => {
    const [users, setUsers] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    };


    useEffect(() => {
        matching();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            users.forEach(user => {
                fetchProfileImage(user.studentId);
            });
        }
    }, [users]);

    const matching = () => {
        axios.get('https://clinkback.store/matching', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const fetchProfileImage = (studentId) => {
        axios.get(`https://clinkback.store/profile-image/get/${studentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
            .then(response => {
                if (response.data && response.data.imageByte) {
                    setProfileImages(prevImages => ({
                        ...prevImages,
                        [studentId]: `data:image/jpeg;base64,${response.data.imageByte}`
                    }));
                }
            })
            .catch(err => {
                console.error(`Failed to fetch profile image for studentId ${studentId}:`, err);
            });
    };

    const enterChatRoom = (user) => {
        axios.get(`https://clinkback.store/roomEnter?id2=${user.studentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
            .then(response => {
                const { roomId } = response.data;
                navigate(`/chat/${roomId}`, { state: { userInfo: user } });
                
            })
            .catch(err => {
                console.error('Failed to enter chat room:', err);
            });
    };


    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 4,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div className='match'>
            <Header />
            {loading ? (
                <Loading />
            ) : (
                <motion.div className='content'
                variants={fadeIn}
                initial="hidden"
                animate="visible">
                    {users.length > 0 ? (
                        <>
                            <Slider {...settings}>
                                {users.map(user => (
                                    <div key={user.studentId} className="slide">
                                        {profileImages[user.studentId] && (
                                            <div className="profileimg">
                                                <img
                                                    src={profileImages[user.studentId]}
                                                    alt="프로필사진"
                                                />
                                            </div>
                                        )}
                                        <div className="slide-content">
                                            <button className="btn" onClick={() => enterChatRoom(user)}>
                                                채팅하기
                                            </button>
                                            <div className="text">
                                                <h4 className="text">{user.name}</h4>
                                                <div className="text">{user.studentId}</div><br />
                                                <div className="text">{user.major}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>

                            <div className='bigtext'>
                                다시 C-link 하기 <br></br>
                            </div>

                            <div className='smalltext'>
                                나를 기다리는 다른 수정이들과 C-link해보세요! <br></br>
                            </div>
                        </>
                    ) : (
                        <div className="no-users">
                            나와 연결된 수정이가 없습니다.
                        </div>
                    )}
                    <div>
                        <Link to='/match/info'><input className="clinkbtn" type="button" value="Clink 하기" /></Link>
                    </div>
                </motion.div>)}



        </div>
    );
}

export default Match;
