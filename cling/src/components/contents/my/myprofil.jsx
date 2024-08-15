import React, { useState, useEffect } from "react";
import '../../../assets/scss/contents/my/myprofil.scss';
import BGPROFIL from '../../../assets/img/my/profil_background.png';
import IMG_PROFIL from '../../../assets/img/logo.png';
import axios from 'axios';
import Spinner from '../../../assets/img/loading.gif';
import Plus from '../../../assets/img/crew/plus.png';
import { useNavigate } from 'react-router-dom';
import cancle from '../../../assets/img/my/cancle.png';
import Position from "./Position";

const Myprofil = () => {
    const [myinfo, setMyinfo] = useState({});
    const [badgeModal, setBadgeModal] = useState(false);
    const [delModal, setDelModal] = useState(false);
    const [edit, setEdit] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [major, setMajor] = useState(null);
    const [positions, setPositions] = useState([]);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserInfo = () => {
        axios.get('https://clinkback.store/api/my-page/position-and-crew', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setMyinfo(res.data);
                    setName(res.data.name || '');
                    setEmail(res.data.email || '');
                    setMajor(res.data.major ? { value: res.data.major, label: res.data.major } : null);
                    setPositions(res.data.positions);
                    setProfileImageFile(res.data.profileImageUrl);
                    setProfileImagePreview(res.data.profileImageUrl);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
            })

    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const editProfil = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('major', major?.value || '');
        if (profileImageFile) {
            formData.append('profileImage', profileImageFile);
        }

        axios.post('https://clinkback.store/api/auth/updateUser', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    fetchUserInfo();
                    setEdit(true);
                }
            })
            .catch(err => {
                console.error(err);
            })
    };

    const logout = () => {
        axios.post('https://clinkback.store/api/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    navigate('/');
                }
            })
            .catch(err => {
                console.error(err);
            });
    };
    const delbadge = (crewName) => {
        axios.delete('https://clinkback.store/api/position/deleteCrew', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            data: {
                crewName: crewName
            }
        })
            .then(res => {
                if (res.status === 200) {
                    fetchUserInfo();
                }
            })
            .catch(err => {
                console.error( err);
            });
    };
    

    const majorLists = [
        { value: '국어국문학과', label: '국어국문학과' },
        { value: '영어영문학과', label: '영어영문학과' },
        { value: '독일어문·문화학과', label: '독일어문·문화학과' },
        { value: '프랑스어문·문화학과', label: '프랑스어문·문화학과' },
        { value: '일본어문·문화학과', label: '일본어문·문화학과' },
        { value: '중국어문·문화학과', label: '중국어문·문화학과' },
        { value: '사학과', label: '사학과' },
        { value: '문화예술경영학과', label: '문화예술경영학과' },
        { value: '정치외교학과', label: '정치외교학과' },
        { value: '심리학과', label: '심리학과' },
        { value: '지리학과', label: '지리학과' },
        { value: '경제학과', label: '경제학과' },
        { value: '미디어커뮤니케이션학과', label: '미디어커뮤니케이션학과' },
        { value: '경영학부', label: '경영학부' },
        { value: '사회복지학과', label: '사회복지학과' },
        { value: '법학부', label: '법학부' },
        { value: '의류산업학과', label: '의류산업학과' },
        { value: '소비자생활문화산업학과', label: '소비자생활문화산업학과' },
        { value: '뷰티산업학과', label: '뷰티산업학과' },
        { value: '수리통계데이터사이언스학부', label: '수리통계데이터사이언스학부' },
        { value: '통계학과', label: '통계학과' },
        { value: '생명과학·화학부', label: '생명과학·화학부' },
        { value: '화학과', label: '화학과' },
        { value: '화학·에너지융합학부', label: '화학·에너지융합학부' },
        { value: '바이오신약의과학부', label: '바이오신약의과학부' },
        { value: '바이오헬스융합학부', label: '바이오헬스융합학부' },
        { value: '서비스·디자인공학과', label: '서비스·디자인공학과' },
        { value: '융합보안공학과', label: '융합보안공학과' },
        { value: '컴퓨터공학과', label: '컴퓨터공학과' },
        { value: '청정융합에너지공학과', label: '청정융합에너지공학과' },
        { value: '바이오식품공학과', label: '바이오식품공학과' },
        { value: '바이오생명공학과', label: '바이오생명공학과' },
        { value: 'AI융합학부', label: 'AI융합학부' },
        { value: '간호학과', label: '간호학과' },
        { value: '교육학과', label: '교육학과' },
        { value: '사회교육과', label: '사회교육과' },
        { value: '윤리교육과', label: '윤리교육과' },
        { value: '한문교육과', label: '한문교육과' },
        { value: '유아교육과', label: '유아교육과' }
    ];


    return (
        <div className='myprofil'>
            <div className={`modal-badge ${badgeModal ? '' : 'hide'}`}>
                <Position />
                <img src={cancle} alt="닫기" onClick={() => setBadgeModal(false)} />
            </div>

            <div className={`delmodaldiv ${delModal ? '' : 'hide'}`}>
                <img src={cancle} alt="닫기" onClick={() => setDelModal(false)} />

                {myinfo.positionsAndCrews && myinfo.positionsAndCrews.length > 0 && (
                    myinfo.positionsAndCrews.map((positionsAndCrews, index) => (
                        <div className="badgelist">
                            <div id="badgenamediv" key={index}>
                                <span id="badgename">{positionsAndCrews.position}</span>

                            </div>
                            <button className="del" onClick={() => delbadge(positionsAndCrews.crewName)}>삭제하기</button>
                        </div>

                    ))
                )}

                <div className="submitBox">
                    <button className="btnSubmit" onClick={() => setDelModal(false)}>저장</button>
                </div>
            </div>
            {
                loading ? (
                    <div className="loading">
                        <img src={Spinner} alt="Loading" />
                    </div>
                ) : (
                    <div className="">
                        <div className={`wrap ${badgeModal || delModal ? 'blur ' : ''}`}>
                            <div id="name">
                                <div id="username">{myinfo.name} 님</div>
                                <div className="badgeBox">
                                    {myinfo.positionsAndCrews && myinfo.positionsAndCrews.length > 0 && (
                                        myinfo.positionsAndCrews.map((positionsAndCrews, index) => (
                                            <div id="badgenamediv" key={index}>
                                                <span id="badgename">{positionsAndCrews.position}</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="btn">
                                    <div className="btn1" onClick={() => setBadgeModal(true)}>역할 뱃지 등록하기</div>
                                    <h3>/</h3>
                                    <div className="btn2" onClick={() => setDelModal(true)}>삭제하기</div>
                                </div>
                            </div>
                            <div className="profil">
                                <div className="profil-img">
                                    <img src={profileImagePreview || IMG_PROFIL} alt="프로필 이미지" className="preview" />
                                    {!edit &&
                                        <div className="img-send">
                                            <label htmlFor="img">
                                                <img src={Plus} className="plusbtn" />
                                            </label>
                                            <input type="file" id="img" onChange={handleProfileImageChange} />
                                        </div>
                                    }
                                </div>
                                <div className="profil-info">
                                    <div>
                                        <h3>이름</h3>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={edit}
                                        />
                                    </div>
                                    <div>
                                        <h3>학번</h3>
                                        <h3>{myinfo.studentId}</h3>
                                    </div>
                                    <div>
                                        <h3>학과</h3>
                                        <select
                                            className="majorSelectOption custom-select"
                                            value={major?.value || ''}
                                            disabled={edit}
                                            onChange={(e) => setMajor({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text })}
                                        >
                                            {majorLists.map((major) => (
                                                <option key={major.value} value={major.value}>
                                                    {major.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="set-logout">
                                {edit ? (
                                    <button className="set" onClick={() => setEdit(false)}>수정하기</button>
                                ) : (
                                    <button className="set" onClick={() => editProfil()}>완료하기</button>
                                )}
                                <h3>/</h3>
                                <button className="logout" onClick={logout}>로그아웃</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Myprofil;
