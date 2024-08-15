import React, { useState } from 'react';
import LOGO from '../../../assets/img/logo.png';
import '../../../assets/scss/contents/user/login.scss';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (studentId === '' || password === '') {
            alert('학번/비밀번호를 입력해주세요');
            return;
        }

        const params = new URLSearchParams();
        params.append('studentId', studentId);
        params.append('password', password);

        axios.post('https://clinkback.store/api/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const token = res.data.token; 
                    localStorage.setItem('accessToken', token)
                    console.log(res);
                    navigate('/mainhome'); 
                    alert('로그인 성공!');
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response) {
                    if (err.response.status === 401) {
                        alert('학번 또는 비밀번호가 올바르지 않습니다.');
                    } else {
                        alert('로그인 중 오류가 발생했습니다.');
                    }
                } else if (err.request) {
                    alert('서버와 연결할 수 없습니다.');
                } else {
                    alert('알 수 없는 오류가 발생했습니다.');
                }
            });
    };

    return (
        <div className='login'>
            <Link to='/' className="c-logo">
                <img src={LOGO} alt="로고" />
            </Link>
            <div className="wrap">
                <Link to="/login/findpw" className='findpw'>비밀번호 찾기</Link>
                
                <form method="post" className='login-form' onSubmit={handleLogin}>
                    <input
                        className="number"
                        type="text"
                        placeholder='학번'
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    />
                    <input
                        className="check"
                        type="password"
                        placeholder='비밀번호'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="btn">
                        <Link to='/create'><button className='signup' type="button">회원가입</button></Link>
                        <button className='signbtn' type="submit">로그인</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
