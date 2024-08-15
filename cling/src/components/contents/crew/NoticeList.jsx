import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoticeWrite from './NoticeWrite';

const NoticeList = ({ department }) => {
    const [notice, setNotice] = useState();


    useEffect(() => {
        axios.get(`https://clinkback.store/applications/${department}/info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setNotice(res.data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const navigate = useNavigate();
    const write = () => {
        navigate(`/noticeWrite/${department}`)
    };

    return (
        <div className="recrew-notice">
            <h2 className="sub-title">작성한 리크루팅 공고</h2>
            <div className="notice-list">
                {notice && 
                        <div className="notice">
                            <div className="inner">
                                <div className="day">{notice.startDate}</div>
                                <Link to={`/notice/${notice.id}`} className="notice-title">{notice.title}</Link>
                                <button className="del">삭제하기</button>
                            </div>
                            <div className="line"></div>
                        </div>
                    }
            </div>
            <div className="towrite" onClick={write}>글 작성</div>
        </div>
    );
};

export default NoticeList;
