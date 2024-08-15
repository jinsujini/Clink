import React, { useEffect, useState } from "react";
import '../../../assets/scss/contents/my/linkedCrystal.scss'
import BGPROFIL from '../../../assets/img/my/profil_background.png'
import axios from 'axios';

const LinkedCrystal = () => {
    const [users, setUsers] = useState([]);
    const [images, setImages] = useState({});

    useEffect(() => {
        showLinked();
      }, []);
      
      const showLinked = () => {
        axios.get('https://clinkback.store/matching', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
        .then(response => {
            setUsers(response.data);

            response.data.forEach(user => {
                axios.get(`https://clinkback.store/profile-image/get/${user.studentId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                })
                .then(imageResponse => {
                    setImages(prevImages => ({
                        ...prevImages,
                        [user.studentId]: imageResponse.data.imageByte
                    }));
                })
                .catch(error => {
                    console.error(`${user.studentId}의 이미지를 불러오는데 실패했습니다.:`, error);
                });
            });
        })
        .catch(error => {
            console.error('연결된 수정이에 대한 정보는 불러오는데 실패했습니다.', error);
        });
    };
      
    return (
        <div className="linkedprofil">
            <div className="profilcard">
                <div id="title">
                    <span id="username">나와 연결된 수정이들</span>
                </div>
                <div id="profillist">
                    {users.length === 0 ? (
                        <span className="linkedZero">나와 연결된 수정이가 없습니다 !</span>
                    ) : (
                        users.map(user => (
                            <div className="profil" key={user.studentId}>
                                <img 
                                    src={`data:image/jpeg;base64,${images[user.studentId]}`}  
                                    alt={`profile-${user.studentId}`} className="imghuman" 
                                />
                                <img src={BGPROFIL} alt="imgprofil" className="imgprofil" />
                                <div id="info">
                                    <div className="infotext">
                                        <span className="text1">이름</span>
                                        <span className="text2">{user.name}</span>
                                    </div>
                                    <div className="infotext">
                                        <span className="text1">학번</span>
                                        <span className="text2">{user.studentId}</span>
                                    </div>
                                    <div className="infotext">
                                        <span className="text1">학과</span>
                                        <span className="text2">{user.major}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinkedCrystal;
