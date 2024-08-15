import React, { useState } from 'react'
import LOGO from '../../../assets/img/logo.png'
import '../../../assets/scss/contents/user/checkschool.scss'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CheckSchool = () => {
    const [email, setEmail] = useState('');
    const [authNum, setAuthNum] = useState('');
    const navigate = useNavigate();

    const sendMail = () => {
        axios.post('http://13.48.207.238:1234/mailSend', {
            email: email
        })
            .then((res) => {
                if (res.status === 200) {                  
                    alert('메일로 인증번호가 전송되었습니다');
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
    const authCheck = () => {
        axios.post('https://clinkback.store/mailauthCheck', {
            email: email,
            authNum :authNum
        })
            .then((res) => {
                if (res.status === 200) {
                    const accessToken = res.data.access;
                    localStorage.setItem('accessToken', accessToken);
                    alert('인증에 성공했습니다.');                    navigate('/create/info')
                }
            })
            .catch((err) => {
                console.error(err);
                alert('인증 번호가 일치하지 않거나 유효하지 않습니다');
            });
    }

    return (
        <div className='checkschool'>
            < div className="c-logo">
                <img src={LOGO} alt="logo" />
            </div>
            <div className='check-form'>
                <div className="email-check">
                    <input
                        className="email"
                        type="email"
                        placeholder='학교 E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="send-email" onClick={sendMail}>인증번호</div>
                </div>

                <input className="number" type="text" placeholder='인증번호'
                onChange={(e) => setAuthNum(e.target.value)} />
                <div className="btn" onClick={authCheck} >학교 인증하기</div>
            </div>
        </div>
    );
}

export default CheckSchool;
