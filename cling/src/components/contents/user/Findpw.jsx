import React, { useState } from 'react';
import '../../../assets/scss/contents/user/findpw.scss';
import LOGO from '../../../assets/img/logo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Findpw = () => {
  const [popup, setPopup] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [passwordReset, setPasswordReset] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  const sendAuth = () => {
    const param = new URLSearchParams();
    if (studentId === '' || username === '') {
      alert('학번/이름 입력해주세요');
      return;
    }

    axios.post('https://clinkback.store/api/auth/request-password-change', {
      studentId: studentId,
      name: username
    })
      .then(res => {
        if (res.status === 200) {
          handlePopup();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handlePopup = () => {
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
    }, 1500);
  };

  const resetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    axios.post('https://clinkback.store/api/auth/change-password', {
      authNum: authCode,
      newPassword: newPassword,
      confirmPassword: newPassword
    })
      .then(res => {
        if (res.status === 200) {
          setPasswordReset(true);
        }
      })
      .catch(err => {
        console.error(err);

      });
  };

  return (
    <div className='findpw'>
      {popup && (
        <motion.div className="popup"
          variants={fadeIn}
          initial="hidden"
          animate="visible">
          <div className="alert">
            <h1>E-mail로 인증번호가 발송되었습니다.</h1>
          </div>
        </motion.div>
      )}
      {passwordReset && (
        <motion.div className="popup"
          variants={fadeIn}
          initial="hidden"
          animate="visible">
          <div className="alert">
            <h1>비밀번호가 성공적으로 재설정되었습니다.</h1>
          </div>
        </motion.div>
      )}
     
      <div className="empty"></div>
      <Link to='/' className="c-logo">
        <img src={LOGO} alt="logo" />
      </Link>

      <div className='wrap'>
        <input type="text" placeholder='학번' onChange={(e) => setStudentId(e.target.value)} />

        <div className="email">
          <input className="name" type="text" placeholder='이름' onChange={(e) => setUsername(e.target.value)} />
          <button className='push' onClick={sendAuth}>인증번호</button>
        </div>
        
        <input type="password" placeholder='새 비밀번호' onChange={(e) => setNewPassword(e.target.value)} />
        <input type="password" placeholder='비밀번호 확인' onChange={(e) => setConfirmPassword(e.target.value)} />

        <div className="checknumber">
          <input type="text" placeholder='인증번호' onChange={(e) => setAuthCode(e.target.value)} />
          <button className='check' onClick={resetPassword}>비밀번호 재설정</button>
        </div>
      </div>
    </div>
  );
}

export default Findpw;
