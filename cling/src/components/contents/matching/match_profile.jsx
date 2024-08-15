import React, { useState, useEffect } from 'react';
import '../../../assets/scss/contents/matching/match_profile.scss';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Bubble2 from '../../../assets/img/matching/speech-bubble2.png';
import SmallBubble2 from '../../../assets/img/matching/small-speech-bubble2.png';
import Header from '../../Header';

const MatchProfile = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const navigate = useNavigate(); 
    const location = useLocation();
    const profiles = location.state?.profiles || [];
    const { studentId } = useParams();

    const profile = profiles.find(profile => profile.studentId === studentId);

    useEffect(() => {
        if (profile) {
            fetchProfileImage(profile.studentId);
        }
    }, [profile]);

    const fetchProfileImage = (studentId) => {
        axios.get(`https://clinkback.store/profile-image/get/${studentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
            .then(response => {
                if (response.data && response.data.imageByte) {
                    setProfileImage(`data:image/jpeg;base64,${response.data.imageByte}`);
                }
            })
            .catch(err => {
                console.error(`Failed to fetch profile image for studentId ${studentId}:`, err);
            });
    };

    if (!profile) {
        return <div className='noprofile'>프로필을 찾지 못했습니다.</div>;
    }

    const handleClick = async () => {
        setIsButtonDisabled(true);
        try {
            const requestData = { studentId };

            const response = await axios.post('https://clinkback.store/request/send', requestData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.status === 201) {
                setFeedbackMessage('링크 신청이 완료 되었습니다.');
            } else {
                setFeedbackMessage('이미 요청을 보냈습니다.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;
                if (errorMessage === 'request already sent by the other party') {
                    setFeedbackMessage('이미 상대방이 요청을 보냈습니다.');
                } else if (errorMessage === 'already cringed') {
                    setFeedbackMessage('이미 크링되었습니다.');
                } else {
                    setFeedbackMessage('서버에서 알 수 없는 오류가 발생했습니다.');
                }
            } else {
                setFeedbackMessage('네트워크 오류가 발생했습니다.');
            }
        } finally {
            setTimeout(() => {
                navigate('/match');
            }, 1000);
        }
    };

    return (
        <div className='matchprofile'>
            <Header />
            <div className="content">
                <div className="circle circle1"></div>
                <div className="circle circle2"></div>
                <div className="circle circle3"></div>

                <div className="profilecontent">
                    <div className="profileimg profileimg2">
                        <img src={profileImage || ''} alt="프로필사진" />
                        <div className="bubbleimg">
                            <img src={Bubble2} alt="말풍선" />
                            <div className="bubble-text">
                                {profile.studentId} {profile.name}입니다.
                            </div>
                        </div>
                        <div className="smallbubbleimg">
                            <img src={SmallBubble2} alt="말풍선" />
                            <div className="bubble-text">
                                {profile.major}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className={`btn ${isButtonDisabled ? 'disabled ' : ''}`} 
                            type="button"
                            onClick={handleClick}
                            disabled={isButtonDisabled}
                        >
                            link
                        </button>
                    </div>
                </div>

            </div>
            {feedbackMessage && (
                <div className={`blur ${isButtonDisabled ? '' : 'hide'}`}>
                    <div className='toggle'>
                        {feedbackMessage}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchProfile;
