import React, { useEffect, useState } from 'react';
import PassList from './PassList';
import axios from 'axios';

const Recrewting = ({ department }) => {
    const [notice, setNotice] = useState(null); 


    const fetchNoticeInfo = () => {
        axios.get(`https://clinkback.store/applications/${department}/info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200 && res.data) {
                    console.log(res.data);
                    setNotice(res.data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    

    useEffect(() => {
        fetchNoticeInfo();
  
    }, [department]);

    return (
        <div className="recrew">
            <h2 className='sub-title'>리크루팅 현황</h2>
            {notice ? (
                <div className="recrew-wrap">
                    <h3>현재 리크루팅 진행중인 공고 : <span>{notice.title}</span></h3>
                    <h3>모집 일정 : <span>{notice.startDate}</span> ~ <span>{notice.dueDate}</span></h3>
                    <h3>선발 계획 : <span>{notice.step}</span></h3>
                </div>
            ) : (
                <p></p>
            )}
            <PassList department={department}  />
        </div>
    );
};

export default Recrewting;
