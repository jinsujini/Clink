import React, { useState } from 'react';
import LOGO from '../../../assets/img/logo.png';
import AddBtn from '../../../assets/img/addbtn.png';
import Ex from '../../../assets/img/eximg.png';
import '../../../assets/scss/contents/user/create.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const Create = () => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [email, setEmail] = useState('');
    const [major, setMajor] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(URL.createObjectURL(e.target.files[0]));
            setProfileImageFile(e.target.files[0]);
        };
    }

        const createBtn = (e) => {
            e.preventDefault();

            if (password !== passwordCheck) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            const formData = new FormData();
            formData.append('studentId', studentId);
            formData.append('password', password);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('major', major?.value || '');
            if (profileImageFile) {
                formData.append('profileImage', profileImageFile);
            }


            axios.post('https://clinkback.store/api/auth/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        alert('회원가입 성공! 로그인 페이지로 이동합니다.')
                        navigate('/login');
                    }
                })
                .catch(err => {
                    console.error(err);
                    if (err.status === 200) {
                        alert('이미 가입이 완료된 회원입니다.')
                    }
                    else{
                        alert('회원가입이 실패했습니다.')
                    }
                   

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
            { value: '법학부', label: '법학부' },
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
            <div className='create'>
                <div className="c-logo">
                    <img src={LOGO} alt="logo" />
                </div>
                <div className="info">
                    <label className="img">
                        <img src={profileImage || Ex} alt="프로필사진" />
                        <img className='addimg' src={AddBtn} alt="이미지추가" />
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                    <form className='create-form' >
                        <div className="form">
                            <input
                                type="text"
                                className='name'
                                placeholder='Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="text"
                                className='id'
                                placeholder='Student ID'
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                            <input
                                type="email"
                                className='email'
                                name="email"
                                placeholder='E-mail'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Select
                                className="majorSelectOption"
                                classNamePrefix="custom-select"
                                value={major}
                                onChange={(selectedOption) => setMajor(selectedOption)}
                                options={majorLists}
                            />
                            <div className="pwd">
                                <input
                                    type="password"
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder='PasswordCheck'
                                    value={passwordCheck}
                                    onChange={(e) => setPasswordCheck(e.target.value)}
                                />
                            </div>
                        </div>

                    </form>
                </div>
                <button className='signbtn' onClick={createBtn}>Sign In</button>
                <h4 className='caution'>
                    ※ 특수한 역할 (학생회, 동아리 임원 등 )이 있는 경우 관리자 문의를 통해 뱃지를 드립니다. 문의 - MY 페이지 하단 버튼 이동.
                </h4>
            </div>
        );
    };

    export default Create;
